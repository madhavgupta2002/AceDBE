// Reject path traversal / illegal characters in user-supplied path segments.
export function isSafeSegment(value: string | null): value is string {
    if (!value) return false;
    if (value.includes('..') || value.includes('/') || value.includes('\\')) return false;
    return /^[\w\s.,()&+\-]+$/.test(value);
}
