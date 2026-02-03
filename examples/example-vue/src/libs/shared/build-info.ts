// DO NOT EDIT.
// This file is auto-generated from examples/shared/lib.

export type FrameworkReleaseTag = 'react' | 'vue' | 'solid'

const DEFAULT_REPO = 'SanKyu-Lab/circle-flags-ui'

export function formatBuiltAt(builtTimestamp: number, locale: string = 'zh-CN'): string {
  return new Date(builtTimestamp).toLocaleString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function shortCommit(commitHash: string, length: number = 7): string {
  return commitHash.slice(0, length)
}

export function getNpmPackageUrl(packageName: string): string {
  return `https://www.npmjs.com/package/${packageName}`
}

export function getGithubCommitUrl(commitHash: string, repo: string = DEFAULT_REPO): string {
  return `https://github.com/${repo}/commit/${commitHash}`
}

export function getGithubReleaseTagUrl(
  framework: FrameworkReleaseTag,
  version: string,
  repo: string = DEFAULT_REPO
): string {
  return `https://github.com/${repo}/releases/tag/${framework}-v${version}`
}
