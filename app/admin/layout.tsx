'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, FileCode2, Settings, LogOut, Loader2, User } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('prepgrid_role')
    if (role !== 'admin') {
      router.push('/dashboard')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('prepgrid_role')
    router.push('/auth')
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const navLinks = [
    { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
    { href: '/admin/questions', label: 'Questions', icon: FileCode2 },
    { href: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0c] flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold shadow-lg shadow-primary/20">
              P
            </div>
            <span className="font-black tracking-tight text-lg">PrepGrid AI <span className="text-primary text-xs ml-1 uppercase">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {navLinks.find(l => pathname === l.href || (l.href !== '/admin' && pathname?.startsWith(l.href)))?.label || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 lg:p-10 flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
