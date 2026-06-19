const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (input: string): string => {
  return input.replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char] ?? char)
}
