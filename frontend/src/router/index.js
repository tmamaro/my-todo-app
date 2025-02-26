import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import TaskList from '../components/TaskList.vue';
import UserProfile from '../components/UserProfile.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/tasks', component: TaskList },
  { path: '/profile', component: UserProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
