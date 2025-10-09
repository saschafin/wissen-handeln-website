/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string;
  readonly ANTHROPIC_API_KEY?: string;
  readonly CONTENT_CACHE_TTL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
