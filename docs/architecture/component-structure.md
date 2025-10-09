# Component Architecture
## wissen-handeln.com - Detailed Component Design

### Project Structure

```
wissen-handeln-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Navigation.astro
│   │   │   └── Sidebar.astro
│   │   ├── content/
│   │   │   ├── ArticleCard.astro
│   │   │   ├── ArticleGrid.astro
│   │   │   ├── CategoryTag.astro
│   │   │   └── ShareButtons.astro
│   │   ├── ai/
│   │   │   ├── ContentGenerator.ts
│   │   │   ├── PromptTemplate.ts
│   │   │   └── QualityChecker.ts
│   │   └── common/
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       └── Image.astro
│   ├── content/             # Content collections
│   │   ├── config.ts        # Content schema definitions
│   │   ├── blog/            # Blog posts
│   │   │   ├── post-1.md
│   │   │   └── post-2.md
│   │   ├── pages/           # Static pages
│   │   │   ├── about.md
│   │   │   └── services.md
│   │   └── generated/       # AI-generated content
│   │       └── ai-article-1.md
│   ├── layouts/             # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── BlogLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/               # Route pages
│   │   ├── index.astro      # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro  # Blog listing
│   │   │   └── [slug].astro # Blog post detail
│   │   ├── about.astro
│   │   └── contact.astro
│   ├── lib/                 # Core utilities
│   │   ├── ai/
│   │   │   ├── claude.ts    # Claude API client
│   │   │   ├── prompts.ts   # Prompt templates
│   │   │   └── validator.ts # Content validation
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── seo.ts
│   │   │   └── markdown.ts
│   │   └── types/
│   │       ├── content.ts
│   │       └── api.ts
│   ├── styles/              # Global styles
│   │   ├── global.css
│   │   └── variables.css
│   └── env.d.ts            # Environment type definitions
├── public/                  # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── scripts/                 # Build and utility scripts
│   ├── generate-content.ts  # AI content generation
│   ├── validate-env.ts      # Environment validation
│   └── optimize-images.ts   # Image optimization
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # Documentation
│   └── architecture/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── package.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.example
└── README.md
```

### Core Components

#### 1. Layout Components

##### BaseLayout.astro
```typescript
/**
 * Base layout component - wraps all pages
 *
 * Responsibilities:
 * - HTML structure and meta tags
 * - Global styles and scripts
 * - SEO optimization
 * - Analytics integration
 */

interface Props {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishDate?: Date;
}

// Features:
// - Dynamic meta tags (Open Graph, Twitter)
// - Structured data (Schema.org)
// - Performance optimization (preload, prefetch)
// - Accessibility (ARIA, semantic HTML)
```

##### Header.astro
```typescript
/**
 * Site header with navigation
 *
 * Features:
 * - Responsive navigation
 * - Mobile menu (hamburger)
 * - Search integration (future)
 * - Language switcher (future)
 */

interface HeaderProps {
  currentPath: string;
  transparent?: boolean;
}

// State management:
// - Active navigation item
// - Mobile menu open/close
// - Scroll-based styling
```

##### Footer.astro
```typescript
/**
 * Site footer
 *
 * Features:
 * - Site links
 * - Social media links
 * - Newsletter signup (future)
 * - Copyright and legal
 */
```

#### 2. Content Components

##### ArticleCard.astro
```typescript
/**
 * Article preview card
 *
 * Features:
 * - Responsive image
 * - Title, excerpt, date
 * - Category tags
 * - Read time estimation
 * - Hover effects
 */

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: Date;
  coverImage?: string;
  categories: string[];
  readingTime: number;
}

// Variants:
// - Default (grid)
// - Featured (hero)
// - Compact (sidebar)
```

##### ArticleGrid.astro
```typescript
/**
 * Grid layout for articles
 *
 * Features:
 * - Responsive grid (1/2/3 columns)
 * - Pagination
 * - Filtering by category
 * - Sorting options
 */

interface ArticleGridProps {
  articles: Article[];
  columns?: 1 | 2 | 3;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

##### CategoryTag.astro
```typescript
/**
 * Category/tag badge component
 *
 * Features:
 * - Color coding by category
 * - Clickable (links to category page)
 * - Accessible
 */

interface CategoryTagProps {
  name: string;
  slug: string;
  count?: number;
  variant?: 'default' | 'outline' | 'solid';
}
```

#### 3. AI Integration Components

##### ContentGenerator.ts
```typescript
/**
 * AI content generation service
 *
 * Core functionality:
 * - Claude API integration
 * - Prompt templating
 * - Response parsing
 * - Error handling
 * - Rate limiting
 * - Cost tracking
 */

export class ContentGenerator {
  private client: AnthropicClient;
  private rateLimiter: RateLimiter;

  async generateArticle(params: GenerateArticleParams): Promise<Article> {
    // 1. Validate parameters
    // 2. Build prompt from template
    // 3. Call Claude API
    // 4. Parse response
    // 5. Validate content
    // 6. Return structured article
  }

  async generateMetadata(content: string): Promise<ArticleMetadata> {
    // Generate SEO metadata, tags, categories
  }

  async improveContent(content: string, feedback: string): Promise<string> {
    // Iterative content improvement
  }
}

interface GenerateArticleParams {
  topic: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'academic';
  length: 'short' | 'medium' | 'long';
  targetAudience: string;
  structure?: string[];
}

interface Article {
  title: string;
  content: string;
  excerpt: string;
  metadata: ArticleMetadata;
  quality: QualityScore;
}

interface ArticleMetadata {
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  ogImage?: string;
}

interface QualityScore {
  overall: number;
  readability: number;
  seoOptimization: number;
  engagement: number;
  originality: number;
}
```

##### PromptTemplate.ts
```typescript
/**
 * Prompt engineering templates
 *
 * Features:
 * - Reusable prompt structures
 * - Variable interpolation
 * - Context injection
 * - Few-shot examples
 */

export class PromptTemplate {
  static blogArticle(params: BlogArticleParams): string {
    return `
You are an expert content writer for wissen-handeln.com, a German website focused on knowledge and action.

Topic: ${params.topic}
Target Keywords: ${params.keywords.join(', ')}
Tone: ${params.tone}
Target Length: ${params.length} words
Target Audience: ${params.targetAudience}

Please write a comprehensive, engaging article that:
1. Starts with a compelling hook
2. Provides actionable insights
3. Uses clear, accessible language
4. Includes relevant examples
5. Ends with a strong call-to-action

Structure:
${params.structure?.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Return the article in the following JSON format:
{
  "title": "Engaging article title",
  "content": "Full article content in Markdown",
  "excerpt": "Brief 2-sentence summary",
  "metadata": {
    "categories": ["category1", "category2"],
    "tags": ["tag1", "tag2", "tag3"],
    "seoTitle": "SEO-optimized title (60 chars)",
    "seoDescription": "SEO description (155 chars)",
    "keywords": ["keyword1", "keyword2"]
  }
}
`;
  }

  static improveContent(content: string, feedback: string): string {
    // Template for content improvement
  }

  static generateSEO(content: string): string {
    // Template for SEO optimization
  }
}

interface BlogArticleParams {
  topic: string;
  keywords: string[];
  tone: string;
  length: number;
  targetAudience: string;
  structure?: string[];
}
```

##### QualityChecker.ts
```typescript
/**
 * Content quality validation
 *
 * Features:
 * - Readability scoring (Flesch-Kincaid)
 * - SEO validation
 * - Grammar checking (basic)
 * - Plagiarism detection (basic)
 * - Content structure validation
 */

export class QualityChecker {
  async validateArticle(article: Article): Promise<ValidationResult> {
    const results = await Promise.all([
      this.checkReadability(article.content),
      this.checkSEO(article),
      this.checkStructure(article),
      this.checkLength(article),
      this.checkKeywordDensity(article)
    ]);

    return this.aggregateResults(results);
  }

  private checkReadability(content: string): ReadabilityScore {
    // Flesch Reading Ease
    // Gunning Fog Index
    // SMOG Index
  }

  private checkSEO(article: Article): SEOScore {
    // Title length
    // Meta description length
    // Keyword placement
    // Header structure
    // Image alt tags
  }

  private checkStructure(article: Article): StructureScore {
    // Heading hierarchy
    // Paragraph length
    // List usage
    // Link quality
  }

  private checkLength(article: Article): LengthScore {
    // Word count
    // Sentence length
    // Paragraph length
  }

  private checkKeywordDensity(article: Article): KeywordScore {
    // Primary keyword density (1-2%)
    // Secondary keywords
    // Over-optimization check
  }
}

interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: ValidationIssue[];
  suggestions: string[];
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  category: 'readability' | 'seo' | 'structure' | 'length' | 'keywords';
  message: string;
  location?: {
    line: number;
    column: number;
  };
}
```

#### 4. Utility Components

##### Claude API Client (lib/ai/claude.ts)
```typescript
/**
 * Claude API client wrapper
 *
 * Features:
 * - Authentication
 * - Request/response handling
 * - Error handling and retry logic
 * - Rate limiting
 * - Cost tracking
 * - Response caching
 */

import Anthropic from '@anthropic-ai/sdk';

export class ClaudeClient {
  private client: Anthropic;
  private rateLimiter: RateLimiter;
  private cache: ResponseCache;
  private costTracker: CostTracker;

  constructor(config: ClaudeConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
    this.rateLimiter = new RateLimiter(config.rateLimit);
    this.cache = new ResponseCache(config.cache);
    this.costTracker = new CostTracker();
  }

  async complete(params: CompletionParams): Promise<CompletionResponse> {
    // 1. Check rate limit
    await this.rateLimiter.acquire();

    // 2. Check cache
    const cached = await this.cache.get(params);
    if (cached) return cached;

    // 3. Call API with retry logic
    const response = await this.retryWithBackoff(async () => {
      return await this.client.messages.create({
        model: params.model || 'claude-3-5-sonnet-20241022',
        max_tokens: params.maxTokens || 4096,
        messages: params.messages,
        temperature: params.temperature || 0.7,
      });
    });

    // 4. Track costs
    this.costTracker.track(response);

    // 5. Cache response
    await this.cache.set(params, response);

    return response;
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    // Exponential backoff retry logic
  }

  async getCostStats(): Promise<CostStats> {
    return this.costTracker.getStats();
  }
}

interface ClaudeConfig {
  apiKey: string;
  rateLimit?: {
    requestsPerMinute: number;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}

interface CompletionParams {
  messages: Message[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CompletionResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  stopReason: string;
}

interface CostStats {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCost: number;
  averageLatency: number;
}
```

##### Rate Limiter
```typescript
/**
 * Rate limiting for API calls
 */

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(requestsPerMinute: number) {
    this.maxTokens = requestsPerMinute;
    this.tokens = requestsPerMinute;
    this.refillRate = requestsPerMinute / 60;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate * 1000;
      await this.sleep(waitTime);
      this.refill();
    }

    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

##### Response Cache
```typescript
/**
 * Cache for API responses
 */

export class ResponseCache {
  private cache: Map<string, CachedResponse>;
  private ttl: number;

  constructor(config: { enabled: boolean; ttl: number }) {
    this.cache = new Map();
    this.ttl = config.ttl;
  }

  async get(params: CompletionParams): Promise<CompletionResponse | null> {
    const key = this.generateKey(params);
    const cached = this.cache.get(key);

    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  async set(params: CompletionParams, response: CompletionResponse): Promise<void> {
    const key = this.generateKey(params);
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  private generateKey(params: CompletionParams): string {
    return JSON.stringify({
      messages: params.messages,
      model: params.model,
      temperature: params.temperature,
    });
  }
}

interface CachedResponse {
  response: CompletionResponse;
  timestamp: number;
}
```

### Content Collections Schema

```typescript
// src/content/config.ts

import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string().default('wissen-handeln Team'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    aiGenerated: z.boolean().default(false),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    }).optional(),
  }),
});

const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    layout: z.string().default('PageLayout'),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'pages': pageCollection,
};
```

### Component Interaction Patterns

#### 1. Content Generation Flow
```
User/Script
    ↓
ContentGenerator.generateArticle()
    ↓
PromptTemplate.blogArticle()
    ↓
ClaudeClient.complete()
    ↓
QualityChecker.validateArticle()
    ↓
File System (Markdown)
    ↓
Astro Build Process
    ↓
Static HTML
```

#### 2. Page Rendering Flow
```
Request
    ↓
Astro Router
    ↓
Page Component ([slug].astro)
    ↓
getCollection('blog')
    ↓
BlogLayout
    ↓
BaseLayout (SEO, Meta)
    ↓
Content Rendering
    ↓
Response (HTML)
```

### Performance Optimization

#### Code Splitting Strategy
```typescript
// Lazy load interactive components
const SearchBox = lazy(() => import('./components/SearchBox'));
const CommentSection = lazy(() => import('./components/Comments'));

// Preload critical components
<link rel="modulepreload" href="/components/ArticleCard.js" />
```

#### Image Optimization
```typescript
// Use Astro Image component
import { Image } from 'astro:assets';

<Image
  src={coverImage}
  alt={coverImageAlt}
  width={800}
  height={450}
  format="webp"
  quality={80}
  loading="lazy"
/>
```

#### CSS Optimization
```css
/* Critical CSS inlined in <head> */
/* Non-critical CSS lazy loaded */
/* TailwindCSS purged for production */
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Owner**: Architecture Team
**Status**: Active
