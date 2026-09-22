'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Building2, Heart, MessageSquare, 
  Settings, LogOut, ChevronRight, User, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Building2, label: 'My Listings', href: '/dashboard/listings' },
  { icon: Heart, label: 'Liked Properties', href: '/dashboard/saved' },
  { icon: MessageSquare, label: 'Enquiries', href: '/dashboard/leads' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isHydrated, openLogin } = useAuthStore()

  useEffect(() => {
    if (isHydrated && !user) {
      openLogin()
      router.push('/') // Redirect away from protected dashboard
    }
  }, [isHydrated, user, openLogin, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isHydrated || !user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="h-20 flex items-center px-8 border-b border-slate-50">
          <Link href="/" className="text-xl font-serif font-bold text-[var(--primary-600)]">
            ApnaNest <span className="text-xs font-sans text-slate-400 font-normal">Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                  isActive 
                    ? "bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-serif font-bold text-slate-900">
            {MENU_ITEMS.find(i => i.href === pathname)?.label || 'Dashboard'}
          </h1>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name ?? 'My Account'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.roleId === 2 ? 'Owner' : user?.roleId === 4 ? 'Admin' : 'Buyer'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
