'use client'

import { useRef, useState, useEffect } from 'react'
import { Bot, User, CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const demoConversation = [
  {
    role: 'ai' as const,
    content: "Let's start with a classic problem. Can you explain how you would implement a function to reverse a linked list?",
  },
  {
    role: 'user' as const,
    content: "I would use a two-pointer approach. Initialize prev as null and current as head. Then iterate through the list, storing the next node, reversing the link, and moving forward until current is null.",
  },
  {
    role: 'ai' as const,
    content: "Excellent explanation! Your understanding of the iterative approach is solid.",
    feedback: {
      score: 8.5,
      maxScore: 10,
      strengths: ['Clear step-by-step explanation', 'Correct pointer manipulation'],
      improvements: ['Mention edge cases (empty list)', 'Discuss time/space complexity'],
    },
  },
]

export function AIDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { threshold: 0.1 })
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    if (isInView && visibleMessages < demoConversation.length) {
      setShowTyping(true)
      const timer = setTimeout(() => {
        setShowTyping(false)
        setVisibleMessages((prev) => prev + 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, visibleMessages])

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-primary font-medium mb-4">Live Demo</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5 text-balance">
            Experience the AI interview
          </h2>
          <p className="text-muted-foreground text-lg">
            See how our AI conducts realistic technical interviews and provides actionable feedback.
          </p>
        </div>

        {/* Chat Interface */}
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden border border-border bg-[#0a0c10]">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-white/[0.01]">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0c10]" />
              </div>
              <div>
                <div className="text-sm font-medium">PrepGrid AI</div>
                <div className="text-xs text-muted-foreground">Technical Interview Mode</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-5 space-y-5 min-h-[380px]">
              {demoConversation.slice(0, visibleMessages).map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-fade-in ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      message.role === 'ai'
                        ? 'bg-gradient-to-br from-primary to-secondary'
                        : 'bg-white/10'
                    }`}
                  >
                    {message.role === 'ai' ? (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === 'ai'
                          ? 'rounded-tl-md bg-white/[0.03] border border-border'
                          : 'rounded-tr-md bg-primary/10 border border-primary/20'
                      }`}
                    >
                      <p>{message.content}</p>
                      
                      {/* Feedback Block */}
                      {message.feedback && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          {/* Score */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-muted-foreground">Performance</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                                  style={{ width: `${(message.feedback.score / message.feedback.maxScore) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-secondary">
                                {message.feedback.score}/{message.feedback.maxScore}
                              </span>
                            </div>
                          </div>
                          
                          {/* Strengths & Improvements */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">Strengths</span>
                              </div>
                              <ul className="space-y-1">
                                {message.feedback.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span className="text-emerald-400/50 mt-0.5">•</span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <AlertCircle className="w-3 h-3 text-amber-400" />
                                <span className="text-xs font-medium text-amber-400">To Improve</span>
                              </div>
                              <ul className="space-y-1">
                                {message.feedback.improvements.map((imp, i) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span className="text-amber-400/50 mt-0.5">•</span>
                                    {imp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {showTyping && visibleMessages < demoConversation.length && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.03] border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-border">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                  readOnly
                />
                <button className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
