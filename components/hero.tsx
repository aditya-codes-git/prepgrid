'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

// Dynamically import the 3D orb to avoid SSR issues
const AIOrb = dynamic(() => import('./ai-orb').then(mod => ({ default: mod.AIOrb })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse" />
    </div>
  ),
})

// Interactive journey card with magnetic tilt + glow
function JourneyCard({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.4)',
  style,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`
    el.style.boxShadow = `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(/[\d.]+\)$/, '0.15)')}, inset 0 1px 0 rgba(255,255,255,0.1)`
    el.style.borderColor = glowColor.replace(/[\d.]+\)$/, '0.5)')
  }, [glowColor])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
    el.style.borderColor = ''
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass rounded-xl px-4 py-3 cursor-default transition-all duration-300 ease-out z-20 ${className}`}
      style={{ willChange: 'transform', ...style }}
    >
      {children}
    </div>
  )
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background - Subtle radial gradients */}
      <div className="absolute inset-0 -z-10">
        {/* Primary glow - top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.08] rounded-full blur-[120px]" />
        {/* Secondary glow - bottom */}
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[500px] bg-secondary/[0.04] rounded-full blur-[100px]" />
        {/* Grid overlay - very subtle */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Centered Hero Content */}
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">AI-Powered Interview Preparation</span>
          </div>

          {/* Headline */}
          <h1
            className={`mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-balance max-w-4xl transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Master Technical Interviews with{' '}
            <span className="gradient-text">AI Precision</span>
          </h1>

          {/* Subtext */}
          <p
            className={`mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Practice coding challenges, take AI mock interviews, and get instant, personalized feedback. Land your dream job at top tech companies.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mt-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium text-white rounded-xl bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Start Preparing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link
              href="#demo"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium rounded-xl border border-border hover:bg-white/[0.02] transition-colors"
            >
              <Play className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
              Watch Demo
            </Link>
          </div>
        </div>

        {/* 3D Orb Section */}
        <div
          className={`mt-16 lg:mt-20 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative mx-auto w-full max-w-3xl aspect-square md:aspect-[16/10]">
            <AIOrb className="w-full h-full" />
            
            {/* Journey Stage Cards */}
            {/* APTITUDE — top left */}
            <JourneyCard
              className="absolute top-[12%] -left-2 md:left-4 animate-subtle-float hidden sm:block"
              glowColor="rgba(99, 102, 241, 0.4)"
              style={{ animationDelay: '0s' }}
            >
              <div className="text-sm font-bold uppercase tracking-wider">Aptitude</div>
              <div className="text-[11px] text-muted-foreground tracking-wide mt-0.5">Quant • Logical • Verbal</div>
            </JourneyCard>

            {/* DSA — top right */}
            <JourneyCard
              className="absolute top-[8%] -right-2 md:right-4 animate-subtle-float hidden sm:block"
              glowColor="rgba(34, 211, 238, 0.4)"
              style={{ animationDelay: '0.8s' }}
            >
              <div className="text-sm font-bold uppercase tracking-wider text-secondary">DSA</div>
              <div className="text-[11px] text-muted-foreground tracking-wide mt-0.5">Arrays • Trees • Graphs</div>
            </JourneyCard>

            {/* PROJECTS — mid left */}
            <JourneyCard
              className="absolute top-[52%] -left-2 md:left-0 animate-subtle-float hidden md:block"
              glowColor="rgba(99, 102, 241, 0.35)"
              style={{ animationDelay: '1.6s' }}
            >
              <div className="text-sm font-bold uppercase tracking-wider">Projects</div>
              <div className="text-[11px] text-muted-foreground tracking-wide mt-0.5">Build • Deploy • Showcase</div>
            </JourneyCard>

            {/* INTERVIEWS — mid right */}
            <JourneyCard
              className="absolute top-[48%] -right-2 md:right-0 animate-subtle-float hidden md:block"
              glowColor="rgba(167, 139, 250, 0.4)"
              style={{ animationDelay: '2.4s' }}
            >
              <div className="text-sm font-bold uppercase tracking-wider text-[#a78bfa]">Interviews</div>
              <div className="text-[11px] text-muted-foreground tracking-wide mt-0.5">HR • Technical • System Design</div>
            </JourneyCard>

            {/* OFFERS — bottom center */}
            <JourneyCard
              className="absolute bottom-[8%] left-1/2 -translate-x-1/2 animate-subtle-float hidden sm:block !px-5"
              glowColor="rgba(52, 211, 153, 0.4)"
              style={{ animationDelay: '3.2s' }}
            >
              <div className="text-sm font-bold uppercase tracking-wider text-[#34d399]">Offers</div>
              <div className="text-[11px] text-muted-foreground tracking-wide mt-0.5">Placements • Internships</div>
            </JourneyCard>
          </div>
        </div>
      </div>
    </section>
  )
}
