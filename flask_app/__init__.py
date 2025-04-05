from flask import Flask

def create_app():

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py')

    from flask_app.routes import main
    app.register_blueprint(main)

    return app
