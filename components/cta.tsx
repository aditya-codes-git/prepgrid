'use client'

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useInView } from '@/hooks/use-in-view'

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.2 })

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-[1280px]">
        <div
          className={`relative max-w-3xl mx-auto text-center transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Content */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
            Start preparing{' '}
            <span className="gradient-text">smarter</span>
            {' '}today
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join thousands of developers who have landed their dream jobs. Your next opportunity is one interview away.
          </p>
          
          {/* CTA Button */}
          <Link
            href="/auth"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white rounded-xl bg-primary hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          {/* Trust indicator */}
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Free tier available
          </p>
        </div>
      </div>
    </section>
  )
}
