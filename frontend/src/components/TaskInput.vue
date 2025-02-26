<template>
  <div class="flex justify-center mb-4">
    <input
      type="text"
      v-model="taskInput"
      placeholder="Enter task"
      class="w-full md:w-4/5 p-2 border border-gray-300 rounded"
      @keypress="handleKeyPress"
    />
    <button
      @click="handleAddTask"
      class="bg-blue-500 text-white px-6 py-2 rounded ml-2 transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none active:scale-95"
    >
      Add Task
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useTaskStore } from '@/store/task';

export default {
  name: 'TaskInput',
  setup() {
    const taskInput = ref('');
    const taskStore = useTaskStore();

    const handleAddTask = async () => {
      if (taskInput.value.trim()) {
        await taskStore.addTask(taskInput.value);
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
