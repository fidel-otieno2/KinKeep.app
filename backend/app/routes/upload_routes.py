from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from app.services.media_service import MediaService
import os

class UploadResource(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {'error': 'No file selected'}, 400
        
        # Get upload type from form data
        upload_type = request.form.get('type', 'image')  # image, video, audio
        folder = request.form.get('folder', 'posts')  # posts, stories, messages, profiles
        
        # Validate file type
        allowed_extensions = {
            'image': {'jpg', 'jpeg', 'png', 'gif', 'webp'},
            'video': {'mp4', 'mov', 'avi', 'mkv', 'webm'},
            'audio': {'mp3', 'wav', 'ogg', 'm4a', 'aac'}
        }
        
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if file_ext not in allowed_extensions.get(upload_type, set()):
            return {'error': f'Invalid file type for {upload_type}'}, 400
        
        # Check file size (10MB for images, 100MB for videos, 25MB for audio)
        max_sizes = {'image': 10 * 1024 * 1024, 'video': 100 * 1024 * 1024, 'audio': 25 * 1024 * 1024}
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > max_sizes.get(upload_type, 10 * 1024 * 1024):
            return {'error': f'File too large for {upload_type}'}, 400
        
        # Upload to Cloudinary
        media_service = MediaService()
        
        if upload_type == 'image':
            result = media_service.upload_image(file, folder)
        elif upload_type == 'video':
            result = media_service.upload_video(file, folder)
        elif upload_type == 'audio':
            result = media_service.upload_audio(file, folder)
        else:
            return {'error': 'Invalid upload type'}, 400
        
        if result['success']:
            return {
                'message': 'File uploaded successfully',
                'url': result['url'],
                'public_id': result['public_id'],
                'type': upload_type,
                'duration': result.get('duration')
            }, 201
        else:
            return {'error': result['error']}, 500

def register_upload_routes(api):
    api.add_resource(UploadResource, '/upload')