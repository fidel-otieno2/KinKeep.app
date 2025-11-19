from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User

class RegisterResource(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', required=True)
            parser.add_argument('email', required=True)
            parser.add_argument('password', required=True)
            args = parser.parse_args()
            
            # Allow multiple accounts per email - no check needed
            
            user = User(name=args['name'], email=args['email'])
            user.set_password(args['password'])
            
            db.session.add(user)
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            
            return {
                'message': 'User registered successfully',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class LoginResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()
        
        users = User.query.filter_by(email=args['email']).all()
        user = None
        
        for u in users:
            if u.check_password(args['password']):
                user = u
                break
        
        if not user:
            return {'error': 'Invalid credentials'}, 401
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }

class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        return {'access_token': access_token}

def register_auth_routes(api):
    api.add_resource(RegisterResource, '/auth/register')
    api.add_resource(LoginResource, '/auth/login')
    api.add_resource(RefreshResource, '/auth/refresh')