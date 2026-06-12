/** Client-side iyzico utilities (no secrets) */

export function isIyzicoEnabled() {
  return process.env.NEXT_PUBLIC_IYZICO_ENABLED === 'true'
}
