# Family App Frontend

React frontend application for Family Management App.

## 🚀 Features

- User authentication (Login/Register)
- Family member management
- Material UI components
- Responsive design

## 🛠️ Tech Stack

- React 19 with TypeScript
- Vite
- Material UI (MUI)
- Zustand (State management)
- Axios (API calls)

## 📦 Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

```bash
# Build for production
npm run build
```

## 🐳 Docker

```bash
# Build Docker image
docker build -t family-app-frontend --build-arg VITE_API_URL=/api .

# Run container
docker run -p 80:80 family-app-frontend
```

## 🚀 Deployment

This repository is configured with GitHub Actions CI/CD:

- **Automatic deployment** on PR merge to `main` branch
- **Builds Docker image** and pushes to AWS ECR
- **Updates ECS service** automatically

### GitHub Secrets Required

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## 📝 Environment Variables

**Development**: Uses Vite proxy (no `.env` needed)

**Production**: API URL set via Docker build arg (`VITE_API_URL=/api`)

## 📚 Documentation

- [CI/CD Setup](../SEPARATE_REPOS_SETUP.md)
- [Migration Guide](../MIGRATION_TO_SEPARATE_REPOS.md)

## 🔗 Related Repositories

- Backend: [family-app-backend](https://github.com/Zriyaz/family-app-backend)

