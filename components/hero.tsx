'use client'

import { useEffect, useState } from 'react'
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
            
            {/* Floating stat cards around the orb */}
            <div className="absolute top-1/4 -left-4 md:left-8 glass rounded-xl px-4 py-3 animate-subtle-float hidden sm:block" style={{ animationDelay: '0s' }}>
              <div className="text-2xl font-semibold">10K+</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            
            <div className="absolute top-1/3 -right-4 md:right-8 glass rounded-xl px-4 py-3 animate-subtle-float hidden sm:block" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-semibold text-secondary">85%</div>
              <div className="text-xs text-muted-foreground">Offer Rate</div>
            </div>
            
            <div className="absolute bottom-1/4 left-1/4 glass rounded-xl px-4 py-3 animate-subtle-float hidden md:block" style={{ animationDelay: '2s' }}>
              <div className="text-2xl font-semibold">4.9</div>
              <div className="text-xs text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

        {/* Trust Stats Strip */}
        <div
          className={`mt-16 lg:mt-20 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 py-8 border-t border-b border-border/50">
            {[
              { value: '50,000+', label: 'Mock Interviews Completed' },
              { value: '200+', label: 'Interview Questions' },
              { value: '15+', label: 'Tech Companies Covered' },
              { value: '24/7', label: 'AI Availability' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
