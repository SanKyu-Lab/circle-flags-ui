// DO NOT EDIT.
// This file is auto-generated from examples/shared/lib.

export const FLAG_GRID_CODES = [
  ['US', 'GB', 'NO', 'SE', 'GR', 'EU', 'AQ'],
  ['CN', 'TR', 'CH', 'DK', 'CA', 'PL', 'JP'],
  ['DE', 'FR', 'IT', 'IN', 'BR', 'AR', 'KR'],
] as const

export type FlagGridCode = (typeof FLAG_GRID_CODES)[number][number]

export function createFlagGridRows<T>(mapCode: (code: FlagGridCode) => T): T[][] {
  return FLAG_GRID_CODES.map(row => row.map(mapCode))
}
