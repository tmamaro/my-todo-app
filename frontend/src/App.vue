<template>
  <Layout v-if="!loading">
    <router-view />
  </Layout>
  <!-- OUR MAIN SECTION FULL SCREEN LOADING -->
<!-- OUR MAIN SECTION FULL SCREEN LOADING -->
<section class="bg-blue-900 relative place-items-center grid h-screen w-screen gap-4">   
  <!--   ITEM 1 -->
  <div class="bg-blue-500 w-48 h-48  absolute animate-ping rounded-full delay-5s shadow-xl"></div>
  <!--   ITEM 2 -->
  <div class="bg-blue-400 w-32 h-32 absolute animate-ping rounded-full shadow-xl"></div>
  <!--   ITEM 3 -->
  <div class="bg-gray-800 w-24 h-24 absolute animate-pulse rounded-full shadow-xl"></div>
  <!--   SVG LOGO -->
  <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-900 filter mix-blend-overlay h-16 w-16" viewBox="0 0 200 200"><circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="20" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="1" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="20" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="1" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="20" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="1" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
</section>

</template>

<script>
import Layout from './components/Layout.vue';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/task';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  components: { Layout },
  setup() {
    const loading = ref(true);
    const authStore = useAuthStore();
    const taskStore = useTaskStore();

    onMounted(async () => {
      await authStore.initialize();
      setTimeout(() => loading.value = false, 600); // Small delay for smoother transition, this can be deleted to simply hide the loading screen
      loading.value = false;
    });

    onUnmounted(() => {
      authStore.cleanup();
      taskStore.cleanup();
    });

    return { loading };
  }
};
</script>