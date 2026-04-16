'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BrainCircuit, Play, Code2, Database, LayoutTemplate,
  Sparkles, Loader2, Upload, FileText, Zap, CheckCircle2,
  Target, FileSearch, ArrowRight, Crown
} from 'lucide-react'

/* ─── ROLE DEFINITIONS ─── */
const ROLES = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code2, desc: 'Arrays, trees, graphs, dynamic programming, and core CS problem solving.', color: 'from-emerald-500/20 to-emerald-500/5' },
  { id: 'frontend', name: 'Frontend Engineer', icon: LayoutTemplate, desc: 'React, DOM manipulation, CSS architecture, performance, and Web Vitals.', color: 'from-blue-500/20 to-blue-500/5' },
  { id: 'backend', name: 'Backend Engineer', icon: Database, desc: 'System design, REST/GraphQL APIs, databases, caching, and scalability.', color: 'from-purple-500/20 to-purple-500/5' },
  { id: 'fullstack', name: 'Full Stack Engineer', icon: BrainCircuit, desc: 'End-to-end web development covering frontend, backend, and DevOps.', color: 'from-amber-500/20 to-amber-500/5' },
]

/* ═══════════════════════════════════════════════════════════════
   MODE SELECTOR COMPONENT
   Two premium cards for choosing interview mode
   ═══════════════════════════════════════════════════════════════ */
function ModeSelector({
  mode,
  onModeChange,
}: {
  mode: 'resume' | 'manual'
  onModeChange: (m: 'resume' | 'manual') => void
}) {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── RESUME MODE CARD ── */}
        <button
          onClick={() => onModeChange('resume')}
          className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
            mode === 'resume'
              ? 'border-indigo-500/60 bg-indigo-500/[0.06] shadow-[0_0_40px_rgba(99,102,241,0.12)]'
              : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.03]'
          }`}
        >
          {/* Glow effect when active */}
          {mode === 'resume' && (
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${
                mode === 'resume'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-white/[0.04] text-muted-foreground group-hover:text-white/60'
              }`}>
                <FileSearch className="w-6 h-6" />
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                mode === 'resume'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/[0.04] text-muted-foreground border border-white/[0.06]'
              }`}>
                <Crown className="w-3 h-3" />
                Recommended
              </span>
            </div>

            <h3 className={`text-lg font-bold mb-1.5 transition-colors ${
              mode === 'resume' ? 'text-white' : 'text-white/70 group-hover:text-white/90'
            }`}>
              Resume-Based
            </h3>
            <p className={`text-sm leading-relaxed transition-colors ${
              mode === 'resume' ? 'text-indigo-200/60' : 'text-muted-foreground'
            }`}>
              Tailored mock interview based on your profile analysis.
            </p>

            {/* Selection indicator */}
            <div className={`mt-4 flex items-center gap-2 text-xs font-semibold transition-all ${
              mode === 'resume' ? 'text-indigo-400' : 'text-transparent'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Selected
            </div>
          </div>
        </button>

        {/* ── QUICK START MODE CARD ── */}
        <button
          onClick={() => onModeChange('manual')}
          className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
            mode === 'manual'
              ? 'border-amber-500/60 bg-amber-500/[0.06] shadow-[0_0_40px_rgba(245,158,11,0.12)]'
              : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.03]'
          }`}
        >
          {mode === 'manual' && (
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${
                mode === 'manual'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-white/[0.04] text-muted-foreground group-hover:text-white/60'
              }`}>
                <Zap className="w-6 h-6" />
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                mode === 'manual'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/[0.04] text-muted-foreground border border-white/[0.06]'
              }`}>
                <Zap className="w-3 h-3" />
                Fast Setup
              </span>
            </div>

            <h3 className={`text-lg font-bold mb-1.5 transition-colors ${
              mode === 'manual' ? 'text-white' : 'text-white/70 group-hover:text-white/90'
            }`}>
              Quick Start
            </h3>
            <p className={`text-sm leading-relaxed transition-colors ${
              mode === 'manual' ? 'text-amber-200/60' : 'text-muted-foreground'
            }`}>
              Pick a general track and start practicing instantly.
            </p>

            <div className={`mt-4 flex items-center gap-2 text-xs font-semibold transition-all ${
              mode === 'manual' ? 'text-amber-400' : 'text-transparent'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Selected
            </div>
          </div>
        </button>
      </div>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground/60">
        {mode === 'resume'
          ? 'Your resume will be analyzed by AI to generate targeted questions.'
          : "No resume? No problem — just pick a role and you're in."
        }
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RESUME SECTION COMPONENT
   Upload + analysis results
   ═══════════════════════════════════════════════════════════════ */
function ResumeSection({
  file, setFile, analyzing, analyzeResume, resumeData, onReset,
}: {
  file: File | null
  setFile: (f: File | null) => void
  analyzing: boolean
  analyzeResume: () => void
  resumeData: any
  onReset: () => void
}) {
  return (
    <div className="w-full bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Resume Analysis</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            We&apos;ll tailor questions based on your experience and skills.
          </p>
        </div>
      </div>

      {!resumeData ? (
        <div className="space-y-4 relative z-10">
          {/* Drop zone */}
          <div
            className={`relative group border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
              file
                ? 'border-primary/50 bg-primary/[0.04]'
                : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className="p-4 rounded-2xl bg-white/[0.03] text-muted-foreground group-hover:scale-110 transition-transform mb-4">
              {file ? (
                <FileText className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <p className="text-lg font-bold text-white mb-1">
              {file ? file.name : 'Upload your Resume'}
            </p>
            <p className="text-sm text-muted-foreground">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB · Click to change`
                : 'Drag & drop or click — PDF or DOCX'}
            </p>
          </div>

          <button
            onClick={analyzeResume}
            disabled={!file || analyzing}
            className="flex items-center justify-center w-full md:w-auto gap-2.5 px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Profile…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Resume
              </>
            )}
          </button>
        </div>
      ) : (
        /* ── Analysis result ── */
        <div className="space-y-5 relative z-10">
          <div className="p-5 bg-indigo-500/[0.08] border border-indigo-500/20 rounded-xl">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
              Candidate Profile
            </h3>
            <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">
              {resumeData.candidate_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl text-left">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-2">
                Skills Found
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.primary_skills?.slice(0, 6).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-bold bg-white/[0.04] border border-white/[0.08] rounded text-white/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl text-left">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block mb-2">
                Target Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.recommended_roles?.map((role: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 rounded"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-500/[0.04] border border-emerald-500/10 p-4 rounded-xl text-left">
              <h4 className="text-[10px] font-black text-emerald-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Core Strengths
              </h4>
              <ul className="text-xs text-emerald-100/50 space-y-1">
                {resumeData.strengths?.slice(0, 3).map((s: string, i: number) => (
                  <li key={i} className="truncate">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-500/[0.04] border border-rose-500/10 p-4 rounded-xl text-left">
              <h4 className="text-[10px] font-black text-rose-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Target className="w-3 h-3" /> Growth Areas
              </h4>
              <ul className="text-xs text-rose-100/50 space-y-1">
                {resumeData.weaknesses?.slice(0, 3).map((w: string, i: number) => (
                  <li key={i} className="truncate">• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <button
              onClick={onReset}
              className="text-[10px] font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest"
            >
              Reset & Re-upload
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Analysis Ready
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ROLE SELECTION COMPONENT
   Grid of selectable role cards
   ═══════════════════════════════════════════════════════════════ */
function RoleSelectionSection({
  roles,
  selectedRole,
  onSelect,
  resumeData,
  questionBank,
  setQuestionBank,
  bankLoading,
  setBankLoading,
}: {
  roles: typeof ROLES
  selectedRole: string
  onSelect: (name: string) => void
  resumeData: any
  questionBank: Record<string, string[]>
  setQuestionBank: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  bankLoading: string | null
  setBankLoading: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const fetchIndustryQuestions = async (roleName: string) => {
    if (questionBank[roleName]) {
      const next = { ...questionBank }
      delete next[roleName]
      setQuestionBank(next)
      return
    }
    setBankLoading(roleName)
    try {
      const res = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: roleName }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setQuestionBank(prev => ({ ...prev, [roleName]: data.questions || [] }))
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Failed to fetch questions')
    } finally {
      setBankLoading(null)
    }
  }

  const isMatched = (roleId: string): boolean => {
    if (!resumeData?.recommended_roles) return false
    const recs = resumeData.recommended_roles.map((r: string) => r.toLowerCase())
    return recs.some((rec: string) => {
      if (rec.includes('frontend') && roleId === 'frontend') return true
      if (rec.includes('backend') && roleId === 'backend') return true
      if ((rec.includes('full stack') || rec.includes('fullstack')) && roleId === 'fullstack') return true
      if ((rec.includes('dsa') || rec.includes('algorithm') || rec.includes('problem solving')) && roleId === 'dsa') return true
      return false
    })
  }

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Select Interview Track</h2>
        {resumeData && (
          <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            AI Matched
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.name
          const matched = isMatched(role.id)

          return (
            <div key={role.id} className="flex flex-col gap-2">
              <div
                onClick={() => onSelect(role.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(role.name)
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isSelected
                    ? 'border-primary/60 bg-primary/[0.06] shadow-[0_0_24px_rgba(99,102,241,0.1)] scale-[1.01]'
                    : 'border-white/[0.05] bg-white/[0.015] hover:border-white/[0.1] hover:bg-white/[0.03]'
                }`}
              >
                {matched && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">
                      Matched
                    </span>
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl flex-shrink-0 transition-colors bg-gradient-to-br ${
                    isSelected
                      ? 'from-primary/25 to-primary/10 text-primary'
                      : `${role.color} text-muted-foreground group-hover:text-white/60`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-bold text-sm transition-colors ${
                        isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                      }`}
                    >
                      {role.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {role.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        fetchIndustryQuestions(role.name)
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-black text-primary/70 hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      {bankLoading === role.name ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {questionBank[role.name] ? 'Hide Questions' : 'View Industry Questions'}
                    </button>
                  </div>
                </div>
              </div>

              {questionBank[role.name] && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-2">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.05]">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                       Standard Prep Set (6 Questions)
                    </span>
                  </div>
                  {questionBank[role.name].map((q, i) => (
                    <div key={i} className="flex gap-3 text-left">
                       <span className="shrink-0 text-[10px] font-black text-primary/40 mt-0.5">0{i+1}</span>
                       <p className="text-[11px] text-white/70 leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
import { RefreshCcw } from 'lucide-react'

export default function InterviewEntryPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'resume' | 'manual'>('resume')
  const [selectedRole, setSelectedRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [analyzed, setAnalyzed] = useState(false)
  const [questionBank, setQuestionBank] = useState<Record<string, string[]>>({})
  const [bankLoading, setBankLoading] = useState<string | null>(null)

  // Restore mode from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('prepgrid_mode')
    if (saved === 'resume' || saved === 'manual') setMode(saved as any)
  }, [])

  // Persist mode
  useEffect(() => {
    sessionStorage.setItem('prepgrid_mode', mode)
  }, [mode])

  /* ─── Handlers ─── */
  const handleModeChange = (m: 'resume' | 'manual') => {
    setMode(m)
    setSelectedRole('')
  }

  const handleStart = () => {
    if (!selectedRole) return
    
    // Clear any previous custom questions
    sessionStorage.removeItem('prepgrid_custom_questions')

    if (mode === 'manual') {
      sessionStorage.removeItem('prepgrid_resume')
    } else if (resumeData) {
      sessionStorage.setItem('prepgrid_resume', JSON.stringify(resumeData))
    }

    // Pass the industry questions if they were generated
    if (questionBank[selectedRole]) {
      sessionStorage.setItem('prepgrid_custom_questions', JSON.stringify(questionBank[selectedRole]))
    }

    router.push(`/dashboard/interview/session?role=${selectedRole}`)
  }

  const analyzeResume = async () => {
    if (!file) return
    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/resume/analyze', { method: 'POST', body: formData })

      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
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

  const handleReset = () => {
    setResumeData(null)
    setFile(null)
    setAnalyzed(false)
    setSelectedRole('')
  }

  /* ─── Filtered roles for resume mode ─── */
  const getFilteredRoles = () => {
    if (mode === 'manual') return ROLES
    if (!resumeData?.recommended_roles) return ROLES
    const recs = resumeData.recommended_roles.map((r: string) => r.toLowerCase())
    const filtered = ROLES.filter((role) =>
      recs.some((rec: string) => {
        if (rec.includes('frontend') && role.id === 'frontend') return true
        if (rec.includes('backend') && role.id === 'backend') return true
        if ((rec.includes('full stack') || rec.includes('fullstack')) && role.id === 'fullstack') return true
        if ((rec.includes('dsa') || rec.includes('algorithm') || rec.includes('problem solving')) && role.id === 'dsa') return true
        return false
      })
    )
    return filtered.length > 0 ? filtered : ROLES
  }

  const canStart =
    mode === 'manual'
      ? selectedRole !== ''
      : analyzed && selectedRole !== ''

  return (
    <div className="max-w-3xl mx-auto pb-16 flex flex-col items-center mt-6 px-4">
      {/* ── HEADER ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <BrainCircuit className="w-10 h-10 text-primary relative z-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
          PrepGrid{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            AI Mock
          </span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Personalized technical interviews powered by Groq LLaMA 3.3.
          <br />
          Choose your path below to start practicing.
        </p>
      </div>

      {/* ── STEP 1 — MODE SELECTOR ── */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">
            1
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            Choose Mode
          </span>
        </div>
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* ── STEP 2 — RESUME UPLOAD (conditional) ── */}
      {mode === 'resume' && (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">
              2
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Upload & Analyze
            </span>
          </div>
          <ResumeSection
            file={file}
            setFile={setFile}
            analyzing={analyzing}
            analyzeResume={analyzeResume}
            resumeData={resumeData}
            onReset={handleReset}
          />
        </div>
      )}

      {/* ── STEP 3 (or 2 in manual) — ROLE SELECTION ── */}
      {(mode === 'manual' || analyzed) && (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">
              {mode === 'resume' ? '3' : '2'}
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Select Track
            </span>
          </div>
          <RoleSelectionSection
            roles={getFilteredRoles()}
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
            resumeData={resumeData}
            questionBank={questionBank}
            setQuestionBank={setQuestionBank}
            bankLoading={bankLoading}
            setBankLoading={setBankLoading}
          />
        </div>
      )}


      {/* ── START BUTTON ── */}
      {(mode === 'manual' || analyzed) && (
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="group flex items-center justify-center gap-3 w-full md:w-auto md:px-16 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-black text-base transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Session
          <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}
