"""Application entry point."""
from flask import Flask
from flask_assets import Environment
from flask_cors import CORS
from api.config import app_config
from api.routes import covid_routes, state_routes


def create_app():
    # start app
    app = Flask(__name__)
    app.config.from_object(app_config.Config)
    CORS(app)
    app.config["CORS_HEADERS"] = "Content-Type"
    assets = Environment()
    assets.init_app(app)

    # state blueprints
    app.register_blueprint(state_routes.state_info)

    # covid blueprints
    app.register_blueprint(covid_routes.covid_summary)
    app.register_blueprint(covid_routes.covid_since_date)
    app.register_blueprint(covid_routes.covid_since_first)

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=8000, debug=False)