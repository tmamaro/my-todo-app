<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-indigo-50">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <!-- Header with animated checkmark -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg class="h-10 w-10 text-green-500 animate-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="mt-4 text-2xl font-bold text-indigo-900">Almost There!</h1>
          <p class="mt-2 text-indigo-600">One last step to activate your Taskurai account</p>
        </div>
  
        <!-- Main content -->
        <div class="space-y-4">
          <div class="p-4 bg-indigo-50 rounded-md border border-indigo-100">
            <p class="text-center text-indigo-800">
              We've sent a confirmation email to<br>
              <span class="font-semibold">{{ email }}</span>
            </p>
          </div>
  
          <!-- Open Email Client Button -->
          <button 
            @click="openEmailClient"
            class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Open Email App
          </button>
  
          <!-- Resend Email Section -->
          <div class="pt-4 text-center">
            <p class="text-sm text-gray-600">
              Didn't receive the email? Check spam or
              <button 
                @click="resendEmail" 
                :disabled="isResendDisabled"
                class="text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                resend in {{ countdown }}s
              </button>
            </p>
          </div>
  
          <!-- Social Auth Options -->
          <SocialAuth />

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/authStore';
  import SocialAuth from '@/components/SocialAuth.vue';
  
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  
  const email = ref(route.query.email || '');
  const countdown = ref(30);
  const isResendDisabled = ref(true);
  let timer = null;
  
  onMounted(() => {
    if (!email.value) router.push('/signup');
    startCountdown();
  });
  
  const startCountdown = () => {
    isResendDisabled.value = true;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        isResendDisabled.value = false;
        countdown.value = 30;
      }
    }, 1000);
  };
  
  const resendEmail = async () => {
    try {
      await authStore.resendConfirmation(email.value);
      startCountdown();
      // Show success toast here if needed
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };
  
  const openEmailClient = () => {
    window.location.href = `mailto:${email.value}`;
  };
  
  const signInWith = async (provider) => {
    await authStore.signInWithProvider(provider);
  };
  </script>
  
  <style scoped>
  .animate-check {
    animation: checkmark 0.5s ease-in-out;
  }
  
  @keyframes checkmark {
    0% {
      stroke-dashoffset: 50;
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>