<script setup lang="ts">
import type { Component } from 'vue'
import {
  FlagUs,
  FlagGb,
  FlagNo,
  FlagSe,
  FlagGr,
  FlagEu,
  FlagAqTrueSouth,
  FlagCn,
  FlagTr,
  FlagCh,
  FlagDk,
  FlagCa,
  FlagPl,
  FlagJp,
  FlagDe,
  FlagFr,
  FlagIt,
  FlagIn,
  FlagBr,
  FlagAr,
  FlagKr,
  buildMeta,
} from '@sankyu/vue-circle-flags'
import FlagGrid from './components/FlagGrid.vue'
import BuildInfoCard from './components/BuildInfoCard.vue'
import { createFlagGridRows, type FlagGridCode } from '@example-shared/flag-grid'

const FLAG_COMPONENTS = {
  US: FlagUs,
  GB: FlagGb,
  NO: FlagNo,
  SE: FlagSe,
  GR: FlagGr,
  EU: FlagEu,
  AQ: FlagAqTrueSouth,
  CN: FlagCn,
  TR: FlagTr,
  CH: FlagCh,
  DK: FlagDk,
  CA: FlagCa,
  PL: FlagPl,
  JP: FlagJp,
  DE: FlagDe,
  FR: FlagFr,
  IT: FlagIt,
  IN: FlagIn,
  BR: FlagBr,
  AR: FlagAr,
  KR: FlagKr,
} as const satisfies Record<FlagGridCode, Component>

const flagRows = createFlagGridRows(code => ({
  component: FLAG_COMPONENTS[code],
  code,
}))

const PKG_NAME = '@sankyu/vue-circle-flags'

const { version = 'unknown', commitHash = 'ffffffffffffffff', builtTimestamp = 0 } = buildMeta ?? {}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-white font-sans text-gray-700">
    <div class="flex flex-col gap-5 items-center w-95">
      <FlagGrid :rows="flagRows" />
      <BuildInfoCard
        :package-name="PKG_NAME"
        :version="version"
        :commit-hash="commitHash"
        :built-timestamp="builtTimestamp"
      />
    </div>
  </div>
</template>
