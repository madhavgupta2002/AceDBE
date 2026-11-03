import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const READER_FONTS = [
  { id: 'inter', label: 'Inter', family: 'var(--font-inter, sans-serif), system-ui, sans-serif' },
  { id: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
  { id: 'merriweather', label: 'Merriweather', family: 'var(--font-merriweather), Georgia, serif' },
  { id: 'open-sans', label: 'Open Sans', family: 'var(--font-open-sans), system-ui, sans-serif' },
  { id: 'lora', label: 'Lora', family: 'var(--font-lora), Georgia, serif' },
  { id: 'roboto', label: 'Roboto', family: 'var(--font-roboto), system-ui, sans-serif' },
] as const;

export interface ReaderSettings {
  font: (typeof READER_FONTS)[number]['id'];
  size: number;
  tone: 'night' | 'paper';
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = { font: 'inter', size: 18, tone: 'night' };

export function parseReaderSettings(raw: string | null): ReaderSettings {
  try {
    const saved = JSON.parse(raw || '{}');
    return {
      font: READER_FONTS.some(font => font.id === saved?.font) ? saved.font : DEFAULT_READER_SETTINGS.font,
      size: typeof saved?.size === 'number' && Number.isFinite(saved.size)
        ? Math.min(26, Math.max(16, Math.round(saved.size))) : DEFAULT_READER_SETTINGS.size,
      tone: saved?.tone === 'paper' ? 'paper' : 'night',
    };
  } catch {
    return { ...DEFAULT_READER_SETTINGS };
  }
}

export interface NotesHeading {
  id: string;
  title: string;
  level: number;
}

interface MarkdownNode {
  type: string;
  value?: string;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
}

function visitHeadings(node: MarkdownNode, visit: (heading: MarkdownNode) => void) {
  if (node.type === 'heading') visit(node);
  node.children?.forEach(child => visitHeadings(child, visit));
}

function nodeText(node: MarkdownNode): string {
  return node.value ?? node.children?.map(nodeText).join('') ?? '';
}

/** Parse the same markdown as the reader: fenced code never becomes a contents entry. */
export function getNotesOutline(markdown: string): NotesHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(markdown);
  const usedIds = new Set<string>();
  const headings: NotesHeading[] = [];
  visitHeadings(tree as MarkdownNode, node => {
    const title = nodeText(node).trim();
    const base = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'section';
    let id = `notes-${base}`;
    let suffix = 2;
    while (usedIds.has(id)) id = `notes-${base}-${suffix++}`;
    usedIds.add(id);
    headings.push({ id, title, level: node.depth ?? 1 });
  });
  return headings;
}

/** Give rendering and navigation the same unique IDs, reserving h1 for the page title. */
export function notesHeadings(outline: NotesHeading[]) {
  return (tree: MarkdownNode) => {
    const levels = Array.from(new Set(outline.map(heading => heading.level))).sort((a, b) => a - b);
    let index = 0;
    visitHeadings(tree, node => {
      const heading = outline[index++];
      if (!heading) return;
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: heading.id } };
      node.depth = Math.min(6, 2 + levels.indexOf(heading.level));
    });
  };
}

