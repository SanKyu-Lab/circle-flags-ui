import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const websiteDir = resolve(import.meta.dirname, '..')
const distDir = join(websiteDir, 'dist')
const docsDir = join(websiteDir, 'src', 'content', 'docs')
const siteOrigin = 'https://react-circle-flags.js.org'

const walkFiles = async (directory, extensions) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(entry => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walkFiles(path, extensions) : [path]
    })
  )

  return nestedFiles.flat().filter(path => extensions.has(extname(path)))
}

const toPageUrl = htmlPath => {
  const relativePath = relative(distDir, htmlPath).replaceAll('\\', '/')
  if (relativePath === 'index.html') return `${siteOrigin}/`
  if (relativePath.endsWith('/index.html')) {
    return `${siteOrigin}/${relativePath.slice(0, -'index.html'.length)}`
  }
  return `${siteOrigin}/${relativePath}`
}

const resolveOutputPath = pathname => {
  const decodedPath = decodeURIComponent(pathname)
  if (decodedPath === '/404/' && existsSync(join(distDir, '404.html'))) {
    return join(distDir, '404.html')
  }

  const outputPath = join(distDir, decodedPath)
  const candidates = [
    outputPath,
    join(outputPath, 'index.html'),
    extname(outputPath) ? '' : `${outputPath}.html`,
  ].filter(Boolean)

  return candidates.find(candidate => existsSync(candidate))
}

const checkInternalLinks = async () => {
  if (!existsSync(distDir)) {
    throw new Error('website/dist 不存在；请先运行网站构建。')
  }

  const htmlFiles = await walkFiles(distDir, new Set(['.html']))
  const errors = []

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf8')
    const pageUrl = toPageUrl(htmlPath)
    const hrefs = [...html.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)')/g)].map(
      match => match[1] ?? match[2]
    )

    for (const href of hrefs) {
      if (
        !href ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('data:')
      ) {
        continue
      }

      const targetUrl = new URL(href, pageUrl)
      if (targetUrl.origin !== siteOrigin) continue

      const targetPath = resolveOutputPath(targetUrl.pathname)
      if (!targetPath) {
        errors.push(`${relative(distDir, htmlPath)} -> ${href}`)
        continue
      }

      if (!targetUrl.hash || extname(targetPath) !== '.html') continue

      const fragment = decodeURIComponent(targetUrl.hash.slice(1))
      const targetHtml = targetPath === htmlPath ? html : await readFile(targetPath, 'utf8')
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const hasFragment = new RegExp(
        `(?:id|name)=(?:"${escapedFragment}"|'${escapedFragment}')`
      ).test(targetHtml)

      if (!hasFragment) {
        errors.push(`${relative(distDir, htmlPath)} -> ${href}（锚点不存在）`)
      }
    }
  }

  return errors
}

const extractCodeFences = source => {
  const lines = source.split('\n')
  const fences = []

  for (let index = 0; index < lines.length; index += 1) {
    const opening = lines[index].match(/^\s*```([a-zA-Z0-9+-]*)/)
    if (!opening) continue

    const language = opening[1].toLowerCase()
    const startLine = index + 1
    const body = []

    index += 1
    while (index < lines.length && !/^\s*```/.test(lines[index])) {
      body.push(lines[index])
      index += 1
    }

    fences.push({ language, code: body.join('\n'), startLine })
  }

  return fences
}

const collectTopLevelNames = sourceFile => {
  const names = new Map()
  const duplicates = []

  const addName = (name, line) => {
    if (names.has(name)) {
      duplicates.push(`${name}（首次位于第 ${names.get(name)} 行）`)
      return
    }
    names.set(name, line)
  }

  for (const statement of sourceFile.statements) {
    if (
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
      statement.name
    ) {
      addName(
        statement.name.text,
        sourceFile.getLineAndCharacterOfPosition(statement.name.getStart()).line + 1
      )
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          addName(
            declaration.name.text,
            sourceFile.getLineAndCharacterOfPosition(declaration.name.getStart()).line + 1
          )
        }
      }
    }
  }

  return duplicates
}

const checkScript = ({ code, language, file, startLine }) => {
  const scriptKind =
    language === 'tsx' || language === 'jsx'
      ? ts.ScriptKind.TSX
      : language === 'js'
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS
  const sourceFile = ts.createSourceFile(
    `${file}.${language || 'ts'}`,
    code,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  )

  const errors = sourceFile.parseDiagnostics.map(diagnostic => {
    const position = diagnostic.start ?? 0
    const line = sourceFile.getLineAndCharacterOfPosition(position).line + startLine
    return `${file}:${line} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
  })

  for (const duplicate of collectTopLevelNames(sourceFile)) {
    errors.push(`${file}:${startLine} 顶层声明重复：${duplicate}`)
  }

  return errors
}

const checkCodeSnippets = async () => {
  const docsFiles = await walkFiles(docsDir, new Set(['.md', '.mdx']))
  const errors = []

  for (const path of docsFiles) {
    if (path.startsWith(join(docsDir, 'reference'))) continue

    const source = await readFile(path, 'utf8')
    const file = relative(websiteDir, path)
    const fences = extractCodeFences(source)

    for (const fence of fences) {
      if (['js', 'jsx', 'ts', 'tsx', 'typescript'].includes(fence.language)) {
        errors.push(...checkScript({ ...fence, file }))
      }

      if (fence.language === 'html') {
        for (const match of fence.code.matchAll(
          /<script\s+type=(?:"module"|'module')\s*>([\s\S]*?)<\/script>/g
        )) {
          errors.push(
            ...checkScript({
              code: match[1],
              language: 'js',
              file,
              startLine: fence.startLine + fence.code.slice(0, match.index).split('\n').length,
            })
          )
        }
      }

      if (
        fence.language === 'svelte' &&
        /import\s*\{[^}]+\}\s*from\s*['"]@sankyu\/svelte-circle-flags\/flags\//.test(fence.code)
      ) {
        errors.push(
          `${file}:${fence.startLine} Svelte flags/* 子路径只提供 default export，不能使用命名导入`
        )
      }
    }
  }

  return errors
}

const [linkErrors, snippetErrors] = await Promise.all([checkInternalLinks(), checkCodeSnippets()])
const errors = [...linkErrors, ...snippetErrors]

if (errors.length > 0) {
  console.error(
    `文档验证失败，共 ${errors.length} 项：\n${errors.map(error => `- ${error}`).join('\n')}`
  )
  process.exitCode = 1
} else {
  console.log('✅ 文档代码块语法与构建后站内链接检查通过')
}
