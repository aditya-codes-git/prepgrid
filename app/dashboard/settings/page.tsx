'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-context'
import { User, Mail, Globe, Monitor, LogOut, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  // Profile Form State
  const [fullName, setFullName] = useState('')
  
  // Preferences State
  const [defaultLanguage, setDefaultLanguage] = useState('python')

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '')
      
      // Load local preferences
      const savedLang = localStorage.getItem('prepgrid_default_lang')
      if (savedLang) {
        setDefaultLanguage(savedLang)
      }
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })

    if (!error) {
      setSuccessMsg('Profile updated successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
    setLoading(false)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setDefaultLanguage(newLang)
    localStorage.setItem('prepgrid_default_lang', newLang)
    setSuccessMsg('Preference saved locally.')
    setTimeout(() => setSuccessMsg(''), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('prepgrid_role')
    router.push('/')
  }

  return (
    <div className="max-w-4xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-white">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your account preferences and settings.</p>
      </div>

      <div className="space-y-8">
        
        {/* SUCCESS TOAST INLINE */}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold text-sm transition-all">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* SECTION: ACCOUNT */}
        <section className="bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" /> Account Information
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.02] border border-white/5 text-muted-foreground focus:outline-none cursor-not-allowed opacity-70"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Email cannot be changed directly. Contact support if needed.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.02] border border-white/10 text-white focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none transition-all placeholder:text-muted-foreground/40"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || fullName === user?.user_metadata?.full_name}
                className="h-10 px-6 rounded-xl bg-white border border-white hover:bg-white/90 text-black text-sm font-bold transition-all disabled:opacity-50 disabled:bg-white/10 disabled:border-white/5 disabled:text-white/50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </section>


        {/* SECTION: PREFERENCES */}
        <section className="bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
           <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-muted-foreground" /> Preferences
            </h2>

            <div className="space-y-6 max-w-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                <div>
                  <h3 className="font-bold text-white text-sm">Default Language</h3>
                  <p className="text-xs text-muted-foreground mt-1">Set the initial programming language for coding practice.</p>
                </div>
                <div className="relative min-w-[140px]">
                  <select 
                    value={defaultLanguage}
                    onChange={handleLanguageChange}
                    className="w-full h-10 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white appearance-none focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="python" className="bg-[#0a0a0c]">Python</option>
                    <option value="javascript" className="bg-[#0a0a0c]">JavaScript</option>
                    <option value="java" className="bg-[#0a0a0c]">Java</option>
                    <option value="cpp" className="bg-[#0a0a0c]">C++</option>
                    <option value="c" className="bg-[#0a0a0c]">C</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
                </div>
              </div>

               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div>
                  <h3 className="font-bold text-white text-sm">Theme Mode</h3>
                  <p className="text-xs text-muted-foreground mt-1">PrepGrid is currently optimized strictly for Dark Mode.</p>
                </div>
                <div className="relative min-w-[140px]">
                  <select disabled className="w-full h-10 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/50 appearance-none cursor-not-allowed">
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION: DANGER ZONE */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-red-400/80 mb-6 max-w-lg">
              Proceed with caution. These actions impact your session and data access.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <button 
                onClick={handleSignOut}
                className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-sm font-bold transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
