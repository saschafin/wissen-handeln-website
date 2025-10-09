import { contentGenerator, type GeneratedContent, type ContentGenerationOptions } from './aiContentGenerator';

export interface BlogPost extends GeneratedContent {
  id: string;
  slug: string;
  author: string;
  publishedDate: Date;
  category: string;
  tags: string[];
  readingTime: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string[];
}

class ContentManager {
  private blogPosts: Map<string, BlogPost> = new Map();
  private services: Map<string, Service> = new Map();

  async generateBlogPost(
    topic: string,
    category: string,
    options?: Partial<ContentGenerationOptions>
  ): Promise<BlogPost> {
    const generatedContent = await contentGenerator.generateContent({
      topic,
      type: 'blog-post',
      tone: options?.tone || 'professional',
      language: options?.language || 'de',
      maxTokens: options?.maxTokens || 1500,
    });

    const slug = this.createSlug(generatedContent.title);
    const readingTime = this.calculateReadingTime(generatedContent.content);

    const blogPost: BlogPost = {
      ...generatedContent,
      id: `blog-${Date.now()}`,
      slug,
      author: 'wissen-handeln.com',
      publishedDate: new Date(),
      category,
      tags: generatedContent.keywords,
      readingTime,
    };

    this.blogPosts.set(blogPost.id, blogPost);
    return blogPost;
  }

  async generateServiceDescription(
    serviceName: string,
    options?: Partial<ContentGenerationOptions>
  ): Promise<GeneratedContent> {
    return await contentGenerator.generateContent({
      topic: serviceName,
      type: 'service-description',
      tone: options?.tone || 'professional',
      language: options?.language || 'de',
      maxTokens: options?.maxTokens || 1000,
    });
  }

  async generateAboutContent(
    focus: string,
    options?: Partial<ContentGenerationOptions>
  ): Promise<GeneratedContent> {
    return await contentGenerator.generateContent({
      topic: focus,
      type: 'about-section',
      tone: options?.tone || 'professional',
      language: options?.language || 'de',
      maxTokens: options?.maxTokens || 1200,
    });
  }

  async generateCaseStudy(
    project: string,
    options?: Partial<ContentGenerationOptions>
  ): Promise<GeneratedContent> {
    return await contentGenerator.generateContent({
      topic: project,
      type: 'case-study',
      tone: options?.tone || 'professional',
      language: options?.language || 'de',
      maxTokens: options?.maxTokens || 1500,
    });
  }

  getBlogPosts(category?: string): BlogPost[] {
    const posts = Array.from(this.blogPosts.values());

    if (category) {
      return posts.filter(post => post.category === category);
    }

    return posts.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  }

  getBlogPost(slug: string): BlogPost | undefined {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  getServices(): Service[] {
    return Array.from(this.services.values());
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  initializeDefaultServices(): void {
    const defaultServices: Service[] = [
      {
        id: 'service-1',
        slug: 'strategieberatung',
        title: 'Strategieberatung',
        description: 'Entwicklung maßgeschneiderter Strategien für nachhaltiges Wachstum',
        icon: 'strategy',
        features: [
          'Analyse der Ausgangssituation',
          'Entwicklung strategischer Optionen',
          'Roadmap-Erstellung',
          'Umsetzungsbegleitung',
        ],
        benefits: [
          'Klare strategische Ausrichtung',
          'Messbare Ziele',
          'Nachhaltige Wettbewerbsvorteile',
        ],
      },
      {
        id: 'service-2',
        slug: 'change-management',
        title: 'Change Management',
        description: 'Begleitung von Veränderungsprozessen für erfolgreiche Transformation',
        icon: 'change',
        features: [
          'Stakeholder-Analyse',
          'Kommunikationskonzepte',
          'Schulung und Coaching',
          'Monitoring und Anpassung',
        ],
        benefits: [
          'Akzeptanz für Veränderungen',
          'Minimierung von Widerständen',
          'Nachhaltige Implementierung',
        ],
      },
      {
        id: 'service-3',
        slug: 'prozessoptimierung',
        title: 'Prozessoptimierung',
        description: 'Effizienzsteigerung durch systematische Prozessanalyse und -optimierung',
        icon: 'process',
        features: [
          'Ist-Analyse bestehender Prozesse',
          'Identifikation von Optimierungspotenzialen',
          'Neugestaltung von Abläufen',
          'Implementierungsunterstützung',
        ],
        benefits: [
          'Kostenreduktion',
          'Zeitersparnis',
          'Höhere Qualität',
        ],
      },
      {
        id: 'service-4',
        slug: 'digitale-transformation',
        title: 'Digitale Transformation',
        description: 'Unterstützung bei der digitalen Neuausrichtung Ihres Unternehmens',
        icon: 'digital',
        features: [
          'Digital Maturity Assessment',
          'Digitalisierungsstrategie',
          'Technologie-Beratung',
          'Kulturwandel-Begleitung',
        ],
        benefits: [
          'Wettbewerbsfähigkeit',
          'Innovation',
          'Effizienzgewinne',
        ],
      },
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }
}

export const contentManager = new ContentManager();
contentManager.initializeDefaultServices();
