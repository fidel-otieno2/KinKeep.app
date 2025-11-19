from app import create_app, db
from app.models.user import User
from app.models.family import Family, FamilyMember
from app.models.story import Story, Comment
from app.models.post import Post, Like, PostComment, SavedPost
from app.models.follow import Follow, CloseFriend
from app.models.message import Conversation, ConversationParticipant, Message

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Family': Family,
        'FamilyMember': FamilyMember,
        'Story': Story,
        'Comment': Comment,
        'Post': Post,
        'Like': Like,
        'PostComment': PostComment,
        'SavedPost': SavedPost,
        'Follow': Follow,
        'CloseFriend': CloseFriend,
        'Conversation': Conversation,
        'Message': Message
    }

if __name__ == '__main__':
    app.run(debug=True, port=5001)