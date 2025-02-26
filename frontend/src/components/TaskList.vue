<template>
  <div class="w-full md:w-4/5 p-4">
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
import { useTaskStore } from '@/store/task';
import TaskInput from './TaskInput.vue';
import TaskTable from './TaskTable.vue';

export default {
  name: 'TaskList',
  components: { TaskInput, TaskTable },
  setup() {
    const taskStore = useTaskStore();

    // State for column widths
    const titleWidth = ref(200);
    const notesWidth = ref(250);
    const createdAtWidth = ref(150);
    const statusWidth = ref(100);
    const actionWidth = ref(120);

    // Computed property to ensure tasks are reactive
    const tasks = computed(() => taskStore.tasks);

    // Fetch tasks when component is mounted
    onMounted(() => {
      taskStore.fetchTasks();
    });

    // Methods to interact with the store
    const updateTaskNotes = async (taskId, notes) => {
      const task = taskStore.tasks.find(t => t.id === taskId);
      if (task) {
        task.notes = notes;
        await taskStore.updateNotes(task);
      }
    };

    const updateTaskStatus = async (taskId, isCompleted) => {
      const task = taskStore.tasks.find(t => t.id === taskId);
      if (task) {
        task.is_completed = isCompleted;
        await taskStore.updateStatus(task);
      }
    };

    const deleteTask = async (taskId) => {
      await taskStore.deleteTask(taskId);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); // Custom formatting can be applied
    };

    // Resize column logic
    const MIN_COLUMN_WIDTH = 100; // Minimum column width

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

