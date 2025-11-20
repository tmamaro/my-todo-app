let toastInstance = null;
const pendingNotifications = [];

export function setToastInstance(instance) {
  toastInstance = instance;

  if (toastInstance && pendingNotifications.length) {
    pendingNotifications.splice(0).forEach(({ message, type }) => {
      toastInstance.showNotification(message, type);
    });
  }
}

export function useToast() {
  return {
    notify: (message, type = 'info') => {
      if (toastInstance) {
        toastInstance.showNotification(message, type);
      } else {
        console.warn('Toast instance not initialized');
        pendingNotifications.push({ message, type });
      }
    }
  };
}
