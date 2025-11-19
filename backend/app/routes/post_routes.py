from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.post import Post, Like, PostComment, SavedPost
from app.models.follow import Follow
from datetime import datetime, timedelta

class PostsResource(Resource):
    @jwt_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str, location='args')  # feed, stories, reels, explore
        parser.add_argument('user_id', type=int, location='args')  # filter by user
        parser.add_argument('page', type=int, default=1, location='args')
        parser.add_argument('limit', type=int, default=10, location='args')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        # If user_id is specified, get posts for that specific user
        if args['user_id']:
            if args['type'] == 'stories':
                stories = Post.query.filter(
                    Post.is_story == True,
                    Post.user_id == args['user_id'],
                    Post.story_expires_at > datetime.utcnow()
                ).order_by(Post.created_at.desc()).all()
                return {'stories': [story.to_dict() for story in stories]}
            
            elif args['type'] == 'reels':
                reels = Post.query.filter(
                    Post.is_reel == True,
                    Post.user_id == args['user_id']
                ).order_by(Post.created_at.desc()).paginate(
                    page=args['page'], per_page=args['limit'], error_out=False
                )
                return {
                    'reels': [reel.to_dict() for reel in reels.items],
                    'total': reels.total,
                    'pages': reels.pages
                }
            
            else:  # regular posts
                posts = Post.query.filter(
                    Post.is_story == False,
                    Post.user_id == args['user_id']
                ).order_by(Post.created_at.desc()).paginate(
                    page=args['page'], per_page=args['limit'], error_out=False
                )
                return {
                    'posts': [post.to_dict() for post in posts.items],
                    'total': posts.total,
                    'pages': posts.pages
                }
        
        if args['type'] == 'stories':
            # Get stories from followed users (last 24 hours)
            following_ids = db.session.query(Follow.following_id).filter_by(follower_id=current_user_id).all()
            following_ids = [f[0] for f in following_ids] + [current_user_id]
            
            stories = Post.query.filter(
                Post.is_story == True,
                Post.user_id.in_(following_ids),
                Post.story_expires_at > datetime.utcnow()
            ).order_by(Post.created_at.desc()).all()
            
            return {'stories': [story.to_dict() for story in stories]}
        
        elif args['type'] == 'reels':
            reels = Post.query.filter_by(is_reel=True).order_by(Post.created_at.desc()).paginate(
                page=args['page'], per_page=args['limit'], error_out=False
            )
            return {
                'reels': [reel.to_dict() for reel in reels.items],
                'total': reels.total,
                'pages': reels.pages
            }
        
        else:  # feed
            # Get posts from followed users
            following_ids = db.session.query(Follow.following_id).filter_by(follower_id=current_user_id).all()
            following_ids = [f[0] for f in following_ids] + [current_user_id]
            
            posts = Post.query.filter(
                Post.is_story == False,
                Post.user_id.in_(following_ids)
            ).order_by(Post.created_at.desc()).paginate(
                page=args['page'], per_page=args['limit'], error_out=False
            )
            
            return {
                'posts': [post.to_dict() for post in posts.items],
                'total': posts.total,
                'pages': posts.pages
            }
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('caption', type=str, location='json')
        parser.add_argument('media_urls', type=list, location='json')
        parser.add_argument('media_type', type=str, default='photo', location='json')
        parser.add_argument('location', type=str, location='json')
        parser.add_argument('is_story', type=bool, default=False, location='json')
        parser.add_argument('is_reel', type=bool, default=False, location='json')
        parser.add_argument('visibility', type=str, default='public', location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        post = Post(
            user_id=current_user_id,
            caption=args['caption'],
            media_urls=args['media_urls'],
            media_type=args['media_type'],
            location=args['location'],
            is_story=args['is_story'],
            is_reel=args['is_reel'],
            visibility=args['visibility']
        )
        
        if args['is_story']:
            post.story_expires_at = datetime.utcnow() + timedelta(hours=24)
        
        db.session.add(post)
        db.session.commit()
        
        return {'message': 'Post created', 'post': post.to_dict()}, 201

class PostResource(Resource):
    @jwt_required()
    def get(self, post_id):
        post = Post.query.get_or_404(post_id)
        return {'post': post.to_dict()}

class LikeResource(Resource):
    @jwt_required()
    def post(self, post_id):
        current_user_id = get_jwt_identity()
        
        existing_like = Like.query.filter_by(user_id=current_user_id, post_id=post_id).first()
        if existing_like:
            db.session.delete(existing_like)
            action = 'unliked'
        else:
            like = Like(user_id=current_user_id, post_id=post_id)
            db.session.add(like)
            action = 'liked'
        
        db.session.commit()
        return {'message': f'Post {action}'}

class CommentResource(Resource):
    @jwt_required()
    def post(self, post_id):
        parser = reqparse.RequestParser()
        parser.add_argument('content', type=str, required=True, location='json')
        parser.add_argument('parent_id', type=int, location='json')
        args = parser.parse_args()
        
        current_user_id = get_jwt_identity()
        
        comment = PostComment(
            user_id=current_user_id,
            post_id=post_id,
            content=args['content'],
            parent_id=args['parent_id']
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return {'message': 'Comment added', 'comment': comment.content}, 201

def register_post_routes(api):
    api.add_resource(PostsResource, '/posts')
    api.add_resource(PostResource, '/posts/<int:post_id>')
    api.add_resource(LikeResource, '/posts/<int:post_id>/like')
    api.add_resource(CommentResource, '/posts/<int:post_id>/comments')