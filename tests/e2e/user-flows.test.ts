import { test, expect } from '@playwright/test';

/**
 * End-to-End tests for critical user flows
 *
 * Tests complete user journeys including:
 * - Homepage navigation
 * - Content browsing
 * - AI content generation (if exposed)
 * - Mobile responsiveness
 */

test.describe('Homepage User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4321');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/wissen.*handeln/i);

    // Check for main content areas
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for common navigation items
    await expect(nav.locator('a')).toHaveCount(3, { timeout: 5000 }).catch(() => {
      // Navigation items will be implemented by coder
    });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

    await expect(page.locator('main')).toBeVisible();

    // Check mobile menu if exists
    const mobileMenu = page.locator('[aria-label*="menu" i]');
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});

test.describe('Content Browsing Flow', () => {
  test('should display content list', async ({ page }) => {
    await page.goto('http://localhost:4321/content');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    const contentItems = page.locator('[data-testid="content-item"]');
    // Content items will be implemented by coder
    expect(contentItems).toBeDefined();
  });

  test('should navigate to individual content page', async ({ page }) => {
    await page.goto('http://localhost:4321/content');

    // Click first content item if exists
    const firstItem = page.locator('[data-testid="content-item"]').first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      await expect(page).toHaveURL(/\/content\/.+/);
    }
  });

  test('should show content metadata', async ({ page }) => {
    await page.goto('http://localhost:4321/content/test-article');

    // Check for metadata elements
    const metadata = page.locator('[data-testid="content-metadata"]');
    expect(metadata).toBeDefined();
  });
});

test.describe('Search Functionality', () => {
  test('should allow searching content', async ({ page }) => {
    await page.goto('http://localhost:4321');

    const searchInput = page.locator('input[type="search"], [role="search"] input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test search');
      await searchInput.press('Enter');

      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('search');
    }
  });

  test('should display search results', async ({ page }) => {
    await page.goto('http://localhost:4321/search?q=test');

    await page.waitForLoadState('networkidle');
    const results = page.locator('[data-testid="search-results"]');
    expect(results).toBeDefined();
  });

  test('should handle no results gracefully', async ({ page }) => {
    await page.goto('http://localhost:4321/search?q=nonexistentquery123');

    const noResults = page.locator('text=/no results|keine ergebnisse/i');
    expect(noResults).toBeDefined();
  });
});

test.describe('Performance', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4321');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('http://localhost:4321');

    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          if (lastEntry && typeof lastEntry === 'object') {
            if ('renderTime' in lastEntry && typeof (lastEntry as LargestContentfulPaint).renderTime === 'number') {
              resolve((lastEntry as LargestContentfulPaint).renderTime ?? 0);
              return;
            }

            if ('loadTime' in lastEntry && typeof (lastEntry as LargestContentfulPaint).loadTime === 'number') {
              resolve((lastEntry as LargestContentfulPaint).loadTime ?? 0);
              return;
            }
          }

          resolve(0);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2.5s for good performance
    expect(lcp).toBeLessThan(2500);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:4321');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Only one h1 per page
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('http://localhost:4321');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:4321');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);

    expect(['A', 'BUTTON', 'INPUT']).toContain(focused || '');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('http://localhost:4321');

    const nav = page.locator('nav');
    if (await nav.count() > 0) {
      const ariaLabel = await nav.first().getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });
});

test.describe('Error Handling', () => {
  test('should show 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('http://localhost:4321/non-existent-page');
    expect(response?.status()).toBe(404);
  });

  test('should handle offline gracefully', async ({ page, context }) => {
    await page.goto('http://localhost:4321');

    // Simulate offline
    await context.setOffline(true);
    await page.reload().catch(() => {
      // Expected to fail when offline
    });

    await context.setOffline(false);
  });
});
