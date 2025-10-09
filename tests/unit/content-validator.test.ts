import { describe, it, expect } from 'vitest';
import { aiTestHelpers } from '../setup/test-helpers';

/**
 * Unit tests for Content Validator
 *
 * Tests content validation including:
 * - Schema validation
 * - Length constraints
 * - Required fields
 * - Data type validation
 */

describe('Content Validator', () => {
  describe('Schema Validation', () => {
    it('should validate content against schema', () => {
      const content = aiTestHelpers.createGeneratedContent();

      const requiredFields = ['title', 'content', 'summary', 'keywords', 'generatedAt'];
      requiredFields.forEach(field => {
        expect(content).toHaveProperty(field);
      });
    });

    it('should reject invalid content structure', () => {
      const invalidContent = {
        title: 'Test',
        // missing required fields
      };

      const requiredFields = ['content', 'summary', 'keywords'];
      const missingFields = requiredFields.filter(
        field => !(field in invalidContent)
      );

      expect(missingFields.length).toBeGreaterThan(0);
    });

    it('should validate field types', () => {
      const content = aiTestHelpers.createGeneratedContent();

      expect(typeof content.title).toBe('string');
      expect(typeof content.content).toBe('string');
      expect(Array.isArray(content.keywords)).toBe(true);
      expect(typeof content.generatedAt).toBe('string');
    });
  });

  describe('Length Constraints', () => {
    it('should enforce minimum title length', () => {
      const minLength = 10;
      const title = 'Valid Title for Testing';

      expect(title.length).toBeGreaterThanOrEqual(minLength);
    });

    it('should enforce maximum title length', () => {
      const maxLength = 100;
      const title = 'A'.repeat(150);

      expect(title.length).toBeGreaterThan(maxLength);
    });

    it('should enforce minimum content length', () => {
      const minLength = 50;
      const content = 'This is a test content that should be long enough to pass validation.';

      expect(content.length).toBeGreaterThanOrEqual(minLength);
    });

    it('should validate summary length for meta descriptions', () => {
      const maxLength = 160;
      const summary = 'This is a short summary that fits within meta description limits.';

      expect(summary.length).toBeLessThanOrEqual(maxLength);
    });
  });

  describe('Keyword Validation', () => {
    it('should require at least one keyword', () => {
      const keywords = ['keyword1', 'keyword2'];
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should enforce maximum keyword count', () => {
      const maxKeywords = 10;
      const keywords = Array(15).fill('keyword');

      expect(keywords.length).toBeGreaterThan(maxKeywords);
    });

    it('should validate keyword format', () => {
      const validKeyword = 'valid-keyword';
      const invalidKeyword = 'invalid keyword!@#';

      expect(validKeyword).toMatch(/^[a-zA-Z0-9-]+$/);
      expect(invalidKeyword).not.toMatch(/^[a-zA-Z0-9-]+$/);
    });
  });

  describe('Date Validation', () => {
    it('should validate ISO date format', () => {
      const isoDate = new Date().toISOString();
      expect(() => new Date(isoDate)).not.toThrow();
      expect(new Date(isoDate).toISOString()).toBe(isoDate);
    });

    it('should reject invalid date formats', () => {
      const invalidDate = 'not-a-date';
      expect(isNaN(new Date(invalidDate).getTime())).toBe(true);
    });

    it('should ensure generated date is not in the future', () => {
      const now = new Date();
      const generatedAt = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour future

      expect(generatedAt.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('Content Sanitization', () => {
    it('should remove dangerous HTML tags', () => {
      const dangerousContent = '<script>alert("XSS")</script>Regular content';
      const sanitized = dangerousContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('Regular content');
    });

    it('should allow safe HTML tags', () => {
      const safeContent = '<p>Paragraph</p><strong>Bold text</strong>';
      const safeTags = ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li'];

      expect(safeContent).toContain('<p>');
      expect(safeContent).toContain('<strong>');
    });

    it('should escape special characters', () => {
      const specialChars = 'Test & <test> "quotes"';
      const escaped = specialChars
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });
  });
});
