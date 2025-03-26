import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import TaskList from '../components/TaskList.vue';
import UserProfile from '../components/UserProfile.vue';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import AboutMe from '../components/AboutMe.vue';
import { useAuthStore } from '../store/authStore'; // Import the auth store

const routes = [
  { path: '/', component: LandingPage },
  { 
    path: '/tasks', 
    component: TaskList,
    meta: { 
      requiresAuth: true ,
      requiresInitialized: true,
    } // Protect this route
  },
  { 
    path: '/profile', 
    component: UserProfile,
    meta: { 
      requiresAuth: true,
      requiresInitialized: true
    }// Protect this route
  },
  {
    path: '/signup',
    component: Signup,
    meta: { requiresUnauth: true }
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresUnauth: true }
  },
  { 
    path: '/AboutMe', 
    component: AboutMe
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  
  // Initialize auth if needed
  if (!authStore.isInitialized && to.meta.requiresInitialized) {
    try {
      await authStore.initialize();
    } catch (error) {
      console.error('Auth init error:', error);
      return '/login';
    }
  }

  // Auth required routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.redirectPath = to.fullPath;
    return '/login';
  }

  // Prevent authed users from accessing auth pages
  if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    return '/tasks';
  }

  // Proceed normally
  return true;
  
});

export default router;
