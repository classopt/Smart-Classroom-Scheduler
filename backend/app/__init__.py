from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db=SQLAlchemy()
migrate=Migrate()
jwt=JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    from .config import config
    import os
    env = os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[env])

    # Initialize CORS first
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)

    # Add a simple test route
    @app.route('/api/test', methods=['GET', 'POST'])
    def test():
        return jsonify({'message': 'CORS is working!', 'origin': request.headers.get('Origin')})

    # 1. Initialize the Extensions with app
    db.init_app(app)
    migrate.init_app(app,db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    from .routes.resources import resources_bp
    app.register_blueprint(resources_bp, url_prefix='/api/resources')
    
    from .routes.scheduling import scheduling_bp
    app.register_blueprint(scheduling_bp, url_prefix='/api/scheduling')
    
    return app