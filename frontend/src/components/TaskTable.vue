<template>
    <div class="w-full always-show-scrollbar mt-6 border border table-container">
      <table>
        <thead>
          <tr class="bg-indigo-400">
            <th ref="titleCol" class="relative" :style="{ width: Math.round(titleWidth) + 'px', minWidth: '60px' }">
              Title <div class="resizer" @mousedown="startResize($event, 'titleCol')"></div>
            </th>
            <th ref="notesCol" class="relative" :style="{ width: Math.round(notesWidth) + 'px', minWidth: '60px' }">
              Notes <div class="resizer" @mousedown="startResize($event, 'notesCol')"></div>
            </th>
            <th ref="createdAtCol" class="relative" :style="{ width: Math.round(createdAtWidth) + 'px', minWidth: '60px' }">
              Created<div class="resizer" @mousedown="startResize($event, 'createdAtCol')"></div>
            </th>
            <th ref="statusCol" class="relative" :style="{ width: Math.round(statusWidth) + 'px', minWidth: '60px' }">
              Status <div class="resizer" @mousedown="startResize($event, 'statusCol')"></div>
            </th>
            <th ref="actionCol" class="relative" :style="{ width: Math.round(actionWidth) + 'px', minWidth: '60px' }">
              Action <div class="resizer" @mousedown="startResize($event, 'actionCol')"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td class="border px-4 py-2 break-words">{{ task.title }}</td>
            <td class="border px-4 py-2">
              <textarea
                class="w-full p-2 border"
                v-model="task.notes"
                @blur="updateTaskNotes(task.id, task.notes)"
              ></textarea>
            </td>
            <td class="border px-4 py-2 text-sm text-gray-500 text-center">{{ formatDate(task.created_at) }}</td>
            <td class="border px-4 py-2 text-center">
              <input
                type="checkbox"
                v-model="task.is_completed"
                @change="updateTaskStatus(task.id, task.is_completed)"
                class="mx-auto block"
              />
            </td>
            <td class="border px-4 py-2 text-center">
              <button
                @click="deleteTask(task.id)"
                class="bg-red-500 text-white px-2 py-0.5 justify-center"
              >
                x
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  
  <script>
  export default {
    name: "TaskTable",
    props: {
      tasks: Array,
      updateTaskNotes: Function,
      updateTaskStatus: Function,
      deleteTask: Function,
      formatDate: Function,
      startResize: Function,
      titleWidth: Number,
      notesWidth: Number,
      createdAtWidth: Number,
      statusWidth: Number,
      actionWidth: Number
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