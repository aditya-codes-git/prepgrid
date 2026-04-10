'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Sparkles, LayoutDashboard, Code2, Video, Clock, Search, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Practice', href: '/dashboard/practice', icon: Code2 },
  { name: 'Interview', href: '/dashboard/interview', icon: Video },
  { name: 'History', href: '/dashboard/history', icon: Clock },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
            {/* Mobile Logo Only */}
            <div className="relative w-10 h-10 md:hidden">
              <Image src="/Logo/prepgrid_logo_only.png" alt="PrepGrid Logo" fill className="object-contain" />
            </div>
            {/* Desktop Full Logo */}
            <div className="relative h-10 w-40 hidden md:block">
              <Image src="/Logo/prepgrid_full.png" alt="PrepGrid AI Logo" fill className="object-contain object-left" />
            </div>
          </Link>

          {/* Center Links (Desktop only) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 text-white border border-white/5 shadow-[0_0_12px_rgba(255,255,255,0.05)]' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Search */}
            <div className="hidden sm:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search problems..." 
                className="w-48 xl:w-64 h-9 pl-9 pr-4 rounded-full bg-white/[0.03] border border-white/5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Avatar Profile Dropdown - CSS Hover Approach */}
            <div className="relative group">
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="text-sm font-black text-primary">
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl bg-[#0a0a0c] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-sm font-semibold truncate text-white">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <Link href="/dashboard/profile" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
