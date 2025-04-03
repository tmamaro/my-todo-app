<template>
    <div class="connection-badge" :class="statusClass">
      <span class="status-dot"></span>
      {{ statusText }}
      <span v-if="lastConnectionTime" class="text-xs opacity-75 ml-1">
        ({{ lastConnectionText }})
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useTaskStore } from '@/store/task';
  
  const taskStore = useTaskStore();
  
  const statusMap = {
    connected: { text: 'Live', class: 'connected' },
    disconnected: { text: 'Offline', class: 'disconnected' },
    connecting: { text: 'Connecting...', class: 'connecting' }
  };
  
  const statusText = computed(() => statusMap[taskStore.realtimeStatus].text);
  const statusClass = computed(() => statusMap[taskStore.realtimeStatus].class);
  const lastConnectionText = computed(() => {
    if (!taskStore.lastConnectionTime) return 'Never connected';
    const now = new Date();
    const last = new Date(taskStore.lastConnectionTime);
    const mins = Math.floor((now - last) / 60000);
    return mins < 1 ? 'Just now' : `${mins}m ago`;
  });
  </script>
  
  <style scoped>
  .connection-badge {
    @apply fixed bottom-4 left-4 px-3 py-1.5 rounded-full text-xs flex items-center bg-white shadow-md border;
  }
  .status-dot {
    @apply w-2 h-2 rounded-full mr-2;
  }
  .connected {
    @apply border-green-200 text-green-800;
  }
  .connected .status-dot {
    @apply bg-green-500;
  }
  .connecting {
    @apply border-yellow-200 text-yellow-800;
  }
  .connecting .status-dot {
    @apply bg-yellow-500;
  }
  .disconnected {
    @apply border-red-200 text-red-800;
  }
  .disconnected .status-dot {
    @apply bg-red-500;
  }
  </style>