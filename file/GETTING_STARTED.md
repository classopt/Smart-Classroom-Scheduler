# Getting Started with Smart Classroom Scheduling System

This guide will help you set up and run the frontend application locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn** (v1.22 or higher)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Path Intellisense

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-classroom-file
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and update the variables:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Smart Classroom Scheduling
```

### 4. Start Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure Overview

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base Shadcn components
│   ├── layout/      # Layout components (Header, Sidebar)
│   ├── forms/       # Form components
│   ├── tables/      # Data table components
│   └── scheduling/  # Scheduling-specific components
├── pages/           # Page components (route handlers)
├── hooks/           # Custom React hooks
├── services/        # API services and business logic
├── store/           # Redux store and slices
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
└── lib/             # Third-party library configurations
```

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run E2E tests
```

### Documentation
```bash
npm run storybook    # Start Storybook
```

## 🎨 Setting Up Shadcn/ui Components

Shadcn/ui components need to be added individually. Use the CLI to add components:

```bash
# Add a component (e.g., Button)
npx shadcn-ui@latest add button

# Add multiple components at once
npx shadcn-ui@latest add button input card dialog
```

Commonly needed components for this project:
```bash
npx shadcn-ui@latest add button input label select textarea checkbox switch toast dialog dropdown-menu table tabs card badge separator avatar
```

## 🔧 Configuration Files

### `vite.config.ts`
- Build configuration
- Path aliases
- Dev server settings
- Proxy configuration

### `tailwind.config.js`
- Design system tokens
- Custom colors
- Typography scales
- Animation definitions

### `tsconfig.json`
- TypeScript compiler options
- Path mappings
- Strict mode settings

## 🌐 Connecting to Backend API

Ensure your backend API is running before starting the frontend:

1. Start your backend server (typically on port 8000)
2. Verify the API is accessible at `http://localhost:8000/docs`
3. Update `VITE_API_BASE_URL` in `.env` if using a different port
4. The frontend will proxy API requests through Vite's dev server

### API Proxy Configuration

The Vite dev server is configured to proxy `/api/*` requests to your backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## 🔐 Authentication Flow

The application uses JWT-based authentication:

1. User logs in with email/password
2. Backend returns access token and refresh token
3. Tokens are stored in localStorage
4. All API requests include the access token in Authorization header
5. When access token expires, refresh token is used to get a new one
6. If refresh fails, user is redirected to login page

## 📝 Development Workflow

### 1. Creating a New Page

```bash
# Create page component
touch src/pages/example/ExamplePage.tsx

# Add route in router configuration
# Edit src/router.tsx
```

Example page component:
```typescript
import { FC } from 'react';

const ExamplePage: FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Example Page</h1>
    </div>
  );
};

export default ExamplePage;
```

### 2. Creating a New Component

```bash
touch src/components/example/ExampleComponent.tsx
```

Component template:
```typescript
import { FC } from 'react';

interface ExampleComponentProps {
  title: string;
  // ... other props
}

const ExampleComponent: FC<ExampleComponentProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h2>{title}</h2>
    </div>
  );
};

export default ExampleComponent;
```

### 3. Creating an API Service

```bash
touch src/services/api/example.service.ts
```

Service template:
```typescript
import { apiClient } from './axios.config';
import type { Example } from '@types/index';

class ExampleService {
  async getAll(): Promise<Example[]> {
    const response = await apiClient.get<Example[]>('/api/examples');
    return response.data;
  }

  async getById(id: number): Promise<Example> {
    const response = await apiClient.get<Example>(`/api/examples/${id}`);
    return response.data;
  }

  async create(data: Partial<Example>): Promise<Example> {
    const response = await apiClient.post<Example>('/api/examples', data);
    return response.data;
  }

  async update(id: number, data: Partial<Example>): Promise<Example> {
    // Backend doesn't support PUT, use POST with update flag
    const response = await apiClient.post<Example>(
      `/api/examples/${id}`,
      { ...data, _method: 'PUT' }
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/examples/${id}`);
  }
}

export default new ExampleService();
```

## 🐛 Debugging

### VS Code Launch Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Browser DevTools

- React DevTools - Inspect component hierarchy
- Redux DevTools - Monitor state changes
- Network tab - Debug API calls
- Console - View logs and errors

## 🔍 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:** Use a different port
```bash
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: CORS errors when calling API

**Solution:** Ensure backend allows your origin in CORS configuration
```python
# Backend FastAPI configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Tailwind styles not applying

**Solution:** Ensure Tailwind is properly configured
```bash
# Verify tailwind.config.js includes all content paths
# Restart dev server
npm run dev
```

## 📚 Learning Resources

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### UI Libraries
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)

### State Management
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

### Forms & Validation
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and commit: `git commit -m "Add my feature"`
3. Push to the branch: `git push origin feature/my-feature`
4. Submit a pull request

### Commit Message Guidelines

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add teacher workload visualization component
fix: resolve pagination bug in department list
docs: update API service documentation
```

## 📞 Support

For issues or questions:
1. Check the [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) for implementation details
2. Review existing issues in the issue tracker
3. Create a new issue with detailed information
4. Join team discussions on communication channels

## 🎯 Next Steps

After setting up:
1. ✅ Familiarize yourself with the project structure
2. ✅ Review the [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)
3. ✅ Install recommended VS Code extensions
4. ✅ Run the development server and explore the UI
5. ✅ Try logging in with test credentials
6. ✅ Review existing components in Storybook
7. ✅ Start working on your assigned tasks

Happy coding! 🚀
