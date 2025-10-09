# Contributing Guidelines

Welcome! This guide will help you contribute effectively to the Wissen & Handeln website project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Using Claude Flow](#using-claude-flow)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Completed Installation**: Follow [Installation Guide](../setup/installation.md)
2. **Reviewed Architecture**: Read [Architecture Overview](../architecture/overview.md)
3. **Understanding of SPARC**: Familiarize yourself with SPARC methodology
4. **Claude Flow Setup**: Configure Claude Flow and Hive Mind

### Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/wissen-handeln-website.git
cd wissen-handeln-website

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/wissen-handeln-website.git

# Verify remotes
git remote -v
```

### Set Up Development Environment

```bash
# Install dependencies
npm install  # or pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit with your credentials
nano .env

# Initialize Claude Flow
npx claude-flow@alpha hive-mind init

# Run tests to verify setup
npm test
```

## Development Workflow

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# For bug fixes:
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### 2. Use SPARC Methodology

Follow SPARC phases for systematic development:

```bash
# 1. Specification - Define requirements
npx claude-flow@alpha sparc run spec-pseudocode "your feature description"

# 2. Architecture - Design system
npx claude-flow@alpha sparc run architect "your feature"

# 3. Refinement - TDD implementation
npx claude-flow@alpha sparc tdd "your feature"

# 4. Completion - Integration
npx claude-flow@alpha sparc run integration "your feature"
```

### 3. Use Hive Mind for Complex Tasks

For multi-agent coordination:

```bash
# Spawn coordinated agents
npx claude-flow@alpha hive-mind spawn "Implement user authentication system with JWT"

# Check swarm status
npx claude-flow@alpha hive-mind status

# View collective memory
npx claude-flow@alpha memory query "authentication"
```

### 4. Implement Changes

Write code following project standards:

```typescript
// Example: Well-structured component
/**
 * User authentication component
 * @module components/auth
 */

import { useAuth } from '@/hooks/useAuth';

interface AuthProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function AuthComponent({ onSuccess, onError }: AuthProps) {
  // Implementation
}
```

### 5. Write Tests

Always write tests before or alongside implementation:

```typescript
// __tests__/components/auth.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthComponent } from '@/components/auth';

describe('AuthComponent', () => {
  it('renders login form', () => {
    render(<AuthComponent onSuccess={() => {}} onError={() => {}} />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const onSuccess = jest.fn();
    render(<AuthComponent onSuccess={onSuccess} onError={() => {}} />);

    // Simulate login
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### 6. Run Tests and Linting

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.test.ts

# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Type checking
npm run typecheck
```

### 7. Commit Changes

Use conventional commit messages:

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add JWT authentication system

- Implement JWT token generation
- Add middleware for token validation
- Create authentication endpoints
- Add comprehensive tests

Closes #123"
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(auth): implement JWT authentication
fix(api): resolve content generation timeout
docs(readme): update installation instructions
test(auth): add integration tests for login
```

## Code Standards

### File Organization

```
src/
├── components/          # React components
│   ├── auth/           # Feature-based grouping
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   └── common/         # Shared components
├── services/           # Business logic
│   ├── auth/
│   └── content/
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
└── config/             # Configuration files
```

### Naming Conventions

```typescript
// Files: kebab-case
auth-service.ts
user-profile.tsx

// Components: PascalCase
export function UserProfile() {}

// Functions/Variables: camelCase
const getUserData = () => {};
const userEmail = 'user@example.com';

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Interfaces/Types: PascalCase
interface UserData {}
type AuthStatus = 'authenticated' | 'unauthenticated';
```

### Code Style

```typescript
// Use TypeScript for type safety
interface User {
  id: string;
  email: string;
  name: string;
}

// Prefer const over let
const API_KEY = process.env.API_KEY;

// Use arrow functions for consistency
const processUser = (user: User): string => {
  return `${user.name} (${user.email})`;
};

// Destructure for clarity
const { id, email, name } = user;

// Use async/await over promises
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Add JSDoc comments for public APIs
/**
 * Authenticate user with credentials
 * @param email - User email address
 * @param password - User password
 * @returns Authentication token
 * @throws {AuthError} If credentials are invalid
 */
async function authenticate(email: string, password: string): Promise<string> {
  // Implementation
}
```

### File Size Limits

Keep files modular and maintainable:

- **Components**: Max 300 lines
- **Services**: Max 500 lines
- **Utilities**: Max 200 lines

If a file exceeds limits, split into smaller modules.

## Testing Requirements

### Test Coverage

- **Minimum Coverage**: 80%
- **Critical Paths**: 100% coverage required

```bash
# Check coverage
npm test -- --coverage

# Generate coverage report
npm test -- --coverage --coverageReporters=html
open coverage/index.html
```

### Test Types

1. **Unit Tests**: Test individual functions/components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

```typescript
// Unit test
test('formatDate formats date correctly', () => {
  expect(formatDate('2025-01-01')).toBe('January 1, 2025');
});

// Integration test
test('login flow updates user state', async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.login('user@example.com', 'password');
  });

  expect(result.current.user).toBeDefined();
  expect(result.current.isAuthenticated).toBe(true);
});
```

### Testing Best Practices

- Write tests before or alongside code (TDD)
- Test behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Clean up after tests

## Pull Request Process

### 1. Update Your Branch

```bash
# Fetch latest changes
git fetch upstream

# Rebase on main
git rebase upstream/main

# Resolve conflicts if any
git add .
git rebase --continue
```

### 2. Push to Your Fork

```bash
# Push feature branch
git push origin feature/your-feature-name

# Force push after rebase (if needed)
git push origin feature/your-feature-name --force
```

### 3. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Coverage maintained/improved

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### 4. Code Review Process

- Address reviewer feedback promptly
- Push updates to same branch
- Request re-review when ready
- Engage in constructive discussion

### 5. Merge Requirements

Before merging, ensure:

- [ ] All tests pass
- [ ] Code reviewed and approved
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] CHANGELOG updated (if applicable)

## Using Claude Flow

### Coordination Hooks

Use hooks for agent coordination:

```bash
# Before starting work
npx claude-flow@alpha hooks pre-task --description "implement auth"

# After file edits
npx claude-flow@alpha hooks post-edit --file "auth.ts" --memory-key "team/auth/progress"

# After completing task
npx claude-flow@alpha hooks post-task --task-id "auth-implementation"
```

### Memory Management

Share context via memory:

```bash
# Store implementation notes
npx claude-flow@alpha memory store \
  --key "team/auth/decisions" \
  --value "Using JWT with 1-hour expiry"

# Query team decisions
npx claude-flow@alpha memory query "team/auth"

# Share with other developers
npx claude-flow@alpha memory export team-memory.json
```

### Agent Coordination

For complex features, coordinate multiple agents:

```bash
# Spawn specialized agents
npx claude-flow@alpha hive-mind spawn "Build authentication system with:
- JWT token management
- User registration and login
- Password reset flow
- Email verification
- Role-based access control"

# Agents auto-coordinate via memory and hooks
```

## Best Practices Checklist

Development:
- [ ] Follow SPARC methodology
- [ ] Use Hive Mind for complex tasks
- [ ] Write tests first (TDD)
- [ ] Keep files under size limits
- [ ] Add JSDoc comments
- [ ] Use TypeScript types
- [ ] Handle errors gracefully
- [ ] Validate inputs
- [ ] Log appropriately

Git:
- [ ] Use conventional commits
- [ ] Keep commits atomic
- [ ] Write descriptive messages
- [ ] Rebase before PR
- [ ] Resolve conflicts locally

Testing:
- [ ] Write comprehensive tests
- [ ] Maintain 80%+ coverage
- [ ] Test edge cases
- [ ] Mock external services
- [ ] Clean up test data

Documentation:
- [ ] Update relevant docs
- [ ] Add code comments
- [ ] Update API docs
- [ ] Add examples
- [ ] Update CHANGELOG

## Getting Help

- **Documentation**: Check `/docs` directory
- **GitHub Discussions**: Ask questions
- **Claude Flow Docs**: https://github.com/ruvnet/claude-flow
- **Team Chat**: Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Acknowledged in documentation

Thank you for contributing to Wissen & Handeln!

---

**Questions?** Open an issue or reach out to the maintainers.
