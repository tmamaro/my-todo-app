export function debugLog(...messages) {
  if (import.meta.env.DEV) {
    console.log('[DEBUG]', ...messages);
  }
}