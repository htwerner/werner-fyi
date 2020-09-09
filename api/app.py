"""Application entry point."""
from flask import Flask
from flask_assets import Environment
from flask_cors import CORS
from routes import covid_data


def create_app():
    # start app
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    assets = Environment()
    assets.init_app(app)

    # register blueprints
    app.register_blueprint(covid_data.covid_all)
    app.register_blueprint(covid_data.covid_since_date)
    app.register_blueprint(covid_data.covid_since_first)

    return app


create_app().run(host='0.0.0.0', port=8000, debug=False)