/** Shared markdown preprocessing for question and passage text. */

/**
 * Turns literal "\n" into newlines and escapes currency "$" (e.g. "$30", "$ 2,500", "$___") so it does not
 * start a math span. Inline math such as "$\times$" and "$$...$$" blocks are left untouched.
 */
export function formatQuizText(text: string): string {
  let processed = text.replace(/\\n/g, '\n');
  const mathBlocks: string[] = [];
  processed = processed.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    mathBlocks.push(match);
    return `\x00MATH${mathBlocks.length - 1}\x00`;
  });
  processed = processed.replace(/\$\s*(?=[0-9_])/g, '\\$');
  return processed.replace(/\x00MATH(\d+)\x00/g, (_, i) => mathBlocks[parseInt(i, 10)]);
}
