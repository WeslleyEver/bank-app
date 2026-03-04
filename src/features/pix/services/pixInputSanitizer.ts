export function sanitizePixInput(raw: string): string {
  if (!raw) return "";

  return raw
    .trim()
    .replace(/\u200B/g, "") // remove zero-width space
    .replace(/\n|\r/g, "") // remove quebras de linha
    .replace(/\s+/g, ""); // remove espaços internos
}

export function isSuspiciousInput(value: string): boolean {
  const urlPattern = /(https?:\/\/|www\.|\.com|\.net|\.org|\.br|\.io|\.app)/i;

  const htmlPattern = /<[^>]*>/g;

  return urlPattern.test(value) || htmlPattern.test(value);
}
