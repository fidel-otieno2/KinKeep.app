from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.follow import Follow, CloseFriend
from app.models.user import User

class FollowResource(Resource):
    @jwt_required()
    def post(self, user_id):
        current_user_id = get_jwt_identity()
        
        if current_user_id == user_id:
            return {'error': 'Cannot follow yourself'}, 400
        
        existing_follow = Follow.query.filter_by(
            follower_id=current_user_id, 
            following_id=user_id
        ).first()
        
        if existing_follow:
            db.session.delete(existing_follow)
            action = 'unfollowed'
        else:
            follow = Follow(follower_id=current_user_id, following_id=user_id)
            db.session.add(follow)
            action = 'followed'
        
        db.session.commit()
        return {'message': f'User {action}'}

class FollowersResource(Resource):
    @jwt_required()
    def get(self, user_id):
        followers = db.session.query(Follow, User).join(
            User, Follow.follower_id == User.id
        ).filter(Follow.following_id == user_id).all()
        
        return {
            'followers': [user.to_dict() for follow, user in followers]
        }

class FollowingResource(Resource):
    @jwt_required()
    def get(self, user_id):
        following = db.session.query(Follow, User).join(
            User, Follow.following_id == User.id
        ).filter(Follow.follower_id == user_id).all()
        
        return {
            'following': [user.to_dict() for follow, user in following]
        }

class CloseFriendsResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        close_friends = db.session.query(CloseFriend, User).join(
            User, CloseFriend.friend_id == User.id
        ).filter(CloseFriend.user_id == current_user_id).all()
        
        return {
            'close_friends': [user.to_dict() for cf, user in close_friends]
        }
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('friend_id', type=int, required=True, location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        existing = CloseFriend.query.filter_by(
            user_id=current_user_id,
            friend_id=args['friend_id']
        ).first()
        
        if existing:
            db.session.delete(existing)
            action = 'removed from'
        else:
            close_friend = CloseFriend(
                user_id=current_user_id,
                friend_id=args['friend_id']
            )
            db.session.add(close_friend)
            action = 'added to'
        
        db.session.commit()
        return {'message': f'User {action} close friends'}

def register_follow_routes(api):
    api.add_resource(FollowResource, '/users/<int:user_id>/follow')
    api.add_resource(FollowersResource, '/users/<int:user_id>/followers')
    api.add_resource(FollowingResource, '/users/<int:user_id>/following')
    api.add_resource(CloseFriendsResource, '/close-friends')