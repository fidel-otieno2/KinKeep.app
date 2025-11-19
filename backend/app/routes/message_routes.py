from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from app import db
from app.models.message import Conversation, ConversationParticipant, Message
from app.models.user import User
from app.models.follow import Follow
from sqlalchemy import or_, and_
from app.models.user import User
from app.models.follow import Follow
from sqlalchemy import or_, and_

class ConversationsResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        conversations = db.session.query(Conversation).join(
            ConversationParticipant
        ).filter(ConversationParticipant.user_id == current_user_id).order_by(
            Conversation.updated_at.desc()
        ).all()
        
        result = []
        for conv in conversations:
            # Get last message
            last_message = Message.query.filter_by(
                conversation_id=conv.id
            ).order_by(Message.created_at.desc()).first()
            
            # Get other participants (exclude current user)
            other_participants = [p.user for p in conv.participants if p.user_id != current_user_id]
            
            # For direct messages, use the other person's name and avatar
            if not conv.is_group and other_participants:
                other_user = other_participants[0]
                name = other_user.username
                avatar = other_user.profile_image or f'https://picsum.photos/seed/{other_user.id}/150/150'
            else:
                name = conv.name or 'Group Chat'
                avatar = 'https://picsum.photos/seed/group/150/150'
            
            # Check unread count
            participant = next((p for p in conv.participants if p.user_id == current_user_id), None)
            unread_count = 0
            if participant and participant.last_read_at:
                unread_count = Message.query.filter(
                    Message.conversation_id == conv.id,
                    Message.created_at > participant.last_read_at,
                    Message.sender_id != current_user_id
                ).count()
            elif participant:
                unread_count = Message.query.filter(
                    Message.conversation_id == conv.id,
                    Message.sender_id != current_user_id
                ).count()
            
            result.append({
                'id': conv.id,
                'name': name,
                'avatar': avatar,
                'is_group': conv.is_group,
                'updated_at': conv.updated_at.isoformat(),
                'last_message': last_message.to_dict() if last_message else None,
                'unread_count': unread_count,
                'participants': [{
                    'id': p.user.id,
                    'username': p.user.username,
                    'profile_image': p.user.profile_image or f'https://picsum.photos/seed/{p.user.id}/150/150'
                } for p in conv.participants]
            })
        
        return {'conversations': result}
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('participant_ids', type=list, required=True, location='json')
        parser.add_argument('name', type=str, location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        participant_ids = [int(pid) for pid in args['participant_ids']]
        
        # Check if direct conversation already exists
        if len(participant_ids) == 1:
            other_user_id = participant_ids[0]
            existing_conv = db.session.query(Conversation).join(
                ConversationParticipant, Conversation.id == ConversationParticipant.conversation_id
            ).filter(
                Conversation.is_group == False,
                ConversationParticipant.user_id.in_([current_user_id, other_user_id])
            ).group_by(Conversation.id).having(
                db.func.count(ConversationParticipant.user_id) == 2
            ).first()
            
            if existing_conv:
                return {'conversation_id': existing_conv.id}, 200
        
        conversation = Conversation(
            is_group=len(participant_ids) > 1,
            name=args['name'],
            created_by=current_user_id
        )
        
        db.session.add(conversation)
        db.session.flush()
        
        # Add participants
        all_participants = participant_ids + [current_user_id]
        for participant_id in all_participants:
            participant = ConversationParticipant(
                conversation_id=conversation.id,
                user_id=participant_id
            )
            db.session.add(participant)
        
        db.session.commit()
        
        return {'message': 'Conversation created', 'conversation_id': conversation.id}, 201

class MessagesResource(Resource):
    @jwt_required()
    def get(self, conversation_id):
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=int, default=1, location='args')
        parser.add_argument('limit', type=int, default=50, location='args')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        # Check if user is participant
        participant = ConversationParticipant.query.filter_by(
            conversation_id=conversation_id,
            user_id=current_user_id
        ).first()
        
        if not participant:
            return {'error': 'Access denied'}, 403
        
        messages = Message.query.filter_by(
            conversation_id=conversation_id
        ).order_by(Message.created_at.asc()).paginate(
            page=args['page'], per_page=args['limit'], error_out=False
        )
        
        # Mark messages as read
        participant.last_read_at = db.func.now()
        db.session.commit()
        
        return {
            'messages': [msg.to_dict() for msg in messages.items],
            'total': messages.total
        }
    
    @jwt_required()
    def post(self, conversation_id):
        parser = reqparse.RequestParser()
        parser.add_argument('content', type=str, location='json')
        parser.add_argument('media_url', type=str, location='json')
        parser.add_argument('message_type', type=str, default='text', location='json')
        parser.add_argument('reply_to_id', type=int, location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        # Check if user is participant
        participant = ConversationParticipant.query.filter_by(
            conversation_id=conversation_id,
            user_id=current_user_id
        ).first()
        
        if not participant:
            return {'error': 'Access denied'}, 403
        
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user_id,
            content=args['content'],
            media_url=args['media_url'],
            message_type=args['message_type'],
            reply_to_id=args['reply_to_id']
        )
        
        db.session.add(message)
        
        # Update conversation timestamp
        conversation = Conversation.query.get(conversation_id)
        conversation.updated_at = db.func.now()
        
        db.session.commit()
        
        return {'message': 'Message sent', 'message_data': message.to_dict()}, 201

class SearchUsersResource(Resource):
    @jwt_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('q', type=str, required=True, location='args')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        # Search users by username
        users = User.query.filter(
            User.username.ilike(f'%{args["q"]}%'),
            User.id != current_user_id
        ).limit(20).all()
        
        return {
            'users': [{
                'id': user.id,
                'username': user.username,
                'full_name': user.full_name,
                'profile_image': user.profile_image or f'https://picsum.photos/seed/{user.id}/150/150'
            } for user in users]
        }

def register_message_routes(api):
    api.add_resource(ConversationsResource, '/conversations')
    api.add_resource(MessagesResource, '/conversations/<int:conversation_id>/messages')
    api.add_resource(SearchUsersResource, '/search/users')