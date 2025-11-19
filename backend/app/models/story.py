from app import db
from datetime import datetime

class Story(db.Model):
    __tablename__ = 'stories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)
    enhanced_content = db.Column(db.Text)
    media_url = db.Column(db.Text)
    type = db.Column(db.String(20), default='text')  # text, audio, video
    visibility = db.Column(db.String(20), default='private')  # private, family, public
    language = db.Column(db.String(10), default='en')
    duration_seconds = db.Column(db.Integer)
    ai_enhanced = db.Column(db.Boolean, default=False)
    enhancement_accepted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    comments = db.relationship('Comment', backref='story', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'family_id': self.family_id,
            'title': self.title,
            'content': self.content,
            'enhanced_content': self.enhanced_content,
            'media_url': self.media_url,
            'type': self.type,
            'visibility': self.visibility,
            'language': self.language,
            'duration_seconds': self.duration_seconds,
            'ai_enhanced': self.ai_enhanced,
            'enhancement_accepted': self.enhancement_accepted,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'author': self.author.name if self.author else None
        }

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey('stories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='comments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'story_id': self.story_id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author': self.user.name if self.user else None
        }