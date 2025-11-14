<template>
  <div class="w-full md:w-4/5 p-4 mt-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-4">To-Do App</h1>
    
    <!-- TaskInput Component -->
    <TaskInput />

    <!-- Show loading spinner while fetching -->
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <LoadingSpinner />
    </div>

    <!-- Show empty state if no tasks are present and not loading -->
    <div v-else-if="tasks.length === 0" class="text-center py-10 text-lg text-indigo-300">
      Add your first Task to get started!
    </div>
    
    <!-- Show TaskTable only if there are tasks -->
    <!-- TaskTable Component -->
    <TaskTable
      v-else
      :tasks="tasks"
      :deleteTask="deleteTask"
      :updateTaskNotes="updateTaskNotes"
      :updateTaskPriority="updateTaskPriority"
      :updateTaskStatus="updateTaskStatus"
      :updateTaskDueDate="updateTaskDueDate"
      :formatDate="formatDate"
      :actionWidth="actionWidth"
      :titleWidth="titleWidth"
      :notesWidth="notesWidth"
      :priorityWidth="priorityWidth"
      :statusWidth="statusWidth"
      :dueDateWidth="dueDateWidth"
      :createdAtWidth="createdAtWidth"
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
import { useToast } from '@/composables/useToast';

export default {
  name: 'TaskList',
  components: { TaskInput, TaskTable },
  setup() {
    const taskStore = useTaskStore(); // Use the task store
    const authStore = useAuthStore(); // Use the auth store
    const router = useRouter(); // Use the router
    const { notify } = useToast();
    //// Use a ref for the notify function to avoid accessing toast before it's ready
    //const notify = ref(() => {}); // Placeholder until setToastInstance is called in App.vue //testing
    const loading = computed(() => taskStore.loadingStates.fetchTasks);

    // State for column widths
    const actionWidth = ref(100);
    const titleWidth = ref(150);
    const notesWidth = ref(250);
    const priorityWidth = ref(120); // Default width for priority column
    const statusWidth = ref(60);
    const dueDateWidth = ref(170); // Default width for due date column
    const createdAtWidth = ref(150);
    

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

    const deleteTask = async (taskId, taskTitle) => {
      try {
        await taskStore.deleteTask({ id: taskId, title: taskTitle }, authStore, router);
        notify('Task deleted successfully', 'success');
      } catch (error) {
        notify(error.message, 'error');
      }
    };

    const updateTaskNotes = async (taskId, taskTitle, notes) => {
      try {
        await taskStore.updateNotes({ id: taskId, title: taskTitle, notes }, authStore, router);
        notify('Notes updated successfully', 'success');
      } catch (error) {
        notify(error.message, 'error');
      }
    };

    const updateTaskPriority = async (taskId, priority) => {
      try {
        const task = taskStore.tasks.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');

        await taskStore.updateTask({
          id: taskId,
          title: task.title,
          notes: task.notes,
          is_completed: task.is_completed,
          priority: priority,
          due_date: task.due_date
        }, authStore, router);

        notify('Priority updated successfully', 'success');

      } catch (error) {
        console.notify('Error updating task priority:', error);
        notify(error.message, 'error');
      }
    };

    const updateTaskStatus = async (taskId, taskTitle, isCompleted) => {
      try {
        await taskStore.updateStatus({ id: taskId, title: taskTitle, is_completed: isCompleted }, authStore, router);
        notify('Status updated successfully', 'success');
      } catch (error) {
        console.error('Error updating task status:', error);
        notify(error.message, 'error');
      }
    };

    const updateTaskDueDate = async (taskId, dueDate) => {
      try {
        const task = taskStore.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        await taskStore.updateTask({
          id: taskId,
          title: task.title,
          notes: task.notes,
          is_completed: task.is_completed,
          priority: task.priority,
          due_date: dueDate || null
        }, authStore, router);
        notify('Due date updated successfully', 'success');
      } catch (error) {
        console.error('Error updating task due date:', error);
        notify(error.message, 'error');
      }
    };

    // Format date utility for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); // Custom formatting can be applied
    };

    // Resize column logic
    const MIN_COLUMN_WIDTHS = {
      actionCol: 60,    // Minimum width for Action column
      titleCol: 80,     // Minimum width for Title column
      notesCol: 100,    // Minimum width for Notes column
      priorityCol: 70,  // Minimum width for Priority column
      statusCol: 60,    // Minimum width for Status column
      dueDateCol: 50,   // Minimum width for Due Date column
      createdAtCol: 100 // Minimum width for Created At column
    };

    // Update the startResize function
    const startResize = (event, col) => {
      const startX = event.clientX;
      const startWidth = 
        col === 'actionCol' ? actionWidth.value :
        col === 'titleCol' ? titleWidth.value :
        col === 'notesCol' ? notesWidth.value :
        col === 'priorityCol' ? priorityWidth.value :
        col === 'statusCol' ? statusWidth.value :
        col === 'createdAtCol' ? createdAtWidth.value :
        dueDateWidth.value; // for 'dueDateCol'
    
      const onMouseMove = (moveEvent) => {
        const diff = moveEvent.clientX - startX;
        let newWidth = startWidth + diff;
      
        // Use the fixed minimum width from MIN_COLUMN_WIDTHS
        if (newWidth < MIN_COLUMN_WIDTHS[col]) {
          newWidth = MIN_COLUMN_WIDTHS[col];
        }
      
        if (col === 'actionCol') actionWidth.value = newWidth;
        else if (col === 'titleCol') titleWidth.value = newWidth;
        else if (col === 'notesCol') notesWidth.value = newWidth;
        else if (col === 'priorityCol') priorityWidth.value = newWidth;
        else if (col === 'statusCol') statusWidth.value = newWidth;
        else if (col === 'dueDateCol') dueDateWidth.value = newWidth;
        else if (col === 'createdAtCol') createdAtWidth.value = newWidth;
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
      updateTaskPriority,
      updateTaskStatus,
      updateTaskDueDate,
      deleteTask,
      formatDate,
      startResize,
      actionWidth,
      titleWidth,
      notesWidth,
      priorityWidth,
      statusWidth,
      dueDateWidth,
      createdAtWidth
      //,notify //testing
    };
  }
};
</script>

