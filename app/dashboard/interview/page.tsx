'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrainCircuit, Play, ChevronRight, UserCircle, Code2, Database, LayoutTemplate } from 'lucide-react'

const ROLES = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code2, desc: 'General problem solving and core CS concepts.' },
  { id: 'frontend', name: 'Frontend Engineer', icon: LayoutTemplate, desc: 'React, DOM, CSS, Performance, and Web Vitals.' },
  { id: 'backend', name: 'Backend Engineer', icon: Database, desc: 'System design, APIs, Databases, and Scalability.' },
  { id: 'fullstack', name: 'Full Stack Engineer', icon: UserCircle, desc: 'End-to-end knowledge covering web and services.' }
]

export default function InterviewEntryPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')

  const handleStart = () => {
    if (!selectedRole) return
    // Simple state passing via query param
    router.push(`/dashboard/interview/session?role=${selectedRole}`)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col items-center mt-8">
      
      <div className="relative mb-10 text-center">
        <div className="inline-flexitems-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <BrainCircuit className="w-12 h-12 text-primary relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          PrepGrid <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI Mock</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Experience a highly realistic behavioral and technical interview. Select your target role to generate specialized questions and receive deep, actionable feedback.
        </p>
      </div>

      <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          Select Target Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.name
            return (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' 
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className={`p-3 rounded-xl flex-shrink-0 ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{role.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button 
          onClick={handleStart}
          disabled={!selectedRole}
          className="w-full md:w-auto md:px-12 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] mx-auto shadow-xl shadow-primary/20"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Session
        </button>

      </div>
    </div>
  )
}
