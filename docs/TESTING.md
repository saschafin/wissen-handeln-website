# Testing Strategy for wissen-handeln.com

## Overview

This document outlines the comprehensive testing strategy for the wissen-handeln.com Astro website with AI content generation.

## Test Coverage Goals

- **Overall Coverage**: 90%+
- **Unit Tests**: Core utilities and functions
- **Integration Tests**: API endpoints and AI integrations
- **E2E Tests**: Critical user flows
- **Deployment Tests**: Docker and production configuration

## Test Structure

```
tests/
├── setup/
│   ├── vitest.setup.ts          # Global test configuration
│   └── test-helpers.ts          # Test utility functions
├── unit/
│   ├── ai-content-generator.test.ts   # AI generation tests
│   ├── content-validator.test.ts      # Content validation tests
│   └── astro-components.test.ts       # Component tests
├── integration/
│   ├── api-content-generation.test.ts # API integration tests
│   └── env-config.test.ts            # Environment config tests
├── e2e/
│   └── user-flows.test.ts            # End-to-end user tests
└── deployment/
    └── docker.test.ts                # Deployment tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### E2E with UI
```bash
npm run test:e2e:ui
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual functions and utilities in isolation

**Coverage**:
- AI content generation functions
- Content validation logic
- Utility functions
- Component props validation
- Data transformations

**Example**:
```typescript
describe('AI Content Generator', () => {
  it('should generate content using OpenAI', async () => {
    const result = await generateContent({ topic: 'Test' });
    expect(result).toHaveProperty('content');
  });
});
```

### 2. Integration Tests

**Purpose**: Test interaction between different parts of the system

**Coverage**:
- API endpoint workflows
- AI service integrations
- Environment configuration
- Error handling flows
- Caching mechanisms

**Example**:
```typescript
describe('Content Generation API', () => {
  it('should handle full request/response cycle', async () => {
    const response = await POST('/api/generate-content', data);
    expect(response.status).toBe(200);
  });
});
```

### 3. E2E Tests

**Purpose**: Test complete user workflows in a browser

**Coverage**:
- Homepage navigation
- Content browsing
- Search functionality
- Mobile responsiveness
- Performance metrics
- Accessibility compliance

**Technologies**: Playwright

**Example**:
```typescript
test('should load homepage successfully', async ({ page }) => {
  await page.goto('http://localhost:4321');
  await expect(page).toHaveTitle(/wissen.*handeln/i);
});
```

### 4. Deployment Tests

**Purpose**: Validate deployment configuration and build process

**Coverage**:
- Docker build validation
- Production build optimization
- Environment variable handling
- Container health checks
- Security configurations

## Test Helpers

### AI Test Helpers
```typescript
import { aiTestHelpers } from '../setup/test-helpers';

// Create mock OpenAI client
const mockOpenAI = aiTestHelpers.createMockOpenAI();

// Create sample content request
const request = aiTestHelpers.createContentRequest({
  topic: 'Test Topic',
  keywords: ['test', 'example']
});
```

### Component Test Helpers
```typescript
import { componentTestHelpers } from '../setup/test-helpers';

// Create component props
const props = componentTestHelpers.createComponentProps({
  title: 'Test Title'
});

// Create mock content
const content = componentTestHelpers.createMockContent();
```

### API Test Helpers
```typescript
import { apiTestHelpers } from '../setup/test-helpers';

// Create mock request
const request = apiTestHelpers.createMockRequest(
  'http://localhost:4321/api/test',
  { method: 'POST', body: data }
);

// Parse response
const result = await apiTestHelpers.parseResponse(response);
```

## Coverage Requirements

### Minimum Coverage Thresholds
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Priority Coverage Areas
1. **Critical**: AI content generation (95%+)
2. **High**: API endpoints (90%+)
3. **Medium**: Components (85%+)
4. **Standard**: Utilities (80%+)

## Performance Testing

### Metrics to Monitor
- **Page Load Time**: < 3 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 1 second

### Performance Tests
```typescript
test('should load homepage within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('http://localhost:4321');
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
});
```

## Accessibility Testing

### WCAG 2.1 Level AA Compliance
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- ARIA labels
- Color contrast ratios
- Screen reader compatibility

### Accessibility Tests
```typescript
test('should have proper heading hierarchy', async ({ page }) => {
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBe(1); // Only one h1 per page
});
```

## Security Testing

### Security Checks
- XSS prevention
- SQL injection prevention
- CSRF protection
- Secure headers
- API key protection
- Input sanitization

### Security Tests
```typescript
it('should prevent SQL injection', async () => {
  const maliciousInput = "'; DROP TABLE users; --";
  const response = await api.get(`/users?name=${maliciousInput}`);
  expect(response.status).not.toBe(500);
});
```

## Continuous Integration

### CI/CD Pipeline
1. **Install Dependencies**: `npm ci`
2. **Type Check**: `npm run typecheck`
3. **Lint**: `npm run lint`
4. **Unit Tests**: `npm run test:unit`
5. **Integration Tests**: `npm run test:integration`
6. **Build**: `npm run build`
7. **E2E Tests**: `npm run test:e2e`
8. **Coverage Report**: `npm run test:coverage`

### Quality Gates
- All tests must pass
- Coverage must meet minimum thresholds
- No TypeScript errors
- No linting errors
- Build must succeed

## Best Practices

### Test Writing Guidelines
1. **Descriptive Names**: Test names should clearly describe what is being tested
2. **Arrange-Act-Assert**: Structure tests in three clear phases
3. **Isolation**: Tests should not depend on each other
4. **One Assertion**: Each test should verify one behavior
5. **Mock External Dependencies**: Keep tests fast and reliable
6. **Clean Up**: Always clean up after tests

### Example Test Structure
```typescript
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Arrange
  });

  it('should do something specific', () => {
    // Arrange
    const input = createTestData();

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expectedValue);
  });

  // Cleanup
  afterEach(() => {
    // Clean up
  });
});
```

## Troubleshooting

### Common Issues

**Tests failing locally but passing in CI**
- Check Node version compatibility
- Verify environment variables are set
- Clear cache: `npm run test:coverage -- --clearCache`

**Slow test execution**
- Use `test.only()` to run specific tests
- Increase timeout for specific tests
- Check for unnecessary async operations

**Flaky E2E tests**
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use data-testid attributes for reliable selectors
- Increase timeout values

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)

## Coordination with Hive Mind

This test suite is designed to work with the Hive Mind collective intelligence system:

### Before Implementation
- Tests define the expected behavior (TDD approach)
- Coder can implement against these test specifications
- Clear contract between tester and coder agents

### During Development
- Tests serve as living documentation
- Immediate feedback on implementation correctness
- Coverage metrics track progress

### After Implementation
- Tests verify all requirements are met
- Regression prevention for future changes
- Quality assurance before deployment
