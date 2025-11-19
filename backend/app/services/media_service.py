import cloudinary
import cloudinary.uploader
import os
from flask import current_app

class MediaService:
    def __init__(self):
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET')
        )
    
    def upload_image(self, file, folder="posts"):
        """Upload image to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=f"kinkeep/{folder}",
                resource_type="image",
                transformation=[
                    {'width': 1080, 'height': 1080, 'crop': 'limit', 'quality': 'auto'},
                    {'format': 'jpg'}
                ]
            )
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id']
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def upload_video(self, file, folder="posts"):
        """Upload video to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=f"kinkeep/{folder}",
                resource_type="video",
                transformation=[
                    {'width': 1080, 'height': 1920, 'crop': 'limit', 'quality': 'auto'},
                    {'format': 'mp4'}
                ]
            )
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'duration': result.get('duration', 0)
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def upload_audio(self, file, folder="messages"):
        """Upload audio to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=f"kinkeep/{folder}",
                resource_type="video"  # Cloudinary treats audio as video
            )
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'duration': result.get('duration', 0)
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def delete_media(self, public_id, resource_type="image"):
        """Delete media from Cloudinary"""
        try:
            result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            return {'success': True, 'result': result}
        except Exception as e:
            return {'success': False, 'error': str(e)}