/**
 * Question images are plain Markdown images in the bank JSON, e.g. `![Figure](CLA_M4_Q03.png)`.
 * A bare file name refers to the folder named exactly like the bank (`CLA/Batch 1 CLA/CLA_M4_Q03.png`);
 * absolute URLs and site paths (`https://…`, `/…`) are left alone.
 */

const IMAGE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?\s*\)/g;
const isRelative = (src: string) => !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src);

/** Site path of a bank's image folder, with every segment URL-encoded. */
export function bankImageBase(subjectCode: string, bankType: string, bankName: string): string {
  return `/data/Subjects/${[subjectCode, bankType, bankName].map(encodeURIComponent).join('/')}/`;
}

/** Rewrites bank-relative image file names to site paths under `base`. */
export function resolveImages(text: string, base: string): string;
export function resolveImages(text: string | undefined, base: string): string | undefined;
export function resolveImages(text: string | undefined, base: string): string | undefined {
  if (!text || !text.includes('![')) return text;
  return text.replace(IMAGE, (match, alt: string, src: string) =>
    isRelative(src) ? `![${alt}](${base}${src.split('/').map(encodeURIComponent).join('/')})` : match
  );
}

/** Bank-relative image file names referenced in a text (used by tests to check the files exist). */
export function imageFiles(text: string | undefined): string[] {
  return text ? [...text.matchAll(IMAGE)].map((m) => m[2]).filter(isRelative) : [];
}
