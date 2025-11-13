<!-- src/components/ToastNotification.vue -->
<template>
    <TransitionGroup name="toast" tag="div" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        :class="toastClass(toast.type)"
        class="px-6 py-3 rounded-lg shadow-lg text-white w-[300px] text-center"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </template>
  
  <script>
  export default {
    data() {
      return {
        toasts: []
      };
    },
    methods: {
      showNotification(message, type = 'info') {
        this.toasts.push({ message, type });
  
        setTimeout(() => {
          this.toasts.shift();
        }, 3000);
      },
      toastClass(type) {
        switch (type) {
          case 'success':
            return 'bg-green-600';
          case 'error':
            return 'bg-red-600';
          case 'info':
            return 'bg-blue-600';
          case 'warning':
            return 'bg-yellow-500 text-black';
          default:
            return 'bg-gray-800';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .toast-enter-active, .toast-leave-active {
    transition: all 0.3s ease;
  }
  .toast-enter-from, .toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  </style>
  