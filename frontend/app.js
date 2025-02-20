const apiUrl = 'http://localhost:8000/tasks';

async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear the existing tasks

  // Sort tasks to show the most recent first
  tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  tasks.forEach(task => {
    const tr = document.createElement('tr');

    // Task Title
    const tdTitle = document.createElement('td');
    tdTitle.classList.add('border', 'px-4', 'py-2');
    tdTitle.textContent = task.title;

    // Task Created Date - Format the date to DD-MMM-YYYY HH:MM:SS
    const tdDate = document.createElement('td');
    tdDate.classList.add('border', 'px-4', 'py-2', 'text-sm', 'text-gray-500');
    const dateObj = new Date(task.created_at);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()} ${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`;
    tdDate.textContent = `${formattedDate}`;

    // Task Status (Checkbox)
    const tdStatus = document.createElement('td');
    tdStatus.classList.add('border', 'px-4', 'py-2', 'text-center');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.is_completed;
    checkbox.classList.add('mx-auto', 'block');
    checkbox.addEventListener('change', () => updateTaskStatus(task.id, checkbox.checked));
    tdStatus.appendChild(checkbox);

    // Action Button (Delete)
    const tdAction = document.createElement('td');
    tdAction.classList.add('border', 'px-4', 'py-2');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));  // Delete task function
    tdAction.appendChild(deleteBtn);

    tr.appendChild(tdTitle);
    tr.appendChild(tdDate);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);
    taskList.appendChild(tr);
  });
}

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskTitle = taskInput.value;

  const button = document.getElementById('add-task-button');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('button-text');

  // Disable the button while processing
  button.disabled = true;

  // Show spinner and hide button text
  buttonText.classList.add('hidden');
  spinner.classList.remove('hidden');

  if (taskTitle) {
    // Adding task
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: taskTitle, is_completed: false })
    });

    taskInput.value = ''; // Clear input after adding task
    fetchTasks(); // Re-fetch tasks to show the updated list
  }

  // Re-enable the button and hide spinner after the task is added
  button.disabled = false;
  buttonText.classList.remove('hidden');
  spinner.classList.add('hidden');
}

// Update task status (toggle checkbox)
async function updateTaskStatus(taskId, isCompleted) {
  const task = { is_completed: isCompleted }; // Prepare the data object

  await fetch(`${apiUrl}/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  // Refetch tasks after the update
  fetchTasks();
}

// Delete task
async function deleteTask(taskId) {
  await fetch(`${apiUrl}/${taskId}`, {
    method: 'DELETE',
  });
  fetchTasks();  // Re-fetch tasks to remove the deleted task
}

window.onload = () => {
  fetchTasks();

  // Add event listener to trigger addTask on Enter key press
  document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });
};
