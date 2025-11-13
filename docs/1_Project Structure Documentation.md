# Taskurai - Project Structure Documentation

## 📁 Recommended Folder Structure

```
my-todo-app/
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/              # Static assets (images, icons)
│   │   │   ├── icons/
│   │   │   │   ├── delete_icon_V3.png
│   │   │   │   ├── home_icon_7.png
│   │   │   │   └── home_icon_8.png
│   │   │   └── images/
│   │   │
│   │   ├── components/          # Vue components organized by feature
│   │   │   ├── auth/           # Authentication related components
│   │   │   │   ├── Login.vue
│   │   │   │   ├── Signup.vue
│   │   │   │   ├── SignupConfirmation.vue
│   │   │   │   ├── AuthCallback.vue
│   │   │   │   └── SocialAuth.vue
│   │   │   │
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Layout.vue
│   │   │   │   └── ConnectionStatus.vue
│   │   │   │
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── LandingPage.vue
│   │   │   │   ├── AboutMe.vue
│   │   │   │   └── UserProfile.vue
│   │   │   │
│   │   │   └── tasks/          # Task-related components
│   │   │       ├── TaskList.vue
│   │   │       ├── TaskInput.vue
│   │   │       └── TaskTable.vue
│   │   │
│   │   ├── router/             # Vue Router configuration
│   │   │   └── index.js
│   │   │
│   │   ├── store/              # Pinia state management
│   │   │   ├── authStore.js    # Authentication state
│   │   │   └── task.js         # Task management state
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   └── logger.js       # Debug logging utility
│   │   │
│   │   ├── config/             # Configuration files (NEW - recommended)
│   │   │   └── supabase.js     # Supabase client config
│   │   │
│   │   ├── App.vue             # Root component
│   │   ├── main.js             # Application entry point
│   │   ├── style.css           # Global styles
│   │   └── supabaseClient.js   # Supabase client (move to config/)
│   │
│   ├── .gitignore
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                       # Documentation (NEW)
│   ├── PROJECT_STRUCTURE.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── COMPONENT_GUIDE.md
│   └── DEPLOYMENT.md
│
└── README.md                   # Main project README
```

## 🔄 Refactoring Recommendations

### 1. **Move Components to Organized Folders**

**Current:** All components in `src/components/`
**Recommended:** Organize by feature/domain

```bash
# Move auth components
mv src/components/Login.vue src/components/auth/
mv src/components/Signup.vue src/components/auth/
mv src/components/SignupConfirmation.vue src/components/auth/
mv src/components/AuthCallback.vue src/components/auth/
mv src/components/SocialAuth.vue src/components/auth/

# Move layout components
mv src/components/Layout.vue src/components/layout/
mv src/components/ConnectionStatus.vue src/components/layout/

# Move page components
mv src/components/LandingPage.vue src/components/pages/
mv src/components/AboutMe.vue src/components/pages/
mv src/components/UserProfile.vue src/components/pages/

# Move task components
mv src/components/TaskList.vue src/components/tasks/
mv src/components/TaskInput.vue src/components/tasks/
mv src/components/TaskTable.vue src/components/tasks/
```

### 2. **Create Config Directory**

```bash
mkdir src/config
mv src/supabaseClient.js src/config/supabase.js
```

### 3. **Update Import Paths**

After moving files, update imports in:
- `src/router/index.js`
- Component files that import other components
- Store files that import supabase client

### 4. **Asset Organization**

```bash
mkdir src/assets/icons
mkdir src/assets/images

# Move icons
mv src/assets/delete_icon_V3.png src/assets/icons/
mv src/assets/home_icon_7.png src/assets/icons/
mv src/assets/home_icon_8.png src/assets/icons/
```

## 📊 Component Hierarchy

```
App.vue
└── Layout.vue (wrapper for authenticated pages)
    ├── Header (navigation)
    ├── Main Content (router-view)
    │   ├── LandingPage.vue
    │   ├── AboutMe.vue
    │   ├── Login.vue
    │   ├── Signup.vue
    │   ├── SignupConfirmation.vue
    │   ├── UserProfile.vue
    │   └── TaskList.vue
    │       ├── TaskInput.vue
    │       └── TaskTable.vue
    ├── Footer
    └── ConnectionStatus.vue (floating indicator)
```

## 🔑 Key Files Explained

### **Entry Point**
- `src/main.js` - Initializes Vue app, router, Pinia

### **Core Configuration**
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### **State Management**
- `src/store/authStore.js` - User authentication state
- `src/store/task.js` - Task CRUD operations & real-time sync

### **Routing**
- `src/router/index.js` - Route definitions & navigation guards

### **Styling**
- `src/style.css` - Global styles & Tailwind imports
- Component `<style scoped>` - Component-specific styles

## 📦 Dependencies Overview

### **Core**
- `vue` - Frontend framework
- `vue-router` - Routing
- `pinia` - State management
- `vite` - Build tool

### **Backend & Auth**
- `@supabase/supabase-js` - Backend & auth integration

### **Styling**
- `tailwindcss` - Utility-first CSS
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS transformation

## 🚀 Build & Development

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔒 Environment Variables

**Note:** Currently hardcoded in `supabaseClient.js`
**Recommendation:** Use `.env` file

```bash
# Create .env file
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then update `src/config/supabase.js`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```