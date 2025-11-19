import openai
import os
from flask import current_app

class AIService:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        openai.api_key = api_key
    
    def enhance_story(self, original_content, title=""):
        """Enhance a story while preserving the author's voice"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a gentle editor who helps preserve family stories."},
                    {"role": "user", "content": f"Please enhance this story: {original_content}"}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            enhanced_content = response.choices[0].message.content.strip()
            return {
                'success': True,
                'enhanced_content': enhanced_content,
                'original_content': original_content
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"AI enhancement error: {error_msg}")
            
            # If quota exceeded, provide a mock enhancement
            if "quota" in error_msg.lower():
                enhanced_content = f"[Demo Enhancement]\n\n{original_content}\n\n(Note: Add OpenAI credits for full AI features.)"
                return {
                    'success': True,
                    'enhanced_content': enhanced_content,
                    'original_content': original_content
                }
            
            return {
                'success': False,
                'error': error_msg
            }
    
    def generate_story_summary(self, content):
        """Generate a brief summary of the story"""
        try:
            prompt = f"Create a brief, warm summary (2-3 sentences) of this family story:\n\n{content}"
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You create warm, family-friendly summaries of personal stories."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            current_app.logger.error(f"Summary generation error: {str(e)}")
            return None