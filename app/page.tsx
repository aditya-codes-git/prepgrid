import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { AIDemo } from '@/components/ai-demo'
import { CTA } from '@/components/cta'
import { CinematicFooter } from '@/components/ui/motion-footer'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIDemo />
      <CTA />
      <CinematicFooter />
    </main>
  )
}
