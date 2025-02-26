import { createRouter, createWebHistory } from 'vue-router';
import TaskList from '../components/TaskList.vue';
import UserProfile from '../components/UserProfile.vue';

const routes = [
  { path: '/', component: TaskList },
  { path: '/profile', component: UserProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
