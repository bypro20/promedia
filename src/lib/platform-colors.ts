export type PlatformColor = {
  primary: string
  light: string
  dark: string
  gradient: string
}

export const PLATFORM_COLORS: Record<string, PlatformColor> = {
  instagram: { primary: '#E1306C', light: '#FDE8F0', dark: '#C13584', gradient: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)' },
  tiktok: { primary: '#000000', light: '#F0F0F0', dark: '#010101', gradient: 'linear-gradient(135deg,#010101,#ee1d52)' },
  youtube: { primary: '#FF0000', light: '#FFE5E5', dark: '#CC0000', gradient: 'linear-gradient(135deg,#cc0000,#ff0000)' },
  twitter: { primary: '#1DA1F2', light: '#E8F5FE', dark: '#0d8bd9', gradient: 'linear-gradient(135deg,#1da1f2,#0d8bd9)' },
  facebook: { primary: '#4267B2', light: '#E8EEF8', dark: '#365899', gradient: 'linear-gradient(135deg,#4267B2,#365899)' },
  telegram: { primary: '#0088CC', light: '#E5F4FB', dark: '#006699', gradient: 'linear-gradient(135deg,#0088CC,#006699)' },
  spotify: { primary: '#1DB954', light: '#E8F8EE', dark: '#169c46', gradient: 'linear-gradient(135deg,#1DB954,#169c46)' },
  linkedin: { primary: '#0077B5', light: '#E5F2F8', dark: '#005885', gradient: 'linear-gradient(135deg,#0077B5,#005885)' },
  pinterest: { primary: '#E60023', light: '#FDE8EB', dark: '#bd001c', gradient: 'linear-gradient(135deg,#E60023,#bd001c)' },
  twitch: { primary: '#9146FF', light: '#F0E8FF', dark: '#772ce8', gradient: 'linear-gradient(135deg,#9146FF,#772ce8)' },
  discord: { primary: '#5865F2', light: '#EEF0FE', dark: '#4752c4', gradient: 'linear-gradient(135deg,#5865F2,#4752c4)' },
  threads: { primary: '#000000', light: '#F5F5F5', dark: '#333333', gradient: 'linear-gradient(135deg,#000,#333)' },
  kick: { primary: '#53FC18', light: '#EDFFE8', dark: '#3db812', gradient: 'linear-gradient(135deg,#53FC18,#3db812)' },
  soundcloud: { primary: '#FF5500', light: '#FFEEE5', dark: '#e64d00', gradient: 'linear-gradient(135deg,#FF5500,#e64d00)' },
}

export function getPlatformColor(slug: string): PlatformColor {
  return PLATFORM_COLORS[slug] ?? {
    primary: '#7844E4',
    light: '#EDE5FF',
    dark: '#6835d3',
    gradient: 'linear-gradient(135deg,#7844E4,#6835d3)',
  }
}

export const TIER_COLORS: Record<string, { bg: string; active: string; label: string }> = {
  ucuz: { bg: '#10B981', active: '#059669', label: 'Ucuz Global' },
  standart: { bg: '#3382FA', active: '#2563EB', label: 'Global Standart' },
  premium: { bg: '#7844E4', active: '#6835d3', label: 'Global Premium' },
  gercek: { bg: '#FD5501', active: '#EF4444', label: 'Gerçek VIP' },
}
