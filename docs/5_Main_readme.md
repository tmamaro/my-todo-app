# 🥋 Taskurai - Master Your Tasks

> A modern, real-time todo application built with Vue.js and Supabase. Track your tasks with the discipline of a samurai.

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- ✅ **Real-time Synchronization** - Changes sync instantly across all devices
- 🔐 **Secure Authentication** - Email/password + OAuth (Google, GitHub)
- 📝 **Rich Task Management** - Priority levels, due dates, notes, completion tracking
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- ⚡ **Optimistic Updates** - Instant feedback for all actions
- 🔄 **Offline Resilience** - Automatic reconnection with exponential backoff
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **User Profiles** - Track your productivity with task statistics

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd my-todo-app/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Folder organization and file locations
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[Component Guide](docs/COMPONENT_GUIDE.md)** - Detailed component documentation
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Store APIs and database schema
- **[Setup & Deployment](docs/SETUP_AND_DEPLOYMENT.md)** - Installation and deployment guide
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Cheat sheet for common tasks

## 🏗️ Tech Stack

### **Frontend**
- **Vue 3** - Progressive JavaScript framework (Composition API)
- **Vite** - Next-generation build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### **Backend**
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email + OAuth)
  - Real-time subscriptions
  - Row Level Security (RLS)

## 📁 Project Structure

```
my-todo-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── pages/         # Page components
│   │   │   └── tasks/         # Task management components
│   │   ├── router/            # Vue Router configuration
│   │   ├── store/             # Pinia state management
│   │   ├── config/            # Configuration files
│   │   └── App.vue            # Root component
│   └── package.json
├── docs/                      # Documentation
└── README.md
```

## 🎯 Key Features Explained

### **Real-time Synchronization**
Tasks sync instantly across all your devices using Supabase Realtime. Open the app on multiple devices and watch changes propagate in real-time!

### **Optimistic Updates**
All actions feel instant because the UI updates immediately before waiting for server confirmation. If something fails, changes are automatically rolled back.

### **Smart Reconnection**
Lost your internet connection? No problem! The app automatically reconnects with exponential backoff retry logic.

### **Security First**
- Row Level Security ensures users can only access their own tasks
- Authentication tokens are managed securely by Supabase
- All API calls are filtered by user ID

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Supabase Setup**

1. Create a Supabase project
2. Run the database schema (see [Setup Guide](docs/SETUP_AND_DEPLOYMENT.md))
3. Configure authentication providers
4. Enable Realtime for the `tasks` table

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## 🚀 Deployment

Taskurai can be deployed to various platforms:

- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Simple static hosting
- **Docker** - Containerized deployment
- **GitHub Pages / Cloudflare Pages** - Free static hosting

See [Setup & Deployment Guide](docs/SETUP_AND_DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### **Recommended IDE Setup**

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 support
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### **Coding Standards**

- Use Composition API with `<script setup>`
- Follow Vue 3 style guide
- Use Tailwind utility classes
- Keep components focused and reusable

## 📝 Future Enhancements

Planned features for future releases:

- [ ] Task categories and tags
- [ ] Search and advanced filtering
- [ ] Drag & drop task reordering
- [ ] Dark mode
- [ ] Task sharing and collaboration
- [ ] Recurring tasks
- [ ] Productivity analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Keyboard shortcuts
- [ ] Email notifications

## 🐛 Known Issues

- OAuth redirect may require page refresh on first login (browser-specific)
- Realtime connection may drop after extended idle time (auto-reconnects)

## 📄 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

- **Supabase** - For the amazing backend platform
- **Vue.js Team** - For the fantastic framework
- **Tailwind CSS** - For the beautiful utility classes
- **Vite** - For the blazing-fast build tool

---

<p align="center">
  <strong>Built with 🥋 discipline and ❤️ passion</strong>
</p>

<p align="center">
  <sub>Taskurai - Master your tasks with the focus of a samurai</sub>
</p>
