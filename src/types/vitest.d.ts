// This adds additional type compatibility for Vitest mocking
import 'vitest';

// Augment the Jest namespace to include the mocked utility type
declare global {
  namespace jest {
    // Add the Mocked utility type that's used in the tests
    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: any[]) => any
        ? ReturnType<T[P]> extends Promise<any>
          ? vi.MockInstance<(...args: Parameters<T[P]>) => ReturnType<T[P]>>
          : vi.MockInstance<(...args: Parameters<T[P]>) => ReturnType<T[P]>>
        : T[P] extends object
        ? Mocked<T[P]>
        : T[P]
    };
  }
}

// Ensure this is treated as a module
export {};