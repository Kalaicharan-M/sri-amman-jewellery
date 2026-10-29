from __future__ import annotations

import hashlib
import json
import logging
import os
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from scraper import GoldRateScraperError, get_gold_rate_data

BASE_DIR = Path(__file__).resolve().parent
IST = timezone(timedelta(hours=5, minutes=30))

TEMPLATE_PATH = Path(
    os.getenv(
        "RATE_CARD_TEMPLATE",
        str(BASE_DIR / "assets" / "templates" / "rate_card_template.png"),
    )
)
# Anton is a tall, condensed poster face, so long values like the 8 gram
# price still fill the narrow rate boxes at a large size.
FONT_PATH = BASE_DIR / "assets" / "fonts" / "Anton-Regular.ttf"

DEFAULT_CACHE_FILE = BASE_DIR / "rate_card_cache.png"
CACHE_FILE = Path(os.getenv("RATE_CARD_CACHE_FILE", str(DEFAULT_CACHE_FILE)))
META_FILE = CACHE_FILE.with_suffix(".meta.json")

# How often to check whether the underlying gold/silver rate has changed and,
# if so, regenerate the card image. Cheap when unchanged: get_gold_rate_data()
# just returns the existing scraper cache without a network call. A plain
# fixed-interval poll (rather than cross-thread event signaling) so a check
# is always guaranteed within this window, with no risk of a missed wakeup.
POLL_INTERVAL_MINUTES = int(os.getenv("RATE_CARD_POLL_INTERVAL_MINUTES", "2"))

GOLD_SOVEREIGN_GRAMS = 8

# Measured from the portrait poster template (941x1672), as
# (left, top, right, bottom). Each rate box is the empty space to the right
# of the printed rupee sign in a panel, centred vertically on that sign.
# The date box is the blank pill to the right of the calendar icon.
DATE_BOX = (418, 534, 792, 588)
GOLD_1GM_BOX = (668, 664, 868, 754)
GOLD_8GM_BOX = (668, 866, 868, 956)
SILVER_1GM_BOX = (668, 1067, 868, 1157)

DISPLAY_DATE_FORMAT = "%d-%m-%Y"
SOURCE_DATE_FORMAT = "%d/%b/%Y"

# Sampled from the rupee sign printed in each panel, so the numbers match it.
TEXT_COLOR_GOLD_PANEL = (127, 6, 5)
TEXT_COLOR_SILVER_PANEL = (5, 26, 60)
TEXT_COLOR_DATE = (127, 6, 5)

MAX_FONT_SIZE = 110
MIN_FONT_SIZE = 28

LOGGER = logging.getLogger(__name__)
CARD_GENERATION_LOCK = threading.Lock()
BACKGROUND_THREAD_LOCK = threading.Lock()
BACKGROUND_THREAD: threading.Thread | None = None


class RateCardError(Exception):
    """Raised when the daily rate card image cannot be generated."""


def _now_ist() -> datetime:
    return datetime.now(IST)


def format_inr(value: float) -> str:
    number = int(round(value))
    sign = "-" if number < 0 else ""
    digits = str(abs(number))

    if len(digits) <= 3:
        return f"{sign}{digits}"

    last_three = digits[-3:]
    remaining = digits[:-3]
    groups: list[str] = []

    while len(remaining) > 2:
        groups.insert(0, remaining[-2:])
        remaining = remaining[:-2]

    if remaining:
        groups.insert(0, remaining)

    return f"{sign}{','.join(groups)},{last_three}"


def _load_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_PATH), size)


def _format_display_date(data: dict[str, Any]) -> str:
    raw_date = str(data.get("data_date", "")).strip()

    if raw_date:
        try:
            return datetime.strptime(raw_date, SOURCE_DATE_FORMAT).strftime(DISPLAY_DATE_FORMAT)
        except ValueError:
            pass

    return _now_ist().strftime(DISPLAY_DATE_FORMAT)


def _fit_font(
    draw: ImageDraw.ImageDraw,
    texts: list[str],
    box: tuple[int, int, int, int],
) -> ImageFont.FreeTypeFont:
    # The largest size at which every text fits the box. Passing all three
    # rates together gives them one shared size so the panels match.
    x0, y0, x1, y1 = box

    for size in range(MAX_FONT_SIZE, MIN_FONT_SIZE - 1, -2):
        font = _load_font(size)
        if all(
            right - left <= x1 - x0 and bottom - top <= y1 - y0
            for left, top, right, bottom in (draw.textbbox((0, 0), text, font=font) for text in texts)
        ):
            return font

    return _load_font(MIN_FONT_SIZE)


def _draw_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    *,
    align: str = "left",
) -> None:
    x0, y0, x1, y1 = box
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    x = x0 - left if align == "left" else x0 + ((x1 - x0) - (right - left)) / 2 - left
    y = y0 + ((y1 - y0) - (bottom - top)) / 2 - top
    draw.text((x, y), text, font=font, fill=fill)


def render_rate_card(data: dict[str, Any]) -> Image.Image:
    if not TEMPLATE_PATH.exists():
        raise RateCardError(f"Rate card template not found at {TEMPLATE_PATH}.")

    template = Image.open(TEMPLATE_PATH).convert("RGB")
    draw = ImageDraw.Draw(template)

    gold_1gm = format_inr(data["gold_22k"])
    gold_8gm = format_inr(data["gold_22k"] * GOLD_SOVEREIGN_GRAMS)
    silver_1gm = format_inr(data["silver"])

    display_date = _format_display_date(data)
    date_font = _fit_font(draw, [display_date], DATE_BOX)
    _draw_text(draw, DATE_BOX, display_date, date_font, TEXT_COLOR_DATE, align="center")

    # All rate boxes share the same size, so any one of them works for fitting.
    rate_font = _fit_font(draw, [gold_1gm, gold_8gm, silver_1gm], GOLD_1GM_BOX)
    _draw_text(draw, GOLD_1GM_BOX, gold_1gm, rate_font, TEXT_COLOR_GOLD_PANEL)
    _draw_text(draw, GOLD_8GM_BOX, gold_8gm, rate_font, TEXT_COLOR_GOLD_PANEL)
    _draw_text(draw, SILVER_1GM_BOX, silver_1gm, rate_font, TEXT_COLOR_SILVER_PANEL)

    return template


def _design_fingerprint() -> str:
    # Covers both the template image and this module's drawing code, so a new
    # template or changed layout makes the cached card stale even when the
    # rates themselves have not moved.
    digest = hashlib.sha256()
    digest.update(TEMPLATE_PATH.read_bytes() if TEMPLATE_PATH.exists() else b"")
    digest.update(Path(__file__).read_bytes())
    return digest.hexdigest()[:16]


def _save_card(image: Image.Image, data: dict[str, Any]) -> dict[str, Any]:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    image.save(CACHE_FILE, format="PNG")

    meta = {
        "generated_at": _now_ist().isoformat(),
        "data_date": data.get("data_date", ""),
        "gold_22k": data.get("gold_22k"),
        "silver": data.get("silver"),
        "design": _design_fingerprint(),
    }
    META_FILE.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return meta


def _load_meta() -> dict[str, Any] | None:
    if not META_FILE.exists():
        return None

    try:
        return json.loads(META_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def generate_and_cache_rate_card(force_refresh: bool = False) -> dict[str, Any]:
    with CARD_GENERATION_LOCK:
        data = get_gold_rate_data(force_refresh=force_refresh)
        image = render_rate_card(data)
        meta = _save_card(image, data)
        LOGGER.info("Rate card regenerated for %s", meta.get("data_date"))
        return meta


def get_rate_card_path(regenerate_if_missing: bool = True) -> Path:
    if not CACHE_FILE.exists() and regenerate_if_missing:
        generate_and_cache_rate_card()

    if not CACHE_FILE.exists():
        raise RateCardError("Rate card has not been generated yet.")

    return CACHE_FILE


def get_rate_card_meta(regenerate_if_missing: bool = True) -> dict[str, Any]:
    meta = _load_meta()

    if meta is None and regenerate_if_missing:
        meta = generate_and_cache_rate_card()

    if meta is None:
        raise RateCardError("Rate card has not been generated yet.")

    return meta


def _card_needs_update(meta: dict[str, Any] | None, data: dict[str, Any]) -> bool:
    if meta is None:
        return True

    return (
        meta.get("data_date") != data.get("data_date")
        or meta.get("gold_22k") != data.get("gold_22k")
        or meta.get("silver") != data.get("silver")
        or meta.get("design") != _design_fingerprint()
    )


def _background_updater_loop() -> None:
    LOGGER.info(
        "Rate card background updater started; checking every %s minutes for rate changes.",
        POLL_INTERVAL_MINUTES,
    )

    while True:
        try:
            data = get_gold_rate_data()
            if _card_needs_update(_load_meta(), data):
                image = render_rate_card(data)
                meta = _save_card(image, data)
                LOGGER.info("Rate card regenerated for %s (rate or design changed).", meta.get("data_date"))
        except GoldRateScraperError as exc:
            LOGGER.warning("Rate card refresh check failed: %s", exc)
        except Exception:
            LOGGER.exception("Unexpected error while checking/generating the rate card.")

        threading.Event().wait(timeout=POLL_INTERVAL_MINUTES * 60)


def start_rate_card_background_updater() -> bool:
    global BACKGROUND_THREAD

    with BACKGROUND_THREAD_LOCK:
        if BACKGROUND_THREAD and BACKGROUND_THREAD.is_alive():
            return False

        BACKGROUND_THREAD = threading.Thread(
            target=_background_updater_loop,
            name="rate-card-updater",
            daemon=True,
        )
        BACKGROUND_THREAD.start()
        return True
