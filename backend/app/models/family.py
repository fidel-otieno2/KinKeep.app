from app import db
from datetime import datetime

class Family(db.Model):
    __tablename__ = 'families'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    stories = db.relationship('Story', backref='family', lazy=True)
    members = db.relationship('FamilyMember', backref='family', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'member_count': len(self.members)
        }

class FamilyMember(db.Model):
    __tablename__ = 'family_members'
    
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    relation = db.Column(db.String(100))
    role_in_family = db.Column(db.String(20), default='member')
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='family_memberships')
    
    def to_dict(self):
        return {
            'id': self.id,
            'family_id': self.family_id,
            'user': self.user.to_dict() if self.user else None,
            'relation': self.relation,
            'role_in_family': self.role_in_family,
            'joined_at': self.joined_at.isoformat()
        }