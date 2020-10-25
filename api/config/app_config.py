"""Flask config."""
import os


class Config(object):
    FLASK_ENV = "production"
    DEBUG = os.getenv("DEBUG", False)
    TESTING = False
