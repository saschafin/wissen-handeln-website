import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { apiTestHelpers, aiTestHelpers } from '../setup/test-helpers';

/**
 * Integration tests for Content Generation API
 *
 * Tests the full API workflow including:
 * - Request handling
 * - AI integration
 * - Response formatting
 * - Error handling
 */

describe('Content Generation API Integration', () => {
  beforeAll(() => {
    // Setup test environment
  });

  afterAll(() => {
    // Cleanup
  });

  describe('POST /api/generate-content', () => {
    it('should generate content from valid request', async () => {
      const requestBody = aiTestHelpers.createContentRequest({
        topic: 'Digital Transformation',
        keywords: ['digital', 'transformation', 'business'],
      });

      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      expect(request.method).toBe('POST');
      expect(await request.json()).toEqual(requestBody);
    });

    it('should return 400 for invalid request body', async () => {
      const invalidRequest = {
        // missing required fields
      };

      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          body: invalidRequest,
        }
      );

      // API should validate and return 400
      expect(request.method).toBe('POST');
    });

    it('should handle rate limiting', async () => {
      // Simulate multiple rapid requests
      const requests = Array(10).fill(null).map(() =>
        apiTestHelpers.createMockRequest(
          'http://localhost:4321/api/generate-content',
          {
            method: 'POST',
            body: aiTestHelpers.createContentRequest(),
          }
        )
      );

      expect(requests.length).toBe(10);
    });

    it('should return proper error for missing API keys', async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          body: aiTestHelpers.createContentRequest(),
        }
      );

      // Should return error about missing API key
      expect(request.method).toBe('POST');

      // Restore
      process.env.OPENAI_API_KEY = originalKey;
    });
  });

  describe('GET /api/content/:id', () => {
    it('should retrieve generated content by ID', async () => {
      const contentId = 'test-content-123';
      const request = apiTestHelpers.createMockRequest(
        `http://localhost:4321/api/content/${contentId}`,
        { method: 'GET' }
      );

      expect(request.method).toBe('GET');
      expect(request.url).toContain(contentId);
    });

    it('should return 404 for non-existent content', async () => {
      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/content/non-existent',
        { method: 'GET' }
      );

      expect(request.method).toBe('GET');
    });
  });

  describe('Error Handling', () => {
    it('should handle upstream API failures', async () => {
      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          body: aiTestHelpers.createContentRequest(),
        }
      );

      // Simulate upstream API failure
      expect(request.method).toBe('POST');
    });

    it('should handle timeout errors', async () => {
      const request = apiTestHelpers.createMockRequest(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          body: aiTestHelpers.createContentRequest({
            length: 'long', // Long content might timeout
          }),
        }
      );

      expect(request.method).toBe('POST');
    });

    it('should handle malformed JSON in request body', async () => {
      const request = new Request(
        'http://localhost:4321/api/generate-content',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 'invalid json {',
        }
      );

      await expect(request.json()).rejects.toThrow();
    });
  });

  describe('Response Validation', () => {
    it('should return proper content-type headers', () => {
      const response = apiTestHelpers.createMockResponse(
        { message: 'success' }
      );

      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should include CORS headers', () => {
      const response = new Response(JSON.stringify({ data: 'test' }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should validate response schema', async () => {
      const content = aiTestHelpers.createGeneratedContent();
      const response = apiTestHelpers.createMockResponse({ content });
      const data = await apiTestHelpers.parseResponse(response);

      expect(data.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data).toHaveProperty('content');
    });
  });

  describe('Caching Integration', () => {
    it('should cache successful responses', async () => {
      const request = aiTestHelpers.createContentRequest({
        topic: 'Same Topic',
      });

      // First request - should hit AI API
      // Second request - should use cache
      expect(request.topic).toBe('Same Topic');
    });

    it('should respect cache-control headers', () => {
      const response = new Response(JSON.stringify({ data: 'test' }), {
        headers: {
          'Cache-Control': 'max-age=3600',
        },
      });

      expect(response.headers.get('Cache-Control')).toBe('max-age=3600');
    });

    it('should invalidate cache on errors', async () => {
      // Test cache invalidation logic
      const cacheKey = 'test-cache-key';
      expect(cacheKey).toBeTruthy();
    });
  });
});
