'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
  ],
  Company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  Legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Security', href: '#' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 max-w-[1280px] py-14">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight">PrepGrid</span>
            </Link>
            
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              The AI-powered platform that transforms how you prepare for technical interviews.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PrepGrid. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-primary">precision</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
