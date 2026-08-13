from __future__ import annotations

import json
import logging
import os
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from scraper import CACHE_UPDATED_EVENT, GoldRateScraperError, get_gold_rate_data

BASE_DIR = Path(__file__).resolve().parent
IST = timezone(timedelta(hours=5, minutes=30))
SOURCE_DATE_FORMAT = "%d/%b/%Y"
DISPLAY_DATE_FORMAT = "%d-%m-%Y"

TEMPLATE_PATH = Path(
    os.getenv(
        "RATE_CARD_TEMPLATE",
        str(BASE_DIR / "assets" / "templates" / "rate_card_template.png"),
    )
)
FONT_PATH = BASE_DIR / "assets" / "fonts" / "DejaVuSans-Bold.ttf"

DEFAULT_CACHE_FILE = BASE_DIR / "rate_card_cache.png"
CACHE_FILE = Path(os.getenv("RATE_CARD_CACHE_FILE", str(DEFAULT_CACHE_FILE)))
META_FILE = CACHE_FILE.with_suffix(".meta.json")

# How often to check whether the underlying gold/silver rate has changed and,
# if so, regenerate the card image. Cheap when unchanged: get_gold_rate_data()
# just returns the existing scraper cache without a network call.
POLL_INTERVAL_MINUTES = int(os.getenv("RATE_CARD_POLL_INTERVAL_MINUTES", "5"))

GOLD_SOVEREIGN_GRAMS = 8

# Measured from the sample template (1280x908). Each box is drawn over the
# template to cover the previous day's baked-in numbers and host the new text.
DATE_BOX = (505, 610, 760, 675)
GOLD_LINE1_BOX = (110, 688, 535, 750)
GOLD_LINE2_BOX = (110, 748, 590, 810)
SILVER_BOX = (650, 708, 1015, 768)

BOX_FILL_COLOR = (13, 56, 39)
TEXT_COLOR_WHITE = (255, 255, 255)
TEXT_COLOR_GOLD = (247, 224, 150)
BOX_PADDING = 8
BOX_RADIUS = 12

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


def _format_display_date(data: dict[str, Any]) -> str:
    raw_date = str(data.get("data_date", "")).strip()

    if raw_date:
        try:
            parsed = datetime.strptime(raw_date, SOURCE_DATE_FORMAT)
            return parsed.strftime(DISPLAY_DATE_FORMAT)
        except ValueError:
            pass

    return _now_ist().strftime(DISPLAY_DATE_FORMAT)


def _load_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_PATH), size)


def _draw_field(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    text_color: tuple[int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    padded_box = (x0 - BOX_PADDING, y0 - BOX_PADDING, x1 + BOX_PADDING, y1 + BOX_PADDING)
    draw.rounded_rectangle(padded_box, radius=BOX_RADIUS, fill=BOX_FILL_COLOR)

    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    center_x = x0 + ((x1 - x0) - text_width) / 2 - text_bbox[0]
    center_y = y0 + ((y1 - y0) - text_height) / 2 - text_bbox[1]

    draw.text((center_x, center_y), text, font=font, fill=text_color)


def render_rate_card(data: dict[str, Any]) -> Image.Image:
    if not TEMPLATE_PATH.exists():
        raise RateCardError(f"Rate card template not found at {TEMPLATE_PATH}.")

    template = Image.open(TEMPLATE_PATH).convert("RGB")
    draw = ImageDraw.Draw(template)

    gold_1gm = data["gold_22k"]
    gold_8gm = gold_1gm * GOLD_SOVEREIGN_GRAMS
    silver_1gm = data["silver"]

    rate_font = _load_font(34)
    date_font = _load_font(32)

    _draw_field(draw, DATE_BOX, _format_display_date(data), date_font, TEXT_COLOR_GOLD)
    _draw_field(
        draw,
        GOLD_LINE1_BOX,
        f"1 GM  - Rs.{format_inr(gold_1gm)}",
        rate_font,
        TEXT_COLOR_WHITE,
    )
    _draw_field(
        draw,
        GOLD_LINE2_BOX,
        f"8 GM  - Rs.{format_inr(gold_8gm)}",
        rate_font,
        TEXT_COLOR_WHITE,
    )
    _draw_field(
        draw,
        SILVER_BOX,
        f"1 GM  -  Rs.{format_inr(silver_1gm)}",
        rate_font,
        TEXT_COLOR_WHITE,
    )

    return template


def _save_card(image: Image.Image, data: dict[str, Any]) -> dict[str, Any]:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    image.save(CACHE_FILE, format="PNG")

    meta = {
        "generated_at": _now_ist().isoformat(),
        "data_date": data.get("data_date", ""),
        "gold_22k": data.get("gold_22k"),
        "silver": data.get("silver"),
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


def _rate_values_changed(meta: dict[str, Any] | None, data: dict[str, Any]) -> bool:
    if meta is None:
        return True

    return (
        meta.get("data_date") != data.get("data_date")
        or meta.get("gold_22k") != data.get("gold_22k")
        or meta.get("silver") != data.get("silver")
    )


def _background_updater_loop() -> None:
    LOGGER.info(
        "Rate card background updater started; reacts immediately to gold-rate "
        "cache updates, with a %s-minute fallback check.",
        POLL_INTERVAL_MINUTES,
    )

    while True:
        try:
            data = get_gold_rate_data()
            if _rate_values_changed(_load_meta(), data):
                image = render_rate_card(data)
                meta = _save_card(image, data)
                LOGGER.info("Rate card regenerated for %s (rate changed).", meta.get("data_date"))
        except GoldRateScraperError as exc:
            LOGGER.warning("Rate card refresh check failed: %s", exc)
        except Exception:
            LOGGER.exception("Unexpected error while checking/generating the rate card.")

        # Wake immediately when the gold-rate cache refreshes (background
        # thread or an on-demand request), instead of waiting out the full
        # poll interval regardless of when the underlying data actually changed.
        CACHE_UPDATED_EVENT.wait(timeout=POLL_INTERVAL_MINUTES * 60)
        CACHE_UPDATED_EVENT.clear()

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
