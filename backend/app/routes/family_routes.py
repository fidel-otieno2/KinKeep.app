from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.family import Family, FamilyMember

class FamiliesResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        # Get families where user is a member
        memberships = FamilyMember.query.filter_by(user_id=current_user_id).all()
        families = [membership.family.to_dict() for membership in memberships]
        
        return {'families': families}
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True, location='json')
        parser.add_argument('description', location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        family = Family(
            name=args['name'],
            description=args['description'],
            created_by=current_user_id
        )
        
        db.session.add(family)
        db.session.flush()  # Get family ID
        
        # Add creator as admin member
        member = FamilyMember(
            family_id=family.id,
            user_id=current_user_id,
            relation='Creator',
            role_in_family='admin'
        )
        
        db.session.add(member)
        db.session.commit()
        
        return {'message': 'Family created', 'family': family.to_dict()}, 201

class FamilyResource(Resource):
    @jwt_required()
    def get(self, family_id):
        current_user_id = get_jwt_identity()
        
        # Check membership
        member = FamilyMember.query.filter_by(
            family_id=family_id, 
            user_id=current_user_id
        ).first()
        if not member:
            return {'error': 'Access denied'}, 403
        
        family = Family.query.get_or_404(family_id)
        family_dict = family.to_dict()
        family_dict['members'] = [m.to_dict() for m in family.members]
        
        return {'family': family_dict}

def register_family_routes(api):
    api.add_resource(FamiliesResource, '/families')
    api.add_resource(FamilyResource, '/families/<int:family_id>')