import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PanelSidebar } from '@/components/panel/sidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/giris?next=/panel')

  return (
    <div className="flex min-h-screen bg-[#F0F1F9]">
      <PanelSidebar user={user} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
