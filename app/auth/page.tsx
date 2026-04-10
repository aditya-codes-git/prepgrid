'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-context'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot'

type AuthMode = 'login' | 'signup'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  )
}

export default function AuthPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleGoogleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Failed to connect with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        })
        if (error) {
          setError(error.message)
        } else {
          setSuccess('Check your email for a confirmation link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setError(error.message)
        } else {
          router.push('/')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="relative h-screen grid lg:grid-cols-2 bg-[#050505] overflow-hidden">
      {/* CSS Hack to hide Spline watermark */}
      <style jsx global>{`
        a[href*="spline.design"] {
          display: none !important;
        }
        #spline-watermark {
          display: none !important;
        }
        body {
          overflow: hidden;
        }
      `}</style>

      {/* Left Side: Interactive Robot */}
      <div className="hidden lg:block relative w-full h-full bg-slate-950/20 overflow-hidden border-r border-white/5">
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="w-full h-full" 
        />
        
        {/* Background Ambience */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.05] rounded-full blur-[120px]" />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </div>

      {/* Right Side: Auth Form (Edge-to-Edge symmetrical) */}
      <div className="relative flex flex-col items-center justify-center p-8 sm:p-20 bg-[#08080a]">
        {/* Top-Right Navigation Link */}
        <Link 
          href="/"
          className="absolute top-10 right-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors group z-20"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Auth Content Wrapper */}
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header */}
          <div className="mb-10 text-left">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary mb-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </Link>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase sm:text-4xl">
              {mode === 'login' ? 'Welcome back' : 'Start Preparation'}
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xs">
              {mode === 'login'
                ? 'Sign in to your account to continue your technical interview journey.'
                : 'Join PrepGrid and start mastering technical interviews with AI precision.'}
            </p>
          </div>

          <div className="space-y-5">
            {/* Google OAuth */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-14 px-4 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <GoogleIcon />
              CONTINUE WITH GOOGLE
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
                or manually
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl text-sm font-medium bg-white/[0.03] border border-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-xl text-sm font-medium bg-white/[0.03] border border-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-14 pl-12 pr-12 rounded-xl text-sm font-medium bg-white/[0.03] border border-white/5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex items-center justify-center gap-3 rounded-xl text-sm font-black text-white bg-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'
                )}
              </button>
            </form>

            <div className="pt-8 text-center">
              <p className="text-xs text-muted-foreground font-bold tracking-tight">
                {mode === 'login' ? (
                  <>
                    NOT A MEMBER YET?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="ml-1 text-primary hover:text-white transition-colors font-black"
                    >
                      REGISTER HERE
                    </button>
                  </>
                ) : (
                  <>
                    ALREADY REGISTERED?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="ml-1 text-primary hover:text-white transition-colors font-black"
                    >
                      LOG IN NOW
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
