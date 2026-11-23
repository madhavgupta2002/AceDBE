/** ReactMarkdown preconfigured with GFM tables and KaTeX math, shared by the quiz, review and passage views. */
import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const REMARK = [remarkGfm, remarkMath];
const REHYPE = [rehypeKatex];

// Question figures (`![Figure](file.png)` in the bank JSON, resolved to a site path by the question loader).
const DEFAULT_COMPONENTS: Components = {
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : undefined}
      alt={alt || 'Question figure'}
      loading="lazy"
      className="block my-4 mx-auto max-w-full rounded-lg border border-surface-border/60 bg-white"
    />
  ),
};

export default function Markdown({ children, components }: { children: string; components?: Components }) {
  return (
    <ReactMarkdown remarkPlugins={REMARK} rehypePlugins={REHYPE} components={{ ...DEFAULT_COMPONENTS, ...components }}>
      {children}
    </ReactMarkdown>
  );
}

/** Renders markdown paragraphs inline, for option text that sits next to a label. */
export const inlineParagraphs: Components = {
  p: ({ children }) => <span className="inline">{children}</span>,
};
