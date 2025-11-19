from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=True)
    email = db.Column(db.String(150), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), default='member')
    is_verified = db.Column(db.Boolean, default=False)
    profile_image = db.Column(db.Text, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    website = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    birthday = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    stories = db.relationship('Story', backref='author', lazy=True)
    families_created = db.relationship('Family', backref='creator', lazy=True)
    posts = db.relationship('Post', backref='author', lazy=True)
    
    # Follow relationships
    @property
    def followers_count(self):
        from app.models.follow import Follow
        return Follow.query.filter_by(following_id=self.id).count()
    
    @property
    def following_count(self):
        from app.models.follow import Follow
        return Follow.query.filter_by(follower_id=self.id).count()
    
    @property
    def posts_count(self):
        return len([p for p in self.posts if not p.is_story])
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_verified': self.is_verified,
            'profile_image': self.profile_image,
            'bio': self.bio,
            'website': self.website,
            'phone': self.phone,
            'gender': self.gender,
            'birthday': self.birthday.isoformat() if self.birthday else None,
            'created_at': self.created_at.isoformat(),
            'followers_count': self.followers_count,
            'following_count': self.following_count,
            'posts_count': self.posts_count
        }