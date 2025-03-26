<template>
  <div class="w-full"> <!-- Use full width within the Layout's 90% constraint -->
    <div class="relative min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
      <!-- Moving background elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute w-24 h-24 bg-white rounded-full opacity-10 animate-float1"></div>
        <div class="absolute w-32 h-32 bg-white rounded-full opacity-10 animate-float2"></div>
        <div class="absolute w-20 h-20 bg-white rounded-full opacity-10 animate-float3"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center text-white">
        <h1 class="text-4xl font-bold mb-5 animate-fade-in-down">Tired of excel or a plain text file to register your to dos?</h1>
        <h1 class="text-6xl font-bold mb-5 animate-fade-in-down">Then welcome to Taskurai!</h1>
        <h1 class="text-4xl font-bold mb-5 animate-fade-in-down">Your personal to do list app available everywhere :)</h1>
        <p class="text-xl mb-8 animate-fade-in-up">Click on the "Tasks" link to manage your tasks.</p>
        <router-link to="/tasks" class="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300 animate-bounce">
          Get Started
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
};
</script>

<style scoped>
/* Add any custom styling for this page */
</style>