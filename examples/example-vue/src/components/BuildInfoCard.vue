<script setup lang="ts">
import { computed } from 'vue'
import InfoLink from './InfoLink.vue'
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

interface BuildInfoCardProps {
  packageName: string
  version: string
  commitHash: string
  builtTimestamp: number
}

const props = defineProps<BuildInfoCardProps>()

const builtAtText = computed(() => formatBuiltAt(props.builtTimestamp))
const commitShort = computed(() => shortCommit(props.commitHash))
const npmUrl = computed(() => getNpmPackageUrl(props.packageName))
const packageReadmeUrl = computed(() => getPackageReadmeBlobUrl('vue'))
const projectLogoUrl = computed(() => getProjectLogoUrl())
const frameworkLogoUrl = computed(() => getFrameworkLogoUrl('vue'))
const commitUrl = computed(() => getGithubCommitUrl(props.commitHash))
const releaseUrl = computed(() => getGithubReleaseTagUrl('vue', props.version))
</script>

<template>
  <div
    class="w-full p-5 border border-gray-200 rounded-2xl bg-neutral-50 shadow-sm flex flex-col gap-3"
  >
    <div
      class="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-200"
    >
      BUILD INFO (
      <span class="inline-flex items-center gap-1 align-middle">
        <InfoLink
          :href="packageReadmeUrl"
          class-name="inline-flex items-center text-inherit hover:text-indigo-500 hover:cursor-alias hover:no-underline"
        >
          <img :src="projectLogoUrl" alt="circle-flags-ui package README" class="size-4" />
        </InfoLink>
        <InfoLink
          :href="npmUrl"
          class-name="inline-flex items-center text-inherit hover:text-indigo-500 hover:cursor-alias hover:no-underline"
        >
          <img :src="frameworkLogoUrl" :alt="packageName" class="size-4" />
        </InfoLink>
      </span>
      )
    </div>

    <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 text-sm leading-snug">
      <span class="font-semibold text-gray-700">Version:</span>
      <InfoLink :href="releaseUrl">{{ version }}</InfoLink>

      <span class="font-semibold text-gray-700">Commit:</span>
      <InfoLink :href="commitUrl" class-name="font-mono">{{ commitShort }}</InfoLink>

      <span class="font-semibold text-gray-700">Built at:</span>
      <span class="text-gray-600">{{ builtAtText }}</span>
    </div>
  </div>
</template>
