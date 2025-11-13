let toastInstance = null;

export function setToastInstance(instance) {
  toastInstance = instance;
}

export function useToast() {
  return {
    notify: (message, type = 'info') => {
      if (toastInstance) {
        toastInstance.showNotification(message, type);
      } else {
        console.warn('Toast instance not initialized');
      }
    }
  };
}
