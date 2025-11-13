<template>
    <transition name="fade">
      <div v-if="message" class="error-message" :class="type">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ message }}
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    props: {
      message: String,
      type: {
        type: String,
        default: 'error',
        validator: value => ['error', 'success', 'warning'].includes(value)
      }
    }
  };
  </script>
  
  <style scoped>
  .error-message {
    @apply p-3 rounded-md mb-4 text-sm;
  }
  .error-message.error {
    @apply bg-red-100 text-red-700;
  }
  .error-message.success {
    @apply bg-green-100 text-green-700;
  }
  .error-message.warning {
    @apply bg-yellow-100 text-yellow-700;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>