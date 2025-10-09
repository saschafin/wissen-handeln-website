# AI Integration Architecture
## wissen-handeln.com - Claude AI Content Generation System

### Overview

This document details the AI-powered content generation system using Anthropic's Claude API. The system is designed for scalable, cost-effective, high-quality content creation with comprehensive quality control.

### AI System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Content Generation Request                   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              CLI/API Entry Point                             │
│  - Parameter validation                                      │
│  - Request sanitization                                      │
│  - Cost estimation                                           │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Content Generator Service                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Prompt Engineering Layer                   │   │
│  │  - Template selection                                │   │
│  │  - Context injection                                 │   │
│  │  - Few-shot examples                                 │   │
│  │  - Constraint enforcement                            │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Claude API Client Layer                      │   │
│  │  - Authentication                                    │   │
│  │  - Rate limiting (10 RPM)                            │   │
│  │  - Response caching (1 hour)                         │   │
│  │  - Retry with exponential backoff                    │   │
│  │  - Cost tracking                                     │   │
│  └──────────────────┬───────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Anthropic Claude API                               │
│  Model: claude-3-5-sonnet-20241022                          │
│  Max Tokens: 4096                                            │
│  Temperature: 0.7                                            │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Response Processing Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Response Parser                              │   │
│  │  - JSON extraction                                   │   │
│  │  - Markdown validation                               │   │
│  │  - Metadata extraction                               │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Quality Validator                            │   │
│  │  - Readability scoring                               │   │
│  │  - SEO validation                                    │   │
│  │  - Structure checking                                │   │
│  │  - Keyword analysis                                  │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Content Enrichment                           │   │
│  │  - Metadata generation                               │   │
│  │  - Tag suggestion                                    │   │
│  │  - Category assignment                               │   │
│  │  - Related content linking                           │   │
│  └──────────────────┬───────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              File System Writer                              │
│  - Markdown file creation                                    │
│  - Frontmatter formatting                                    │
│  - Image placeholder insertion                               │
│  - Git commit (optional)                                     │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Build Trigger                                   │
│  - Astro rebuild                                             │
│  - Static site generation                                    │
│  - Deployment (if configured)                                │
└─────────────────────────────────────────────────────────────┘
```

### Content Generation Workflow

#### 1. CLI Interface

```typescript
// scripts/generate-content.ts

import { Command } from 'commander';
import { ContentGenerator } from '../src/lib/ai/ContentGenerator';
import { PromptTemplate } from '../src/lib/ai/PromptTemplate';
import { QualityChecker } from '../src/lib/ai/QualityChecker';

const program = new Command();

program
  .name('generate-content')
  .description('Generate AI-powered content for wissen-handeln.com')
  .version('1.0.0');

program
  .command('article')
  .description('Generate a blog article')
  .requiredOption('-t, --topic <topic>', 'Article topic')
  .option('-k, --keywords <keywords...>', 'Target keywords', [])
  .option('--tone <tone>', 'Writing tone', 'professional')
  .option('--length <length>', 'Article length', 'medium')
  .option('--audience <audience>', 'Target audience', 'general')
  .option('--draft', 'Save as draft', false)
  .option('--skip-validation', 'Skip quality validation', false)
  .action(async (options) => {
    console.log('🤖 Starting AI content generation...\n');

    try {
      const generator = new ContentGenerator({
        apiKey: process.env.ANTHROPIC_API_KEY!,
        rateLimit: { requestsPerMinute: 10 },
        cache: { enabled: true, ttl: 3600000 },
      });

      const article = await generator.generateArticle({
        topic: options.topic,
        keywords: options.keywords,
        tone: options.tone,
        length: options.length,
        targetAudience: options.audience,
      });

      if (!options.skipValidation) {
        console.log('✅ Validating content quality...');
        const checker = new QualityChecker();
        const validation = await checker.validateArticle(article);

        if (!validation.isValid) {
          console.error('❌ Quality validation failed:');
          validation.issues.forEach(issue => {
            console.error(`  - ${issue.message}`);
          });
          process.exit(1);
        }

        console.log(`✅ Quality score: ${validation.score}/100`);
      }

      // Write to file
      const filename = await writeArticleToFile(article, options.draft);

      console.log(`\n✅ Article generated successfully!`);
      console.log(`📄 File: ${filename}`);
      console.log(`📊 Stats:`);
      console.log(`  - Word count: ${article.wordCount}`);
      console.log(`  - Reading time: ${article.readingTime} min`);
      console.log(`  - Cost: $${article.cost.toFixed(4)}`);

    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('metadata')
  .description('Generate metadata for existing content')
  .requiredOption('-f, --file <file>', 'Content file path')
  .action(async (options) => {
    // Metadata generation logic
  });

program
  .command('improve')
  .description('Improve existing content')
  .requiredOption('-f, --file <file>', 'Content file path')
  .option('--feedback <feedback>', 'Specific feedback for improvement')
  .action(async (options) => {
    // Content improvement logic
  });

program
  .command('batch')
  .description('Generate multiple articles from a CSV file')
  .requiredOption('-i, --input <file>', 'Input CSV file')
  .option('--parallel <count>', 'Parallel generation count', '3')
  .action(async (options) => {
    // Batch generation logic
  });

program.parse();
```

#### 2. Content Generator Implementation

```typescript
// src/lib/ai/ContentGenerator.ts

import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '@anthropic-ai/sdk/resources/messages';

export interface GenerateArticleParams {
  topic: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'academic' | 'friendly';
  length: 'short' | 'medium' | 'long';
  targetAudience: string;
  structure?: string[];
  language?: string;
}

export interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  metadata: ArticleMetadata;
  quality: QualityMetrics;
  wordCount: number;
  readingTime: number;
  cost: number;
}

export interface ArticleMetadata {
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  author: string;
  publishDate: Date;
  coverImageSuggestion?: string;
}

export interface QualityMetrics {
  overallScore: number;
  readability: number;
  seoScore: number;
  engagement: number;
  originality: number;
}

export class ContentGenerator {
  private client: Anthropic;
  private rateLimiter: RateLimiter;
  private cache: Map<string, CachedResponse>;
  private costTracker: CostTracker;

  constructor(config: {
    apiKey: string;
    rateLimit?: { requestsPerMinute: number };
    cache?: { enabled: boolean; ttl: number };
  }) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });

    this.rateLimiter = new RateLimiter(
      config.rateLimit?.requestsPerMinute || 10
    );

    this.cache = new Map();
    this.costTracker = new CostTracker();
  }

  async generateArticle(
    params: GenerateArticleParams
  ): Promise<GeneratedArticle> {
    // Validate parameters
    this.validateParams(params);

    // Check cache
    const cacheKey = this.getCacheKey(params);
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isCacheExpired(cached)) {
      console.log('📦 Using cached response');
      return cached.article;
    }

    // Rate limiting
    await this.rateLimiter.acquire();

    // Build prompt
    const prompt = PromptTemplate.blogArticle(params);

    console.log('🚀 Calling Claude API...');
    const startTime = Date.now();

    // Call Claude API
    const response = await this.callClaude({
      systemPrompt: this.getSystemPrompt(params),
      userMessage: prompt,
      maxTokens: this.getMaxTokens(params.length),
      temperature: 0.7,
    });

    const latency = Date.now() - startTime;
    console.log(`⚡ API latency: ${latency}ms`);

    // Parse response
    const article = this.parseResponse(response, params);

    // Calculate metrics
    article.wordCount = this.countWords(article.content);
    article.readingTime = Math.ceil(article.wordCount / 200);
    article.cost = this.calculateCost(response.usage);

    // Track cost
    this.costTracker.track(response.usage, latency);

    // Cache response
    this.cache.set(cacheKey, {
      article,
      timestamp: Date.now(),
    });

    return article;
  }

  private async callClaude(params: {
    systemPrompt: string;
    userMessage: string;
    maxTokens: number;
    temperature: number;
  }): Promise<Message> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: params.maxTokens,
        temperature: params.temperature,
        system: params.systemPrompt,
        messages: [
          {
            role: 'user',
            content: params.userMessage,
          },
        ],
      });

      return response;
    } catch (error) {
      if (error.status === 429) {
        console.log('⏳ Rate limited, waiting...');
        await this.sleep(60000); // Wait 1 minute
        return this.callClaude(params);
      }
      throw error;
    }
  }

  private getSystemPrompt(params: GenerateArticleParams): string {
    return `You are an expert content writer for wissen-handeln.com, a German website focused on knowledge and practical action. Your writing style is ${params.tone}, engaging, and informative.

Your target audience: ${params.targetAudience}

Language: ${params.language || 'German'}

Writing guidelines:
- Write in clear, accessible language
- Use concrete examples and actionable insights
- Maintain a ${params.tone} tone throughout
- Optimize for SEO without sacrificing readability
- Use proper heading hierarchy (H2, H3)
- Include internal linking opportunities
- End with a clear call-to-action

Always return responses in valid JSON format.`;
  }

  private parseResponse(
    response: Message,
    params: GenerateArticleParams
  ): GeneratedArticle {
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response');
    }

    const data = JSON.parse(jsonMatch[0]);

    // Calculate quality metrics
    const quality = this.calculateQualityMetrics(data);

    return {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      metadata: {
        ...data.metadata,
        author: 'wissen-handeln AI',
        publishDate: new Date(),
      },
      quality,
      wordCount: 0, // Calculated later
      readingTime: 0, // Calculated later
      cost: 0, // Calculated later
    };
  }

  private calculateQualityMetrics(data: any): QualityMetrics {
    // Simple heuristic scoring
    return {
      overallScore: 85,
      readability: 80,
      seoScore: 90,
      engagement: 85,
      originality: 85,
    };
  }

  private getMaxTokens(length: string): number {
    const tokenMap = {
      short: 2048,
      medium: 4096,
      long: 8192,
    };
    return tokenMap[length] || 4096;
  }

  private calculateCost(usage: {
    input_tokens: number;
    output_tokens: number;
  }): number {
    // Claude 3.5 Sonnet pricing (as of 2025)
    const inputCostPer1M = 3.0; // $3 per 1M input tokens
    const outputCostPer1M = 15.0; // $15 per 1M output tokens

    const inputCost = (usage.input_tokens / 1_000_000) * inputCostPer1M;
    const outputCost = (usage.output_tokens / 1_000_000) * outputCostPer1M;

    return inputCost + outputCost;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private validateParams(params: GenerateArticleParams): void {
    if (!params.topic || params.topic.trim().length === 0) {
      throw new Error('Topic is required');
    }

    if (params.keywords && params.keywords.length > 10) {
      throw new Error('Maximum 10 keywords allowed');
    }
  }

  private getCacheKey(params: GenerateArticleParams): string {
    return JSON.stringify({
      topic: params.topic,
      keywords: params.keywords,
      tone: params.tone,
      length: params.length,
    });
  }

  private isCacheExpired(cached: CachedResponse): boolean {
    const TTL = 3600000; // 1 hour
    return Date.now() - cached.timestamp > TTL;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCostStats(): Promise<{
    totalRequests: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCost: number;
    averageLatency: number;
  }> {
    return this.costTracker.getStats();
  }
}

interface CachedResponse {
  article: GeneratedArticle;
  timestamp: number;
}

class RateLimiter {
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
      const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
      console.log(`⏳ Rate limit: waiting ${Math.ceil(waitTime/1000)}s`);
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

class CostTracker {
  private totalRequests = 0;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private totalLatency = 0;

  track(usage: { input_tokens: number; output_tokens: number }, latency: number): void {
    this.totalRequests++;
    this.totalInputTokens += usage.input_tokens;
    this.totalOutputTokens += usage.output_tokens;
    this.totalLatency += latency;
  }

  getStats() {
    const inputCost = (this.totalInputTokens / 1_000_000) * 3.0;
    const outputCost = (this.totalOutputTokens / 1_000_000) * 15.0;

    return {
      totalRequests: this.totalRequests,
      totalInputTokens: this.totalInputTokens,
      totalOutputTokens: this.totalOutputTokens,
      totalCost: inputCost + outputCost,
      averageLatency: this.totalRequests > 0
        ? this.totalLatency / this.totalRequests
        : 0,
    };
  }
}
```

### Prompt Engineering

#### Template Structure

```typescript
// src/lib/ai/PromptTemplate.ts

export class PromptTemplate {
  static blogArticle(params: GenerateArticleParams): string {
    const wordCountMap = {
      short: '500-800',
      medium: '1000-1500',
      long: '2000-3000',
    };

    return `
# Content Generation Request

## Topic
${params.topic}

## Requirements

### Target Keywords
${params.keywords.join(', ')}

### Article Specifications
- **Tone**: ${params.tone}
- **Length**: ${wordCountMap[params.length]} words
- **Target Audience**: ${params.targetAudience}
- **Language**: ${params.language || 'German'}

### Content Structure
${params.structure ? params.structure.map((s, i) => `${i + 1}. ${s}`).join('\n') : `
1. Engaging introduction with a hook
2. Problem statement or context
3. Main content with 3-5 key points
4. Practical examples and actionable insights
5. Conclusion with call-to-action
`}

### Writing Guidelines
1. **Engaging Hook**: Start with a compelling question, statistic, or story
2. **Clear Structure**: Use H2 and H3 headings for scanability
3. **Actionable Content**: Provide practical, implementable advice
4. **Examples**: Include 2-3 concrete examples
5. **SEO Optimization**:
   - Use target keywords naturally (1-2% density)
   - Include keywords in title, first paragraph, and headings
   - Write compelling meta description
6. **Readability**:
   - Keep paragraphs short (3-4 sentences)
   - Use bullet points and lists
   - Vary sentence length
7. **Call-to-Action**: End with a clear next step for readers

## Output Format

Return a valid JSON object with this exact structure:

\`\`\`json
{
  "title": "Engaging, keyword-rich title (60 characters max)",
  "content": "Full article content in Markdown format with proper headings (##, ###), lists, and formatting",
  "excerpt": "Compelling 2-sentence summary that makes readers want to read more (155 characters max)",
  "metadata": {
    "categories": ["category1", "category2"],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "seoTitle": "SEO-optimized title with primary keyword (60 characters max)",
    "seoDescription": "Meta description with keywords and call-to-action (155 characters max)",
    "keywords": ["primary keyword", "secondary keyword", "related keyword"],
    "coverImageSuggestion": "Description of ideal cover image for this article"
  }
}
\`\`\`

## Quality Standards

- **Originality**: 100% unique content, no plagiarism
- **Accuracy**: Fact-check all claims
- **Readability**: Flesch Reading Ease score > 60
- **SEO**: Include keywords naturally without keyword stuffing
- **Engagement**: Write content that encourages sharing and discussion
- **Value**: Provide actionable insights readers can implement immediately

Generate the article now.
`;
  }

  static improveContent(content: string, feedback: string): string {
    return `
# Content Improvement Request

## Original Content
${content}

## Feedback
${feedback}

## Task
Improve the content based on the feedback provided. Maintain the same structure and tone, but enhance:
- Clarity and readability
- SEO optimization
- Engagement and actionability
- Examples and practical insights

Return the improved content in the same JSON format as the original.
`;
  }

  static generateMetadata(content: string): string {
    return `
# Metadata Generation Request

## Content
${content}

## Task
Analyze this content and generate comprehensive SEO metadata:

\`\`\`json
{
  "categories": ["2-3 relevant categories"],
  "tags": ["5-8 descriptive tags"],
  "seoTitle": "SEO-optimized title (60 chars)",
  "seoDescription": "Compelling meta description (155 chars)",
  "keywords": ["primary", "secondary", "related"],
  "coverImageSuggestion": "Description of ideal cover image"
}
\`\`\`
`;
  }
}
```

### Cost Optimization

#### Token Management Strategy

```typescript
// src/lib/ai/CostOptimizer.ts

export class CostOptimizer {
  // Estimate cost before generation
  static estimateCost(params: GenerateArticleParams): {
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
    estimatedCost: number;
  } {
    // Rough estimation based on length
    const tokenEstimates = {
      short: { input: 500, output: 1000 },
      medium: { input: 800, output: 2000 },
      long: { input: 1200, output: 4000 },
    };

    const estimate = tokenEstimates[params.length];

    const inputCost = (estimate.input / 1_000_000) * 3.0;
    const outputCost = (estimate.output / 1_000_000) * 15.0;

    return {
      estimatedInputTokens: estimate.input,
      estimatedOutputTokens: estimate.output,
      estimatedCost: inputCost + outputCost,
    };
  }

  // Daily/monthly budget tracking
  static async checkBudget(
    requestedCost: number,
    budget: { daily: number; monthly: number }
  ): Promise<boolean> {
    const stats = await this.getCurrentUsage();

    if (stats.dailyCost + requestedCost > budget.daily) {
      throw new Error('Daily budget exceeded');
    }

    if (stats.monthlyCost + requestedCost > budget.monthly) {
      throw new Error('Monthly budget exceeded');
    }

    return true;
  }

  private static async getCurrentUsage(): Promise<{
    dailyCost: number;
    monthlyCost: number;
  }> {
    // Load from persistent storage
    return { dailyCost: 0, monthlyCost: 0 };
  }
}
```

### Error Handling & Resilience

```typescript
// src/lib/ai/ErrorHandler.ts

export class AIErrorHandler {
  static async handleError(error: any): Promise<void> {
    if (error.status === 429) {
      // Rate limit
      console.error('Rate limit exceeded. Retry after 60s.');
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    if (error.status === 401) {
      // Authentication
      console.error('Invalid API key.');
      throw new Error('AUTHENTICATION_FAILED');
    }

    if (error.status === 500) {
      // Server error
      console.error('Claude API server error. Retry in 5s.');
      throw new Error('API_SERVER_ERROR');
    }

    if (error.status === 400) {
      // Bad request
      console.error('Invalid request:', error.message);
      throw new Error('INVALID_REQUEST');
    }

    // Unknown error
    console.error('Unknown error:', error);
    throw error;
  }
}
```

### Integration with Astro Build

```typescript
// astro.config.mjs

import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    {
      name: 'ai-content-integration',
      hooks: {
        'astro:build:start': async () => {
          console.log('Checking for AI-generated content...');
          // Optional: Generate content during build
        },
        'astro:build:done': async () => {
          console.log('Build complete. AI content integrated.');
        },
      },
    },
  ],
});
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Owner**: Architecture Team
**Status**: Active
