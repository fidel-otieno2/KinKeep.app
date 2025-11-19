# KinKeep Backend API

Flask-RESTful API for the Family Story Keeper application.

## Features

- JWT Authentication with refresh tokens
- Role-based access control (RBAC)
- PostgreSQL database with SQLAlchemy ORM
- Family and story management
- Media upload support (Cloudinary)
- Email notifications (SendGrid)
- AI story enhancement (OpenAI)

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis (for background tasks)

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Run the application:
```bash
python run.py
```

## Environment Variables

```
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://username:password@localhost/kinkeep_db
JWT_SECRET_KEY=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SENDGRID_API_KEY=your-sendgrid-key
OPENAI_API_KEY=your-openai-key
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user profile

### Families
- `GET /families` - List user's families
- `POST /families` - Create new family
- `GET /families/:id` - Get family details

### Stories
- `GET /stories` - List stories (with pagination)
- `POST /stories` - Create new story
- `GET /stories/:id` - Get story details
- `PUT /stories/:id` - Update story

## Database Schema

See `app/models/` for complete model definitions.

## Deployment

Deploy to Render, Railway, or similar platform with PostgreSQL addon.