# System Architecture Overview
## wissen-handeln.com - AI-Powered Content Platform

### Executive Summary

wissen-handeln.com is a high-performance static site built with Astro, featuring AI-powered content generation capabilities. The system is designed for production deployment on Coolify (173.249.21.101) with Docker containerization, automated builds, and seamless CI/CD integration.

### System Goals

1. **Performance**: Sub-second page loads with optimized static generation
2. **AI Integration**: Seamless content generation using Claude AI APIs
3. **Scalability**: Docker-based architecture for easy horizontal scaling
4. **Maintainability**: Clear separation of concerns with modular architecture
5. **Production-Ready**: Comprehensive monitoring, logging, and error handling

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     External Users                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Coolify (173.249.21.101)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Nginx Reverse Proxy (SSL)                │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                        │
│  ┌───────────────────▼───────────────────────────────────┐  │
│  │         Docker Container: Astro App                   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           Node.js Runtime                       │  │  │
│  │  │  ┌──────────────────────────────────────────┐   │  │  │
│  │  │  │     Astro Static Site Generator          │   │  │  │
│  │  │  │  ┌────────────┐  ┌──────────────────┐    │   │  │  │
│  │  │  │  │   Pages    │  │   Components     │    │   │  │  │
│  │  │  │  └────────────┘  └──────────────────┘    │   │  │  │
│  │  │  │  ┌────────────┐  ┌──────────────────┐    │   │  │  │
│  │  │  │  │   Content  │  │   AI Integration │    │   │  │  │
│  │  │  │  └────────────┘  └──────────────────┘    │   │  │  │
│  │  │  └──────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Claude API    │  │  GitHub API    │  │ Content CDN  │  │
│  │  (Anthropic)   │  │  (Version)     │  │ (Optional)   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core Technology Stack

#### Frontend & Build
- **Framework**: Astro 4.x (Static Site Generator)
- **UI Components**: React/Preact for interactive islands
- **Styling**: TailwindCSS + CSS Modules
- **Type Safety**: TypeScript 5.x
- **Build Tool**: Vite 5.x (bundled with Astro)

#### AI & Content Generation
- **AI Provider**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Content Management**: Markdown + Frontmatter
- **Image Processing**: Sharp for optimization
- **SEO**: Astro SEO integration

#### Deployment & Infrastructure
- **Container**: Docker (multi-stage build)
- **Platform**: Coolify (self-hosted PaaS)
- **Web Server**: Nginx (reverse proxy)
- **SSL**: Let's Encrypt via Coolify
- **CI/CD**: GitHub Actions + Coolify webhooks

#### Storage & Persistence
- **Content Storage**: File-based (Markdown in `/src/content`)
- **Generated Content**: `/src/content/generated` (version controlled)
- **Static Assets**: `/public` directory
- **Cache**: Docker layer caching + Astro build cache

### System Capabilities

#### 1. Content Generation
- AI-powered article generation using Claude API
- Template-based content creation
- SEO-optimized metadata generation
- Automatic tag and category assignment
- Content validation and quality checks

#### 2. Static Site Generation
- Pre-rendered HTML for all pages
- Optimized JavaScript bundles (islands architecture)
- Image optimization and responsive images
- RSS feed generation
- Sitemap generation

#### 3. Performance Optimization
- Route-based code splitting
- CSS purging and minification
- Asset preloading and lazy loading
- Service worker for offline capability
- CDN-ready static assets

#### 4. Developer Experience
- Hot module replacement (HMR) in development
- TypeScript for type safety
- ESLint + Prettier for code quality
- Git-based version control
- Environment-based configuration

### Deployment Architecture

#### Production Environment (Coolify)
```
Coolify Host: 173.249.21.101
├── Docker Network: coolify-network
├── Reverse Proxy: Nginx (Coolify managed)
│   ├── SSL: Let's Encrypt
│   ├── HTTPS redirect
│   └── Static file caching
├── Application Container
│   ├── Image: node:20-alpine
│   ├── Port: 4321 (internal)
│   ├── Volumes:
│   │   ├── /app/dist (build output)
│   │   └── /app/.cache (build cache)
│   └── Environment Variables:
│       ├── ANTHROPIC_API_KEY (secret)
│       ├── NODE_ENV=production
│       └── PUBLIC_SITE_URL=https://wissen-handeln.com
└── Monitoring (Coolify built-in)
    ├── Container health checks
    ├── Resource usage metrics
    └── Application logs
```

#### Build Process
```
1. Git Push → GitHub
2. Webhook → Coolify
3. Coolify pulls latest code
4. Docker multi-stage build:
   a. Install dependencies (cached)
   b. Run type checking
   c. Build Astro site
   d. Generate static assets
   e. Optimize images
5. Deploy new container
6. Health check
7. Traffic switch (zero-downtime)
8. Old container cleanup
```

### Security Architecture

#### Secrets Management
- Environment variables stored in Coolify
- API keys never committed to repository
- `.env.example` for documentation
- Runtime secret validation

#### API Security
- Rate limiting on Claude API calls
- API key rotation strategy
- Error handling without leaking sensitive data
- CORS configuration

#### Container Security
- Non-root user in Docker
- Minimal Alpine base image
- No unnecessary packages
- Regular security updates

### Scalability Considerations

#### Horizontal Scaling
- Stateless application design
- Docker container replication
- Load balancing via Nginx
- CDN integration for static assets

#### Content Scaling
- Incremental static regeneration
- Batch content generation
- Content caching strategies
- Database-free architecture

#### Performance Scaling
- Build-time optimization
- Asset compression (Brotli/Gzip)
- HTTP/2 server push
- Edge caching strategies

### Monitoring & Observability

#### Health Checks
- Docker health check endpoint (`/health`)
- Build success/failure notifications
- Application error logging
- Performance metrics

#### Logging Strategy
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Coolify log aggregation
- Error tracking (optional Sentry integration)

#### Metrics
- Build time tracking
- Page load performance
- AI API usage and costs
- Cache hit rates

### Disaster Recovery

#### Backup Strategy
- Git repository as source of truth
- Docker image versioning
- Content backup in Git
- Coolify configuration export

#### Rollback Procedure
1. Identify failing deployment
2. Coolify rollback to previous version
3. Investigate root cause
4. Fix and redeploy

#### High Availability
- Docker container auto-restart
- Coolify health monitoring
- Automated failover (future: multi-node)

### Development Workflow

```
Developer → Git Push → GitHub
                         ↓
                    GitHub Actions
                    ├── Lint & Type Check
                    ├── Build Test
                    └── Unit Tests
                         ↓
                    Merge to main
                         ↓
                    Coolify Webhook
                         ↓
                    Production Deployment
```

### Data Flow

#### Content Creation Flow
```
1. Content Request (CLI/API)
2. AI Content Generator
   ├── Prompt Engineering
   ├── Claude API Call
   └── Response Parsing
3. Content Validator
   ├── Schema validation
   ├── Quality checks
   └── SEO validation
4. File Writer
   ├── Markdown creation
   ├── Frontmatter metadata
   └── Git commit
5. Build Trigger
6. Static Site Generation
7. Deployment
```

#### Request Flow (Production)
```
User Request
    ↓
Nginx (SSL termination)
    ↓
Route matching
    ↓
Static file serving
    ↓
Browser caching
    ↓
User receives content
```

### Configuration Management

#### Environment Variables
```bash
# Production (Coolify)
ANTHROPIC_API_KEY=sk-ant-***
NODE_ENV=production
PUBLIC_SITE_URL=https://wissen-handeln.com
BUILD_CACHE_ENABLED=true

# Development (Local)
ANTHROPIC_API_KEY=sk-ant-***
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:4321
BUILD_CACHE_ENABLED=false
```

#### Configuration Files
- `astro.config.mjs` - Astro configuration
- `tailwind.config.cjs` - TailwindCSS
- `tsconfig.json` - TypeScript
- `Dockerfile` - Container definition
- `.coolify.json` - Coolify deployment config

### Future Enhancements

#### Phase 2 Features
- Database integration (PostgreSQL) for analytics
- User authentication system
- Comment system
- Newsletter integration
- Search functionality (Algolia/Meilisearch)

#### Advanced AI Features
- Multi-language content generation
- Content personalization
- Image generation integration
- Automated content updates
- A/B testing for content variants

#### Infrastructure Improvements
- Multi-region deployment
- CDN integration (Cloudflare)
- Advanced caching strategies
- GraphQL API layer
- Real-time analytics

### Success Metrics

#### Performance KPIs
- Page load time: < 1s (LCP)
- Time to Interactive: < 2s
- Build time: < 3 minutes
- Deployment time: < 5 minutes

#### Quality KPIs
- Lighthouse score: > 95
- Core Web Vitals: All green
- Zero runtime errors
- 100% type coverage

#### Business KPIs
- AI content quality score: > 85%
- Content generation cost: < $0.10/article
- Uptime: > 99.9%
- User engagement metrics

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Owner**: Architecture Team
**Status**: Active
