from flask_restful import Resource
from app.services.ai_service import AIService
import os

class TestAIResource(Resource):
    def get(self):
        try:
            # Check if API key is available
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                return {'error': 'OpenAI API key not found'}, 500
            
            # Test AI service
            ai_service = AIService()
            result = ai_service.enhance_story("This is a test story.", "Test")
            
            return {
                'api_key_present': bool(api_key),
                'ai_test_success': result['success'],
                'ai_test_result': result.get('enhanced_content', result.get('error'))
            }
        except Exception as e:
            return {'error': str(e)}, 500

def register_test_routes(api):
    api.add_resource(TestAIResource, '/test/ai')