# Taskurai - Architecture & API Documentation

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────┐
│         CLIENT (Browser)                 │
│  ┌───────────────────────────────────┐  │
│  │      Vue.js Application           │  │
│  │  ┌──────┐  ┌──────┐  ┌────────┐  │  │
│  │  │Router│  │Pinia │  │Components│ │  │
│  │  └──────┘  └──────┘  └────────┘  │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ HTTPS/WebSocket
                   │
┌──────────────────▼──────────────────────┐
│         SUPABASE BACKEND                 │
│  ┌──────────┐  ┌──────┐  ┌──────────┐  │
│  │PostgreSQL│  │ Auth │  │ Realtime │  │
│  └──────────┘  └──────┘  └──────────┘  │
└─────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. Authentication Flow

```
User Login
    ↓
Login.vue → authStore.signIn()
    ↓
Supabase Auth API
    ↓
Auth State Changed
    ↓
authStore.user updated
    ↓
Router Navigation Guard
    ↓
Redirect to /tasks
```

### 2. Task CRUD Flow

```
User Action
    ↓
Component (TaskInput/TaskTable)
    ↓
taskStore action
    ├─ Optimistic Update (immediate)
    ↓
Supabase API Call
    ↓
Database Update
    ↓
Realtime Event Broadcast
    ↓
All Clients Receive Update
    ↓
UI Re-renders
```

### 3. Realtime Synchronization

```
Component Mounted
    ↓
taskStore.fetchTasks()
    ├─ Fetch existing tasks
    └─ Setup Realtime Subscriptions
         ├─ Channel 1: INSERT/UPDATE (user-filtered)
         └─ Channel 2: DELETE (client-filtered)
              ↓
         Events Queued & Processed
              ↓
         UI Updated
```

---

## 🔐 Auth Store API

### **State**

```javascript
{
  user: null | Object,
  error: null | Error,
  loading: boolean,
  isInitialized: boolean,
  redirectPath: null | string
}
```

### **Key Actions**

#### `initialize()`
```javascript
await authStore.initialize()
```
- Restores session from Supabase
- Sets up auth state listener
- Marks system as ready

#### `signIn(email, password)`
```javascript
const redirectPath = await authStore.signIn('user@email.com', 'password')
if (redirectPath) {
  router.push(redirectPath)
}
```
- Returns redirect path on success
- Updates user state via listener

#### `signOut()`
```javascript
await authStore.signOut()
router.push('/login')
```
- Clears user state
- Revokes Supabase session
- Cleans up task store

#### `signInWithProvider(provider)`
```javascript
await authStore.signInWithProvider('google')
// Redirects to OAuth provider
```

---

## ✅ Task Store API

### **State**

```javascript
{
  tasks: Array<Task>,
  subscription: Channel,
  deleteSubscription: Channel,
  updateQueue: Array<Function>,
  isProcessingQueue: boolean,
  realtimeStatus: string,  // 'connected'|'disconnected'|'connecting'
  reconnectAttempts: number
}
```

### **Task Object**

```javascript
{
  id: string,              // UUID
  title: string,           // Max 100 chars
  notes: string,
  is_completed: boolean,
  priority: string,        // 'low'|'medium'|'high'
  due_date: string | null, // ISO date
  user_uuid: string,
  created_at: string,
  updated_at: string
}
```

### **Key Actions**

#### `fetchTasks(authStore, router)`
```javascript
await taskStore.fetchTasks(authStore, router)
```
- Loads all user tasks
- Sets up realtime subscriptions

#### `addTask(taskData, authStore, router)`
```javascript
await taskStore.addTask({
  title: 'New task',
  priority: 'high',
  due_date: '2025-12-31'
}, authStore, router)
```
- Validates input
- Optimistic update
- Syncs with database

#### `updateTask(task, authStore, router)`
```javascript
await taskStore.updateTask({
  id: task.id,
  title: task.title,
  notes: 'Updated notes',
  priority: 'high',
  due_date: '2025-12-31',
  is_completed: false
}, authStore, router)
```

#### `deleteTask(task, authStore, router)`
```javascript
await taskStore.deleteTask({
  id: task.id,
  title: task.title
}, authStore, router)
```

---

## 🔄 Realtime Architecture

### Dual-Channel Strategy

**Why Two Channels?**

1. **INSERT/UPDATE Channel** - User-filtered at DB level
2. **DELETE Channel** - Client-side filtered (Supabase limitation)

```javascript
// Channel 1: User-specific
.on('postgres_changes', {
  event: 'INSERT',
  filter: `user_uuid=eq.${user.id}`
}, handleInsert)

// Channel 2: All deletes
.on('postgres_changes', {
  event: 'DELETE'
}, (payload) => handleDelete(payload, user.id))
```

### Connection Resilience

**Exponential Backoff:**
```
Attempt 1: 1s
Attempt 2: 2s
Attempt 3: 3s
...
Max: 10s (5 attempts)
```

---

## 🗄️ Database Schema

### **tasks table**

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  notes TEXT DEFAULT '',
  is_completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  category TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user_uuid ON tasks(user_uuid);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_uuid);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_uuid);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_uuid);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_uuid);
```

---

## 🎯 Design Patterns

### 1. **Store Pattern (Pinia)**
Centralized state management with reactive stores

### 2. **Optimistic UI Updates**
Update UI immediately, rollback on error

### 3. **Event Queue**
Sequential processing to prevent race conditions

### 4. **Composition API**
Reusable logic via composables

### 5. **Route Guards**
Declarative route protection

### 6. **Pub/Sub (Realtime)**
Event-driven synchronization

---

## 🔍 Error Handling

### Levels

1. **Component**: User feedback (toasts, error messages)
2. **Store**: Rollback optimistic updates
3. **Global**: Router redirects on auth errors

### Example

```javascript
try {
  await taskStore.addTask(taskData, authStore, router)
  // Success - optimistic update visible
} catch (error) {
  console.error('Error:', error)
  errorMessage.value = 'Failed to add task'
  // Store automatically rolled back
}
```

---

## 📈 Performance Optimizations

1. **Lazy Loading** - Routes loaded on demand
2. **Computed Properties** - Cached reactive values
3. **Event Queue** - Prevents excessive re-renders
4. **Optimistic Updates** - Instant perceived response
5. **Minimal Re-renders** - Targeted state updates

---

## 🔒 Security

1. **Row Level Security (RLS)** - Enforced at database
2. **User UUID Filtering** - All queries filtered
3. **Auth Tokens** - Auto-refreshed by Supabase
4. **Protected Routes** - Navigation guards
5. **No Sensitive Data** - Public anon key only
