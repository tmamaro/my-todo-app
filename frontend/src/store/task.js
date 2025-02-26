import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: []
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
      try {
        // Send a request to add the task
        const response = await fetch('http://localhost:8000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: taskTitle, notes: '', is_completed: false })
        });

        // Check if the response is successful
        if (response.ok) {
          const newTask = await response.json(); // Assuming the backend sends the task object back
          
          // Add the new task to the store's state (reactivity)
          this.tasks = [newTask, ...this.tasks]; // Prepend the new task for immediate update in the list
        } else {
          console.error('Failed to add task');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async updateStatus(task) {
      try {
        await fetch(`http://localhost:8000/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_completed: task.is_completed })
        });
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    async updateNotes(task) {
      try {
        await fetch(`http://localhost:8000/tasks/${task.id}/notes`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: task.notes })
        });
      } catch (error) {
        console.error('Error updating notes:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        await fetch(`http://localhost:8000/tasks/${taskId}`, { method: 'DELETE' });
        this.tasks = this.tasks.filter(task => task.id !== taskId); // Directly remove the task from state
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }
});
