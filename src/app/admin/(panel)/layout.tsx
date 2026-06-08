import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminShell } from '@/components/admin/shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user || user.role !== 'admin') redirect('/admin/giris?next=/admin')

  return <AdminShell adminEmail={user.email}>{children}</AdminShell>
}
