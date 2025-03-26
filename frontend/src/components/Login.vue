<template>
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full p-6 bg-black border rounded-lg shadow-sm">
        <h1 class="text-2xl text-indigo-300 font-bold text-center mb-6">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              autocomplete="username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/signup" class="text-green-600 hover:underline">Sign up</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/authStore'; // Import the auth store
  import { debugLog } from '@/utils/logger';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const isLoading = ref(false);
      const router = useRouter();
      const authStore = useAuthStore(); // Use the auth store
        
      // Redirect if the user is already logged in
      onMounted(async () => {
        if (!authStore.isInitialized) {
          await authStore.initialize();
        }

        if (authStore.isAuthenticated) {
          const redirectPath = authStore.redirectPath || '/tasks';
          authStore.redirectPath = null; // Clear the redirect after use
          router.push(redirectPath);
        }
      });

      const handleLogin = async () => {
        isLoading.value = true;
        error.value = '';
  
        try {
          // Call the signIn action which now returns the redirect path
          const redirectPath = await authStore.signIn(email.value, password.value);
          
          if (redirectPath) {
            // Wait briefly to ensure auth state is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            debugLog('Login successful, redirecting to:', redirectPath);
            router.push(redirectPath);
          } else {
            error.value = 'Login failed. Please check your credentials.';
          }
        } catch (err) {
          error.value = 'An error occurred during login. Please try again.';
          debugLog('Login error:', err);
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        email,
        password,
        error,
        isLoading,
        handleLogin,
      };
    },
  };
  </script>