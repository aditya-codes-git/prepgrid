'use client'

import { useRef } from 'react'
import { Code2, Brain, BarChart3 } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const features = [
  {
    icon: Code2,
    title: 'Coding Practice',
    description: 'Solve 500+ curated problems from top tech companies. Real interview questions with detailed solutions and explanations.',
    color: 'from-primary/20 to-primary/5',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: Brain,
    title: 'AI Mock Interviews',
    description: 'Experience realistic interviews with our adaptive AI. It adjusts difficulty based on your performance in real-time.',
    color: 'from-secondary/20 to-secondary/5',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track your progress with detailed insights. Identify weak areas and get personalized improvement recommendations.',
    color: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
]

export function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.1 })

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-primary font-medium mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5 text-balance">
            Everything you need to ace your interview
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines cutting-edge AI with proven interview strategies to give you the ultimate preparation experience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-7 rounded-2xl transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Background */}
              <div className="absolute inset-0 rounded-2xl bg-white/[0.02] border border-border transition-colors group-hover:border-white/10" />
              
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                
                {/* Text */}
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
