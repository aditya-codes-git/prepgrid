'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Demo', href: '#demo' },
  { name: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          'mx-auto max-w-[1280px] rounded-2xl transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-[#06080a]/70 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'
            : 'bg-white/[0.02] backdrop-blur-xl border border-white/[0.04]'
        )}
      >
        <div className="flex items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">
              PrepGrid
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.03]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-white/[0.06] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-white/[0.04] rounded-lg"
            >
              Sign in
            </Link>
            <Link
              href="#cta"
              className="group relative px-5 py-2 text-sm font-medium rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-shadow duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/30 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-[1px] rounded-[10px] bg-gradient-to-b from-white/20 to-transparent opacity-60" />
              <span className="relative text-white drop-shadow-sm">Get Started</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground rounded-lg hover:bg-white/[0.02]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 border-t border-white/[0.06] animate-fade-in bg-gradient-to-b from-transparent to-black/20">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.02]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/[0.06]">
                <Link
                  href="#"
                  className="px-4 py-3 text-sm text-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                >
                  Sign in
                </Link>
                <Link
                  href="#cta"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-white text-center rounded-xl bg-gradient-to-r from-primary to-primary/80"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
