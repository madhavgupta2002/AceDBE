/** ReactMarkdown preconfigured with GFM tables and KaTeX math, shared by the quiz, review and passage views. */
import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const REMARK = [remarkGfm, remarkMath];
const REHYPE = [rehypeKatex];

export default function Markdown({ children, components }: { children: string; components?: Components }) {
  return (
    <ReactMarkdown remarkPlugins={REMARK} rehypePlugins={REHYPE} components={components}>
      {children}
    </ReactMarkdown>
  );
}

/** Renders markdown paragraphs inline, for option text that sits next to a label. */
export const inlineParagraphs: Components = {
  p: ({ children }) => <span className="inline">{children}</span>,
};
