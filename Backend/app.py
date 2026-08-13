import base64
import hashlib
import hmac
import json
import logging
import os
import re
import time
import uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def _load_local_env_file():
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


# Must run before importing product_store/rate_card/scraper: those modules
# read env vars (e.g. GOLD_RATE_CACHE_TTL_MINUTES) into module-level
# constants at import time, so .env has to be loaded first.
_load_local_env_file()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

from flask import Flask, jsonify, request, send_from_directory  # noqa: E402
from werkzeug.utils import secure_filename  # noqa: E402

from product_store import (  # noqa: E402
    ProductNotFoundError,
    ProductStore,
    ProductValidationError,
)
from rate_card import (  # noqa: E402
    RateCardError,
    generate_and_cache_rate_card,
    get_rate_card_meta,
    get_rate_card_path,
    start_rate_card_background_updater,
)
from scraper import (  # noqa: E402
    GoldRateScraperError,
    get_gold_rate_data,
    start_gold_rate_background_updater,
)

ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7


def _get_allowed_origins():
    raw_origins = os.getenv(
        "FRONTEND_ORIGINS",
        os.getenv("FRONTEND_ORIGIN", ""),
    ).strip()

    if raw_origins.startswith("[") and raw_origins.endswith("]"):
        raw_origins = raw_origins[1:-1].strip()

    if raw_origins == "*":
        return "*"

    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    origins.extend(
        origin.strip()
        for origin in raw_origins.split(",")
        if origin.strip()
    )

    raw_origin_regex = os.getenv("FRONTEND_ORIGIN_REGEX", "").strip()
    if raw_origin_regex:
        origins.append(re.compile(raw_origin_regex))

    unique_string_origins = []
    seen_string_origins = set()

    for origin in origins:
        if isinstance(origin, str):
            if origin in seen_string_origins:
                continue

            seen_string_origins.add(origin)
            unique_string_origins.append(origin)
            continue

        unique_string_origins.append(origin)

    return unique_string_origins


def _is_origin_allowed(origin, allowed_origins):
    if allowed_origins == "*":
        return True

    for allowed_origin in allowed_origins:
        if isinstance(allowed_origin, str) and allowed_origin == origin:
            return True

        if hasattr(allowed_origin, "match") and allowed_origin.match(origin):
            return True

    return False


def _resolve_backend_path(raw_value, default_path):
    base_path = Path(raw_value) if raw_value else Path(default_path)
    if not base_path.is_absolute():
        base_path = BASE_DIR / base_path

    return base_path.resolve()


def _b64url_encode(raw_bytes):
    return base64.urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")


def _b64url_decode(value):
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")


def _build_admin_token(secret):
    issued_at = int(time.time())
    payload = {
        "iat": issued_at,
        "exp": issued_at + ADMIN_SESSION_TTL_SECONDS,
    }
    payload_segment = _b64url_encode(
        json.dumps(payload, separators=(",", ":")).encode("utf-8")
    )
    signature = hmac.new(
        secret.encode("utf-8"),
        payload_segment.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload_segment}.{signature}"


def _verify_admin_token(token, secret):
    if not token or "." not in token:
        return False

    payload_segment, provided_signature = token.rsplit(".", 1)
    expected_signature = hmac.new(
        secret.encode("utf-8"),
        payload_segment.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(provided_signature, expected_signature):
        return False

    try:
        payload = json.loads(_b64url_decode(payload_segment).decode("utf-8"))
    except (ValueError, json.JSONDecodeError):
        return False

    expires_at = int(payload.get("exp", 0))
    return expires_at > int(time.time())


def _extract_bearer_token():
    authorization = request.headers.get("Authorization", "").strip()
    if not authorization.lower().startswith("bearer "):
        return ""

    return authorization[7:].strip()


def _is_allowed_image(filename):
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return extension in ALLOWED_IMAGE_EXTENSIONS


def _save_uploaded_image(upload_folder, file_storage):
    original_name = secure_filename(file_storage.filename or "")
    if not original_name:
        raise ProductValidationError("Please choose a valid image file.")

    if not _is_allowed_image(original_name):
        raise ProductValidationError(
            "Only JPG, JPEG, PNG, and WEBP product images are supported."
        )

    extension = original_name.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{extension}"
    upload_path = upload_folder / filename
    file_storage.save(upload_path)
    return f"/uploads/{filename}"


def _delete_uploaded_image(upload_folder, image_path):
    if not image_path.startswith("/uploads/"):
        return

    filename = image_path.removeprefix("/uploads/")
    target_path = (upload_folder / filename).resolve()

    try:
        target_path.relative_to(upload_folder.resolve())
    except ValueError:
        return

    if target_path.exists():
        target_path.unlink()


def _unauthorized_response():
    return jsonify({"error": "Admin login required."}), 401


def _should_start_background_updater():
    debug_enabled = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    if debug_enabled and os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        return False

    return True


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    app.config["MAX_CONTENT_LENGTH"] = int(
        os.getenv("MAX_UPLOAD_SIZE_MB", "8")
    ) * 1024 * 1024

    allowed_origins = _get_allowed_origins()

    upload_folder = _resolve_backend_path(
        os.getenv("UPLOAD_FOLDER"),
        BASE_DIR / "uploads",
    )
    upload_folder.mkdir(parents=True, exist_ok=True)

    products_file = _resolve_backend_path(
        os.getenv("PRODUCTS_FILE"),
        BASE_DIR / "products.json",
    )
    store = ProductStore(products_file)

    admin_password = os.getenv("ADMIN_PASSWORD", "").strip()
    admin_session_secret = os.getenv("ADMIN_SESSION_SECRET", "").strip()

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin", "").strip()

        if allowed_origins == "*":
            response.headers["Access-Control-Allow-Origin"] = "*"
        elif origin and _is_origin_allowed(origin, allowed_origins):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"

        response.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization,Content-Type"
        return response

    @app.get("/")
    def root():
        return jsonify(
            {
                "service": "Sri Amman Jewellery backend",
                "status": "ok",
            }
        )

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.post("/admin/login")
    def admin_login():
        if not admin_password or not admin_session_secret:
            return (
                jsonify(
                    {
                        "error": (
                            "Admin credentials are not configured on the backend."
                        )
                    }
                ),
                503,
            )

        payload = request.get_json(silent=True) or {}
        password = str(payload.get("password", "")).strip()

        if not password or password != admin_password:
            return jsonify({"error": "Invalid admin password."}), 401

        return jsonify(
            {
                "success": True,
                "token": _build_admin_token(admin_session_secret),
                "expires_in_seconds": ADMIN_SESSION_TTL_SECONDS,
            }
        )

    @app.get("/products")
    def products():
        return jsonify(store.list_products())

    @app.post("/products")
    def create_product():
        if not admin_password or not admin_session_secret:
            return (
                jsonify(
                    {
                        "error": (
                            "Admin credentials are not configured on the backend."
                        )
                    }
                ),
                503,
            )

        if not _verify_admin_token(_extract_bearer_token(), admin_session_secret):
            return _unauthorized_response()

        payload = request.form if request.form else (request.get_json(silent=True) or {})
        image_file = request.files.get("image")
        image_url = str(payload.get("image_url", "")).strip()

        try:
            image_path = image_url
            if image_file and image_file.filename:
                image_path = _save_uploaded_image(upload_folder, image_file)

            product = store.create_product(
                title=str(payload.get("title", "")),
                category=str(payload.get("category", "")),
                price=payload.get("price", ""),
                description=str(payload.get("description", "")),
                image=image_path,
            )
        except ProductValidationError as exc:
            return jsonify({"error": str(exc)}), 400
        except Exception:
            app.logger.exception("Unexpected error while creating product")
            return jsonify({"error": "Unable to create product right now."}), 500

        return jsonify(product), 201

    @app.delete("/products/<product_id>")
    def delete_product(product_id):
        if not admin_password or not admin_session_secret:
            return (
                jsonify(
                    {
                        "error": (
                            "Admin credentials are not configured on the backend."
                        )
                    }
                ),
                503,
            )

        if not _verify_admin_token(_extract_bearer_token(), admin_session_secret):
            return _unauthorized_response()

        try:
            deleted_product = store.delete_product(product_id)
            _delete_uploaded_image(upload_folder, deleted_product.get("image", ""))
        except ProductNotFoundError as exc:
            return jsonify({"error": str(exc)}), 404
        except Exception:
            app.logger.exception("Unexpected error while deleting product")
            return jsonify({"error": "Unable to delete product right now."}), 500

        return jsonify({"success": True, "deleted_product": deleted_product})

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(upload_folder, filename)

    @app.get("/gold-rate")
    def gold_rate():
        try:
            return jsonify(get_gold_rate_data())
        except GoldRateScraperError as exc:
            return (
                jsonify(
                    {
                        "error": "Unable to fetch gold rates right now.",
                        "details": str(exc),
                    }
                ),
                503,
            )
        except Exception:
            app.logger.exception("Unexpected error while serving /gold-rate")
            return jsonify({"error": "Unexpected server error."}), 500

    @app.get("/gold-rate/card")
    def gold_rate_card():
        try:
            card_path = get_rate_card_path()
        except (RateCardError, GoldRateScraperError) as exc:
            return jsonify({"error": "Unable to generate the rate card.", "details": str(exc)}), 503
        except Exception:
            app.logger.exception("Unexpected error while serving /gold-rate/card")
            return jsonify({"error": "Unexpected server error."}), 500

        response = send_from_directory(
            card_path.parent, card_path.name, mimetype="image/png"
        )
        response.headers["Cache-Control"] = "no-cache"
        return response

    @app.get("/gold-rate/card/meta")
    def gold_rate_card_meta():
        try:
            return jsonify(get_rate_card_meta())
        except (RateCardError, GoldRateScraperError) as exc:
            return jsonify({"error": "Unable to generate the rate card.", "details": str(exc)}), 503
        except Exception:
            app.logger.exception("Unexpected error while serving /gold-rate/card/meta")
            return jsonify({"error": "Unexpected server error."}), 500

    @app.post("/gold-rate/card/refresh")
    def gold_rate_card_refresh():
        if not admin_password or not admin_session_secret:
            return (
                jsonify(
                    {
                        "error": (
                            "Admin credentials are not configured on the backend."
                        )
                    }
                ),
                503,
            )

        if not _verify_admin_token(_extract_bearer_token(), admin_session_secret):
            return _unauthorized_response()

        try:
            return jsonify(generate_and_cache_rate_card(force_refresh=True))
        except (RateCardError, GoldRateScraperError) as exc:
            return jsonify({"error": "Unable to generate the rate card.", "details": str(exc)}), 503
        except Exception:
            app.logger.exception("Unexpected error while serving /gold-rate/card/refresh")
            return jsonify({"error": "Unexpected server error."}), 500

    if _should_start_background_updater():
        if start_gold_rate_background_updater():
            app.logger.info("Gold rate background updater started.")
        if start_rate_card_background_updater():
            app.logger.info("Rate card background updater started.")
    else:
        app.logger.info(
            "Skipping background updater startup in the reload parent process."
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
    )
