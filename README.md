# KinKeep.app - Family Story Keeper

A multi-platform application for preserving and sharing family stories across generations. Built with React (web/PWA), Flask (API), and PostgreSQL.

## 🎯 Vision

Preserve precious family memories through guided storytelling, AI enhancement, and beautiful digital storybooks that can be shared across generations.

## ✨ Core Features

- **Guided Story Recording** - Audio, video, and text capture with thoughtful prompts
- **AI Enhancement** - Automatic transcription and story polishing while preserving voice
- **Family Management** - Private, family-only, or public sharing with role-based access
- **Digital Storybooks** - AI-compiled PDF books from selected family stories
- **Multi-Platform** - Web app, mobile apps (iOS/Android), and desktop apps

## 🏗 Architecture

```
KinKeep.app/
├── backend/           # Flask REST API
├── frontend-web/      # React web app + PWA
├── mobile/           # React Native (future)
├── desktop/          # Electron (future)
└── shared/           # Shared utilities
```

## 🚀 Tech Stack

### Backend
- **Framework**: Flask + Flask-RESTful
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with refresh tokens
- **Media**: Cloudinary for file storage
- **Email**: SendGrid for notifications
- **AI**: OpenAI GPT + Whisper for enhancement
- **Background Jobs**: Celery + Redis

### Frontend
- **Framework**: React 18 + React Router v6
- **Styling**: TailwindCSS
- **Forms**: Formik + Yup validation
- **PWA**: Service worker + manifest
- **State**: Context API + local storage

### Mobile (Phase 2)
- **Framework**: React Native
- **Platforms**: iOS + Android
- **Features**: Enhanced recording, offline sync

### Desktop (Phase 3)
- **Framework**: Electron
- **Platforms**: Windows, macOS, Linux
- **Features**: Local file management, PDF generation

## 🛠 Development Setup

### Backend Setup

1. **Create virtual environment**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Setup database**:
```bash
# Create PostgreSQL database
createdb kinkeep_db

# Run migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

4. **Environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run backend**:
```bash
python run.py
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend-web
npm install
```

2. **Environment variables**:
```bash
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000
```

3. **Run frontend**:
```bash
npm start
```

## 📱 PWA Installation

Users can install the web app on their devices:

- **Mobile**: Tap "Add to Home Screen" in browser menu
- **Desktop**: Click install icon in address bar
- **Features**: Offline access, native app feel, push notifications

## 🔐 Security Features

- JWT authentication with automatic refresh
- Role-based access control (Admin, Manager, Member)
- Input validation and sanitization
- Secure file upload with type validation
- HTTPS enforcement in production

## 🎨 Design Philosophy

- **Warm & Nostalgic**: Earth tones (amber, cream, beige)
- **Accessible**: Large text, high contrast, simple navigation
- **Emotional**: Focus on preserving memories and family bonds
- **Cross-generational**: Easy for elderly users, engaging for youth

## 📊 Database Schema

### Core Tables
- `users` - User accounts and authentication
- `families` - Family groups and settings
- `family_members` - User-family relationships
- `stories` - Individual stories with metadata
- `comments` - Story comments and reactions
- `compiled_books` - AI-generated storybooks

## 🚀 Deployment

### Backend (Render/Railway)
```bash
# Set environment variables in platform
# Deploy from GitHub repository
# Add PostgreSQL addon
```

### Frontend (Netlify/Vercel)
```bash
# Build command: npm run build
# Publish directory: build
# Set REACT_APP_API_URL environment variable
```

## 🗺 Roadmap

### Phase 1: Web Foundation ✅
- [x] Flask API with JWT auth
- [x] React web app with PWA
- [x] Core story management
- [x] Family organization
- [ ] AI story enhancement
- [ ] PDF storybook generation

### Phase 2: Mobile Native
- [ ] React Native app
- [ ] Enhanced mobile recording
- [ ] Offline story drafts
- [ ] Push notifications
- [ ] App store deployment

### Phase 3: Desktop Apps
- [ ] Electron wrapper
- [ ] Local file management
- [ ] Enhanced PDF generation
- [ ] Desktop-specific features

### Phase 4: Advanced Features
- [ ] Voice cloning for narration
- [ ] Multi-language support
- [ ] Blockchain legacy certificates
- [ ] Integration with genealogy services

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💝 Acknowledgments

- Families who shared their stories during research
- Open source community for amazing tools
- Beta testers who provided valuable feedback

---

**KinKeep.app** - *Preserving voices, memories, and wisdom for generations to come* ❤️