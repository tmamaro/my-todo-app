<template>
  <Layout>
    <router-view /> <!-- This will render the active route -->
  </Layout>
</template>

<script>
import Layout from './components/Layout.vue';

export default {
  components: {
    Layout,
  },
};
</script>
