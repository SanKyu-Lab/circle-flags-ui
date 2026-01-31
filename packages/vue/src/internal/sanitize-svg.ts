export function sanitizeSvg(raw: string): string {
  if (typeof DOMParser === 'undefined') return raw

  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')
  const svg = doc.documentElement

  if (!svg || doc.querySelector('parsererror')) return raw

  svg.querySelectorAll('script,foreignObject').forEach(el => el.remove())

  svg.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()

      if (name.startsWith('on')) {
        try {
          el.removeAttribute(attr.name)
        } catch {
          try {
            el.setAttribute(attr.name, '')
          } catch {
            // Ignore in test / non-DOM environments
          }
        }
        return
      }

      if ((name === 'href' || name === 'xlink:href') && value.startsWith('javascript:')) {
        try {
          el.removeAttribute(attr.name)
        } catch {
          try {
            el.setAttribute(attr.name, '')
          } catch {
            // Ignore in test / non-DOM environments
          }
        }
      }
    })
  })

  return svg.outerHTML
}
