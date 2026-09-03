// Barrel re-export - keeps backward compatibility for existing imports.
// Data is physically split so the public bundle never pulls cockpit-only datasets.
export * from './mock-data-public';
export * from './mock-data-cockpit';
