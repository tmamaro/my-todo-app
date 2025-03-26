<template>
  <div class="flex flex-col min-h-screen">
    <!-- Full-width header -->
    <header class="bg-indigo-900 text-white p-4 w-full">
      <nav class="w-[90%] mx-auto">
        <ul class="flex space-x-10 justify-center">
          <li><router-link to="/" class="hover:text-white transition duration-300">Home</router-link></li>
          <li><router-link to="/tasks" class="hover:text-white transition duration-300">Tasks</router-link></li>
          <li><router-link to="/profile" class="hover:text-white transition duration-300">Profile</router-link></li>
          <li><router-link to="/signup" class="hover:text-white transition duration-300">Sign Up</router-link></li>
          <li><router-link to="/login" class="hover:text-white transition duration-300">Login</router-link></li>
          <li><router-link to="/AboutMe" class="hover:text-white transition duration-300">AboutMe</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- Main content (constrained to 90% width, grows to fill space) -->
    <main class="flex-grow p-4 w-[90%] mx-auto">
      <slot></slot> <!-- Content of the page will be injected here -->
    </main>

    <!-- Full-width footer (sticks to the bottom) -->
    <footer class="bg-indigo-900 text-white p-4 text-center w-full mt-auto">
      <p>&copy; 2025 Taskurai</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Layout',
};
</script>
