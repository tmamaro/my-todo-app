<template>
  <div class="w-full md:w-4/5 p-4">
    <h1 class="text-3xl font-bold text-center mb-4">To-Do App</h1>

    <div class="flex justify-center">
      <input 
        type="text" 
        v-model="taskInput" 
        placeholder="Enter task" 
        class="w-full md:w-4/5 p-2 border border-gray-300 rounded mb-4"
        @keypress="handleKeyPress"
      >
    </div>

    <div class="flex justify-center">
      <button 
        @click="addTask"
        class="bg-blue-500 text-white px-6 py-2 rounded transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none active:scale-95"
      >
        Add Task
      </button>
    </div>

    <div class="w-full always-show-scrollbar mt-6 border border-gray-300 table-container">
      <table>
        <thead>
          <tr class="bg-gray-200">
            <th ref="titleCol" class="w-[200px] relative">
              Title <div class="resizer" @mousedown="startResize($event, 'titleCol')"></div>
            </th>
            <th ref="notesCol" class="w-[250px] relative">
              Notes <div class="resizer" @mousedown="startResize($event, 'notesCol')"></div>
            </th>
            <th ref="createdAtCol" class="w-[150px] relative">
              Created at <div class="resizer" @mousedown="startResize($event, 'createdAtCol')"></div>
            </th>
            <th ref="statusCol" class="w-[100px] relative">
              Status <div class="resizer" @mousedown="startResize($event, 'statusCol')"></div>
            </th>
            <th ref="actionCol" class="w-[120px] relative">
              Action <div class="resizer" @mousedown="startResize($event, 'actionCol')"></div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td class="border px-4 py-2 w-[30%] md:max-w-[200px] break-words overflow-hidden">{{ task.title }}</td>
            <td class="border px-4 py-2">
              <textarea 
                class="w-full p-2 border rounded" 
                v-model="task.notes" 
                @blur="updateTaskNotes(task.id, task.notes)"
              >
              </textarea>
            </td>
            <td class="border px-4 py-2 text-sm text-gray-500 text-center">{{ formatDate(task.created_at) }}</td>
            <td class="border px-4 py-2 text-center">
              <input 
                type="checkbox" 
                v-model="task.is_completed"
                @change="updateTaskStatus(task.id, task.is_completed)"
                class="mx-auto block"
              >
            </td>
            <td class="border px-4 py-2 text-center">
              <button 
                @click="deleteTask(task.id)"
                class="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'TaskList',
  setup() {
    const taskInput = ref('');
    const tasks = ref([]);

    const apiUrl = 'http://localhost:8000/tasks';

    // Column Resizing
    const resizingColumn = ref(null);
    const startX = ref(0);
    const startWidth = ref(0);

    // Table column refs
    const titleCol = ref(null);
    const notesCol = ref(null);
    const createdAtCol = ref(null);
    const statusCol = ref(null);
    const actionCol = ref(null);

    // Mapping column keys to refs
    const columnRefs = { titleCol, notesCol, createdAtCol, statusCol, actionCol };

    // Start resizing when mouse is pressed on a resizer
    const startResize = (event, colKey) => {
      resizingColumn.value = columnRefs[colKey].value;
      startX.value = event.pageX;
      startWidth.value = resizingColumn.value.offsetWidth;
      
      document.addEventListener('mousemove', resizeColumn);
      document.addEventListener('mouseup', stopResize);
    };

    // Resize column on mouse move
    const resizeColumn = (event) => {
      if (!resizingColumn.value) return;
      const diff = event.pageX - startX.value;
      resizingColumn.value.style.width = `${startWidth.value + diff}px`;
    };

    // Stop resizing when mouse is released
    const stopResize = () => {
      document.removeEventListener('mousemove', resizeColumn);
      document.removeEventListener('mouseup', stopResize);
      resizingColumn.value = null;
    };

    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        tasks.value = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // Add a new task
    const addTask = async () => {
      if (!taskInput.value.trim()) return;

      try {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskInput.value,
            notes: '',
            is_completed: false
          })
        });
        taskInput.value = '';
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };

    // Update task status
    const updateTaskStatus = async (taskId, isCompleted) => {
      try {
        await fetch(`${apiUrl}/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_completed: isCompleted })
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    };

    // Update task notes
    const updateTaskNotes = async (taskId, notes) => {
      try {
        await fetch(`${apiUrl}/${taskId}/notes`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes })
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    };

    // Delete a task
    const deleteTask = async (taskId) => {
      try {
        await fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    // Handle enter key press for adding task
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
      }
    };

    // Run when component is mounted
    onMounted(async () => {
      await fetchTasks(); // Fetch tasks first

      // Set default column widths
      Object.values(columnRefs).forEach(ref => {
        if (ref.value) {
          ref.value.style.width = `${ref.value.offsetWidth}px`;
        }
      });
    });

    return {
      taskInput,
      tasks,
      addTask,
      updateTaskStatus,
      updateTaskNotes,
      deleteTask,
      formatDate,
      handleKeyPress,
      fetchTasks,
      startResize,
      titleCol,
      notesCol,
      createdAtCol,
      statusCol,
      actionCol,
    };
  },
};

</script>

<style scoped>

.resizer {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
}

.resizer:hover {
  background-color: gray;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
}

.always-show-scrollbar {
  overflow: auto;
  scrollbar-gutter: stable both-edges;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

th,
td {
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  word-wrap: break-word;
  position: relative;
}

thead {
  position: sticky;
  top: 0;
  background-color: #f3f4f6;
  z-index: 2;
}

.resizer {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
}

.resizer:hover {
  background-color: gray;
}
</style>
