# Taskurai - Setup & Deployment Guide

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account
- Git

### **Local Development Setup**

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd my-todo-app/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

---

## ⚙️ Environment Configuration

### **Create `.env` file**

```bash
# frontend/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Update `supabaseClient.js`**

**Current (hardcoded - NOT RECOMMENDED):**
```javascript
const supabaseUrl = 'https://ldwfccbfvebjozvkpbkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Recommended (environment variables):**
```javascript
// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

---

## 🗄️ Supabase Setup

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Save your project URL and anon key

### **2. Database Schema Setup**

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 100 AND char_length(title) > 0),
  notes TEXT DEFAULT '',
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  category TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_tasks_user_uuid ON tasks(user_uuid);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_uuid);

CREATE POLICY "Users can insert own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_uuid);

CREATE POLICY "Users can update own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_uuid);

CREATE POLICY "Users can delete own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_uuid);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

### **3. Authentication Configuration**

#### **Email Authentication**
1. Go to Authentication → Providers
2. Enable Email provider
3. Set redirect URLs:
   - Site URL: `http://localhost:5173` (dev)
   - Redirect URLs: Add callback URLs

#### **OAuth Providers (Optional)**

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI
4. In Supabase → Enable Google provider

**GitHub:**
1. GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. In Supabase → Enable GitHub provider

---

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Option 2: Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Option 3: Docker**

```bash
# Build and run
docker-compose up --build
```

---

## 🐛 Troubleshooting

### **Realtime not working**
1. Check Realtime enabled in Supabase
2. Verify RLS policies allow SELECT
3. Check browser console for errors

### **Auth errors**
1. Check environment variables
2. Verify redirect URLs match exactly
3. Clear browser cache

### **Build errors**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔒 Security Best Practices

1. Never commit .env files
2. Use environment variables for secrets
3. Enable Row Level Security
4. Keep dependencies updated
5. Use HTTPS in production

---

## 📈 Performance Optimization

### **Lazy Load Routes**
```javascript
const TaskList = () => import('../components/tasks/TaskList.vue');
```

### **Enable Compression**
- Configure in hosting platform
- Enable gzip compression

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
