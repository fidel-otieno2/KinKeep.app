from app import db
from datetime import datetime

class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    is_group = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(255))  # For group chats
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = db.relationship('Message', backref='conversation', lazy=True)
    participants = db.relationship('ConversationParticipant', backref='conversation', lazy=True)

class ConversationParticipant(db.Model):
    __tablename__ = 'conversation_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_read_at = db.Column(db.DateTime)
    
    # Relationships
    user = db.relationship('User', backref='conversation_participations')

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text)
    media_url = db.Column(db.String(500))
    message_type = db.Column(db.String(20), default='text')  # text, image, video, voice, post_share
    reply_to_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    edited_at = db.Column(db.DateTime)
    
    # Relationships
    sender = db.relationship('User', backref='sent_messages')
    reply_to = db.relationship('Message', remote_side=[id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'sender_id': self.sender_id,
            'content': self.content,
            'media_url': self.media_url,
            'message_type': self.message_type,
            'reply_to_id': self.reply_to_id,
            'created_at': self.created_at.isoformat(),
            'sender': self.sender.to_dict() if self.sender else None
        }