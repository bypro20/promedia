/** Eski sistemde bakiye talepleri ticket olarak kaydedilmişti — destekten ayır */
export function isLegacyDepositTicket(subject: string) {
  return /^Bakiye yükleme talebi/i.test(subject.trim())
}

export const SUPPORT_TICKET_FILTER = {
  NOT: {
    subject: { startsWith: 'Bakiye yükleme talebi' },
  },
} as const
