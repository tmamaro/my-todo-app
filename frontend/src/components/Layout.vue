<template>
  <div class="flex flex-col min-h-screen">
    <!-- Full-width header -->
    <header class="bg-indigo-900 text-white p-2 w-full">
      <nav class="w-[90%] mx-auto">
        <ul class="flex items-center h-full">
          <!-- Left-aligned navigation items -->
          <div class="flex items-center space-x-10 h-full">
            <!-- Home icon -->
            <li class="h-full flex items-center">
              <router-link to="/" class="hover:text-white transition duration-300 flex items-center h-full">
                <img 
                  src="@/assets/home_icon_8.png" 
                  alt="Home" 
                  class="h-10 w-10 object-contain rounded-full"
                >
              </router-link>
            </li>
            <li class="h-full flex items-center">
              <router-link to="/" class="hover:text-white transition duration-300 h-full flex items-center">Home</router-link>
            </li>
            <li class="h-full flex items-center">
              <router-link to="/AboutMe" class="hover:text-white transition duration-300 h-full flex items-center">AboutTaskurai</router-link>
            </li>
            <li v-if="isAuthenticated" class="h-full flex items-center">
              <router-link to="/tasks" class="hover:text-white transition duration-300 h-full flex items-center">Tasks</router-link>
            </li>
          </div>
          
          <!-- Right-aligned auth items -->
          <div class="ml-auto flex items-center space-x-10 h-full">
            <template v-if="!isAuthenticated">
              <li class="h-full flex items-center">
                <router-link to="/login" class="hover:text-white transition duration-300 h-full flex items-center">Login</router-link>
              </li>
            </template>
            <template v-else>
              <li class="h-full flex items-center">
                <router-link to="/profile" class="hover:text-white transition duration-300 h-full flex items-center">Profile</router-link>
              </li>
              <li class="h-full flex items-center">
                <button 
                  @click="initiateLogout"
                  class="hover:text-white transition duration-300 h-full flex items-center"
                  :disabled="logoutLoading"
                >
                  <span v-if="logoutLoading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </span>
                  <span v-else>Logout</span>
                </button>
              </li>
            </template>
          </div>
        </ul>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-grow w-[100%] mx-auto">
      <slot></slot>
    </main>

    <!-- Full-width footer -->
    <footer class="bg-indigo-900 text-white p-2 text-center w-full mt-auto">
      <p>&copy; 2025 Taskurai</p>
    </footer>

    <!-- Confirmation Dialog -->
    <div v-if="showLogoutConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-indigo-400 border border-gray-300 p-6 rounded-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Confirm Logout</h3>
        <p class="mb-6">Are you sure you want to log out?</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showLogoutConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-50 hover:bg-gray-300 hover:text-black"
            :disabled="logoutLoading"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout"
            class="px-4 py-2 border border-gray-300 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            :disabled="logoutLoading"
          >
            <span v-if="logoutLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Logout successful!
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

export default {
  name: 'Layout',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const showLogoutConfirmation = ref(false);
    const logoutLoading = ref(false);
    const showToast = ref(false);

    const initiateLogout = () => {
      showLogoutConfirmation.value = true;
    };

    const confirmLogout = async () => {
      try {
        logoutLoading.value = true;
        await authStore.signOut();
        
        // Show success feedback
        showToast.value = true;
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          showToast.value = false;
        }, 3000);
        
        // Redirect to login
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        logoutLoading.value = false;
        showLogoutConfirmation.value = false;
      }
    };

    return {
      isAuthenticated,
      initiateLogout,
      confirmLogout,
      showLogoutConfirmation,
      logoutLoading,
      showToast
    };
  }
};
</script>