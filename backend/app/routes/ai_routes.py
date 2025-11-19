from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.story import Story
from app.services.ai_service import AIService

class EnhanceStoryResource(Resource):
    @jwt_required()
    def post(self, story_id):
        current_user_id = get_jwt_identity()
        story = Story.query.get_or_404(story_id)
        
        # Check if user owns the story or has family access
        if story.user_id != current_user_id:
            # TODO: Check if user is family member
            return {'error': 'Access denied'}, 403
        
        if not story.content:
            return {'error': 'No content to enhance'}, 400
        
        if story.ai_enhanced:
            return {'error': 'Story already enhanced'}, 400
        
        # Enhance the story using AI
        try:
            ai_service = AIService()
            result = ai_service.enhance_story(story.content, story.title)
            
            if not result['success']:
                return {'error': 'Enhancement failed', 'details': result.get('error')}, 500
        except Exception as e:
            return {'error': 'AI service error', 'details': str(e)}, 500
        
        # Update the story with enhanced content
        story.enhanced_content = result['enhanced_content']
        story.ai_enhanced = True
        story.enhancement_accepted = False  # User needs to accept
        
        db.session.commit()
        
        return {
            'message': 'Story enhanced successfully',
            'story': story.to_dict()
        }

class AcceptEnhancementResource(Resource):
    @jwt_required()
    def post(self, story_id):
        current_user_id = get_jwt_identity()
        story = Story.query.get_or_404(story_id)
        
        if story.user_id != current_user_id:
            return {'error': 'Access denied'}, 403
        
        parser = reqparse.RequestParser()
        parser.add_argument('accept', type=bool, required=True, location='json')
        args = parser.parse_args()
        
        story.enhancement_accepted = args['accept']
        
        if not args['accept']:
            # If rejected, clear the enhanced content
            story.enhanced_content = None
            story.ai_enhanced = False
        
        db.session.commit()
        
        return {
            'message': 'Enhancement preference updated',
            'story': story.to_dict()
        }

def register_ai_routes(api):
    api.add_resource(EnhanceStoryResource, '/stories/<int:story_id>/enhance')
    api.add_resource(AcceptEnhancementResource, '/stories/<int:story_id>/accept-enhancement')