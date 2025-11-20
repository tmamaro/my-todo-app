<template>
    <div class="w-full always-show-scrollbar mt-6 border border table-container">
      <table>
        <thead>
          <tr class="bg-indigo-400">
            <th ref="actionCol" class="relative" :style="{ width: Math.round(actionWidth) + 'px', minWidth: '100px' }">
              Action <div class="resizer" @mousedown="startResize($event, 'actionCol')"></div>
            </th>
            <th ref="titleCol" class="relative" :style="{ width: Math.round(titleWidth) + 'px', minWidth: '150px' }">
              <button class="header-button" type="button" @click="() => onSort('title')">
                <span>Title</span>
                <span class="sort-indicator">{{ sortIndicator('title') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'titleCol')"></div>
            </th>
            <th ref="notesCol" class="relative" :style="{ width: Math.round(notesWidth) + 'px', minWidth: '250px' }">
              <button class="header-button" type="button" @click="() => onSort('notes')">
                <span>Notes</span>
                <span class="sort-indicator">{{ sortIndicator('notes') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'notesCol')"></div>
            </th>
            <th ref="priorityCol" class="relative" :style="{ width: Math.round(priorityWidth) + 'px', minWidth: '120px' }">
              <button class="header-button" type="button" @click="() => onSort('priority')">
                <span>Priority</span>
                <span class="sort-indicator">{{ sortIndicator('priority') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'priorityCol')"></div>
            </th>
            <th ref="statusCol" class="relative" :style="{ width: Math.round(statusWidth) + 'px', minWidth: '60px' }">
              <button class="header-button" type="button" @click="() => onSort('is_completed')">
                <span>Status</span>
                <span class="sort-indicator">{{ sortIndicator('is_completed') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'statusCol')"></div>
            </th>
            <th ref="dueDateCol" class="relative" :style="{ width: Math.round(dueDateWidth) + 'px', minWidth: '170px' }">
              <button class="header-button" type="button" @click="() => onSort('due_date')">
                <span>Due Date</span>
                <span class="sort-indicator">{{ sortIndicator('due_date') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'dueDateCol')"></div>
            </th>
            <th ref="createdAtCol" class="relative" :style="{ width: Math.round(createdAtWidth) + 'px', minWidth: '150px' }">
              <button class="header-button" type="button" @click="() => onSort('created_at')">
                <span>Created</span>
                <span class="sort-indicator">{{ sortIndicator('created_at') }}</span>
              </button>
              <div class="resizer" @mousedown="startResize($event, 'createdAtCol')"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading state for initial fetch -->
          <tr v-if="loading && tasks.length === 0">
            <td :colspan="7" class="text-center py-4">
              <div class="flex justify-center">
                <LoadingSpinner />
              </div>
            </td>
          </tr>
           <!-- Rows for each task -->
          <tr v-for="task in tasks" :key="task?.id">
            <td class="border px-4 py-2 text-center">
              <!-- Replace the 'x' with an image -->
              <button 
                @click="deleteTask(task?.id,  task?.title)"
                :disabled="deleting"
                class="bg-transparent px-0 py-0 justify-center"
              >
                <template v-if="!deleting">
                  <img :src="deleteIcon" alt="Delete" class="w-8 h-8" />
                </template>
                <LoadingSpinner v-else class="w-8 h-8" />
              </button>
            </td>
            <!-- Title column -->
          <td class="border px-4 py-2 break-words">{{ task?.title }}</td>
          
          <!-- Notes column with loading -->
          <td class="border px-4 py-2">
            <div class="relative">
              <textarea
                class="w-full p-2 border"
                :value="task.notes || ''"
                placeholder="Write your notes and click outside the box to save them :D"
                @blur="(event) => updateTaskNotes(task.id, task.title, event.target.value)"
                :disabled="updatingNotes"
                title="Exit box to save"
              ></textarea>
              <LoadingSpinner v-if="updatingNotes" class="absolute right-2 top-2 h-4 w-4" />
            </div>
          </td>
          
          <!-- Priority column with loading -->
          <td class="border px-4 py-2 text-center">
            <div class="relative">
              <select 
                :value="task.priority || 'medium'"
                @change="(event) => updateTaskPriority(task.id, event.target.value)"
                :disabled="updatingPriority"
                class="w-full p-1 border rounded text-center"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <LoadingSpinner v-if="updatingPriority" class="absolute right-2 top-2 h-4 w-4" />
            </div>
          </td>
          
          <!-- Status column with loading -->
          <td class="border px-4 py-2 text-center">
            <div class="relative">
              <input
                type="checkbox"
                :checked="task.is_completed"
                @change="(event) => updateTaskStatus(task.id, task.title, event.target.checked)"
                :disabled="updatingStatus"
                class="mx-auto block"
              />
              <LoadingSpinner v-if="updatingStatus" class="absolute right-2 top-2 h-4 w-4" />
            </div>
          </td>
          
          <!-- Due Date column with loading -->
          <td class="border px-4 py-2 text-center">
            <div class="relative">
              <input
                type="date"
                :value="task.due_date ? task.due_date.split('T')[0] : ''"
                @change="(event) => updateTaskDueDate(task.id, event.target.value)"
                :min="new Date().toISOString().split('T')[0]"
                :disabled="updatingDueDate"
                class="w-full p-1 border rounded text-center"
              />
              <LoadingSpinner v-if="updatingDueDate" class="absolute right-2 top-2 h-4 w-4" />
            </div>
          </td>
          
          <!-- Created At column -->
          <td class="border px-4 py-2 text-sm text-gray-500 text-center">
            {{ formatDate(task.created_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  
<script>
  import deleteIcon from '@/assets/delete_icon_V3.png';
  import { useTaskStore } from '@/store/task';
  import { computed } from 'vue';
  import LoadingSpinner from './LoadingSpinner.vue'; // Import the loading spinner component

  export default {
    name: "TaskTable",
    components: {
      LoadingSpinner
    },
    props: {
      tasks: Array,
      updateTaskNotes: Function,
      updateTaskPriority: Function,
      updateTaskStatus: Function,
      updateTaskDueDate: Function,
      deleteTask: Function,
      formatDate: Function,
      startResize: Function,
      actionWidth: Number,
      titleWidth: Number,
      notesWidth: Number,
      priorityWidth: Number,
      statusWidth: Number,
      dueDateWidth: Number,
      createdAtWidth: Number,
      sortKey: String,
      sortDirection: String,
      onSort: Function
    },

  setup(props) {
    const taskStore = useTaskStore();
    
    // Access loading states from the store
    const loading = computed(() => taskStore.loadingStates.fetchTasks);
    const updatingNotes = computed(() => taskStore.loadingStates.updateNotes);
    const updatingPriority = computed(() => taskStore.loadingStates.updateTask);
    const updatingStatus = computed(() => taskStore.loadingStates.updateStatus);
    const updatingDueDate = computed(() => taskStore.loadingStates.updateTask);
    const deleting = computed(() => taskStore.loadingStates.deleteTask);

    const sortIndicator = (key) => {
      if (props.sortKey !== key) return '↕';
      return props.sortDirection === 'asc' ? '▲' : '▼';
    };

    return {
      loading,
      updatingNotes,
      updatingPriority,
      updatingStatus,
      updatingDueDate,
      deleting,
      sortIndicator,
      onSort: props.onSort
    };
  },
  data() {
    return {
      deleteIcon // Add the image to the data object so it can be used in the template
    };
  }
};
</script>
  
  <style scoped>
  
  /* Your styles here */
  .table-container {
    max-height: 550px;
    overflow-y: auto;
    overflow-x: visible;
    /*background-color:  black ;*/ /* #818cf8; */
    scrollbar-gutter: stable right-edge;/*both-edges;*/    
    -webkit-transform: translateZ(0); /* Help with rendering performance */
    transform: translateZ(0); /* Help with rendering performance */
  }
  
  .resizer {
    position: absolute;
    right: -1px;
    top: 0;
    width: 3px;
    height: 100%;
    cursor: ew-resize;
    background-color: #c7d2fe;
  }
  
  thead {
    position: sticky;
    top: 0;
    background-color: #f3f4f6;
    z-index: 2;
    backface-visibility: hidden;
  }

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .header-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    color: #1f2937;
  }

  .header-button:hover {
    background-color: #e0e7ff;
  }

  .sort-indicator {
    font-size: 0.75rem;
    color: #312e81;
  }
  </style>