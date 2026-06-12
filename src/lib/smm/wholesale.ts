import { SMM_PANEL_PRESETS } from './providers'

/** Toptan paneller eşlemede aracı panellere göre öncelikli */
export function isWholesaleProvider(id: string): boolean {
  return SMM_PANEL_PRESETS.find((p) => p.id === id)?.providerTier === 'wholesale'
}

export const WHOLESALE_SCORE_BOOST = 8
