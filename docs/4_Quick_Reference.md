# Taskurai - Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm audit fix            # Fix vulnerabilities
```

## 📁 Quick File Locations

| What | Where |
|------|-------|
| Auth Components | `src/components/auth/` |
| Layout Components | `src/components/layout/` |
| Page Components | `src/components/pages/` |
| Task Components | `src/components/tasks/` |
| Routes | `src/router/index.js` |
| Stores | `src/store/` |
| Config | `src/config/supabase.js` |
| Styles | `src/style.css` |
| Assets | `src/assets/` |

## 🔑 Key Concepts

### **Authentication Flow**
```
Login → authStore.signIn() → Supabase → 
Router Guard → Redirect to /tasks
```

### **Task CRUD**
```
User Action → Component → Store → 
Optimistic Update → Supabase API → 
Realtime Event → UI Update
```

## 🎨 Component Cheat Sheet

### **Import Stores**
```javascript
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/task'

const authStore = useAuthStore()
const taskStore = useTaskStore()
```

### **Check Authentication**
```javascript
const isAuthenticated = computed(() => authStore.isAuthenticated)

if (!authStore.user) {
  router.push('/login')
}
```

### **Task Operations**
```javascript
// Fetch tasks
await taskStore.fetchTasks(authStore, router)

// Add task
await taskStore.addTask({ 
  title, 
  priority, 
  due_date 
}, authStore, router)

// Update task
await taskStore.updateTask(task, authStore, router)

// Delete task
await taskStore.deleteTask({ id, title }, authStore, router)
```

## 🗄️ Database Quick Reference

### **Tasks Table Schema**
```sql
id              UUID (PK)
user_uuid       UUID (FK)
title           TEXT (max 100)
notes           TEXT
is_completed    BOOLEAN
priority        TEXT ('low'|'medium'|'high')
due_date        TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🔧 Troubleshooting Quick Fixes

### **App won't start**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Realtime not working**
1. Check Supabase Realtime enabled
2. Verify RLS policies
3. Check browser console
4. Verify WebSocket connection

### **Auth errors**
1. Check environment variables
2. Verify Supabase credentials
3. Check redirect URLs
4. Clear browser cache

## 💡 Common Patterns

### **Reactive Computed**
```javascript
const tasks = computed(() => taskStore.tasks)
const user = computed(() => authStore.user)
```

### **Error Handling**
```javascript
try {
  await taskStore.addTask(data, authStore, router)
} catch (error) {
  console.error('Error:', error)
  errorMessage.value = 'Operation failed'
}
```

### **Conditional Rendering**
```vue
<div v-if="isAuthenticated">Logged in</div>
<div v-else>Please log in</div>
```

### **List Rendering**
```vue
<tr v-for="task in tasks" :key="task.id">
  <td>{{ task.title }}</td>
</tr>
```

### **Event Handling**
```vue
<button @click="handleClick">Click</button>
<input @blur="saveData" />
<form @submit.prevent="handleSubmit">
```

## 🎨 Tailwind Common Classes

### **Layout**
```
flex flex-col items-center justify-center
w-full h-screen p-4 m-4 mx-auto
```

### **Colors**
```
bg-indigo-500 text-white border-gray-300
hover:bg-indigo-700
```

### **Responsive**
```
sm:text-sm md:w-1/2 lg:flex-row
```

### **States**
```
hover:bg-blue-700 
disabled:opacity-50 
disabled:cursor-not-allowed
```

## 🚦 Router Navigation

```javascript
import { useRouter } from 'vue-router'
const router = useRouter()

router.push('/tasks')
router.replace('/login')
router.go(-1)  // Go back
```

## 📦 Import Aliases

```javascript
import Component from '@/components/Component.vue'
// @ = src directory
```

## 🎯 Store Action Signatures

### **Auth Store**
```javascript
await authStore.initialize()
await authStore.signUp(email, password)
await authStore.signIn(email, password)
await authStore.signOut()
await authStore.signInWithProvider('google')
```

### **Task Store**
```javascript
await taskStore.fetchTasks(authStore, router)
await taskStore.addTask(taskData, authStore, router)
await taskStore.updateTask(task, authStore, router)
await taskStore.deleteTask(task, authStore, router)
taskStore.cleanup()
```

## 📋 Validation Rules

### **Task Title**
- Required
- Max 100 characters

### **Priority**
- Must be: 'low', 'medium', 'high'

### **Due Date**
- Valid date
- Cannot be in the past

### **Email**
- Valid email format
- Required for signup/login

## 📞 Quick Help

| Error | Solution |
|-------|----------|
| Module not found | Check import, run `npm install` |
| Invalid credentials | Verify Supabase keys |
| Not authenticated | Check auth, redirect to login |
| Failed to fetch | Check network/API endpoint |
| Permission denied | Check RLS policies |

---

<p align="center">
  <strong>Happy Coding! 🥋</strong>
</p>
