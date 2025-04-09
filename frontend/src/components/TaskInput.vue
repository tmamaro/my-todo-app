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

  <!-- NEW: Priority selector (initially hidden) -->
  <div v-if="showPriority" class="flex justify-center gap-2 mb-2">
    <button
      v-for="priority in priorities"
      @click="selectedPriority = priority.value"
      class="px-3 py-1 text-xs rounded-md"
      :class="priority === selectedPriority ? 
             'bg-indigo-100 text-indigo-800' : 
             'bg-gray-100 text-gray-600'"
    >
      {{ priority.label }}
    </button>
  </div>

  <!-- NEW: Optional due date picker -->
  <div v-if="showDueDate" class="flex justify-center">
    <input
      type="date"
      v-model="dueDate"
      class="border rounded-md p-1 text-sm"
      :min="new Date().toISOString().split('T')[0]"
    />
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
    const selectedPriority = ref('medium');
    const dueDate = ref('');
    const showPriority = ref(true); // Disabled by default
    const showDueDate = ref(true);  // Disabled by default
    const priorities = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ];
    
    const handleAddTask = async () => {
      // Basic validation
      if (!taskInput.value.trim()) {
        alert('Task title cannot be empty');
        return;
      }
    
      // Date validation
      if (showDueDate.value && dueDate.value) {
        const selectedDate = new Date(dueDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          alert('Due date cannot be in the past');
          return;
        }
      }
    
      try {
        await taskStore.addTask(
          {
            title: taskInput.value,
            priority: showPriority.value ? selectedPriority.value : undefined,
            due_date: showDueDate.value ? dueDate.value : undefined
          }, 
          authStore,
          router
        );
        taskInput.value = '';
        dueDate.value = '';
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
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
      selectedPriority,
      dueDate,
      priorities,
      showPriority,
      showDueDate, 
      handleAddTask,
      handleKeyPress,
    };
  }
};
</script>
