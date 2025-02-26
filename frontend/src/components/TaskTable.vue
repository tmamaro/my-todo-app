<template>
    <div class="w-full always-show-scrollbar mt-6 border border-gray-300 table-container">
      <table>
        <thead>
          <tr class="bg-gray-200">
            <th ref="titleCol" class="relative" :style="{ width: titleWidth + 'px', minWidth: '100px' }">
              Title <div class="resizer" @mousedown="startResize($event, 'titleCol')"></div>
            </th>
            <th ref="notesCol" class="relative" :style="{ width: notesWidth + 'px', minWidth: '100px' }">
              Notes <div class="resizer" @mousedown="startResize($event, 'notesCol')"></div>
            </th>
            <th ref="createdAtCol" class="relative" :style="{ width: createdAtWidth + 'px', minWidth: '100px' }">
              Created at <div class="resizer" @mousedown="startResize($event, 'createdAtCol')"></div>
            </th>
            <th ref="statusCol" class="relative" :style="{ width: statusWidth + 'px', minWidth: '100px' }">
              Status <div class="resizer" @mousedown="startResize($event, 'statusCol')"></div>
            </th>
            <th ref="actionCol" class="relative" :style="{ width: actionWidth + 'px', minWidth: '100px' }">
              Action <div class="resizer" @mousedown="startResize($event, 'actionCol')"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td class="border px-4 py-2 break-words">{{ task.title }}</td>
            <td class="border px-4 py-2">
              <textarea
                class="w-full p-2 border rounded"
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
                class="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
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
    max-height: 400px;
    overflow-y: auto;
    overflow-x: auto;
    scrollbar-gutter: stable both-edges;
  }
  
  .resizer {
    position: absolute;
    right: 0;
    top: 0;
    width: 5px;
    height: 100%;
    cursor: ew-resize;
    background-color: #ccc;
  }
  
  thead {
    position: sticky;
    top: 0;
    background-color: #f3f4f6;
    z-index: 2;
  }
  
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }
  </style>