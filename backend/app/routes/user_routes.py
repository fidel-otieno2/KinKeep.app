from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from app import db
from app.models.user import User
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

class UserProfileResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        return {'user': user.to_dict()}
    
    @jwt_required()
    def put(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get_or_404(current_user_id)
            
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            if 'name' in data and data['name']:
                user.name = data['name']
            if 'username' in data:
                user.username = data['username']
            if 'email' in data and data['email']:
                user.email = data['email']
            if 'bio' in data:
                user.bio = data['bio']
            if 'website' in data:
                user.website = data['website']
            if 'phone' in data:
                user.phone = data['phone']
            if 'gender' in data:
                user.gender = data['gender']
            if 'profile_image' in data:
                user.profile_image = data['profile_image']
            
            db.session.commit()
            return {'message': 'Profile updated successfully', 'user': user.to_dict()}
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class ChangePasswordResource(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        
        parser = reqparse.RequestParser()
        parser.add_argument('currentPassword', type=str, required=True, location='json')
        parser.add_argument('newPassword', type=str, required=True, location='json')
        args = parser.parse_args()
        
        if not check_password_hash(user.password_hash, args['currentPassword']):
            return {'error': 'Current password is incorrect'}, 400
        
        user.password_hash = generate_password_hash(args['newPassword'])
        db.session.commit()
        
        return {'message': 'Password changed successfully'}

def register_user_routes(api):
    api.add_resource(UserProfileResource, '/users/me')
    api.add_resource(ChangePasswordResource, '/users/change-password')