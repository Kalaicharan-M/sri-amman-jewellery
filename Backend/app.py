import os

from flask import Flask, jsonify
from flask_cors import CORS

from scraper import GoldRateScraperError, get_gold_rate_data


def _get_allowed_origins():
    raw_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").strip()
    if raw_origins == "*":
        return "*"

    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    return origins or ["http://localhost:5173"]


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    allowed_origins = _get_allowed_origins()
    CORS(
        app,
        resources={
            r"/gold-rate": {"origins": allowed_origins},
            r"/health": {"origins": allowed_origins},
        },
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
