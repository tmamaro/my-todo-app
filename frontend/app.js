const apiUrl = 'http://localhost:8000/tasks';

async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    taskList.appendChild(li);
  });
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskTitle = taskInput.value;

  if (taskTitle) {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: taskTitle, is_completed: false })
    });
    taskInput.value = '';
    fetchTasks(); // Re-fetch tasks
  }
}

window.onload = fetchTasks;
