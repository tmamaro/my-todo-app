<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-gray-800 text-white p-4">
      <nav>
        <ul class="flex space-x-4">
          <li><router-link to="/" class="hover:text-gray-400 transition duration-300">Home</router-link></li>
          <li><router-link to="/tasks" class="hover:text-gray-400 transition duration-300">Tasks</router-link></li>
          <li><router-link to="/profile" class="hover:text-gray-400 transition duration-300">Profile</router-link></li>
        </ul>
      </nav>
    </header>
    <main class="flex-grow p-4 w-[90%] mx-auto"> <!-- Use 90% of the viewport width -->
      <slot></slot> <!-- Content of the page will be injected here -->
    </main>
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2025 My Todo App</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Layout',
};
</script>

<style scoped>
/* Add any custom styling for the layout here */
</style>