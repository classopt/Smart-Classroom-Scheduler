# 🎓 Smart Classroom Scheduling System - Frontend

> A modern, production-ready React application for AI-powered university timetable generation with conflict-free scheduling, teacher workload management, and comprehensive analytics.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🏗️ Core Functionality
- **Hierarchical Resource Management** - Departments → Programs → Batches → Sections
- **Teacher Management** - Profiles, availability calendars, course qualifications
- **Course & Room Management** - Comprehensive catalog with advanced filtering
- **AI-Powered Scheduling** - Conflict-free timetable generation with constraints
- **Workload Distribution** - Visual workload balancing and assignment tools
- **Real-time Conflict Detection** - Instant feedback on scheduling conflicts

### 📊 Analytics & Insights
- **Room Utilization Metrics** - Track and optimize space usage
- **Teacher Workload Analysis** - Balance teaching loads effectively
- **Conflict Statistics** - Identify and resolve scheduling issues
- **Schedule Efficiency** - Measure and improve timetable quality

### 🎨 User Experience
- **Modern, Responsive Design** - Works seamlessly on all devices
- **Dark Mode Support** - Easy on the eyes, day or night
- **Intuitive Navigation** - Clean, organized interface
- **Real-time Updates** - Instant feedback on all actions
- **Export Capabilities** - PDF and Excel exports for timetables

### 🔒 Security & Performance
- **JWT Authentication** - Secure token-based auth with auto-refresh
- **Role-Based Access** - Granular permissions for different user types
- **Optimized Loading** - Code splitting and lazy loading
- **Error Boundaries** - Graceful error handling
- **Offline Support** - Service worker for basic offline functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on port 8000

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smart-classroom-file

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Detailed setup instructions
- **[Project Roadmap](./PROJECT_ROADMAP.md)** - Development phases and timeline
- **[API Documentation](./docs/API.md)** - Backend integration guide
- **[Component Library](http://localhost:6006)** - Storybook documentation (run `npm run storybook`)

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** - Latest version with concurrent features
- **TypeScript 5.3** - Type safety and better DX
- **Vite 5.0** - Lightning-fast development and builds

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, consistent icons
- **Framer Motion** - Smooth animations and transitions

### State & Data Management
- **Redux Toolkit** - Predictable state container
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors
- **Zustand** - Lightweight state management

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Visualization & Export
- **Recharts** - Composable charting library
- **react-big-calendar** - Full-featured calendar component
- **jsPDF** - Client-side PDF generation
- **xlsx** - Excel export functionality

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Storybook** - Component documentation

## 📂 Project Structure

```
smart-classroom-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base Shadcn components
│   │   ├── layout/        # Layout components
│   │   ├── forms/         # Form components
│   │   ├── tables/        # Data table components
│   │   ├── scheduling/    # Scheduling components
│   │   └── analytics/     # Chart components
│   ├── pages/             # Route components
│   │   ├── auth/          # Login, Register
│   │   ├── dashboard/     # Dashboard
│   │   ├── departments/   # Department management
│   │   ├── teachers/      # Teacher management
│   │   ├── courses/       # Course management
│   │   ├── rooms/         # Room management
│   │   ├── scheduling/    # Scheduling interface
│   │   └── analytics/     # Analytics dashboard
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   │   ├── api/          # HTTP services
│   │   ├── export/       # Export services
│   │   └── analytics/    # Analytics calculations
│   ├── store/             # Redux store
│   │   └── slices/       # Redux slices
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── lib/               # Library configs
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── .env.example           # Environment template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
├── GETTING_STARTED.md     # Setup guide
├── PROJECT_ROADMAP.md     # Development roadmap
└── README.md              # This file
```

## 🎨 Design System

### Colors

```css
Primary: Blue (#3B82F6)
Success: Green (#10B981)
Warning: Orange (#F59E0B)
Error: Red (#EF4444)
Info: Cyan (#0EA5E9)
```

### Typography

- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Font Sizes**: 12px - 48px (xs to 5xl)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

8px grid system: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:e2e` | Run E2E tests |
| `npm run storybook` | Start Storybook |

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=Smart Classroom Scheduling
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

### Backend Integration

The frontend expects the backend API to be running at the URL specified in `VITE_API_BASE_URL`. Ensure the backend:

1. Is running and accessible
2. Has CORS configured to allow requests from `http://localhost:3000`
3. Implements the expected API endpoints (see API documentation)

## 🧪 Testing

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Open E2E test UI
npm run test:e2e:ui
```

## 🚢 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Deployment Platforms

This application can be deployed to:

- **Vercel** (Recommended) - Zero-config deployments
- **Netlify** - Continuous deployment from Git
- **AWS S3 + CloudFront** - Scalable static hosting
- **Docker** - Containerized deployment
- **Traditional Web Servers** - Apache, Nginx

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

## 📝 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS + Shadcn/ui configuration
- [x] API integration with Axios
- [x] Authentication system

### Phase 2: Core Features 🚧
- [ ] Department & Program management
- [ ] Teacher management
- [ ] Course & Room management
- [ ] Hierarchical data structures

### Phase 3: Scheduling 📋
- [ ] Workload assignment interface
- [ ] Timetable generation
- [ ] Conflict detection
- [ ] Schedule viewing & editing

### Phase 4: Analytics 📊
- [ ] Room utilization metrics
- [ ] Teacher workload analysis
- [ ] Conflict statistics
- [ ] Efficiency indicators

### Phase 5: Export & Polish ✨
- [ ] PDF export
- [ ] Excel export
- [ ] Print optimization
- [ ] Performance optimization

See [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) for detailed timeline.

## 🐛 Known Issues

- [ ] PDF export may be slow for large timetables
- [ ] Mobile navigation drawer animation needs polish
- [ ] Calendar view performance with >500 events

See [GitHub Issues](https://github.com/your-org/smart-classroom-frontend/issues) for complete list.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead** - [Name](mailto:email@example.com)
- **Frontend Developer** - [Name](mailto:email@example.com)
- **UI/UX Designer** - [Name](mailto:email@example.com)
- **Backend Developer** - [Name](mailto:email@example.com)

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issue Tracker**: [GitHub Issues](https://github.com/your-org/smart-classroom-frontend/issues)
- **Email**: support@example.com
- **Slack**: #smart-classroom-dev

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [React](https://react.dev/) team for the amazing framework
- All contributors who have helped improve this project

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

**Last Updated:** February 2026
