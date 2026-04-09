'use client'

import { useRef } from 'react'
import { User, Play, Sparkles } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const steps = [
  {
    number: '01',
    icon: User,
    title: 'Select Your Focus',
    description: 'Choose your target role, experience level, and the companies you&apos;re preparing for. We personalize everything.',
  },
  {
    number: '02',
    icon: Play,
    title: 'Practice & Interview',
    description: 'Jump into coding challenges or start a realistic AI mock interview. Practice anytime, at your own pace.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Get AI Feedback',
    description: 'Receive instant, detailed feedback with scores and actionable recommendations to improve rapidly.',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.1 })

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-secondary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-secondary font-medium mb-4">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5 text-balance">
            Simple steps to interview success
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started in minutes. Our streamlined process means less setup, more improvement.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="absolute top-16 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />
          
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Step Number & Icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-foreground" />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-xs font-medium text-white flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
