/**
 * Test helper functions for creating test data and mocks
 */

import { vi } from 'vitest';

/**
 * AI Content Generation Test Helpers
 */
export const aiTestHelpers = {
  /**
   * Create mock OpenAI client
   */
  createMockOpenAI: () => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Generated content from OpenAI',
                role: 'assistant',
              },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        }),
      },
    },
  }),

  /**
   * Create mock Anthropic client
   */
  createMockAnthropic: () => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'Generated content from Claude',
          },
        ],
        role: 'assistant',
        stop_reason: 'end_turn',
        usage: {
          input_tokens: 10,
          output_tokens: 20,
        },
      }),
    },
  }),

  /**
   * Create sample content request
   */
  createContentRequest: (overrides = {}) => ({
    topic: 'Test Topic',
    keywords: ['keyword1', 'keyword2'],
    tone: 'professional' as const,
    length: 'medium' as const,
    ...overrides,
  }),

  /**
   * Create sample generated content
   */
  createGeneratedContent: (overrides = {}) => ({
    title: 'Test Article Title',
    content: 'This is test article content with multiple paragraphs.',
    summary: 'Test summary',
    keywords: ['keyword1', 'keyword2'],
    generatedAt: new Date().toISOString(),
    ...overrides,
  }),
};

/**
 * Component Test Helpers
 */
export const componentTestHelpers = {
  /**
   * Create mock Astro component props
   */
  createComponentProps: <T extends Record<string, any>>(props: T): T => props,

  /**
   * Create mock content data
   */
  createMockContent: (overrides = {}) => ({
    id: 'test-1',
    title: 'Test Content',
    description: 'Test description',
    content: 'Test content body',
    publishedAt: new Date().toISOString(),
    ...overrides,
  }),
};

/**
 * API Test Helpers
 */
export const apiTestHelpers = {
  /**
   * Create mock Request object
   */
  createMockRequest: (
    url: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ) => {
    const { method = 'GET', headers = {}, body } = options;
    return new Request(url, {
      method,
      headers: new Headers(headers),
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * Create mock response
   */
  createMockResponse: (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Parse response JSON
   */
  parseResponse: async (response: Response) => {
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  },
};

/**
 * Environment Test Helpers
 */
export const envTestHelpers = {
  /**
   * Set test environment variables
   */
  setEnvVars: (vars: Record<string, string>) => {
    Object.entries(vars).forEach(([key, value]) => {
      process.env[key] = value;
    });
  },

  /**
   * Clear environment variables
   */
  clearEnvVars: (keys: string[]) => {
    keys.forEach(key => {
      delete process.env[key];
    });
  },

  /**
   * Create env file content for testing
   */
  createEnvContent: (vars: Record<string, string>): string => {
    return Object.entries(vars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  },
};

/**
 * Performance Test Helpers
 */
export const performanceTestHelpers = {
  /**
   * Measure execution time
   */
  measureTime: async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
  },

  /**
   * Assert performance threshold
   */
  assertPerformance: async <T>(
    fn: () => Promise<T>,
    maxDurationMs: number
  ): Promise<T> => {
    const { result, duration } = await performanceTestHelpers.measureTime(fn);
    if (duration > maxDurationMs) {
      throw new Error(
        `Performance threshold exceeded: ${duration.toFixed(2)}ms > ${maxDurationMs}ms`
      );
    }
    return result;
  },
};

/**
 * File System Test Helpers
 */
export const fsTestHelpers = {
  /**
   * Create temporary directory path
   */
  getTempDir: (): string => {
    return `/tmp/test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  },

  /**
   * Create mock file data
   */
  createMockFile: (name: string, content: string, type = 'text/plain') => ({
    name,
    content,
    type,
    size: content.length,
  }),
};
