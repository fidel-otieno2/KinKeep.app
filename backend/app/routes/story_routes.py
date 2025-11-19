from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.story import Story
from app.models.family import FamilyMember

class StoriesResource(Resource):
    @jwt_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('family_id', type=int, location='args')
        parser.add_argument('page', type=int, default=1, location='args')
        parser.add_argument('limit', type=int, default=10, location='args')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        query = Story.query
        
        if args['family_id']:
            # Check if user is member of family
            member = FamilyMember.query.filter_by(
                family_id=args['family_id'], 
                user_id=current_user_id
            ).first()
            if not member:
                return {'error': 'Access denied'}, 403
            query = query.filter_by(family_id=args['family_id'])
        else:
            query = query.filter_by(user_id=current_user_id)
        
        stories = query.paginate(
            page=args['page'], 
            per_page=args['limit'], 
            error_out=False
        )
        
        return {
            'stories': [story.to_dict() for story in stories.items],
            'total': stories.total,
            'pages': stories.pages,
            'current_page': stories.page
        }
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('family_id', type=int, required=True, location='json')
        parser.add_argument('title', required=True, location='json')
        parser.add_argument('content', location='json')
        parser.add_argument('type', default='text', location='json')
        parser.add_argument('visibility', default='private', location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        # Check family membership
        member = FamilyMember.query.filter_by(
            family_id=args['family_id'], 
            user_id=current_user_id
        ).first()
        if not member:
            return {'error': 'Access denied'}, 403
        
        story = Story(
            user_id=current_user_id,
            family_id=args['family_id'],
            title=args['title'],
            content=args['content'],
            type=args['type'],
            visibility=args['visibility']
        )
        
        db.session.add(story)
        db.session.commit()
        
        return {'message': 'Story created', 'story': story.to_dict()}, 201

class StoryResource(Resource):
    @jwt_required()
    def get(self, story_id):
        current_user_id = get_jwt_identity()
        story = Story.query.get_or_404(story_id)
        
        # Check access permissions
        if story.visibility == 'private' and story.user_id != current_user_id:
            return {'error': 'Access denied'}, 403
        
        if story.visibility == 'family':
            member = FamilyMember.query.filter_by(
                family_id=story.family_id, 
                user_id=current_user_id
            ).first()
            if not member:
                return {'error': 'Access denied'}, 403
        
        return {'story': story.to_dict()}
    
    @jwt_required()
    def put(self, story_id):
        current_user_id = get_jwt_identity()
        story = Story.query.get_or_404(story_id)
        
        if story.user_id != current_user_id:
            return {'error': 'Access denied'}, 403
        
        parser = reqparse.RequestParser()
        parser.add_argument('title', location='json')
        parser.add_argument('content', location='json')
        parser.add_argument('visibility', location='json')
        args = parser.parse_args()
        
        if args['title']:
            story.title = args['title']
        if args['content']:
            story.content = args['content']
        if args['visibility']:
            story.visibility = args['visibility']
        
        db.session.commit()
        return {'message': 'Story updated', 'story': story.to_dict()}

def register_story_routes(api):
    api.add_resource(StoriesResource, '/stories')
    api.add_resource(StoryResource, '/stories/<int:story_id>')