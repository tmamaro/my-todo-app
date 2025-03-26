import { defineStore } from 'pinia';
import { supabase } from '../supabaseClient';
import { useTaskStore } from './task';
import { debugLog } from '../utils/logger';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    loading: true,
    authListener: null,
    isInitialized: false, // Track initialization state
  }),

  actions: {
    async fetchUser() {
      try {
        this.loading = true;
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        this.user = user;
        return user;
      } catch (error) {
        this.error = error;
        this.user = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async initialize() {
      if (this.isInitialized) return;
      
      // Get current session quietly first
      const { data: { session } } = await supabase.auth.getSession();
      if (session) this.user = session.user;

      // Set up listener with debounce logic
      this.authListener = supabase.auth.onAuthStateChange((event, session) => {
        debugLog('Auth state changed:', event);  // Keep for debugging in DEV
        
        // Only process certain events
        if (event === 'SIGNED_OUT') {
          this.handleSignOut();
        } 
        // Only update user if the ID actually changed
        else if (session?.user?.id !== this.user?.id) {
          this.user = session?.user || null;
        }
      });

      this.isInitialized = true;
    },

    handleSignOut() {
      this.user = null;
      const taskStore = useTaskStore();
      taskStore.cleanup();
      if (this.router) this.router.push('/login');
    },

    cleanup() {
      if (this.authListener) {
        this.authListener.unsubscribe();
        this.authListener = null;
      }
      this.isInitialized = false;
    },
  

    // Sign up a new user
    async signUp(email, password) {
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          this.error = error;
          console.error('Error signing up:', error);
          return null;
        }
        this.user = data.user;
        return data.user;
      } catch (err) {
        this.error = err;
        console.error('Unexpected error:', err);
        return null;
      }
    },

    // Sign in an existing user
    async signIn(email, password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          this.error = error;
          console.error('Error signing in:', error);
          return null;
        }
        this.user = data.user;
        return data.user;
      } catch (err) {
        this.error = err;
        console.error('Unexpected error:', err);
        return null;
      }
    },

    // Sign out the current user
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          this.error = error;
          console.error('Error signing out:', error);
          return false;
        }

        // Clean up the task store subscription
        const taskStore = useTaskStore();
        taskStore.cleanup();

        this.user = null;
        return true;
      } catch (err) {
        this.error = err;
        console.error('Unexpected error:', err);
        return false;
      }
    },

    // Listen for authentication state changes
    listenForAuthChanges() {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          this.user = session.user;
        } else if (event === 'SIGNED_OUT') {
          this.user = null;
        }
      });
    },
  },

  getters: {
    // Check if the user is logged in
    isLoggedIn: (state) => !!state.user,
  },
});