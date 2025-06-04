interface EventMap {
    [eventName: string]: any;
  }
  
  export class EventBus<T extends EventMap> {
    private listeners = new Map<keyof T, Set<(payload: T[keyof T]) => void>>();
  
    on<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): void {
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
      }
      this.listeners.get(eventName)!.add(listener);
    }
  
    off<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): void {
      const listeners = this.listeners.get(eventName);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(eventName);
        }
      }
    }
  
    emit<K extends keyof T>(eventName: K, payload: T[K]): void {
      const listeners = this.listeners.get(eventName);
      listeners?.forEach((listener) => listener(payload));
    }
  }