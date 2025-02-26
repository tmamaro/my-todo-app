import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    async fetchTasks() {
      try {
        const response = await fetch('http://localhost:8000/tasks');
        const data = await response.json();
        this.tasks = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async addTask(taskTitle) {
      if (!taskTitle.trim()) {
        console.error('Task title cannot be empty');
        return; // Validation check
      }
      
      try {
        // Send a request to add the task
        const response = await fetch('http://localhost:8000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: taskTitle, notes: '', is_completed: false }),
        });

        // Check if the response is successful
        if (response.ok) {
          const newTask = await response.json();
          this.tasks = [newTask, ...this.tasks]; // Optimistic update
        } else {
          console.error('Failed to add task');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async updateStatus(task) {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_completed: task.is_completed }),
        });
        
        if (response.ok) {
          // Optimistically update the status in the store directly if the API call was successful
          const updatedTask = await response.json();
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
          }
        } else {
          console.error('Failed to update task status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    async updateNotes(task) {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${task.id}/notes`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: task.notes }),
        });

        if (response.ok) {
          // Optimistically update the notes in the store directly if the API call was successful
          const updatedTask = await response.json();
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
          }
        } else {
          console.error('Failed to update task notes');
        }
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Optimistically remove the task from the store if the delete request was successful
          this.tasks = this.tasks.filter(task => task.id !== taskId);
        } else {
          console.error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
  },
});
