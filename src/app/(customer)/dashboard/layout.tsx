import { redirect } from 'next/navigation'
import { auth }     from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/dashboard')

  return (
    <div className="min-h-screen bg-cream">
      <div className="page-container py-8">
        <div className="flex gap-8">
          <DashboardSidebar user={session.user} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
