export function formatDate(date: Date, locale: string = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export async function parseMarkdown(markdown: string): Promise<string> {
  // Simple markdown to HTML conversion
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700">$1</a>')
    .replace(/^- (.+)$/gim, '<li class="ml-4 mb-2">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside my-4">$1</ul>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|u|l])/gm, '<p class="mb-4">')
    .replace(/(?<!>)$/gm, '</p>');
}
