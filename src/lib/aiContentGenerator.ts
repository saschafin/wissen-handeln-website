import OpenAI from 'openai';

interface ContentGenerationOptions {
  topic: string;
  type: 'blog-post' | 'service-description' | 'about-section' | 'case-study';
  tone?: 'professional' | 'conversational' | 'academic';
  maxTokens?: number;
  language?: 'de' | 'en';
}

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  keywords: string[];
  generatedAt: Date;
}

class AIContentGenerator {
  private openai: OpenAI | null = null;
  private cache: Map<string, { content: GeneratedContent; timestamp: number }> = new Map();
  private cacheTTL: number;

  constructor() {
    // Initialize OpenAI only if API key is available
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }

    this.cacheTTL = parseInt(import.meta.env.CONTENT_CACHE_TTL || '3600', 10) * 1000;
  }

  private getCacheKey(options: ContentGenerationOptions): string {
    return JSON.stringify({
      topic: options.topic,
      type: options.type,
      tone: options.tone || 'professional',
      language: options.language || 'de',
    });
  }

  private getCachedContent(key: string): GeneratedContent | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.content;
  }

  private setCachedContent(key: string, content: GeneratedContent): void {
    this.cache.set(key, {
      content,
      timestamp: Date.now(),
    });
  }

  private getSystemPrompt(type: string, language: string): string {
    const prompts = {
      'blog-post': language === 'de'
        ? 'Du bist ein erfahrener Content-Autor, der informative und ansprechende Blog-Beiträge schreibt. Erstelle gut strukturierte Artikel mit klaren Überschriften, praktischen Beispielen und handlungsorientierten Schlussfolgerungen.'
        : 'You are an experienced content writer who creates informative and engaging blog posts. Create well-structured articles with clear headings, practical examples, and actionable conclusions.',

      'service-description': language === 'de'
        ? 'Du bist ein Marketing-Experte, der überzeugende Leistungsbeschreibungen erstellt. Fokussiere dich auf Kundennutzen, konkrete Ergebnisse und klare Handlungsaufforderungen.'
        : 'You are a marketing expert who creates compelling service descriptions. Focus on customer benefits, concrete results, and clear calls to action.',

      'about-section': language === 'de'
        ? 'Du bist ein Unternehmenskommunikations-Spezialist, der authentische und vertrauenswürdige "Über uns"-Texte verfasst. Betone Expertise, Werte und den einzigartigen Ansatz.'
        : 'You are a corporate communications specialist who writes authentic and trustworthy "About" content. Emphasize expertise, values, and unique approach.',

      'case-study': language === 'de'
        ? 'Du bist ein Business-Analyst, der überzeugende Fallstudien erstellt. Strukturiere die Inhalte nach: Herausforderung, Lösung, Ergebnis. Verwende konkrete Zahlen und Fakten.'
        : 'You are a business analyst who creates compelling case studies. Structure content as: Challenge, Solution, Result. Use concrete numbers and facts.',
    };

    return prompts[type as keyof typeof prompts] || prompts['blog-post'];
  }

  private getUserPrompt(options: ContentGenerationOptions): string {
    const { topic, type, tone = 'professional', language = 'de' } = options;

    if (language === 'de') {
      return `Erstelle einen ${type === 'blog-post' ? 'Blog-Beitrag' : type === 'service-description' ? 'Leistungsbeschreibung' : type === 'about-section' ? 'Über-uns-Text' : 'Fallstudie'} zum Thema: "${topic}".

Ton: ${tone === 'professional' ? 'professionell' : tone === 'conversational' ? 'gesprächig' : 'akademisch'}

Format:
- Gib einen prägnanten Titel (max. 60 Zeichen)
- Schreibe einen ansprechenden Haupttext (300-500 Wörter)
- Erstelle einen kurzen Teaser (max. 150 Zeichen)
- Liste 5 relevante Keywords auf

Antworte im JSON-Format:
{
  "title": "Der Titel",
  "content": "Der Hauptinhalt mit Markdown-Formatierung",
  "excerpt": "Der Teaser-Text",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;
    } else {
      return `Create a ${type} about: "${topic}".

Tone: ${tone}

Format:
- Provide a concise title (max. 60 characters)
- Write engaging main content (300-500 words)
- Create a short excerpt (max. 150 characters)
- List 5 relevant keywords

Respond in JSON format:
{
  "title": "The Title",
  "content": "The main content with Markdown formatting",
  "excerpt": "The excerpt text",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;
    }
  }

  async generateContent(options: ContentGenerationOptions): Promise<GeneratedContent> {
    // Check cache first
    const cacheKey = this.getCacheKey(options);
    const cachedContent = this.getCachedContent(cacheKey);
    if (cachedContent) {
      return cachedContent;
    }

    // If no OpenAI client, return fallback content
    if (!this.openai) {
      return this.getFallbackContent(options);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(options.type, options.language || 'de'),
          },
          {
            role: 'user',
            content: this.getUserPrompt(options),
          },
        ],
        max_tokens: options.maxTokens || 1500,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No content generated');
      }

      const parsed = JSON.parse(responseContent);
      const generatedContent: GeneratedContent = {
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        keywords: parsed.keywords,
        generatedAt: new Date(),
      };

      // Cache the result
      this.setCachedContent(cacheKey, generatedContent);

      return generatedContent;
    } catch (error) {
      console.error('AI content generation failed:', error);
      return this.getFallbackContent(options);
    }
  }

  private getFallbackContent(options: ContentGenerationOptions): GeneratedContent {
    const language = options.language || 'de';

    if (language === 'de') {
      return {
        title: `${options.topic} - Professionelle Beratung`,
        content: `# ${options.topic}

Wir unterstützen Sie dabei, Ihr Wissen in konkretes Handeln umzusetzen.

## Unsere Expertise

Mit langjähriger Erfahrung in der Beratung helfen wir Ihnen, maßgeschneiderte Lösungen für Ihre Herausforderungen zu entwickeln.

## Ihr Nutzen

- Praxisorientierte Strategien
- Messbare Ergebnisse
- Nachhaltige Veränderung

Kontaktieren Sie uns für ein unverbindliches Gespräch.`,
        excerpt: `Professionelle Beratung für ${options.topic} - Wir setzen Wissen in Handeln um.`,
        keywords: ['Beratung', 'Strategie', 'Umsetzung', options.topic, 'Expertise'],
        generatedAt: new Date(),
      };
    } else {
      return {
        title: `${options.topic} - Professional Consulting`,
        content: `# ${options.topic}

We support you in transforming knowledge into action.

## Our Expertise

With years of experience in consulting, we help you develop tailored solutions for your challenges.

## Your Benefits

- Practice-oriented strategies
- Measurable results
- Sustainable change

Contact us for a no-obligation consultation.`,
        excerpt: `Professional consulting for ${options.topic} - We turn knowledge into action.`,
        keywords: ['Consulting', 'Strategy', 'Implementation', options.topic, 'Expertise'],
        generatedAt: new Date(),
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const contentGenerator = new AIContentGenerator();
export type { ContentGenerationOptions, GeneratedContent };
