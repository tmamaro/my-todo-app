<template>
  <div class="w-full"> <!-- Use full width within the Layout's 90% constraint -->
    <h1 class="text-6xl font-bold mb-4">User Profile</h1> <!-- Consistent heading size -->
    <div class="bg-white p-6 rounded-lg shadow-md"> <!-- Add a card-like container -->
      <p class="text-lg mb-2"><strong>Name:</strong> John Doe</p>
      <p class="text-lg mb-2"><strong>Email:</strong> johndoe@example.com</p>
      <!-- You can add a form to edit profile info here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
};
</script>

<style scoped>
/* Add any custom styling for this page */
</style>