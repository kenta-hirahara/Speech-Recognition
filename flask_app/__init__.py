from flask import Flask
from dotenv import load_dotenv

def create_app():
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py')

    from flask_app.routes import main
    app.register_blueprint(main)

    return app
