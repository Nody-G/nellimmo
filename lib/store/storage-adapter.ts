/**
 * Resilient LocalStorage adapter for Nell'Immo Cockpit.
 * Handles SSR safety, JSON parsing errors, and storage quota exceptions.
 */

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`[StorageAdapter] Failed to parse stored item for key "${key}":`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[StorageAdapter] Failed to save item for key "${key}":`, e);
    return false;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error(`[StorageAdapter] Failed to remove item for key "${key}":`, e);
  }
}
