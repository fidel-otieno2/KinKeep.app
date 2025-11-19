from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_restful import Api
from config import Config
from dotenv import load_dotenv
from datetime import date

# Load environment variables
load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
    
    # Initialize API
    api = Api(app)
    
    # Register routes
    from app.routes.auth_routes import register_auth_routes
    from app.routes.user_routes import register_user_routes
    from app.routes.family_routes import register_family_routes
    from app.routes.story_routes import register_story_routes
    from app.routes.ai_routes import register_ai_routes
    from app.routes.test_routes import register_test_routes
    from app.routes.post_routes import register_post_routes
    from app.routes.follow_routes import register_follow_routes
    from app.routes.message_routes import register_message_routes
    from app.routes.upload_routes import register_upload_routes
    
    register_auth_routes(api)
    register_user_routes(api)
    register_family_routes(api)
    register_story_routes(api)
    register_ai_routes(api)
    register_test_routes(api)
    register_post_routes(api)
    register_follow_routes(api)
    register_message_routes(api)
    register_upload_routes(api)
    
    return app