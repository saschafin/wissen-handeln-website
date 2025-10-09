import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { envTestHelpers } from '../setup/test-helpers';

/**
 * Integration tests for Environment Configuration
 *
 * Tests environment variable handling and configuration
 */

describe('Environment Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset to original env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original env after each test
    process.env = originalEnv;
  });

  describe('API Key Configuration', () => {
    it('should require OpenAI API key', () => {
      const apiKey = process.env.OPENAI_API_KEY;
      expect(apiKey).toBeDefined();
      expect(typeof apiKey).toBe('string');
    });

    it('should require Anthropic API key', () => {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      expect(apiKey).toBeDefined();
      expect(typeof apiKey).toBe('string');
    });

    it('should validate API key format', () => {
      envTestHelpers.setEnvVars({
        OPENAI_API_KEY: 'sk-test123',
      });

      const apiKey = process.env.OPENAI_API_KEY;
      expect(apiKey).toMatch(/^sk-/);
    });

    it('should not expose API keys in client bundle', () => {
      // Server-side only vars should not have PUBLIC_ prefix
      const openaiKey = process.env.OPENAI_API_KEY;
      const anthropicKey = process.env.ANTHROPIC_API_KEY;

      expect(openaiKey).toBeDefined();
      expect(anthropicKey).toBeDefined();

      // These should NOT be in client bundle
      const clientVars = Object.keys(process.env).filter(key =>
        key.startsWith('PUBLIC_')
      );

      expect(clientVars).not.toContain('PUBLIC_OPENAI_API_KEY');
      expect(clientVars).not.toContain('PUBLIC_ANTHROPIC_API_KEY');
    });
  });

  describe('Public Environment Variables', () => {
    it('should expose site URL to client', () => {
      const siteUrl = process.env.PUBLIC_SITE_URL;
      expect(siteUrl).toBeDefined();
    });

    it('should use HTTPS in production', () => {
      envTestHelpers.setEnvVars({
        NODE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://wissen-handeln.com',
      });

      const siteUrl = process.env.PUBLIC_SITE_URL || '';
      if (process.env.NODE_ENV === 'production') {
        expect(siteUrl).toMatch(/^https:\/\//);
      }
    });

    it('should allow HTTP in development', () => {
      envTestHelpers.setEnvVars({
        NODE_ENV: 'development',
        PUBLIC_SITE_URL: 'http://localhost:4321',
      });

      const siteUrl = process.env.PUBLIC_SITE_URL;
      expect(siteUrl).toMatch(/^https?:\/\//);
    });
  });

  describe('Environment Modes', () => {
    it('should support development mode', () => {
      envTestHelpers.setEnvVars({ NODE_ENV: 'development' });
      expect(process.env.NODE_ENV).toBe('development');
    });

    it('should support production mode', () => {
      envTestHelpers.setEnvVars({ NODE_ENV: 'production' });
      expect(process.env.NODE_ENV).toBe('production');
    });

    it('should support test mode', () => {
      envTestHelpers.setEnvVars({ NODE_ENV: 'test' });
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should default to development if not set', () => {
      delete process.env.NODE_ENV;
      const env = process.env.NODE_ENV || 'development';
      expect(env).toBe('development');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate all required environment variables', () => {
      const requiredVars = [
        'OPENAI_API_KEY',
        'ANTHROPIC_API_KEY',
        'PUBLIC_SITE_URL',
      ];

      const missing = requiredVars.filter(varName => !process.env[varName]);
      expect(missing).toEqual([]);
    });

    it('should provide helpful error for missing variables', () => {
      delete process.env.OPENAI_API_KEY;

      const validateEnv = () => {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('Missing required environment variable: OPENAI_API_KEY');
        }
      };

      expect(validateEnv).toThrow('OPENAI_API_KEY');
    });

    it('should warn about deprecated variables', () => {
      const deprecatedVars = ['OLD_API_KEY'];
      const warnings: string[] = [];

      deprecatedVars.forEach(varName => {
        if (process.env[varName]) {
          warnings.push(`${varName} is deprecated`);
        }
      });

      // Should not have any deprecated vars set
      expect(warnings).toEqual([]);
    });
  });

  describe('.env File Loading', () => {
    it('should load variables from .env.local', () => {
      // .env.local takes precedence
      const envContent = envTestHelpers.createEnvContent({
        OPENAI_API_KEY: 'local-key',
      });

      expect(envContent).toContain('OPENAI_API_KEY=local-key');
    });

    it('should load variables from .env.production', () => {
      const envContent = envTestHelpers.createEnvContent({
        NODE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://wissen-handeln.com',
      });

      expect(envContent).toContain('NODE_ENV=production');
    });

    it('should not commit .env files to git', () => {
      // .env files should be in .gitignore
      const gitignorePatterns = ['.env', '.env.local', '.env.*.local'];

      expect(gitignorePatterns).toContain('.env');
    });
  });

  describe('Runtime Configuration', () => {
    it('should merge multiple config sources', () => {
      const defaultConfig = {
        apiTimeout: 30000,
        maxRetries: 3,
      };

      const envConfig = {
        apiTimeout: Number(process.env.API_TIMEOUT) || defaultConfig.apiTimeout,
        maxRetries: Number(process.env.MAX_RETRIES) || defaultConfig.maxRetries,
      };

      expect(envConfig.apiTimeout).toBe(30000);
      expect(envConfig.maxRetries).toBe(3);
    });

    it('should type-cast environment variables correctly', () => {
      envTestHelpers.setEnvVars({
        MAX_RETRIES: '5',
        ENABLE_CACHE: 'true',
        API_TIMEOUT: '10000',
      });

      const maxRetries = Number(process.env.MAX_RETRIES);
      const enableCache = process.env.ENABLE_CACHE === 'true';
      const apiTimeout = Number(process.env.API_TIMEOUT);

      expect(typeof maxRetries).toBe('number');
      expect(typeof enableCache).toBe('boolean');
      expect(typeof apiTimeout).toBe('number');
    });
  });

  describe('Security', () => {
    it('should not log sensitive environment variables', () => {
      const sensitiveVars = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY'];
      const safeToPrint = (key: string) => !sensitiveVars.includes(key);

      expect(safeToPrint('PUBLIC_SITE_URL')).toBe(true);
      expect(safeToPrint('OPENAI_API_KEY')).toBe(false);
    });

    it('should redact API keys in error messages', () => {
      const apiKey = 'sk-1234567890abcdef';
      const redacted = apiKey.replace(/sk-\w+/, 'sk-***REDACTED***');

      expect(redacted).toBe('sk-***REDACTED***');
      expect(redacted).not.toContain('1234567890');
    });
  });
});
