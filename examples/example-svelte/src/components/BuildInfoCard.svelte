<script lang="ts">
  import InfoLink from './InfoLink.svelte'
  import {
    formatBuiltAt,
    getGithubCommitUrl,
    getPackageReadmeBlobUrl,
    getProjectLogoUrl,
    getFrameworkLogoUrl,
    getGithubReleaseTagUrl,
    getNpmPackageUrl,
    shortCommit,
  } from '../libs/shared/build-info'
  import type { BuildMeta } from '@sankyu/svelte-circle-flags'

  interface Props {
    packageName: string
    meta: BuildMeta
  }

  let { packageName, meta }: Props = $props()

  const builtAtText = $derived(formatBuiltAt(meta.builtTimestamp))
  const commitShort = $derived(shortCommit(meta.commitHash))
  const npmUrl = $derived(getNpmPackageUrl(packageName))
  const packageReadmeUrl = $derived(getPackageReadmeBlobUrl('svelte'))
  const projectLogoUrl = $derived(getProjectLogoUrl())
  const frameworkLogoUrl = $derived(getFrameworkLogoUrl('svelte'))
  const commitUrl = $derived(getGithubCommitUrl(meta.commitHash))
  const releaseUrl = $derived(getGithubReleaseTagUrl('svelte', meta.version))
</script>

<div
  class="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-neutral-50 p-5 shadow-sm"
>
  <div
    class="border-b border-gray-200 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400"
  >
    BUILD INFO (
    <span class="inline-flex items-center gap-1 align-middle">
      <InfoLink
        href={packageReadmeUrl}
        className="inline-flex items-center text-inherit hover:text-indigo-500 hover:cursor-alias hover:no-underline"
      >
        <img src={projectLogoUrl} alt="circle-flags-ui package README" class="size-4" />
      </InfoLink>
      <InfoLink
        href={npmUrl}
        className="inline-flex items-center text-inherit hover:text-indigo-500 hover:cursor-alias hover:no-underline"
      >
        <img src={frameworkLogoUrl} alt={packageName} class="size-4" />
      </InfoLink>
    </span>
    )
  </div>

  <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-sm leading-snug">
    <span class="font-semibold text-gray-700">Version:</span>
    <InfoLink href={releaseUrl}>{meta.version}</InfoLink>

    <span class="font-semibold text-gray-700">Commit:</span>
    <InfoLink href={commitUrl} className="font-mono">{commitShort}</InfoLink>

    <span class="font-semibold text-gray-700">Built at:</span>
    <span class="text-gray-600">{builtAtText}</span>
  </div>
</div>
