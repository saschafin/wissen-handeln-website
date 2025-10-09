# wissen-handeln.com Website

Professional consulting website built with Astro and AI-powered content generation.

## Overview

This project leverages Astro for fast static site generation with AI-driven content capabilities using OpenAI.

## Features

- Modern, responsive design with Tailwind CSS
- AI-powered content generation using OpenAI
- TypeScript for type safety
- SEO optimized
- Fast static site generation
- Reusable component architecture

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layouts
│   ├── lib/            # Utilities and AI integration
│   ├── pages/          # Route pages
│   └── styles/         # Global styles
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## AI Content Generation

The website uses OpenAI's GPT-4 for dynamic content generation. Configure your API key in the `.env` file to enable this feature.

Content is automatically cached to reduce API calls and improve performance.

## Pages

- `/` - Home page with service overview
- `/about` - About us and company values
- `/services` - Detailed service descriptions
- `/blog` - Blog posts and articles
- `/blog/[slug]` - Individual blog post pages
- `/contact` - Contact form and information

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript checks
- `npm run lint` - Run ESLint

## License

Copyright © 2025 wissen-handeln.com
