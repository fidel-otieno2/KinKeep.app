from app import db
from datetime import datetime

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'))
    caption = db.Column(db.Text)
    media_urls = db.Column(db.JSON)  # Array of media URLs
    media_type = db.Column(db.String(20), default='photo')  # photo, video, carousel
    location = db.Column(db.String(255))
    is_story = db.Column(db.Boolean, default=False)
    is_reel = db.Column(db.Boolean, default=False)
    story_expires_at = db.Column(db.DateTime)
    visibility = db.Column(db.String(20), default='public')  # public, family, close_friends
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    likes = db.relationship('Like', backref='post', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('PostComment', backref='post', lazy=True, cascade='all, delete-orphan')
    saves = db.relationship('SavedPost', backref='post', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'family_id': self.family_id,
            'caption': self.caption,
            'media_urls': self.media_urls,
            'media_type': self.media_type,
            'location': self.location,
            'is_story': self.is_story,
            'is_reel': self.is_reel,
            'visibility': self.visibility,
            'created_at': self.created_at.isoformat(),
            'likes_count': len(self.likes),
            'comments_count': len(self.comments),
            'author': self.author.to_dict() if self.author else None
        }

class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id'),)

class PostComment(db.Model):
    __tablename__ = 'post_comments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('post_comments.id'))  # For replies
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='post_comments')
    replies = db.relationship('PostComment', backref=db.backref('parent', remote_side=[id]))

class SavedPost(db.Model):
    __tablename__ = 'saved_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id'),)