import { defineStore } from 'pinia';
import { supabase } from '../supabaseClient';

export const useTaskStore = defineStore('task', {
  
  state: () => ({
    tasks: [],
  }),

  actions: {

    // Fetch all tasks from Supabase
    async fetchTasks() {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false }); // Sort by most recent

        if (error) throw error;
        this.tasks = data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },

    // Add a new task to Supabase
    async addTask(taskTitle) {
      if (!taskTitle.trim()) {
        console.error('Task title cannot be empty');
        return; // Validation check
      }
      
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{ title: taskTitle, notes: '', is_completed: false }])
          .select(); // Return the inserted row

        if (error) throw error;
        this.tasks = [data[0], ...this.tasks]; // Optimistic update
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },

    // commented while using supabase
    //    // Check if the response is successful
    //    if (response.ok) {
    //      const newTask = await response.json();
    //      this.tasks = [newTask, ...this.tasks]; // Optimistic update
    //    } else {
    //      console.error('Failed to add task');
    //    }
    //  } catch (error) {
    //    console.error('Error adding task:', error);
    //  }
    //},


    // Update task status in Supabase
    async updateStatus(task) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({ is_completed: task.is_completed })
          .eq('id', task.id)
          .select(); // Return the updated row
        
          if (error) throw error;
          const updatedTask = data[0];
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask; // Update the store
          }
        } catch (error) {
          console.error('Error updating task status:', error);
        }
    },


    // Update task notes in Supabase
    async updateNotes(task) {
      try {
        const { data, error } = await supabase
        .from('tasks')
        .update({ notes: task.notes })
        .eq('id', task.id)
        .select(); // Return the updated row

        if (error) throw error;
        const updatedTask = data[0];
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask; // Update the store
        }
      } catch (error) {
        console.error('Error updating task notes:', error);
      }
    },


    // Delete a task from Supabase
    async deleteTask(taskId) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId);

          if (error) throw error;
          this.tasks = this.tasks.filter(task => task.id !== taskId); // Optimistic update
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },
    },
  });
