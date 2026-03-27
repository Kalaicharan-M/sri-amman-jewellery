import os
import re

from flask import Flask, jsonify
from flask_cors import CORS

from scraper import GoldRateScraperError, get_gold_rate_data


def _get_allowed_origins():
    raw_origins = os.getenv(
        "FRONTEND_ORIGINS",
        os.getenv("FRONTEND_ORIGIN", ""),
    ).strip()
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


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    allowed_origins = _get_allowed_origins()
    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
    )

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

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

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
    )
