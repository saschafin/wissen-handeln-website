# AI Integration Guide

Complete guide for integrating and using the Claude AI content generation system in the Wissen & Handeln website.

## Overview

The website uses Anthropic's Claude AI for intelligent content generation, including:

- Automated content creation
- Content refinement and editing
- SEO optimization
- Multi-language support
- Context-aware generation

## Architecture

### System Components

```
┌─────────────────┐
│   User Request  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │   API    │
    │ Endpoint │
    └────┬─────┘
         │
    ┌────▼──────────┐
    │  Content Gen  │
    │   Service     │
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │  Claude API   │
    │  Integration  │
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │   Response    │
    │  Processing   │
    └───────────────┘
```

## Setup

### 1. Install Dependencies

```bash
# For Node.js
npm install @anthropic-ai/sdk

# For Python
pip install anthropic
```

### 2. Configure API Key

Add to `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
ANTHROPIC_MAX_TOKENS=4096
```

### 3. Initialize Client

#### Node.js/TypeScript

```typescript
// lib/ai/claude-client.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateContent(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    max_tokens: options?.maxTokens || 4096,
    temperature: options?.temperature || 1.0,
    system: options?.systemPrompt || 'You are a helpful content creator for Wissen & Handeln.',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.content[0].text;
}

export default client;
```

#### Python

```python
# lib/ai/claude_client.py
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

def generate_content(
    prompt: str,
    max_tokens: int = 4096,
    temperature: float = 1.0,
    system_prompt: str = "You are a helpful content creator for Wissen & Handeln."
) -> str:
    message = client.messages.create(
        model=os.environ.get("ANTHROPIC_MODEL", "claude-3-sonnet-20240229"),
        max_tokens=max_tokens,
        temperature=temperature,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return message.content[0].text
```

## Content Generation Services

### Blog Post Generation

```typescript
// services/content/blog-generator.ts
import { generateContent } from '@/lib/ai/claude-client';

export interface BlogPostOptions {
  topic: string;
  tone?: 'professional' | 'casual' | 'academic';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  language?: string;
}

export async function generateBlogPost(
  options: BlogPostOptions
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
}> {
  const lengthGuide = {
    short: '500-800 words',
    medium: '1000-1500 words',
    long: '2000-3000 words',
  };

  const prompt = `Generate a blog post about "${options.topic}".

Requirements:
- Tone: ${options.tone || 'professional'}
- Length: ${lengthGuide[options.length || 'medium']}
- Include keywords: ${options.keywords?.join(', ') || 'N/A'}
- Language: ${options.language || 'German'}

Please provide:
1. An engaging title
2. Full article content with proper structure (intro, body, conclusion)
3. A brief excerpt (2-3 sentences)
4. 5-7 relevant tags

Format as JSON:
{
  "title": "...",
  "content": "...",
  "excerpt": "...",
  "tags": ["tag1", "tag2", ...]
}`;

  const systemPrompt = `You are an expert content writer for Wissen & Handeln,
a knowledge and action-oriented organization. Write engaging, informative content
that balances theory with practical application.`;

  const response = await generateContent(prompt, {
    maxTokens: 8000,
    systemPrompt,
  });

  return JSON.parse(response);
}
```

### Page Content Generation

```typescript
// services/content/page-generator.ts
export interface PageContentOptions {
  pageType: 'about' | 'service' | 'team' | 'contact' | 'landing';
  title: string;
  keyPoints: string[];
  targetAudience?: string;
}

export async function generatePageContent(
  options: PageContentOptions
): Promise<{
  headline: string;
  subheadline: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  cta: {
    text: string;
    buttonText: string;
  };
}> {
  const prompt = `Generate content for a ${options.pageType} page.

Title: ${options.title}
Key Points:
${options.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}
Target Audience: ${options.targetAudience || 'General public'}

Create:
1. Compelling headline
2. Engaging subheadline
3. 3-4 content sections with titles and paragraphs
4. Call-to-action section with text and button text

Format as JSON:
{
  "headline": "...",
  "subheadline": "...",
  "sections": [
    {"title": "...", "content": "..."},
    ...
  ],
  "cta": {
    "text": "...",
    "buttonText": "..."
  }
}`;

  const response = await generateContent(prompt, {
    maxTokens: 4096,
  });

  return JSON.parse(response);
}
```

### SEO Content Optimization

```typescript
// services/content/seo-optimizer.ts
export interface SEOOptimizationOptions {
  content: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  targetLength?: number;
}

export async function optimizeContentForSEO(
  options: SEOOptimizationOptions
): Promise<{
  optimizedContent: string;
  metaDescription: string;
  metaTitle: string;
  suggestedTags: string[];
  seoScore: number;
  improvements: string[];
}> {
  const prompt = `Optimize this content for SEO:

Content:
${options.content}

Primary Keyword: ${options.primaryKeyword}
Secondary Keywords: ${options.secondaryKeywords?.join(', ') || 'N/A'}
Target Length: ${options.targetLength || 'optimize for readability'}

Please:
1. Optimize content for SEO while maintaining readability
2. Create compelling meta description (150-160 chars)
3. Create SEO-friendly meta title (50-60 chars)
4. Suggest relevant tags
5. Provide SEO score (0-100)
6. List specific improvements made

Format as JSON:
{
  "optimizedContent": "...",
  "metaDescription": "...",
  "metaTitle": "...",
  "suggestedTags": [...],
  "seoScore": 85,
  "improvements": [...]
}`;

  const response = await generateContent(prompt, {
    maxTokens: 8000,
  });

  return JSON.parse(response);
}
```

## API Endpoints

### Content Generation API

```typescript
// app/api/content/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/services/content/blog-generator';
import { generatePageContent } from '@/services/content/page-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, options } = body;

    let result;

    switch (type) {
      case 'blog':
        result = await generateBlogPost(options);
        break;
      case 'page':
        result = await generatePageContent(options);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

### SEO Optimization API

```typescript
// app/api/content/optimize-seo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { optimizeContentForSEO } from '@/services/content/seo-optimizer';

export async function POST(request: NextRequest) {
  try {
    const options = await request.json();
    const result = await optimizeContentForSEO(options);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('SEO optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize content' },
      { status: 500 }
    );
  }
}
```

## Usage Examples

### Generate Blog Post

```typescript
// Example: Generate blog post
const blogPost = await fetch('/api/content/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'blog',
    options: {
      topic: 'Effective Knowledge Management Strategies',
      tone: 'professional',
      length: 'medium',
      keywords: ['knowledge management', 'productivity', 'collaboration'],
      language: 'German',
    },
  }),
});

const result = await blogPost.json();
console.log(result.data);
```

### Optimize Content

```typescript
// Example: Optimize existing content
const optimized = await fetch('/api/content/optimize-seo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Your existing content here...',
    primaryKeyword: 'knowledge management',
    secondaryKeywords: ['productivity', 'efficiency'],
  }),
});

const result = await optimized.json();
console.log(result.data);
```

## Best Practices

### 1. Prompt Engineering

```typescript
// Good: Specific, structured prompt
const prompt = `Generate a professional blog post about knowledge management.

Requirements:
- Target audience: Business professionals
- Length: 1000-1500 words
- Include 3 actionable tips
- Use examples from German companies

Structure:
1. Introduction with hook
2. Main content with subsections
3. Practical tips
4. Conclusion with CTA`;

// Bad: Vague prompt
const prompt = 'Write about knowledge management';
```

### 2. Error Handling

```typescript
async function generateWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateContent(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw new Error('Max retries exceeded');
}
```

### 3. Cost Optimization

```typescript
// Cache results for expensive operations
import { cacheContent } from '@/lib/cache';

export async function generateWithCache(
  prompt: string,
  cacheKey: string
): Promise<string> {
  // Check cache first
  const cached = await cacheContent.get(cacheKey);
  if (cached) return cached;

  // Generate if not cached
  const result = await generateContent(prompt);

  // Cache for 1 hour
  await cacheContent.set(cacheKey, result, 3600);

  return result;
}
```

### 4. Content Validation

```typescript
export function validateGeneratedContent(content: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check minimum length
  if (content.length < 100) {
    issues.push('Content too short');
  }

  // Check for placeholder text
  if (content.includes('[...]') || content.includes('TBD')) {
    issues.push('Contains placeholder text');
  }

  // Check for proper structure
  if (!content.includes('\n\n')) {
    issues.push('Missing paragraph breaks');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
```

## Monitoring & Analytics

### Track API Usage

```typescript
// lib/ai/usage-tracker.ts
export async function trackAPIUsage(
  operation: string,
  tokensUsed: number,
  cost: number
) {
  await db.apiUsage.create({
    data: {
      operation,
      tokensUsed,
      cost,
      timestamp: new Date(),
    },
  });
}
```

### Monitor Performance

```typescript
// lib/ai/performance-monitor.ts
export async function monitorGeneration(
  fn: () => Promise<string>
): Promise<{
  result: string;
  duration: number;
  tokensUsed: number;
}> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  // Log performance metrics
  console.log(`Generation took ${duration}ms`);

  return { result, duration, tokensUsed: 0 }; // Calculate tokens
}
```

## Testing

### Unit Tests

```typescript
// __tests__/ai/content-generator.test.ts
import { generateBlogPost } from '@/services/content/blog-generator';

describe('Blog Post Generator', () => {
  it('generates valid blog post', async () => {
    const result = await generateBlogPost({
      topic: 'Test Topic',
      tone: 'professional',
      length: 'short',
    });

    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('content');
    expect(result.content.length).toBeGreaterThan(500);
  });

  it('includes specified keywords', async () => {
    const keywords = ['test', 'example'];
    const result = await generateBlogPost({
      topic: 'Test Topic',
      keywords,
    });

    keywords.forEach(keyword => {
      expect(result.content.toLowerCase()).toContain(keyword);
    });
  });
});
```

## Security Considerations

1. **API Key Protection**:
   - Never expose API keys in client-side code
   - Use server-side API routes only
   - Rotate keys regularly

2. **Input Validation**:
   ```typescript
   function validateGenerationRequest(input: any) {
     if (!input.topic || input.topic.length > 200) {
       throw new Error('Invalid topic');
     }
     // Sanitize input
     return sanitize(input);
   }
   ```

3. **Rate Limiting**:
   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 10, // 10 requests per window
   });

   app.use('/api/content', limiter);
   ```

## Troubleshooting

### Common Issues

1. **API Key Errors**:
   ```bash
   # Verify key is set
   echo $ANTHROPIC_API_KEY

   # Test key
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01"
   ```

2. **Rate Limiting**:
   - Implement exponential backoff
   - Cache frequently requested content
   - Monitor usage dashboard

3. **Content Quality**:
   - Refine prompts for better results
   - Add validation checks
   - Implement human review workflow

## Next Steps

- Review [API Documentation](../api/content-generation.md)
- Set up [Monitoring](../operations/monitoring.md)
- Configure [Caching Strategy](../operations/caching.md)

---

**Ready to generate content!** See [API Reference](../api/content-generation.md) for complete endpoint documentation.
