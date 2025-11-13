// src/main.js
import './style.css';  // Import the updated CSS file
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ToastNotification from './components/ToastNotification.vue';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
// Registering ToastNotification globally
app.component('ToastNotification', ToastNotification);
