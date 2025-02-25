const apiUrl = 'http://localhost:8000/tasks';

document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();

  document.getElementById('add-task-button').addEventListener('click', addTask);
  document.getElementById('taskInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });
});

async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    tasks.forEach(task => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td class="border px-4 py-2 w-[30%] md:max-w-[200px] break-words overflow-hidden">${task.title}</td>
        <td class="border px-4 py-2">
          <textarea class="w-full p-2 border rounded" onblur="updateTaskNotes(${task.id}, this.value)">${task.notes || ''}</textarea>
        </td>
        <td class="border px-4 py-2 text-sm text-gray-500 text-center">${formatDate(task.created_at)}</td>
        <td class="border px-4 py-2 text-center">
          <input type="checkbox" ${task.is_completed ? 'checked' : ''} class="mx-auto block" onchange="updateTaskStatus(${task.id}, this.checked)">
        </td>
        <td class="border px-4 py-2 text-center">
          <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteTask(${task.id})">Delete</button>
        </td>
      `;

      taskList.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskTitle = taskInput.value.trim();
  if (!taskTitle) return;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle, notes: '', is_completed: false })
    });

    taskInput.value = '';
    fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

async function updateTaskNotes(taskId, notes) {
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
}

async function updateTaskStatus(taskId, isCompleted) {
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
}

async function deleteTask(taskId) {
  try {
    await fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' });
    fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
