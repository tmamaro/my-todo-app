<template>
  <div class="task-input-container">
    <div class="flex justify-center mb-4">
      <div class="relative w-full md:w-4/5">
        <input
          type="text"
          v-model="taskInput"
          placeholder="Enter task (max 100 chars)"
          :maxlength="MAX_TITLE_LENGTH"
          :class="[
            'border rounded-md p-2 w-full focus:outline-none focus:ring-2',
            inputError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
          ]"
          @keypress="handleKeyPress"
          @input="validateInput"
        />
        <span 
          class="absolute right-2 bottom-2 text-xs text-gray-400"
          :class="{ 'text-red-500': isNearLimit }"
        >
          {{ remainingChars }} / {{ MAX_TITLE_LENGTH }}
        </span>
      </div>
      <button
        @click="handleAddTask"
        :disabled="isSubmitDisabled"
        class="bg-indigo-500 text-white px-6 py-2 rounded-md ml-2 transition duration-200 ease-in-out hover:bg-indigo-300 hover:text-black hover:shadow-md focus:outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Task
      </button>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="text-center text-red-500 text-sm mb-2">
      {{ errorMessage }}
    </div>

    <!-- Priority selector -->
    <div v-if="showPriority" class="flex justify-center gap-2 mb-2">
      <button
        v-for="priority in priorities"
        :key="priority.value"
        @click="selectedPriority = priority.value"
        class="px-3 py-1 text-xs rounded-md"
        :class="selectedPriority === priority.value ? 
               'bg-indigo-100 text-indigo-800' : 
               'bg-gray-100 text-gray-600'"
      >
        {{ priority.label }}
      </button>
    </div>

    <!-- Due date picker with validation -->
    <div v-if="showDueDate" class="flex justify-center">
      <input
        type="date"
        v-model="dueDate"
        :class="[
          'border rounded-md p-1 text-sm',
          dateError ? 'border-red-500' : 'border-gray-300'
        ]"
        :min="new Date().toISOString().split('T')[0]"
        @change="validateDate"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useTaskStore } from '@/store/task';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

export default {
  name: 'TaskInput',
  setup() {
    const MAX_TITLE_LENGTH = 100;
    const taskInput = ref('');
    const taskStore = useTaskStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const selectedPriority = ref('medium');
    const dueDate = ref('');
    const showPriority = ref(true);
    const showDueDate = ref(true);
    const inputError = ref(false);
    const dateError = ref(false);
    const errorMessage = ref('');

    const priorities = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ];

    const remainingChars = computed(() => MAX_TITLE_LENGTH - taskInput.value.length);
    const isNearLimit = computed(() => remainingChars.value < 10);
    const isSubmitDisabled = computed(() => !taskInput.value.trim() || inputError.value);

    const validateInput = () => {
      inputError.value = false;
      errorMessage.value = '';
      
      if (taskInput.value.trim().length === 0) {
        inputError.value = true;
        errorMessage.value = 'Task title cannot be empty';
      } else if (taskInput.value.length > MAX_TITLE_LENGTH) {
        inputError.value = true;
        errorMessage.value = `Task title cannot exceed ${MAX_TITLE_LENGTH} characters`;
      }
    };

    const validateDate = () => {
      dateError.value = false;
      if (showDueDate.value && dueDate.value) {
        const selectedDate = new Date(dueDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          dateError.value = true;
          errorMessage.value = 'Due date cannot be in the past';
        }
      }
    };

    const handleAddTask = async () => {
      validateInput();
      validateDate();
      
      if (inputError.value || dateError.value) {
        return;
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
        errorMessage.value = '';
      } catch (error) {
        console.error('Error adding task:', error);
        errorMessage.value = 'Failed to add task. Please try again.';
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddTask();
      }
    };
    
    return {
      MAX_TITLE_LENGTH,
      taskInput,
      selectedPriority,
      dueDate,
      priorities,
      showPriority,
      showDueDate,
      inputError,
      dateError,
      errorMessage,
      remainingChars,
      isNearLimit,
      isSubmitDisabled,
      handleAddTask,
      handleKeyPress,
      validateInput,
      validateDate
    };
  }
};
</script>

<style scoped>
.task-input-container {
  transition: all 0.3s ease;
}
</style>