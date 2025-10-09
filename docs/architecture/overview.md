# Architecture Overview

Comprehensive architectural documentation for the Wissen & Handeln website.

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability & Performance](#scalability--performance)

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │   Admin UI   │  │   Mobile     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                      API Gateway                              │
│                   (Rate Limiting, Auth)                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
│  Content Service │ │  AI Service  │ │  User Service    │
│  - Pages         │ │  - Claude AI │ │  - Auth          │
│  - Blog Posts    │ │  - Generation│ │  - Profiles      │
│  - Media         │ │  - SEO Opt   │ │  - Permissions   │
└─────────┬────────┘ └──────┬──────┘ └─────────┬────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                       Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │   Storage    │      │
│  │  (Primary)   │  │   (Cache)    │  │   (S3/GCS)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Project Root
├── Client Layer
│   ├── Web Application (Next.js/React)
│   ├── Admin Dashboard
│   └── API Client SDK
│
├── Application Layer
│   ├── API Endpoints
│   │   ├── Content Management
│   │   ├── AI Generation
│   │   └── User Management
│   │
│   ├── Services
│   │   ├── Content Service
│   │   ├── AI Service (Claude Integration)
│   │   ├── User Service
│   │   └── Email Service
│   │
│   └── Middleware
│       ├── Authentication
│       ├── Authorization
│       ├── Rate Limiting
│       └── Error Handling
│
├── Business Logic Layer
│   ├── Domain Models
│   ├── Business Rules
│   ├── Validation Logic
│   └── Workflows
│
├── Data Access Layer
│   ├── Database Repositories
│   ├── Cache Layer
│   ├── File Storage
│   └── External APIs
│
└── Infrastructure Layer
    ├── Database (PostgreSQL)
    ├── Cache (Redis)
    ├── Storage (S3/Local)
    ├── Queue (Bull/RabbitMQ)
    └── Monitoring (Sentry)
```

## Technology Stack

### Frontend (if applicable)

**Framework**: Next.js 14 / React 18

**UI Components**:
- Tailwind CSS for styling
- Headless UI for accessible components
- React Hook Form for forms
- Zod for validation

**State Management**:
- React Context for global state
- SWR/React Query for data fetching
- Zustand for complex state (if needed)

### Backend

**Framework**:
- Node.js with Express/Fastify, or
- Python with Django/FastAPI

**API Layer**:
- RESTful API architecture
- GraphQL (optional)
- JSON API specification

**Authentication**:
- JWT tokens
- Session-based auth (optional)
- OAuth 2.0 (social login)

### Database

**Primary Database**: PostgreSQL 15+
- Relational data storage
- Full-text search
- JSON support for flexible data

**Schema Design**:
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'blog', 'page', etc.
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    author_id UUID REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AI generations tracking
CREATE TABLE ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    prompt TEXT NOT NULL,
    result TEXT,
    tokens_used INTEGER,
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Caching

**Redis**:
- Session storage
- API response caching
- Rate limiting counters
- Queue management

**Cache Strategy**:
- Cache-aside pattern
- TTL-based expiration
- Cache invalidation on updates

### AI Integration

**Anthropic Claude API**:
- Model: Claude 3 Sonnet (default)
- Purpose: Content generation, optimization
- Rate limiting: Configured per tier

**Integration Pattern**:
```typescript
// Service layer abstraction
interface AIService {
  generateContent(prompt: string, options: GenerationOptions): Promise<string>;
  optimizeSEO(content: string, keywords: string[]): Promise<OptimizedContent>;
  translate(content: string, targetLang: string): Promise<string>;
}
```

### File Storage

**Options**:
1. **Local Storage** (development)
2. **AWS S3** (production - recommended)
3. **Google Cloud Storage** (alternative)

**Organization**:
```
storage/
├── uploads/
│   ├── images/
│   ├── documents/
│   └── media/
└── generated/
    ├── thumbnails/
    └── optimized/
```

### Queue System

**Bull Queue** (Node.js) or **Celery** (Python):
- Background job processing
- Scheduled tasks
- Email sending
- Content generation jobs

## Design Patterns

### 1. Repository Pattern

Abstracts data access logic:

```typescript
// Repository interface
interface ContentRepository {
  findById(id: string): Promise<Content | null>;
  findBySlug(slug: string): Promise<Content | null>;
  create(data: CreateContentDTO): Promise<Content>;
  update(id: string, data: UpdateContentDTO): Promise<Content>;
  delete(id: string): Promise<void>;
}

// Implementation
class PostgresContentRepository implements ContentRepository {
  async findById(id: string): Promise<Content | null> {
    const result = await db.query(
      'SELECT * FROM content WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // ... other methods
}
```

### 2. Service Layer Pattern

Encapsulates business logic:

```typescript
// Service layer
class ContentService {
  constructor(
    private contentRepo: ContentRepository,
    private aiService: AIService,
    private cacheService: CacheService
  ) {}

  async createBlogPost(data: CreateBlogPostDTO): Promise<BlogPost> {
    // Validate
    this.validateBlogPostData(data);

    // Generate with AI if needed
    if (data.useAI) {
      data.content = await this.aiService.generateContent(data.topic);
    }

    // Create
    const post = await this.contentRepo.create(data);

    // Cache
    await this.cacheService.invalidate(`blog:${post.slug}`);

    return post;
  }
}
```

### 3. Factory Pattern

For creating complex objects:

```typescript
class AIClientFactory {
  static createClient(model: string): AIClient {
    switch (model) {
      case 'claude-3-opus':
        return new ClaudeOpusClient();
      case 'claude-3-sonnet':
        return new ClaudeSonnetClient();
      default:
        return new ClaudeHaikuClient();
    }
  }
}
```

### 4. Middleware Pattern

For request processing:

```typescript
// Authentication middleware
async function authenticateMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 5. Observer Pattern

For event handling:

```typescript
// Event emitter
class ContentEvents extends EventEmitter {
  onPublish(callback: (content: Content) => void) {
    this.on('content:published', callback);
  }

  emitPublish(content: Content) {
    this.emit('content:published', content);
  }
}

// Usage
contentEvents.onPublish(async (content) => {
  await sendNotification(`New content published: ${content.title}`);
  await updateCache(content);
});
```

## Data Flow

### Content Generation Flow

```
1. User Request
   ↓
2. API Endpoint (/api/content/generate)
   ↓
3. Authentication Middleware
   ↓
4. Rate Limiting Middleware
   ↓
5. Content Service
   ├─→ Validate Input
   ├─→ Check Cache (Redis)
   └─→ AI Service
       ├─→ Claude API
       └─→ Response Processing
   ↓
6. Save to Database (PostgreSQL)
   ↓
7. Update Cache (Redis)
   ↓
8. Return Response to Client
```

### User Authentication Flow

```
1. Login Request (email, password)
   ↓
2. API Endpoint (/api/auth/login)
   ↓
3. User Service
   ├─→ Find user by email
   ├─→ Verify password hash
   └─→ Generate JWT token
   ↓
4. Store session (Redis)
   ↓
5. Return JWT to client
   ↓
6. Client stores JWT (localStorage/cookie)
   ↓
7. Subsequent requests include JWT
   ↓
8. Middleware validates JWT
```

## Security Architecture

### Authentication & Authorization

**JWT-Based Authentication**:
```typescript
// Token structure
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Role-Based Access Control (RBAC)**:
- `admin` - Full access
- `editor` - Content management
- `user` - Basic access

### Security Measures

1. **Input Validation**: Zod/Joi schemas
2. **SQL Injection Prevention**: Parameterized queries
3. **XSS Protection**: Content sanitization
4. **CSRF Protection**: CSRF tokens
5. **Rate Limiting**: Per-IP and per-user
6. **HTTPS Only**: Force SSL/TLS
7. **Security Headers**: Helmet.js

### Environment Security

```bash
# Secrets never in code
ANTHROPIC_API_KEY=from-env-only
DATABASE_URL=from-env-only
SECRET_KEY=from-env-only

# Different secrets per environment
# .env.development
# .env.staging
# .env.production
```

## Scalability & Performance

### Horizontal Scaling

**Stateless Architecture**:
- No server-side session storage (use Redis)
- Load balancer distributes requests
- Multiple application instances

### Caching Strategy

**Multi-Level Caching**:
1. **Browser Cache**: Static assets
2. **CDN Cache**: Images, CSS, JS
3. **Redis Cache**: API responses
4. **Database Query Cache**: Frequent queries

### Database Optimization

**Indexing**:
```sql
-- Frequently queried fields
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_published_at ON content(published_at);
CREATE INDEX idx_users_email ON users(email);
```

**Connection Pooling**:
```typescript
const pool = new Pool({
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Performance Monitoring

**Metrics to Track**:
- Response time (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- Database query time
- AI API latency

**Tools**:
- Application Performance Monitoring (APM)
- Sentry for error tracking
- Prometheus + Grafana for metrics
- Coolify built-in monitoring

## Deployment Architecture

### Coolify Deployment

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline

```
1. Code Push (GitHub)
   ↓
2. Automated Tests (GitHub Actions)
   ↓
3. Build Docker Image
   ↓
4. Push to Registry
   ↓
5. Coolify Deployment
   ↓
6. Health Check
   ↓
7. Traffic Switch (Zero-Downtime)
```

## Future Considerations

### Potential Enhancements

1. **Microservices**: Split into separate services
2. **GraphQL API**: Alternative to REST
3. **WebSockets**: Real-time features
4. **Multi-Region**: Geographic distribution
5. **Machine Learning**: Custom ML models
6. **Mobile Apps**: Native iOS/Android

### Scalability Roadmap

1. **Phase 1**: Single server (current)
2. **Phase 2**: Horizontal scaling with load balancer
3. **Phase 3**: Microservices architecture
4. **Phase 4**: Multi-region deployment

---

## Related Documentation

- [Installation Guide](../setup/installation.md)
- [AI Integration](../development/ai-integration.md)
- [API Documentation](../api/content-generation.md)
- [Deployment Guide](../setup/deployment.md)

---

**Last Updated**: 2025-10-09
