export interface AppEvents {
    data: { text: string; timestamp: number };
    error: Error & { code: number };
    count: number;
  }