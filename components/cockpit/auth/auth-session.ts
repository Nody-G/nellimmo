import { isAuthenticated, hasUsers } from '@/lib/auth';

const authListeners = new Set<() => void>();

export function subscribeAuth(cb: () => void): () => void {
  authListeners.add(cb);
  return () => {
    authListeners.delete(cb);
  };
}

export function getAuthSnapshot(): boolean {
  return isAuthenticated();
}

export function getAuthServerSnapshot(): boolean {
  return false;
}

export function getHasUsersSnapshot(): boolean {
  return hasUsers();
}

export function getHasUsersServerSnapshot(): boolean {
  return false;
}

export function notifyAuthChanged(): void {
  authListeners.forEach((cb) => cb());
}

export type AuthMode = 'setup' | 'legacy' | 'login';
