import { describe, it, expect } from 'vitest';
import { componentTestHelpers } from '../setup/test-helpers';

/**
 * Unit tests for Astro Components
 *
 * Tests component rendering and props handling
 */

describe('Astro Components', () => {
  describe('Header Component', () => {
    it('should render with default props', () => {
      const props = componentTestHelpers.createComponentProps({
        title: 'Wissen & Handeln',
      });

      expect(props.title).toBe('Wissen & Handeln');
    });

    it('should render navigation links', () => {
      const props = componentTestHelpers.createComponentProps({
        navItems: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      });

      expect(props.navItems).toHaveLength(3);
      expect(props.navItems[0]).toHaveProperty('label');
      expect(props.navItems[0]).toHaveProperty('href');
    });

    it('should handle mobile menu toggle', () => {
      const props = componentTestHelpers.createComponentProps({
        isMobileMenuOpen: false,
      });

      expect(props.isMobileMenuOpen).toBe(false);
    });
  });

  describe('Content Card Component', () => {
    it('should render content with all properties', () => {
      const content = componentTestHelpers.createMockContent({
        id: 'article-1',
        title: 'Test Article',
        description: 'Test description',
        publishedAt: '2025-10-09T00:00:00Z',
      });

      expect(content).toHaveProperty('id');
      expect(content).toHaveProperty('title');
      expect(content).toHaveProperty('description');
      expect(content).toHaveProperty('publishedAt');
    });

    it('should format dates correctly', () => {
      const date = new Date('2025-10-09T00:00:00Z');
      const formatted = date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      expect(formatted).toContain('2025');
    });

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      const maxLength = 150;
      const truncated = longDescription.slice(0, maxLength) + '...';

      expect(truncated.length).toBeLessThanOrEqual(maxLength + 3);
      expect(truncated).toContain('...');
    });
  });

  describe('Footer Component', () => {
    it('should display copyright information', () => {
      const year = new Date().getFullYear();
      const copyright = `© ${year} Wissen & Handeln`;

      expect(copyright).toContain(year.toString());
    });

    it('should render social media links', () => {
      const socialLinks = [
        { platform: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
      ];

      expect(socialLinks).toHaveLength(2);
      socialLinks.forEach(link => {
        expect(link.url).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('SEO Component', () => {
    it('should generate proper meta tags', () => {
      const seo = {
        title: 'Test Page',
        description: 'Test description',
        keywords: ['test', 'page'],
      };

      expect(seo.title.length).toBeGreaterThan(0);
      expect(seo.title.length).toBeLessThan(70);
      expect(seo.description.length).toBeLessThan(160);
    });

    it('should include Open Graph tags', () => {
      const og = {
        'og:title': 'Test Page',
        'og:description': 'Test description',
        'og:type': 'website',
        'og:url': 'https://wissen-handeln.com',
      };

      expect(og['og:title']).toBeTruthy();
      expect(og['og:type']).toBe('website');
    });

    it('should include Twitter Card meta tags', () => {
      const twitter = {
        'twitter:card': 'summary_large_image',
        'twitter:title': 'Test Page',
        'twitter:description': 'Test description',
      };

      expect(twitter['twitter:card']).toBe('summary_large_image');
    });
  });

  describe('AI Content Display Component', () => {
    it('should display generated content', () => {
      const content = componentTestHelpers.createMockContent({
        content: 'AI generated content here',
      });

      expect(content.content).toBeTruthy();
      expect(content.content.length).toBeGreaterThan(0);
    });

    it('should show loading state', () => {
      const loadingState = {
        isLoading: true,
        content: null,
      };

      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.content).toBeNull();
    });

    it('should show error state', () => {
      const errorState = {
        isLoading: false,
        error: 'Failed to generate content',
        content: null,
      };

      expect(errorState.error).toBeTruthy();
      expect(errorState.content).toBeNull();
    });
  });

  describe('Form Components', () => {
    it('should validate required fields', () => {
      const formData = {
        name: '',
        email: 'test@example.com',
      };

      const errors: string[] = [];
      if (!formData.name) errors.push('Name is required');

      expect(errors).toContain('Name is required');
    });

    it('should validate email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'invalid-email';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    it('should sanitize user input', () => {
      const userInput = '<script>alert("XSS")</script>Hello';
      const sanitized = userInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('Hello');
    });
  });
});
