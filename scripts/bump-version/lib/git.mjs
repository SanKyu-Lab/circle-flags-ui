export const execGit = async (git, gitArgs) => (await git.raw(gitArgs)).trim()

export const getLatestPackageTag = async (git, slug) => {
  const tagsRaw = await execGit(git, ['tag', '--list', `${slug}-v*`, '--sort=-v:refname'])
  const tags = tagsRaw ? tagsRaw.split('\n').filter(Boolean) : []
  return tags[0] ?? ''
}

/**
 * Get packages that have changes since the latest tag of each package.
 * If a package has no tag, it is considered changed.
 */
export const getChangedPackages = async (git, allPackages) => {
  const changed = []

  for (const pkg of allPackages) {
    try {
      const latestTag = await getLatestPackageTag(git, pkg.slug)
      if (!latestTag) {
        changed.push(pkg)
        continue
      }

      const diff = await git.diff([latestTag, 'HEAD', '--', pkg.dir])
      if (diff.trim()) {
        changed.push(pkg)
      }
    } catch {
      changed.push(pkg)
    }
  }

  return changed
}

export const checkGitStatus = async git => {
  try {
    const status = await git.status()
    return {
      isClean: status.isClean(),
      modified: status.modified.length,
      staged: status.staged.length,
      untracked: status.not_added.length,
    }
  } catch {
    return { isClean: true, modified: 0, staged: 0, untracked: 0 }
  }
}
