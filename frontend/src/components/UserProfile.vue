<template>
  <div class="profile-container">
    <div class="avatar-section">
      <img 
        :src="userAvatar" 
        class="avatar"
        @click="triggerFileInput"
      />
      <input 
        type="file" 
        ref="fileInput"
        @change="handleAvatarUpload"
        accept="image/*"
        hidden
      />
    </div>
    
    <div class="profile-details">
      <h2>{{ user.email }}</h2>
      <p>Member since: {{ formatDate(user.created_at) }}</p>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Tasks Completed</h3>
          <p>{{ completedTasksCount }}</p>
        </div>
        <div class="stat-card">
          <h3>Open Tasks</h3>
          <p>{{ pendingTasksCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/task';

const authStore = useAuthStore();
const taskStore = useTaskStore();

const user = computed(() => authStore.user);
const completedTasksCount = computed(() => 
  taskStore.tasks.filter(t => t.is_completed).length
);
const pendingTasksCount = computed(() =>
  taskStore.tasks.filter(t => !t.is_completed).length
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
</script>