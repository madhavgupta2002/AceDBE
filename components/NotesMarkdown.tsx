'use client';

import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { notesHeadings, type NotesHeading } from '@/lib/notesReader';
import MermaidBlock from './MermaidBlock';

function htmlText(node: { value?: string; children?: unknown[] }): string {
  return node.value ?? node.children?.map(child => htmlText(child as Parameters<typeof htmlText>[0])).join('') ?? '';
}

const components: Components = {
  h2: ({ node, ...props }) => <h2 tabIndex={-1} {...props} />,
  h3: ({ node, ...props }) => <h3 tabIndex={-1} {...props} />,
  h4: ({ node, ...props }) => <h4 tabIndex={-1} {...props} />,
  h5: ({ node, ...props }) => <h5 tabIndex={-1} {...props} />,
  h6: ({ node, ...props }) => <h6 tabIndex={-1} {...props} />,
  ul: ({ node, ...props }) => <ul {...props} />,
  ol: ({ node, ...props }) => <ol {...props} />,
  code: ({ node, className, children, ...props }) => {
    if (className?.includes('language-mermaid')) {
      return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
    }
    return <code className={className} {...props}>{children}</code>;
  },
  pre: ({ node, children, ...props }) => {
    const code = node?.children[0];
    const classes = code?.type === 'element' ? code.properties.className : [];
    if (Array.isArray(classes) && classes.includes('language-mermaid')) return <>{children}</>;
    return <pre {...props}>{children}</pre>;
  },
  blockquote: ({ node, children, ...props }) => {
    const firstParagraph = node?.children.find(child => child.type === 'element' && child.tagName === 'p');
    const text = firstParagraph ? htmlText(firstParagraph).trim() : '';
    const practice = /^(?:CLA|practice|check your understanding|quick check)\s*[:：]/i.test(text);
    const caution = /^(?:warning|caution|important|watch out)\s*[:：]/i.test(text);
    const example = /^(?:example|tip|remember|note|key idea)\s*[:：]/i.test(text);
    const Icon = practice ? Target : caution ? AlertTriangle : Lightbulb;
    return (
      <blockquote data-kind={practice ? 'practice' : caution ? 'caution' : example ? 'idea' : 'quote'} {...props}>
        {(practice || caution || example) && <div className="notes-callout-label">
          <Icon size={16} aria-hidden="true" />
          {practice ? 'Try it yourself' : caution ? 'Pay attention' : 'Worth remembering'}
        </div>}
        {React.Children.map(children, child => {
          if (practice && React.isValidElement<{ node?: { tagName?: string } }>(child)
            && ['ul', 'ol'].includes(child.props.node?.tagName ?? '')) {
            return (
              <details className="notes-answer">
                <summary>Reveal answer</summary>
                <div>{child}</div>
              </details>
            );
          }
          return child;
        })}
      </blockquote>
    );
  },
  table: ({ node, ...props }) => (
    <div className="notes-table" role="region" aria-label="Notes table" tabIndex={0}>
      <table {...props} />
    </div>
  ),
  img: ({ node, alt, ...props }) => (
    // Markdown assets can be arbitrary external images; retain native sizing and loading.
    // eslint-disable-next-line @next/next/no-img-element
    <img loading="lazy" alt={alt ?? ''} {...props} />
  ),
};

export default function NotesMarkdown({ markdown, outline }: { markdown: string; outline: NotesHeading[] }) {
  const linkedComponents: Components = {
    ...components,
    a: ({ node, href, ...props }) => {
      const target = href?.startsWith('#') ? `notes-${href.slice(1)}` : '';
      const destination = outline.some(heading => heading.id === target) ? `#${target}` : href;
      return <a href={destination} {...props} />;
    },
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, [notesHeadings, outline]]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={linkedComponents}
    >
      {markdown}
    </ReactMarkdown>
  );
}
