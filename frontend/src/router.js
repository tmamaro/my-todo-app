import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import TaskList from './components/TaskList.vue';

const routes = [
  { path: '/', name: 'home', component: LandingPage },
  { path: '/tasks', name: 'tasks', component: TaskList }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
