<template>
    <div class="w-full always-show-scrollbar mt-6 border border table-container">
      <table>
        <thead>
          <tr class="bg-indigo-400">
            <th ref="actionCol" class="relative" :style="{ width: Math.round(actionWidth) + 'px', minWidth: '60px' }">
              Action <div class="resizer" @mousedown="startResize($event, 'actionCol')"></div>
            </th>
            <th ref="titleCol" class="relative" :style="{ width: Math.round(titleWidth) + 'px', minWidth: '60px' }">
              Title <div class="resizer" @mousedown="startResize($event, 'titleCol')"></div>
            </th>
            <th ref="notesCol" class="relative" :style="{ width: Math.round(notesWidth) + 'px', minWidth: '60px' }">
              Notes <div class="resizer" @mousedown="startResize($event, 'notesCol')"></div>
            </th>
            <th ref="priorityCol" class="relative" :style="{ width: Math.round(priorityWidth) + 'px', minWidth: '120px' }">
              Priority <div class="resizer" @mousedown="startResize($event, 'priorityCol')"></div>
            </th>
            <th ref="statusCol" class="relative" :style="{ width: Math.round(statusWidth) + 'px', minWidth: '60px' }">
              Status <div class="resizer" @mousedown="startResize($event, 'statusCol')"></div>
            </th>
            <th ref="dueDateCol" class="relative" :style="{ width: Math.round(dueDateWidth) + 'px', minWidth: '170px' }">
              Due Date <div class="resizer" @mousedown="startResize($event, 'dueDateCol')"></div>
            </th>
            <th ref="createdAtCol" class="relative" :style="{ width: Math.round(createdAtWidth) + 'px', minWidth: '60px' }">
              Created<div class="resizer" @mousedown="startResize($event, 'createdAtCol')"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task?.id">
            <td class="border px-4 py-2 text-center">
              <!-- Replace the 'x' with an image -->
              <button @click="deleteTask(task?.id,  task?.title)" class="bg-transparent px-0 py-0 justify-center">
                <img :src="deleteIcon" alt="Delete" class="w-8 h-8" />
              </button>
            </td>
            <td class="border px-4 py-2 break-words">{{ task?.title }}</td>
            <td class="border px-4 py-2">
              <div class="relative">
                <textarea
                  class="w-full p-2 border"
                  :value="task.notes || ''"
                  placeholder="Write your notes and click outside the box to save them :D"
                  @blur="(event) => updateTaskNotes(task.id, task.title, event.target.value)"
                  title="Exit box to save"
                ></textarea>
              </div>
            </td>
            <td class="border px-4 py-2 text-center">
              <div class="relative">
                <select 
                  :value="task.priority || 'medium'"
                  @change="(event) => updateTaskPriority(task.id, event.target.value)"
                  class="w-full p-1 border rounded text-center"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </td>
            <td class="border px-4 py-2 text-center">
              <input
                type="checkbox"
                :checked="task.is_completed"
                @change="(event) => updateTaskStatus(task.id, task.title, event.target.checked)"
                class="mx-auto block"
              />
            </td>
            <td class="border px-4 py-2 text-center">
              <div class="relative">
                <input
                  type="date"
                  :value="task.due_date ? task.due_date.split('T')[0] : ''"
                  @change="(event) => updateTaskDueDate(task.id, event.target.value)"
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full p-1 border rounded text-center"
                />
              </div>
            </td>
            <td class="border px-4 py-2 text-sm text-gray-500 text-center">{{ formatDate(task.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  
  <script>
  import deleteIcon from '@/assets/delete_icon_V3.png';

  export default {
    name: "TaskTable",
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
      createdAtWidth: Number
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
  </style>