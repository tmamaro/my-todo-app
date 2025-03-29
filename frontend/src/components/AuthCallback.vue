<template>
    <div class="flex items-center justify-center h-screen">
      <p>Processing authentication...</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  onMounted(async () => {
    await authStore.initialize()
    router.push('/tasks')
  })
  </script>