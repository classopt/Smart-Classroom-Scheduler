from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db=SQLAlchemy()
migrate=Migrate()
jwt=JWTManager()

def create_app():
    app = Flask(__name__)

    # 1. Adding Some basic configurations

    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///development.db'
    app.config['JWT_SECRET_KEY']='your-secret-affair'

    # 1. Initialize the Extensions with  app

    db.init_app(app)
    migrate.init_app(app,db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    return app