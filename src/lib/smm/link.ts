import type { ServiceDefinition } from '@/lib/packages'

function stripAt(value: string) {
  return value.trim().replace(/^@+/, '')
}

function ensureHttps(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export function buildTargetLink(service: ServiceDefinition, rawInput: string): string {
  const input = rawInput.trim()
  if (!input) throw new Error('Hedef kullanıcı adı veya link gerekli')

  if (/^https?:\/\//i.test(input)) return input

  const username = stripAt(input)
  const platform = service.platformSlug

  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/${username}/`
    case 'tiktok':
      return `https://www.tiktok.com/@${username}`
    case 'youtube':
      if (input.startsWith('UC') || input.includes('/channel/') || input.includes('/@')) {
        return ensureHttps(input.includes('/') ? input : `youtube.com/channel/${input}`)
      }
      return `https://www.youtube.com/@${username}`
    case 'twitter':
      return `https://x.com/${username}`
    case 'facebook':
      return `https://www.facebook.com/${username}`
    case 'telegram':
      return ensureHttps(input.startsWith('t.me') ? input : `t.me/${username}`)
    case 'spotify':
      return ensureHttps(input)
    case 'linkedin':
      return ensureHttps(input.includes('linkedin.com') ? input : `linkedin.com/in/${username}`)
    case 'pinterest':
      return `https://www.pinterest.com/${username}/`
    case 'twitch':
      return `https://www.twitch.tv/${username}`
    case 'discord':
      return ensureHttps(input)
    case 'threads':
      return `https://www.threads.net/@${username}`
    case 'kick':
      return `https://kick.com/${username}`
    case 'soundcloud':
      return ensureHttps(input.includes('soundcloud.com') ? input : `soundcloud.com/${username}`)
    default:
      if (service.inputPrefix === '@' || service.inputPrefix === '') {
        return ensureHttps(input)
      }
      return `${service.inputPrefix}${username}`
  }
}
