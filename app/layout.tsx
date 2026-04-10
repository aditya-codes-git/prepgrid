import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'PrepGrid AI | Master Technical Interviews with AI Precision',
  description: 'Practice coding, take AI mock interviews, and get personalized feedback — all in one platform. The future of interview preparation is here.',
  keywords: ['AI interview', 'coding practice', 'technical interviews', 'mock interviews', 'interview preparation', 'AI feedback'],
  authors: [{ name: 'PrepGrid AI' }],
  openGraph: {
    title: 'PrepGrid AI | Master Technical Interviews with AI Precision',
    description: 'Practice coding, take AI mock interviews, and get personalized feedback — all in one platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepGrid AI | Master Technical Interviews with AI Precision',
    description: 'Practice coding, take AI mock interviews, and get personalized feedback — all in one platform.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-white overflow-x-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
