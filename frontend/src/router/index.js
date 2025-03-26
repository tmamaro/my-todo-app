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
    meta: { requiresAuth: true } // Protect this route
  },
  { 
    path: '/profile', 
    component: UserProfile,
    meta: { requiresAuth: true } // Protect this route
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path: '/login',
    component: Login
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Ensure auth store is initialized but don't trigger new initialization
  if (!authStore.isInitialized) {
    await authStore.fetchUser(); // Just get current user without setting up listener
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/signup') && authStore.isLoggedIn) {
    next('/tasks'); // Redirect away from auth pages if logged in
  } else {
    next();
  }
});

export default router;
