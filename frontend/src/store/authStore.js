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
    isReady: false, // The isReady flag helps track initialization state
    isInitialized: false, // Track initialization state
    redirectPath: null,
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
      this.isReady = false;
      
      // Get current session quietly first
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        this.user = null;
      } else if (session) {
        this.user = session.user;
      }

      this.setupAuthListener();
      this.isReady = true;
      this.isInitialized = true;
    },

    setupAuthListener() {
      this.authListener = supabase.auth.onAuthStateChange((event, session) => {
        debugLog('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          this.handleSignOut();
        } else if (session) {
          // Only update if the user changed
          if (!this.user || session.user.id !== this.user.id) {
            this.user = session.user;
          }
        }
      });
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
        this.loading = true;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          this.error = error;
          console.error('Error signing in:', error);
          return null;
        }
        // The auth listener will handle updating the user state
        const redirectPath = this.redirectPath || '/tasks';
        this.redirectPath = null;
        return redirectPath;
      } catch (err) {
        this.error = err;
        console.error('Sign in error:', err);
        return null;
      } finally {
        this.loading = false;
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

    setRedirectPath(path) {
      this.redirectPath = path;
    },

  },

  getters: {
    // Check if the user is logged in
    isAuthenticated: (state) => !!state.user,
  },
});