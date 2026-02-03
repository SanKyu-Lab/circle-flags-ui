import { InfoLink } from './InfoLink'
import {
  formatBuiltAt,
  getGithubCommitUrl,
  getGithubReleaseTagUrl,
  getNpmPackageUrl,
  shortCommit,
} from '@example-shared/build-info'

interface BuildInfoCardProps {
  packageName: string
  version: string
  commitHash: string
  builtTimestamp: number
}

export function BuildInfoCard({
  packageName,
  version,
  commitHash,
  builtTimestamp,
}: BuildInfoCardProps) {
  const builtAtText = formatBuiltAt(builtTimestamp)
  const commitShort = shortCommit(commitHash)
  const npmUrl = getNpmPackageUrl(packageName)
  const commitUrl = getGithubCommitUrl(commitHash)
  const releaseUrl = getGithubReleaseTagUrl('solid', version)

  return (
    <div class="w-full p-5 border border-gray-200 rounded-2xl bg-neutral-50 shadow-sm flex flex-col gap-3">
      <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-200">
        BUILD INFO (
        <InfoLink href={npmUrl} class="text-inherit hover:text-indigo-500 hover:cursor-alias">
          {packageName}
        </InfoLink>
        )
      </div>

      <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-sm leading-snug">
        <span class="font-semibold text-gray-700">Version:</span>
        <InfoLink href={releaseUrl}>{version}</InfoLink>

        <span class="font-semibold text-gray-700">Commit:</span>
        <InfoLink href={commitUrl} class="font-mono">
          {commitShort}
        </InfoLink>

        <span class="font-semibold text-gray-700">Built at:</span>
        <span class="text-gray-600">{builtAtText}</span>
      </div>
    </div>
  )
}
