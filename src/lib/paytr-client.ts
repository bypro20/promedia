export function getPaytrIframeUrl(token: string) {
  return `https://www.paytr.com/odeme/guvenli/${token}`
}

export function isPaytrEnabled() {
  return process.env.NEXT_PUBLIC_PAYTR_ENABLED === 'true'
}
