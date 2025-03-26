<template>
  <div class="flex justify-center mb-4">
    <input
      type="text"
      v-model="taskInput"
      placeholder="Enter task"
      class="border border-gray-300 rounded-md p-2 w-full md:w-4/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      @keypress="handleKeyPress"
    />
    <button
      @click="handleAddTask"
      class="bg-indigo-500 text-white px-6 py-2 rounded-md ml-2 transition duration-200 ease-in-out hover:bg-indigo-300 hover:text-black hover:shadow-md focus:outline-none active:scale-95"
    >
      Add Task
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useTaskStore } from '@/store/task'; // Import the task store
import { useAuthStore } from '@/store/authStore'; // Import the auth store
import { useRouter } from 'vue-router'; // Import Vue Router

export default {
  name: 'TaskInput',
  setup() {
    const taskInput = ref('');
    const taskStore = useTaskStore(); // Use the task store
    const authStore = useAuthStore(); // Use the auth store
    const router = useRouter(); // Use the router

    const handleAddTask = async () => {
      if (taskInput.value.trim()) {
        await taskStore.addTask(taskInput.value, authStore, router); // Pass authStore and router to addTask
        taskInput.value = ''; // Clear the input after adding
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddTask();
      }
    };

    return {
      taskInput,
      handleAddTask,
      handleKeyPress,
    };
  }
};
</script>
