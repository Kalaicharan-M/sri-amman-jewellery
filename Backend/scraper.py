from __future__ import annotations

import json
import logging
import os
import re
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup


LIVE_CHENNAI_URL = "https://www.livechennai.com/gold_silverrate.asp"
IST = timezone(timedelta(hours=5, minutes=30))
DATE_FORMAT = "%d/%b/%Y"
DEFAULT_CACHE_FILE = Path(__file__).with_name("gold_rate_cache.json")
CACHE_FILE = Path(os.getenv("GOLD_RATE_CACHE_FILE", str(DEFAULT_CACHE_FILE)))
REQUEST_TIMEOUT = float(os.getenv("SCRAPER_TIMEOUT", "15"))
CACHE_TTL_MINUTES = int(os.getenv("GOLD_RATE_CACHE_TTL_MINUTES", "10"))
BACKGROUND_REFRESH_INTERVAL_SECONDS = max(CACHE_TTL_MINUTES, 1) * 60
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/123.0.0.0 Safari/537.36"
)
LOGGER = logging.getLogger(__name__)
CACHE_REFRESH_LOCK = threading.Lock()
BACKGROUND_UPDATER_LOCK = threading.Lock()
BACKGROUND_UPDATER_EVENT = threading.Event()
BACKGROUND_UPDATER_THREAD: threading.Thread | None = None

try:
    import lxml  # noqa: F401

    HTML_PARSER = "lxml"
except ImportError:
    HTML_PARSER = "html.parser"

_HTTP_SESSION = requests.Session()

GOLD_ROW_PATTERN = re.compile(
    r"^(?P<date>\d{1,2}/[A-Za-z]{3}/\d{4})$"
)
SILVER_ROW_PATTERN = re.compile(
    r"^(?P<date>\d{1,2}/[A-Za-z]{3}/\d{4})$"
)
UPDATE_TIME_PATTERN = re.compile(
    r"Last Update Time:\s*(?:\d{1,2}/\d{1,2}/\d{4}\s*)?"
    r"(?P<hour>\d{1,2}):(?P<minute>\d{2})(?::(?P<second>\d{2}))?\s*(?P<meridiem>[AP]M)",
    re.IGNORECASE,
)
PAGE_DATE_PATTERN = re.compile(r"Todays Gold Rate in Chennai \((\d{1,2}/[A-Za-z]{3}/\d{4})\)")
NUMBER_PATTERN = re.compile(r"^[\d,]+(?:\.\d+)?$")


class GoldRateScraperError(Exception):
    """Raised when live gold rate data cannot be fetched or parsed."""


def _now_ist() -> datetime:
    return datetime.now(IST)


def _normalize_number(value: str) -> int | float:
    number = float(value.replace(",", ""))
    return int(number) if number.is_integer() else round(number, 2)


def _get_cache_last_updated(cache: dict[str, Any]) -> str:
    last_updated = cache.get("last_updated")
    if isinstance(last_updated, str):
        return last_updated

    legacy_fetched_at = cache.get("fetched_at")
    if isinstance(legacy_fetched_at, str):
        return legacy_fetched_at

    return ""


def _load_cache() -> dict[str, Any] | None:
    if not CACHE_FILE.exists():
        return None

    try:
        payload = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None

    if not isinstance(payload, dict) or "data" not in payload:
        return None

    return payload


def _save_cache(data: dict[str, Any]) -> dict[str, Any]:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    cache_updated_at = _now_ist().isoformat()
    payload = {
        "last_updated": cache_updated_at,
        "data": data,
    }
    CACHE_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


def _cache_is_fresh(cache: dict[str, Any]) -> bool:
    cache_last_updated = _get_cache_last_updated(cache)
    if not cache_last_updated:
        legacy_fetched_on = cache.get("fetched_on")
        return legacy_fetched_on == _now_ist().date().isoformat()

    try:
        fetched_at_dt = datetime.fromisoformat(cache_last_updated)
    except ValueError:
        return False

    age = _now_ist() - fetched_at_dt
    return age <= timedelta(minutes=CACHE_TTL_MINUTES)


def _build_cached_response(
    cache: dict[str, Any],
    *,
    source_status: str,
    warning: str | None = None,
    scrape_error: str | None = None,
) -> dict[str, Any]:
    cached_data = dict(cache["data"])
    cached_data["served_from_cache"] = True
    cached_data["source_status"] = source_status
    cached_data["cache_ttl_minutes"] = CACHE_TTL_MINUTES
    cache_last_updated = _get_cache_last_updated(cache)

    if cache_last_updated:
        cached_data["cache_last_updated"] = cache_last_updated

    if warning:
        cached_data["warning"] = warning
    else:
        cached_data.pop("warning", None)

    if scrape_error:
        cached_data["scrape_error"] = scrape_error
    else:
        cached_data.pop("scrape_error", None)

    return cached_data


def _build_live_response(data: dict[str, Any], cache_last_updated: str) -> dict[str, Any]:
    live_response = dict(data)
    live_response["served_from_cache"] = False
    live_response["source_status"] = "live"
    live_response["cache_ttl_minutes"] = CACHE_TTL_MINUTES
    live_response["cache_last_updated"] = cache_last_updated
    live_response.pop("warning", None)
    live_response.pop("scrape_error", None)
    return live_response


def _fetch_livechennai_html() -> str:
    try:
        response = _HTTP_SESSION.get(
            LIVE_CHENNAI_URL,
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise GoldRateScraperError("Failed to fetch data from Live Chennai.") from exc

    response.encoding = response.apparent_encoding or response.encoding
    return response.text


def _extract_lines(soup: BeautifulSoup) -> list[str]:
    text = soup.get_text("\n", strip=True)
    return [re.sub(r"\s+", " ", line).strip() for line in text.splitlines() if line.strip()]


def _extract_table_rows(soup: BeautifulSoup) -> list[list[str]]:
    rows: list[list[str]] = []

    for row in soup.find_all("tr"):
        cells = [
            re.sub(r"\s+", " ", cell.get_text(" ", strip=True)).strip()
            for cell in row.find_all(["th", "td"])
        ]
        if cells:
            rows.append(cells)

    return rows


def _extract_gold_rows(table_rows: list[list[str]]) -> list[dict[str, Any]]:
    parsed_rows: list[dict[str, Any]] = []

    for cells in table_rows:
        if len(cells) != 5:
            continue

        match = GOLD_ROW_PATTERN.match(cells[0])
        if not match or not all(NUMBER_PATTERN.match(value) for value in cells[1:]):
            continue

        parsed_rows.append(
            {
                "date": match.group("date"),
                "gold_24k": _normalize_number(cells[1]),
                "gold_22k": _normalize_number(cells[3]),
            }
        )

    return parsed_rows


def _extract_silver_rows(table_rows: list[list[str]]) -> list[dict[str, Any]]:
    parsed_rows: list[dict[str, Any]] = []

    for cells in table_rows:
        if len(cells) != 3:
            continue

        match = SILVER_ROW_PATTERN.match(cells[0])
        if (
            not match
            or not NUMBER_PATTERN.match(cells[1])
            or not NUMBER_PATTERN.match(cells[2])
        ):
            continue

        parsed_rows.append(
            {
                "date": match.group("date"),
                "silver": _normalize_number(cells[1]),
            }
        )

    return parsed_rows


def _extract_last_updated(lines: list[str], history: list[dict[str, Any]]) -> str:
    if not history:
        raise GoldRateScraperError("No gold rate history found in the scraped data.")

    time_match = None
    page_date = None

    for line in lines:
        if time_match is None:
            time_match = UPDATE_TIME_PATTERN.search(line)

        if page_date is None:
            date_match = PAGE_DATE_PATTERN.search(line)
            if date_match:
                page_date = date_match.group(1)

        if time_match and page_date:
            break

    data_date = history[0]["date"] or page_date
    parsed = datetime.strptime(data_date, DATE_FORMAT)

    if time_match:
        hour = int(time_match.group("hour")) % 12
        if time_match.group("meridiem").upper() == "PM":
            hour += 12

        parsed = parsed.replace(
            hour=hour,
            minute=int(time_match.group("minute")),
            second=int(time_match.group("second") or 0),
        )

    return parsed.replace(tzinfo=IST).isoformat()


def _merge_history(
    gold_rows: list[dict[str, Any]], silver_rows: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    silver_by_date = {row["date"]: row["silver"] for row in silver_rows}
    history: list[dict[str, Any]] = []

    for gold_row in gold_rows:
        silver_value = silver_by_date.get(gold_row["date"])
        if silver_value is None:
            continue

        history.append(
            {
                "date": gold_row["date"],
                "gold_22k": gold_row["gold_22k"],
                "gold_24k": gold_row["gold_24k"],
                "silver": silver_value,
            }
        )

    return history[:7]


def _build_change_summary(
    history: list[dict[str, Any]], field_name: str
) -> dict[str, int | float] | None:
    if len(history) < 2:
        return None

    current_value = float(history[0][field_name])
    previous_value = float(history[1][field_name])
    change = current_value - previous_value
    change_percent = 0.0 if previous_value == 0 else round((change / previous_value) * 100, 2)

    return {
        "change": int(change) if change.is_integer() else round(change, 2),
        "change_percent": change_percent,
    }


def scrape_live_chennai_rates() -> dict[str, Any]:
    html = _fetch_livechennai_html()
    soup = BeautifulSoup(html, HTML_PARSER)

    table_rows = _extract_table_rows(soup)

    for element in soup(["script", "style", "noscript"]):
        element.decompose()
    lines = _extract_lines(soup)

    gold_rows = _extract_gold_rows(table_rows)
    silver_rows = _extract_silver_rows(table_rows)
    history = _merge_history(gold_rows, silver_rows)

    if not history:
        raise GoldRateScraperError("Unable to parse gold and silver rates from Live Chennai.")

    current = history[0]

    return {
        "gold_22k": current["gold_22k"],
        "gold_24k": current["gold_24k"],
        "silver": current["silver"],
        "last_updated": _extract_last_updated(lines, history),
        "data_date": current["date"],
        "currency": "INR",
        "unit": "gram",
        "source": LIVE_CHENNAI_URL,
        "history": history,
        "changes": {
            "gold_22k": _build_change_summary(history, "gold_22k"),
            "gold_24k": _build_change_summary(history, "gold_24k"),
            "silver": _build_change_summary(history, "silver"),
        },
        "source_status": "live",
    }


def _refresh_cache_from_source(force_refresh: bool = False) -> dict[str, Any]:
    cached = _load_cache()
    if cached and not force_refresh and _cache_is_fresh(cached):
        return _build_cached_response(cached, source_status="cache")

    with CACHE_REFRESH_LOCK:
        cached = _load_cache()
        if cached and not force_refresh and _cache_is_fresh(cached):
            return _build_cached_response(cached, source_status="cache")

        live_data = scrape_live_chennai_rates()
        cache_payload = _save_cache(live_data)
        LOGGER.info("Gold rate cache updated at %s", cache_payload["last_updated"])
        return _build_live_response(live_data, cache_payload["last_updated"])


def _background_updater_loop() -> None:
    LOGGER.info(
        "Gold rate background updater started with a %s-minute interval.",
        CACHE_TTL_MINUTES,
    )

    while True:
        try:
            cached = _load_cache()
            if not cached or not _cache_is_fresh(cached):
                _refresh_cache_from_source()
        except GoldRateScraperError as exc:
            LOGGER.warning("Gold rate background refresh failed: %s", exc)
        except Exception:
            LOGGER.exception("Unexpected error while updating the gold rate cache.")

        BACKGROUND_UPDATER_EVENT.wait(timeout=BACKGROUND_REFRESH_INTERVAL_SECONDS)
        BACKGROUND_UPDATER_EVENT.clear()


def start_gold_rate_background_updater() -> bool:
    global BACKGROUND_UPDATER_THREAD

    with BACKGROUND_UPDATER_LOCK:
        if BACKGROUND_UPDATER_THREAD and BACKGROUND_UPDATER_THREAD.is_alive():
            return False

        BACKGROUND_UPDATER_THREAD = threading.Thread(
            target=_background_updater_loop,
            name="gold-rate-cache-updater",
            daemon=True,
        )
        BACKGROUND_UPDATER_THREAD.start()
        return True


def get_gold_rate_data(force_refresh: bool = False) -> dict[str, Any]:
    cached = _load_cache()

    if cached and not force_refresh:
        if _cache_is_fresh(cached):
            return _build_cached_response(cached, source_status="cache")

        BACKGROUND_UPDATER_EVENT.set()
        return _build_cached_response(
            cached,
            source_status="stale_cache",
            warning="Serving the latest cached rates while a background refresh runs.",
        )

    try:
        return _refresh_cache_from_source(force_refresh=force_refresh)
    except GoldRateScraperError as exc:
        if cached and "data" in cached:
            LOGGER.warning("Gold rate refresh failed; serving cached data instead: %s", exc)
            return _build_cached_response(
                cached,
                source_status="stale_cache",
                warning="Serving the latest cached rates because the live scrape failed.",
                scrape_error=str(exc),
            )

        raise
