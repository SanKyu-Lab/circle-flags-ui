<script lang="ts">
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
  } from '@sankyu/svelte-circle-flags'
  import FlagGrid from './components/FlagGrid.svelte'
  import BuildInfoCard from './components/BuildInfoCard.svelte'
  import { createFlagGridRows, type FlagGridCode } from './libs/shared/flag-grid'
  import type { Component } from 'svelte'

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

  const PKG_NAME = '@sankyu/svelte-circle-flags'
  const meta = buildMeta()
</script>

<main class="min-h-screen bg-gray-50 p-6">
  <div class="mx-auto max-w-4xl space-y-8">
    <div class="text-center">
      <h1 class="mb-2 text-3xl font-bold text-gray-900">{PKG_NAME}</h1>
      <p class="text-gray-600">400+ circular SVG flags for Svelte 5</p>
    </div>

    <FlagGrid rows={flagRows} />
    <BuildInfoCard packageName={PKG_NAME} {meta} />
  </div>
</main>
