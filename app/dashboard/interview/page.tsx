'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrainCircuit, Play, ChevronRight, UserCircle, Code2, Database, LayoutTemplate, Sparkles, Loader2, Target, CheckCircle2, Upload, FileText } from 'lucide-react'

const ROLES = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code2, desc: 'General problem solving and core CS concepts.' },
  { id: 'frontend', name: 'Frontend Engineer', icon: LayoutTemplate, desc: 'React, DOM, CSS, Performance, and Web Vitals.' },
  { id: 'backend', name: 'Backend Engineer', icon: Database, desc: 'System design, APIs, Databases, and Scalability.' },
  { id: 'fullstack', name: 'Full Stack Engineer', icon: UserCircle, desc: 'End-to-end knowledge covering web and services.' }
]

export default function InterviewEntryPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [analyzed, setAnalyzed] = useState(false)

  const handleStart = () => {
    if (!selectedRole) return
    // Persist resume analysis for the session to use
    if (resumeData) {
      sessionStorage.setItem('prepgrid_resume', JSON.stringify(resumeData))
    }
    router.push(`/dashboard/interview/session?role=${selectedRole}`)
  }

  const analyzeResume = async () => {
    if (!file) return
    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      })

      // Guard against non-JSON responses (HTML error pages, etc.)
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected response. Please try again.')
      }

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResumeData(data)
      setAnalyzed(true)
    } catch (error) {
      console.error('Resume analysis failed:', error)
      alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      setResumeData(null)
    } finally {
      setAnalyzing(false)
    }
  }

  const getFilteredRoles = () => {
    if (!resumeData || !resumeData.recommended_roles) return ROLES
    
    return ROLES.filter(role => {
      const normalizedRecommend = resumeData.recommended_roles.map((r: string) => r.toLowerCase())
      // Check for acronyms or substring matches
      return normalizedRecommend.some((rec: string) => {
        if (rec.includes('frontend') && role.id === 'frontend') return true
        if (rec.includes('backend') && role.id === 'backend') return true
        if ((rec.includes('full stack') || rec.includes('fullstack')) && role.id === 'fullstack') return true
        if ((rec.includes('dsa') || rec.includes('algorithm') || rec.includes('problem solving')) && role.id === 'dsa') return true
        return false
      })
    })
  }

  const filteredRoles = getFilteredRoles()

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col items-center mt-8">
      
      <div className="relative mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 mb-6 relative">
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
      {/* AI RESUME ANALYZER */}
      <section className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Resume Analysis</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Upload your resume to unlock specialized interview tracks.</p>
          </div>
        </div>

        {!resumeData && (
          <div className="space-y-4 relative z-10">
            <div className={`relative group border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${file ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}>
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className="p-4 rounded-2xl bg-white/5 text-muted-foreground group-hover:scale-110 transition-transform mb-4">
                {file ? <FileText className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8" />}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white mb-1">
                  {file ? file.name : 'Upload your Resume'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {file ? `${(file.size / 1024).toFixed(1)} KB • Click to change` : 'Drag & drop or click to upload PDF or DOCX'}
                </p>
              </div>
            </div>
            
            <button
              onClick={analyzeResume}
              disabled={!file || analyzing}
              className="flex items-center justify-center w-full md:w-auto gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Professional Profile...</> : 'Analyze Resume'}
            </button>
          </div>
        )}

        {resumeData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 relative z-10">
            <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Candidate Profile</h3>
              <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">{resumeData.candidate_summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-2">Primary Expertise</span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.primary_skills?.slice(0, 6).map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-white/5 border border-white/10 rounded text-white/70">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-2">Role Fitment</span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.recommended_roles?.map((role: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded">{role}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                <h4 className="text-[10px] font-black text-emerald-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Core Strengths
                </h4>
                <ul className="text-xs text-emerald-100/60 space-y-1">
                  {resumeData.strengths?.slice(0, 3).map((s: string, i: number) => <li key={i} className="truncate">• {s}</li>)}
                </ul>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
                <h4 className="text-[10px] font-black text-rose-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <Target className="w-3 h-3" /> Growth Areas
                </h4>
                <ul className="text-xs text-rose-100/60 space-y-1">
                  {resumeData.weaknesses?.slice(0, 3).map((w: string, i: number) => <li key={i} className="truncate">• {w}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={() => { setResumeData(null); setFile(null); setAnalyzed(false); setSelectedRole(''); }}
                className="text-[10px] font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest"
              >
                Reset & Re-upload
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Analysis Ready</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* TARGET ROLES PANEL - ONLY VISIBLE POST-ANALYSIS */}
      {analyzed && (
        <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Step 2: Select Role
            </h2>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
              Matched for you
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredRoles.map((role) => {
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
      )}
    </div>
  )
}
