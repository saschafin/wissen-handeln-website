# Content Generation API Documentation

Complete API reference for the Wissen & Handeln AI-powered content generation system.

## Base URL

```
Development: http://localhost:3000/api
Production:  https://wissen-handeln.com/api
```

## Authentication

All API endpoints require authentication via API key or JWT token.

### API Key Authentication

```bash
curl -H "X-API-Key: your_api_key_here" \
  https://wissen-handeln.com/api/content/generate
```

### JWT Authentication

```bash
curl -H "Authorization: Bearer your_jwt_token" \
  https://wissen-handeln.com/api/content/generate
```

## Rate Limits

- **Free Tier**: 10 requests per 15 minutes
- **Pro Tier**: 100 requests per 15 minutes
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Endpoints

### 1. Generate Blog Post

Generate a complete blog post with AI.

**Endpoint**: `POST /api/content/generate/blog`

#### Request

```json
{
  "topic": "Effective Knowledge Management Strategies",
  "tone": "professional",
  "length": "medium",
  "keywords": ["knowledge management", "productivity", "collaboration"],
  "language": "de",
  "includeImages": false,
  "seoOptimize": true
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| topic | string | Yes | Main topic of the blog post |
| tone | string | No | Tone: `professional`, `casual`, `academic` (default: `professional`) |
| length | string | No | Length: `short` (500-800), `medium` (1000-1500), `long` (2000-3000) |
| keywords | string[] | No | SEO keywords to include |
| language | string | No | ISO 639-1 code (default: `de`) |
| includeImages | boolean | No | Generate image suggestions (default: `false`) |
| seoOptimize | boolean | No | Optimize for SEO (default: `true`) |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "blog_abc123xyz",
    "title": "Effektive Wissensmanagement-Strategien für moderne Unternehmen",
    "content": "Full blog post content...",
    "excerpt": "Entdecken Sie bewährte Strategien für effektives Wissensmanagement...",
    "tags": [
      "Wissensmanagement",
      "Produktivität",
      "Zusammenarbeit",
      "Strategie",
      "Innovation"
    ],
    "metadata": {
      "wordCount": 1247,
      "readingTime": "6 min",
      "language": "de"
    },
    "seo": {
      "metaTitle": "Effektive Wissensmanagement-Strategien | Wissen & Handeln",
      "metaDescription": "Entdecken Sie die besten Strategien für erfolgreiches Wissensmanagement...",
      "slug": "effektive-wissensmanagement-strategien",
      "keywords": ["wissensmanagement", "produktivität", "zusammenarbeit"]
    },
    "images": [
      {
        "position": "hero",
        "description": "Modern office with collaborative workspace",
        "altText": "Team working together on knowledge management"
      }
    ],
    "createdAt": "2025-10-09T14:30:00Z"
  }
}
```

#### Example

```bash
curl -X POST https://wissen-handeln.com/api/content/generate/blog \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "topic": "Effective Knowledge Management Strategies",
    "tone": "professional",
    "length": "medium",
    "keywords": ["knowledge management", "productivity"],
    "language": "de"
  }'
```

---

### 2. Generate Page Content

Generate content for website pages.

**Endpoint**: `POST /api/content/generate/page`

#### Request

```json
{
  "pageType": "about",
  "title": "Über Wissen & Handeln",
  "keyPoints": [
    "Expertise in knowledge management",
    "20+ years of experience",
    "Proven methodologies",
    "Client success stories"
  ],
  "targetAudience": "Business professionals and organizations",
  "language": "de"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pageType | string | Yes | Page type: `about`, `service`, `team`, `contact`, `landing` |
| title | string | Yes | Page title |
| keyPoints | string[] | Yes | Key points to cover (3-5 recommended) |
| targetAudience | string | No | Target audience description |
| language | string | No | ISO 639-1 code (default: `de`) |
| ctaText | string | No | Custom call-to-action text |

#### Response

```json
{
  "success": true,
  "data": {
    "id": "page_xyz789abc",
    "headline": "Wissensmanagement neu gedacht",
    "subheadline": "Wir verbinden Theorie mit Praxis für nachhaltigen Erfolg",
    "sections": [
      {
        "title": "Unsere Expertise",
        "content": "Mit über 20 Jahren Erfahrung im Wissensmanagement...",
        "order": 1
      },
      {
        "title": "Unsere Methodik",
        "content": "Wir verwenden bewährte Methodiken...",
        "order": 2
      },
      {
        "title": "Erfolgsgeschichten",
        "content": "Unsere Kunden berichten von...",
        "order": 3
      }
    ],
    "cta": {
      "text": "Bereit, Ihr Wissensmanagement zu transformieren?",
      "buttonText": "Kontaktieren Sie uns",
      "buttonLink": "/contact"
    },
    "createdAt": "2025-10-09T14:30:00Z"
  }
}
```

---

### 3. Optimize Content for SEO

Optimize existing content for search engines.

**Endpoint**: `POST /api/content/optimize/seo`

#### Request

```json
{
  "content": "Your existing content here...",
  "primaryKeyword": "wissensmanagement",
  "secondaryKeywords": ["produktivität", "zusammenarbeit", "innovation"],
  "targetLength": 1500,
  "language": "de"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string | Yes | Content to optimize |
| primaryKeyword | string | Yes | Primary SEO keyword |
| secondaryKeywords | string[] | No | Secondary keywords (2-5 recommended) |
| targetLength | number | No | Target word count |
| language | string | No | ISO 639-1 code (default: `de`) |

#### Response

```json
{
  "success": true,
  "data": {
    "optimizedContent": "Optimized content with improved SEO...",
    "metaDescription": "Entdecken Sie effektive Wissensmanagement-Strategien...",
    "metaTitle": "Wissensmanagement: Strategien für Erfolg | Wissen & Handeln",
    "suggestedTags": [
      "Wissensmanagement",
      "Produktivität",
      "Zusammenarbeit",
      "Innovation",
      "Strategie"
    ],
    "seoScore": 87,
    "improvements": [
      "Added primary keyword to first paragraph",
      "Improved heading structure with H2/H3 tags",
      "Optimized meta description length (158 chars)",
      "Increased keyword density from 0.8% to 1.2%",
      "Added internal linking opportunities"
    ],
    "analysis": {
      "keywordDensity": {
        "wissensmanagement": 1.2,
        "produktivität": 0.8,
        "zusammenarbeit": 0.6
      },
      "readability": {
        "score": 72,
        "level": "easy"
      },
      "contentLength": 1524
    }
  }
}
```

---

### 4. Translate Content

Translate content to different languages.

**Endpoint**: `POST /api/content/translate`

#### Request

```json
{
  "content": "Your content in German...",
  "sourceLanguage": "de",
  "targetLanguage": "en",
  "preserveFormatting": true,
  "tone": "professional"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string | Yes | Content to translate |
| sourceLanguage | string | Yes | Source language ISO code |
| targetLanguage | string | Yes | Target language ISO code |
| preserveFormatting | boolean | No | Maintain HTML/Markdown formatting (default: `true`) |
| tone | string | No | Translation tone: `professional`, `casual`, `formal` |

#### Response

```json
{
  "success": true,
  "data": {
    "translatedContent": "Your content in English...",
    "sourceLanguage": "de",
    "targetLanguage": "en",
    "confidence": 0.95,
    "alternatives": [
      {
        "variant": "Alternative translation...",
        "confidence": 0.89
      }
    ]
  }
}
```

---

### 5. Generate Content Variations

Create multiple variations of content for A/B testing.

**Endpoint**: `POST /api/content/generate/variations`

#### Request

```json
{
  "content": "Original content...",
  "variationCount": 3,
  "variationType": "tone",
  "tones": ["professional", "casual", "enthusiastic"]
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "original": "Original content...",
    "variations": [
      {
        "id": "var_1",
        "content": "Professional variation...",
        "tone": "professional"
      },
      {
        "id": "var_2",
        "content": "Casual variation...",
        "tone": "casual"
      },
      {
        "id": "var_3",
        "content": "Enthusiastic variation...",
        "tone": "enthusiastic"
      }
    ]
  }
}
```

---

### 6. Check Content Quality

Analyze content quality and get improvement suggestions.

**Endpoint**: `POST /api/content/analyze/quality`

#### Request

```json
{
  "content": "Content to analyze...",
  "language": "de",
  "checkGrammar": true,
  "checkReadability": true,
  "checkSEO": true
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "overallScore": 82,
    "grammar": {
      "score": 95,
      "issues": [
        {
          "type": "spelling",
          "message": "Possible spelling error",
          "suggestion": "Wissensmanagement",
          "position": 42
        }
      ]
    },
    "readability": {
      "score": 78,
      "fleschScore": 65,
      "gradeLevel": 8,
      "suggestions": [
        "Consider shorter sentences",
        "Use more active voice"
      ]
    },
    "seo": {
      "score": 73,
      "issues": [
        "Missing meta description",
        "Low keyword density"
      ]
    }
  }
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server error |
| `AI_SERVICE_ERROR` | 503 | AI service unavailable |
| `CONTENT_TOO_LONG` | 400 | Content exceeds maximum length |
| `UNSUPPORTED_LANGUAGE` | 400 | Language not supported |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again in 15 minutes.",
    "details": {
      "limit": 10,
      "resetAt": "2025-10-09T15:00:00Z"
    }
  }
}
```

---

## Webhooks

Configure webhooks to receive notifications about content generation jobs.

### Webhook Events

- `content.generation.started` - Content generation started
- `content.generation.completed` - Content generation completed
- `content.generation.failed` - Content generation failed

### Webhook Payload

```json
{
  "event": "content.generation.completed",
  "timestamp": "2025-10-09T14:30:00Z",
  "data": {
    "id": "job_abc123",
    "type": "blog",
    "status": "completed",
    "result": {
      "id": "blog_xyz789",
      "title": "Generated Blog Title"
    }
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { WissenHandelnClient } from '@wissen-handeln/sdk';

const client = new WissenHandelnClient({
  apiKey: process.env.API_KEY,
});

// Generate blog post
const blog = await client.content.generateBlog({
  topic: 'Knowledge Management',
  tone: 'professional',
  length: 'medium',
});

console.log(blog.title);
```

### Python

```python
from wissen_handeln import Client

client = Client(api_key=os.environ['API_KEY'])

# Generate blog post
blog = client.content.generate_blog(
    topic='Knowledge Management',
    tone='professional',
    length='medium'
)

print(blog.title)
```

---

## Best Practices

1. **Cache Results**: Cache generated content to avoid redundant API calls
2. **Batch Requests**: Combine multiple requests when possible
3. **Error Handling**: Implement retry logic with exponential backoff
4. **Rate Limiting**: Monitor rate limits and implement client-side throttling
5. **Validation**: Validate generated content before publishing
6. **Security**: Never expose API keys in client-side code

---

## Support

- **API Status**: https://status.wissen-handeln.com
- **Documentation**: https://docs.wissen-handeln.com
- **Support Email**: api-support@wissen-handeln.com

---

**Version**: 1.0.0
**Last Updated**: 2025-10-09
