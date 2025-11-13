# Taskurai - Component Guide

## 📋 Component Overview

This document provides detailed documentation for each component in the Taskurai application.

---

## 🔐 Authentication Components

### **Login.vue**
**Location**: `src/components/auth/`
**Purpose**: User login form with email/password and OAuth options

**Features**:
- Email/password login
- Social authentication (Google, GitHub)
- Auto-redirect if already authenticated
- Error handling with user feedback
- Loading states

**Key Methods**:
```javascript
handleLogin()  // Process login form submission
```

**Store Dependencies**:
- `authStore.signIn(email, password)`
- `authStore.isAuthenticated`

---

### **Signup.vue**
**Location**: `src/components/auth/`
**Purpose**: New user registration form

**Features**:
- Email/password registration
- Password confirmation validation
- Social authentication options
- Loading states with spinner

**Validation**:
- Passwords must match
- Email format validation (HTML5)

---

### **SignupConfirmation.vue**
**Location**: `src/components/auth/`
**Purpose**: Post-signup email confirmation instructions

**Features**:
- Displays user's email
- Resend confirmation email (30s cooldown)
- Open email client button
- Animated checkmark icon

---

### **SocialAuth.vue**
**Location**: `src/components/auth/`
**Purpose**: Reusable social authentication buttons

**Features**:
- Google sign-in button
- GitHub sign-in button
- Loading states per provider
- Error toast notifications

---

## 🏗️ Layout Components

### **Layout.vue**
**Location**: `src/components/layout/`
**Purpose**: Main application wrapper with navigation and footer

**Features**:
- Header with navigation
- Conditional menu items (auth-based)
- Logout confirmation dialog
- Success toast notification
- Footer with copyright

**Navigation Items**:
- Home (always visible)
- About Taskurai (always visible)
- Tasks (authenticated only)
- Login (unauthenticated only)
- Profile (authenticated only)
- Logout (authenticated only)

---

### **ConnectionStatus.vue**
**Location**: `src/components/layout/`
**Purpose**: Real-time connection status indicator

**Status Types**:
- `connected` → Green → "Live"
- `connecting` → Yellow → "Connecting..."
- `disconnected` → Red → "Offline"

**Store Dependencies**:
- `taskStore.realtimeStatus`
- `taskStore.lastConnectionTime`

---

## 📄 Page Components

### **LandingPage.vue**
**Location**: `src/components/pages/`
**Purpose**: Home/marketing page

**Features**:
- Hero section with gradient background
- Animated floating elements
- Call-to-action button
- Welcome message

**Animations**:
- `float1`, `float2`, `float3` - Floating circles
- `fade-in-down` - Title animation
- `bounce` - CTA button

---

### **AboutMe.vue**
**Location**: `src/components/pages/`
**Purpose**: Information about the Taskurai brand

**Content**:
- Explains "Taskurai" name (Task + Samurai)
- Philosophy and purpose
- Visual branding

---

### **UserProfile.vue**
**Location**: `src/components/pages/`
**Purpose**: User profile and statistics

**Features**:
- User avatar (clickable to upload)
- Email display
- Member since date
- Task statistics cards
  - Completed tasks count
  - Pending tasks count

---

## ✅ Task Components

### **TaskList.vue**
**Location**: `src/components/tasks/`
**Purpose**: Main task management page (container)

**Features**:
- Composes TaskInput and TaskTable
- Fetches tasks on mount
- Manages column widths
- Delegates CRUD operations to store

**Key Methods**:
```javascript
deleteTask(id, title)
updateTaskNotes(id, title, notes)
updateTaskPriority(id, priority)
updateTaskStatus(id, title, isCompleted)
updateTaskDueDate(id, dueDate)
formatDate(dateString)
startResize(event, column)
```

**Column Widths** (resizable):
- Action: 100px (min: 60px)
- Title: 150px (min: 80px)
- Notes: 250px (min: 100px)
- Priority: 120px (min: 70px)
- Status: 60px (min: 60px)
- Due Date: 170px (min: 50px)
- Created: 150px (min: 100px)

---

### **TaskInput.vue**
**Location**: `src/components/tasks/`
**Purpose**: Task creation form

**Features**:
- Task title input (max 100 chars)
- Character counter with warning
- Priority selector (Low/Medium/High)
- Due date picker with validation
- Enter key to submit
- Real-time validation

**Validation Rules**:
- Title: Required, max 100 characters
- Due Date: Cannot be in the past
- Priority: low/medium/high only

**State**:
```javascript
taskInput: string
selectedPriority: string     // 'low'|'medium'|'high'
dueDate: string             // ISO date string
inputError: boolean
dateError: boolean
errorMessage: string
```

---

### **TaskTable.vue**
**Location**: `src/components/tasks/`
**Purpose**: Task list table with inline editing

**Features**:
- Resizable columns (drag handles)
- Sticky header
- Scrollable body (max 550px)
- Inline notes editing (textarea)
- Priority dropdown
- Completion checkbox
- Date picker for due date
- Delete button with icon
- Auto-save on blur (notes)
- Auto-save on change (others)

**Columns**:
1. **Action**: Delete button (image icon)
2. **Title**: Read-only, word-wrap
3. **Notes**: Textarea, auto-save on blur
4. **Priority**: Dropdown (Low/Medium/High)
5. **Status**: Checkbox (is_completed)
6. **Due Date**: Date input, min=today
7. **Created**: Formatted timestamp

---

## 🎨 App.vue

**Purpose**: Root application component

**Features**:
- Loading screen during initialization
- Animated loading spinner
- Layout wrapper for content
- Auth initialization on mount
- Cleanup on unmount

**Loading Animation**:
- Blue gradient background
- 3 animated circles (ping/pulse)
- SVG bouncing dots
- 600ms delay for smooth transition

**Lifecycle**:
```javascript
onMounted()
  → authStore.initialize()
  → 600ms delay
  → loading = false

onUnmounted()
  → authStore.cleanup()
  → taskStore.cleanup()
```

---

## 🔧 Component Best Practices

### **State Management**

✅ **Do:**
- Use Pinia stores for shared state
- Use computed properties for derived state
- Keep component state local when possible

❌ **Don't:**
- Mutate store state directly
- Store UI-only state in Pinia
- Duplicate data between store and component

### **Props & Events**

✅ **Do:**
- Define prop types explicitly
- Use meaningful prop names
- Emit events for parent communication

❌ **Don't:**
- Pass entire store instances as props
- Mutate props directly

### **Styling**

✅ **Do:**
- Use Tailwind utility classes
- Scope component styles
- Use semantic class names

❌ **Don't:**
- Use inline styles (except dynamic values)
- Override Tailwind unnecessarily

---

## 📝 Component Template

```vue
<template>
  <div class="component-container">
    <!-- Your template -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
defineProps({
  propName: Type
})

// State
const localState = ref(null)

// Computed
const derived = computed(() => /* ... */)

// Methods
const handleAction = () => {
  // Implementation
}

// Lifecycle
onMounted(() => {
  // Initialization
})
</script>

<style scoped>
/* Component-specific styles */
</style>
```