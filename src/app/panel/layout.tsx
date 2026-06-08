import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PanelShell } from '@/components/panel/shell'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/giris?next=/panel')
  if (user.role === 'admin') redirect('/admin')

  return <PanelShell user={user}>{children}</PanelShell>
}
