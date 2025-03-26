import { defineStore } from 'pinia';
import { supabase } from '../supabaseClient';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    subscription: null, // Store the real-time subscription
    updateQueue: [], // Queue for updates
    isProcessingQueue: false, // Flag to track queue processing
  }),

  actions: {
    // Add an update to the queue
    enqueueUpdate(updateFn) {
      this.updateQueue.push(updateFn);
      this.processQueue();
    },

    // Process the queue
    async processQueue() {
      if (this.isProcessingQueue || this.updateQueue.length === 0) return;

      this.isProcessingQueue = true;
      const updateFn = this.updateQueue.shift();
      try {
        await updateFn();
      } catch (error) {
        console.error('Error processing update:', error);
      } finally {
        this.isProcessingQueue = false;
        this.processQueue(); // Process the next update
      }
    },

    // Fetch all tasks from Supabase
    async fetchTasks(authStore, router) {
      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_uuid', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        this.tasks = data;

        // Subscribe to real-time updates
        this.subscription = supabase
          .channel('tasks-insert-update')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'tasks',
              filter: `user_uuid=eq.${user.id}`,
            },
            (payload) => {
              this.enqueueUpdate(() => {
                // Check if the task already exists in the local state
                const exists = this.tasks.some(t => t.id === payload.new.id);
                if (!exists) {
                  this.tasks = [payload.new, ...this.tasks];
                }
              });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'tasks',
              filter: `user_uuid=eq.${user.id}`,
            },
            (payload) => {
              this.enqueueUpdate(() => {
                const index = this.tasks.findIndex(t => t.id === payload.new.id);
                if (index !== -1) {
                  this.tasks[index] = payload.new;
                }
              });
            }
          )
          .subscribe();

        // Subscribe to DELETE events
        this.deleteSubscription = supabase
          .channel('tasks-delete')
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'tasks',
            },
            (payload) => {
              this.enqueueUpdate(() => {
                const taskToDelete = this.tasks.find(t => t.id === payload.old.id);
                if (taskToDelete && taskToDelete.user_uuid === user.id) {
                  this.tasks = this.tasks.filter(t => t.id !== payload.old.id);
                }
              });
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },

    // Add a new task to Supabase
    async addTask(taskTitle, authStore, router) {
      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      if (!taskTitle.trim()) {
        console.error('Task title cannot be empty');
        return;
      }

      // Add the optimistic update to the queue
      this.enqueueUpdate(async () => {
        try {
          // Optimistic update: Add the task locally
          const newTask = {
            id: `temp-${Date.now()}`, // Temporary ID (optional, can be removed)
            title: taskTitle,
            notes: '',
            is_completed: false,
            user_uuid: user.id,
            created_at: new Date().toISOString(),
          };
          this.tasks = [newTask, ...this.tasks];

          // Insert into the database
          const { data, error } = await supabase
            .from('tasks')
            .insert([{ title: taskTitle, notes: '', is_completed: false, user_uuid: user.id }])
            .select();

          if (error) throw error;

          // Replace the temporary task with the one from the database
          if (data && data.length > 0) {
            const index = this.tasks.findIndex(t => t.id === newTask.id);
            if (index !== -1) {
              this.tasks[index] = data[0];
            }
          }
        } catch (error) {
          console.error('Error adding task:', error);
          // Rollback the optimistic update
          this.tasks = this.tasks.filter(t => t.id !== newTask.id);
        }
      });
    },

    // Update task notes in Supabase
    async updateNotes(task, authStore, router) {
      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      this.enqueueUpdate(async () => {
        try {
          // Optimistic update
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], notes: task.notes };
          }

          // Update the task in the database
          const { data, error } = await supabase
            .from('tasks')
            .update({ notes: task.notes })
            .eq('id', task.id)
            .eq('user_uuid', user.id)
            .select();

          if (error) throw error;

          // Replace the task with the one from the database
          if (data && data.length > 0) {
            this.tasks[taskIndex] = data[0];
          }
        } catch (error) {
          console.error('Error updating task notes:', error);
          // Rollback the optimistic update
          this.tasks = [...this.tasks];
        }
      });
    },

    // Update task status in Supabase
    async updateStatus(task, authStore, router) {
      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      this.enqueueUpdate(async () => {
        try {
          // Optimistic update
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], is_completed: task.is_completed };
          }

          // Update the task in the database
          const { data, error } = await supabase
            .from('tasks')
            .update({ is_completed: task.is_completed })
            .eq('id', task.id)
            .eq('user_uuid', user.id)
            .select();

          if (error) throw error;

          // Replace the task with the one from the database
          if (data && data.length > 0) {
            this.tasks[taskIndex] = data[0];
          }
        } catch (error) {
          console.error('Error updating task status:', error);
          // Rollback the optimistic update
          this.tasks = [...this.tasks];
        }
      });
    },

    // Delete a task from Supabase
    async deleteTask(task, authStore, router) {
      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      this.enqueueUpdate(async () => {
        try {
          // Optimistic update
          this.tasks = this.tasks.filter(t => t.id !== task.id);

          // Delete the task from the database
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', task.id)
            .eq('user_uuid', user.id);

          if (error) throw error;
        } catch (error) {
          console.error('Error deleting task:', error);
          // Rollback the optimistic update
          this.tasks = [...this.tasks, task];
        }
      });
    },

    // Clean up the real-time subscription
    cleanup() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
  },
});