import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

/**
 * Global test setup for Vitest
 * Runs before all tests
 */

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';

  // Mock environment variables that might be needed
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
  process.env.PUBLIC_SITE_URL = 'http://localhost:4321';
});

afterAll(() => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

/**
 * Global test utilities
 */
export const testUtils = {
  /**
   * Wait for a condition to be true
   */
  waitFor: async (
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
    interval = 100
  ): Promise<void> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error(`Timeout waiting for condition after ${timeout}ms`);
  },

  /**
   * Create a mock API response
   */
  mockApiResponse: <T>(data: T, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  }),

  /**
   * Create a mock fetch function
   */
  mockFetch: (responses: Map<string, any>) => {
    return vi.fn((url: string) => {
      const response = responses.get(url);
      if (!response) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: 'Not found' }),
        });
      }
      return Promise.resolve(response);
    });
  },
};

// Make utilities globally available
globalThis.testUtils = testUtils;

type TestUtils = typeof testUtils;

// Type declarations
declare global {
  // eslint-disable-next-line no-var
  var testUtils: TestUtils;
}
