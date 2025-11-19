# KinKeep.app - Project Structure

## Multi-Platform Architecture

```
KinKeep.app/
├── backend/                 # Flask API (shared by all platforms)
├── frontend-web/           # React web app + PWA
├── mobile/                 # React Native (future)
├── desktop/               # Electron (future)
├── shared/                # Shared utilities/types
├── docs/                  # Documentation
└── deployment/           # Docker, CI/CD configs
```

## Development Phases

### Phase 1: Web Foundation ✅ (Current)
- Flask REST API
- React web app with PWA capabilities
- PostgreSQL database
- Core features: auth, stories, families

### Phase 2: Mobile Native
- React Native app
- Enhanced mobile recording
- Offline capabilities

### Phase 3: Desktop Apps
- Electron wrapper
- Enhanced file management
- Local PDF generation

## Shared Components
- API endpoints (Flask)
- Database schema (PostgreSQL)
- Authentication (JWT)
- Media handling (Cloudinary)
- AI services (OpenAI)