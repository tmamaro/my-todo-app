<!-- src/components/LandingPage.vue -->
<template>
  <Layout>
    <h1>Welcome to the Todo App</h1>
    <p>Click on the "Tasks" link to manage your tasks.</p>
  </Layout>
</template>

<script>
import Layout from './Layout.vue';

export default {
  name: 'LandingPage',
  components: {
    Layout
  }
};
</script>

<style scoped>
/* Add any custom styling for this page */
</style>
