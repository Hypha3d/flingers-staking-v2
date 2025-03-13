// Utility functions to handle localStorage

// Save data to localStorage
export const saveToStorage = (key: string, value: any): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  // Get data from localStorage
  export const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored) as T;
        } catch (error) {
          console.error(`Error parsing stored value for key ${key}:`, error);
        }
      }
    }
    return defaultValue;
  };
  
  // Remove data from localStorage
  export const removeFromStorage = (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  };