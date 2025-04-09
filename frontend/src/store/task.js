import { defineStore } from 'pinia';
import { supabase } from '../supabaseClient';

const DEBUG = import.meta.env.DEV;

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    subscription: null,       // For INSERT/UPDATE events
    deleteSubscription: null, // For DELETE events (separate channel)
    updateQueue: [],
    isProcessingQueue: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    baseRetryDelay: 1000,
    realtimeStatus: 'disconnected', // 'connected' | 'disconnected' | 'connecting'
    lastConnectionTime: null,
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
      
      if (!authStore.isInitialized) {
        await authStore.initialize();
      }

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
        this.setupRealtimeSubscriptions(authStore, router);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },

    setupRealtimeSubscriptions(authStore, router) {
      const user = authStore.user;
      
      // Clean up any existing subscriptions
      this.cleanup();

      // Main channel for INSERT/UPDATE events (user-specific)
      this.subscription = supabase
        .channel('tasks-insert-update', {
          config: {
            broadcast: { ack: true },
            presence: { key: `tasks-updates-${user.id}` },
            heartbeatInterval: 30000,
            timeout: 60000
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'tasks',
            filter: `user_uuid=eq.${user.id}`,
          },
          (payload) => this.handleInsert(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'tasks',
            filter: `user_uuid=eq.${user.id}`,
          },
          (payload) => this.handleUpdate(payload)
        )
        .on('error', (error) => this.handleChannelError(error, authStore, router))
        .on('close', () => this.handleChannelClose(authStore, router))
        .subscribe();

      // Separate channel for DELETE events (no user filter)
      this.deleteSubscription = supabase
        .channel('tasks-delete', {
          config: {
            broadcast: { ack: false }, // No need for ack on delete channel
            heartbeatInterval: 30000,
            timeout: 60000
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'tasks',
          },
          (payload) => this.handleDelete(payload, user.id) // Pass user.id for filtering
        )
        .subscribe();
    },

    async waitForSubscriptionReady() {
      const maxWaitTime = 5000; // 5 seconds
      const startTime = Date.now();
      
      while (!this.subscription && (Date.now() - startTime) < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!this.subscription) {
        throw new Error('Subscription failed to initialize');
      }
    },

    handleInsert(payload) {
      this.enqueueUpdate(() => {
        const exists = this.tasks.some(t => t.id === payload.new.id);
        if (!exists) {
          this.tasks = [payload.new, ...this.tasks];
        }
      });
    },

    handleUpdate(payload) {
      this.enqueueUpdate(() => {
        const index = this.tasks.findIndex(t => t.id === payload.new.id);
        if (index !== -1) {
          this.tasks[index] = payload.new;
        }
      });
    },

    handleDelete(payload, currentUserId) {
      this.enqueueUpdate(() => {
        this.tasks = this.tasks.filter(t => 
          t.id !== payload.old.id || t.user_uuid !== currentUserId
        );
      });
    },

    handleChannelError(error, authStore, router) {
      console.error('Channel error:', error);
      this.reconnect(authStore, router);
    },

    handleChannelClose(authStore, router) {
      this.realtimeStatus = 'disconnected';
      if (DEBUG) console.log('Channel closed - attempting to reconnect...');
      this.reconnect(authStore, router);
    },

    handleReconnectSuccess() {
      this.realtimeStatus = 'connected';
      this.lastConnectionTime = new Date().toISOString();
      this.resetReconnectAttempts();
      if (DEBUG) console.log('Successfully reconnected to real-time channels');
    },

    reconnect(authStore, router) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }

      this.realtimeStatus = 'connecting';
      this.reconnectAttempts++;
      const delay = Math.min(this.baseRetryDelay * this.reconnectAttempts, 10000);
      if (DEBUG) console.log(`Reconnecting attempt ${this.reconnectAttempts} in ${delay}ms`);
    
      setTimeout(async () => {
        try {
          await this.fetchTasks(authStore, router);
          this.handleReconnectSuccess();
        } catch (error) {
          console.error('Reconnection failed:', error);
        }
      }, delay);
    },

    resetReconnectAttempts() {
      this.reconnectAttempts = 0;
    },

    // Add a new task to Supabase
    async addTask( taskData, authStore, router) {

      if (!authStore.isInitialized) {
        await authStore.initialize();
      }

      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      if (!taskData.title?.trim()) {
        console.error('Task title cannot be empty');
        return;
      }

      if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
        console.error('Invalid priority value');
        return;
      }
    
      if (taskData.due_date && isNaN(new Date(taskData.due_date).getTime())) {
        console.error('Invalid due date');
        return;
      }

      await this.waitForSubscriptionReady();

      // Add the optimistic update to the queue
      this.enqueueUpdate(async () => {
        try {
          // Optimistic update: Add the task locally
          const newTask = {
            id: `temp-${Date.now()}`, // Temporary ID (optional, can be removed)
            title: taskData.title,
            notes: '', // taskData.notes || '', // Default if not provided
            is_completed: false,
            user_uuid: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            due_date: taskData.due_date || null,
            priority: taskData.priority || 'medium',
            category: '', // taskData.category || '',
          };
          this.tasks = [newTask, ...this.tasks];

          // Insert into the database
          const { data, error } = await supabase
            .from('tasks')
            .insert([{ 
              title: taskData.title, 
              notes: '', 
              is_completed: false, 
              user_uuid: user.id,
              //created_at: newTask.created_at,
              //updated_at: newTask.updated_at,
              due_date: taskData.due_date || null,
              priority: taskData.priority || 'medium',
              category: '' // taskData.category || ''
            }])
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

    // Add a new action to update all task fields
    async updateTask(task, authStore, router) {

      if (!authStore.isInitialized) {
        await authStore.initialize();
      }

      const user = authStore.user;
      if (!user) {
        console.error('User is not logged in');
        router.push('/login');
        return;
      }

      // Validation
      if (!task.title?.trim()) {
        console.error('Task title cannot be empty');
        return;
      }
    
      if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
        console.error('Invalid priority value');
        return;
      }
    
      if (task.due_date && isNaN(new Date(task.due_date).getTime())) {
        console.error('Invalid due date');
        return;
      }
    
      this.enqueueUpdate(async () => {
        try {
          // Optimistic update
          const taskIndex = this.tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = { 
              ...this.tasks[taskIndex], 
              title: task.title,
              notes: task.notes,
              due_date: task.due_date,
              priority: task.priority
            };
          }
        
          // Update the task in the database -> talvez separar isto em varias funções para cada campo ou então juntar tudo numa só
          const { data, error } = await supabase
            .from('tasks')
            .update({ 
              title: task.title, // tirar esta linha se eu n quiser atualizar o titulo
              notes: task.notes,
              due_date: task.due_date,
              priority: task.priority
            })
            .eq('id', task.id)
            .eq('user_uuid', user.id)
            .select();
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            this.tasks[taskIndex] = data[0];
          }
        } catch (error) {
          console.error('Error updating task:', error);
          this.tasks = [...this.tasks];
        }
      });
    },


    // Update task notes in Supabase
    async updateNotes(task, authStore, router) {

      if (!authStore.isInitialized) {
        await authStore.initialize();
      }

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

      if (!authStore.isInitialized) {
        await authStore.initialize();
      }

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

      if (!authStore.isInitialized) {
        await authStore.initialize();
      }
      
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
        supabase.removeChannel(this.subscription); // Proper way to remove channel
        this.subscription = null;
      }
      if (this.deleteSubscription) {
        supabase.removeChannel(this.deleteSubscription);
        this.deleteSubscription = null;
      }
      this.resetReconnectAttempts();
    },
  },
});