# KinKeep Frontend

React web application with Progressive Web App (PWA) capabilities for the Family Story Keeper platform.

## Features

- React 18 with React Router v6
- JWT authentication with auto-refresh
- Responsive design with TailwindCSS
- Progressive Web App (PWA) support
- Form validation with Formik + Yup
- Family-friendly UI design

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
```

## PWA Features

- Installable on mobile and desktop
- Offline capability (coming soon)
- Native app-like experience
- Push notifications (coming soon)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── services/      # API and external services
├── utils/         # Utility functions
└── App.js         # Main application component
```

## Deployment

Deploy to Netlify or Vercel:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## Multi-Platform Roadmap

### Phase 2: Mobile Native (React Native)
- iOS and Android apps
- Enhanced mobile recording
- Offline story drafts

### Phase 3: Desktop Apps (Electron)
- Windows, macOS, Linux
- Enhanced file management
- Local PDF generation

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test on multiple devices
4. Ensure accessibility compliance