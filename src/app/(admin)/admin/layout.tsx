import { redirect } from 'next/navigation'
import { auth }     from '@/lib/auth'
import { AdminSidebar } from '@/components/dashboard/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) redirect('/')

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
