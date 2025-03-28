<template>
  <div class="w-full md:w-4/5 p-4 mt-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-4">To-Do App</h1>
    
    <!-- TaskInput Component -->
    <TaskInput />
    
    <!-- TaskTable Component -->
    <TaskTable
      :tasks="tasks"
      :updateTaskNotes="updateTaskNotes"
      :updateTaskStatus="updateTaskStatus"
      :deleteTask="deleteTask"
      :formatDate="formatDate"
      :titleWidth="titleWidth"
      :notesWidth="notesWidth"
      :createdAtWidth="createdAtWidth"
      :statusWidth="statusWidth"
      :actionWidth="actionWidth"
      :startResize="startResize"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useTaskStore } from '@/store/task'; // Import the task store
import { useAuthStore } from '@/store/authStore'; // Import the auth store
import { useRouter } from 'vue-router'; // Import Vue Router
import TaskInput from './TaskInput.vue';
import TaskTable from './TaskTable.vue';

export default {
  name: 'TaskList',
  components: { TaskInput, TaskTable },
  setup() {
    const taskStore = useTaskStore(); // Use the task store
    const authStore = useAuthStore(); // Use the auth store
    const router = useRouter(); // Use the router

    // State for column widths
    const titleWidth = ref(150);
    const notesWidth = ref(250);
    const createdAtWidth = ref(150);
    const statusWidth = ref(60);
    const actionWidth = ref(100);

    // Computed property to ensure tasks are reactive
    const tasks = computed(() => taskStore.tasks);

    // Fetch tasks when component is mounted
    onMounted(async () => {
      if (!authStore.user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }
    
      try {
        await taskStore.fetchTasks(authStore, router); // Pass authStore and router to fetchTasks
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    });

    // Methods to interact with the store
    const updateTaskNotes = async (taskId, taskTitle, notes) => {
      try {
        await taskStore.updateNotes({ id: taskId, title: taskTitle, notes }, authStore, router);
      } catch (error) {
        console.error('Error updating task notes:', error);
      }
    };

    const updateTaskStatus = async (taskId, taskTitle, isCompleted) => {
      try {
        await taskStore.updateStatus({ id: taskId, title: taskTitle, is_completed: isCompleted }, authStore, router);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    };

    const deleteTask = async (taskId, taskTitle) => {
      try {
        await taskStore.deleteTask({ id: taskId, title: taskTitle}, authStore, router);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); // Custom formatting can be applied
    };

    // Resize column logic
    const MIN_COLUMN_WIDTH = 60; // Minimum column width

    const startResize = (event, col) => {
      const startX = event.clientX;
      const startWidth = col === 'titleCol' ? titleWidth.value :
                        col === 'notesCol' ? notesWidth.value :
                        col === 'createdAtCol' ? createdAtWidth.value :
                        col === 'statusCol' ? statusWidth.value : actionWidth.value;
    
      const onMouseMove = (moveEvent) => {
        const diff = moveEvent.clientX - startX;
        let newWidth = startWidth + diff;
      
        // Enforce minimum column width
        if (newWidth < MIN_COLUMN_WIDTH) {
          newWidth = MIN_COLUMN_WIDTH;
        }
      
        if (col === 'titleCol') titleWidth.value = newWidth;
        if (col === 'notesCol') notesWidth.value = newWidth;
        if (col === 'createdAtCol') createdAtWidth.value = newWidth;
        if (col === 'statusCol') statusWidth.value = newWidth;
        if (col === 'actionCol') actionWidth.value = newWidth;
      };
    
      const stopResize = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopResize);
      };
    
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stopResize);
    };

    return {
      tasks,
      updateTaskNotes,
      updateTaskStatus,
      deleteTask,
      formatDate,
      startResize,
      titleWidth,
      notesWidth,
      createdAtWidth,
      statusWidth,
      actionWidth
    };
  }
};
</script>

