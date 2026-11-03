/** Short label for a module: numeric ids become "M3"; named modules are shown as-is. */
export function moduleLabel(module: string | number | null | undefined): string {
  if (module === null || module === undefined) return '';
  const s = String(module).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `M${s}` : s;
}
