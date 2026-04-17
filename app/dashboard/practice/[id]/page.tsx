'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Editor from '@monaco-editor/react'
import { 
  ArrowLeft, Play, Send, CheckCircle2, XCircle, 
  Loader2, AlertCircle, Terminal, History, Database,
  ChevronRight, Languages, Clock, HardDrive
} from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FluidDropdown } from "@/components/ui/fluid-dropdown"

const LANGUAGE_CONFIG = {
  python: { id: 71, label: 'Python 3', ext: 'py' },
  javascript: { id: 63, label: 'JavaScript', ext: 'js' },
  cpp: { id: 54, label: 'C++', ext: 'cpp' },
  java: { id: 62, label: 'Java', ext: 'java' },
}

export default function ProblemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [problem, setProblem] = useState<any | null>(null)
  const [language, setLanguage] = useState<keyof typeof LANGUAGE_CONFIG>('java')
  const [code, setCode] = useState('')
  const [testCases, setTestCases] = useState<any[]>([])
  const hasInitialized = useRef(false)
  
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [consoleTab, setConsoleTab] = useState('testcase')
  
  const [runResult, setRunResult] = useState<any>(null)
  const [submitResult, setSubmitResult] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    async function fetchProblemData() {
      const id = parseInt(params.id as string)
      
      // Fetch Problem
      const { data: prob } = await supabase.from('problems').select('*').eq('id', id).single()
      if (prob) {
        setProblem(prob)
        if (!hasInitialized.current) {
          const cacheKey = `prepgrid_code_${id}_${language}`
          const cachedCode = localStorage.getItem(cacheKey)
          setCode(cachedCode || prob.starter_code?.[language] || '')
          hasInitialized.current = true
        }
      }

      // Fetch Test Cases
      const { data: tcs } = await supabase.from('test_cases').select('*').eq('problem_id', id).eq('is_hidden', false)
      if (tcs) setTestCases(tcs)

      // Fetch Submissions
      if (user) {
        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .eq('problem_id', id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (subs) setSubmissions(subs)
      }
    }
    fetchProblemData()
  }, [params.id, user])

  const handleLanguageChange = (lang: keyof typeof LANGUAGE_CONFIG) => {
    setLanguage(lang)
    const cacheKey = `prepgrid_code_${params.id}_${lang}`
    const cachedCode = localStorage.getItem(cacheKey)

    if (cachedCode) {
      setCode(cachedCode)
    } else if (problem?.starter_code?.[lang]) {
      setCode(problem.starter_code[lang])
    } else {
      setCode('')
    }
  }

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (hasInitialized.current && problem) {
      const cacheKey = `prepgrid_code_${params.id}_${language}`
      localStorage.setItem(cacheKey, code)
    }
  }, [code, language, params.id, problem])

  const handleRun = async () => {
    setIsRunning(true)
    setConsoleTab('result')
    setRunResult(null)

    try {
      const res = await fetch('/api/practice/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_CONFIG[language].id,
          stdin: testCases[0]?.input || ''
        })
      })
      const data = await res.json()
      setRunResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setConsoleTab('result')
    setSubmitResult(null)

    try {
      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problem.id,
          source_code: code,
          language_id: LANGUAGE_CONFIG[language].id,
          language_name: language
        })
      })
      const data = await res.json()
      setSubmitResult(data)
      
      // Refresh submissions
      if (user) {
        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .eq('problem_id', problem.id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (subs) setSubmissions(subs)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!problem) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0c]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0a0a0c] text-slate-300 overflow-hidden -m-4 md:-m-8">
      
      {/* Top Navbar */}
      <div className="h-12 border-b border-white/5 bg-[#121214] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/practice" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            {problem.id}. {problem.title}
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
              problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {problem.difficulty}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            Run Code
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Submit
          </button>
        </div>
      </div>

      <PanelGroup direction="horizontal" className="flex-1">
        
        {/* Left Pane: Description & Submissions */}
        <Panel defaultSize={40} minSize={30}>
          <div className="h-full bg-[#121214] border-r border-white/5 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-4 pt-2 border-b border-white/5">
                <TabsList className="bg-transparent gap-2">
                  <TabsTrigger value="description" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-lg transition-none h-9 px-4 text-xs font-bold uppercase tracking-wider">Description</TabsTrigger>
                  <TabsTrigger value="submissions" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-lg transition-none h-9 px-4 text-xs font-bold uppercase tracking-wider">Submissions</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <TabsContent value="description" className="m-0 space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-black text-white tracking-tight">{problem.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-code:text-blue-400 prose-code:bg-blue-400/5 prose-code:px-1 prose-code:rounded">
                    <p className="whitespace-pre-wrap">{problem.description}</p>
                    
                    <div className="space-y-8 mt-10">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">Example {idx + 1}:</h4>
                          <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 font-mono text-xs space-y-2 ring-1 ring-white/5">
                            <div><span className="text-muted-foreground mr-2">Input:</span> <span className="text-white">{tc.input}</span></div>
                            <div><span className="text-muted-foreground mr-2">Output:</span> <span className="text-white">{tc.expected_output}</span></div>
                            {tc.explanation && <div><span className="text-muted-foreground mr-2">Explanation:</span> <span className="text-slate-500 italic">{tc.explanation}</span></div>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {problem.constraints && (
                      <div className="mt-10 pt-10 border-t border-white/5">
                        <h4 className="text-sm font-bold text-white mb-4">Constraints:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-xs font-mono text-muted-foreground">
                          {problem.constraints.map((c: string, idx: number) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="submissions" className="m-0 space-y-4 animate-in fade-in duration-300">
                  {submissions.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                      <History className="w-12 h-12 mb-4" />
                      <p className="text-sm">No submissions yet. Solve the problem to see your history!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       {submissions.map((sub) => (
                         <div key={sub.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                           <div>
                             <div className={`text-sm font-black mb-1 ${sub.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>{sub.status}</div>
                             <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                               {sub.language} • {new Date(sub.created_at).toLocaleDateString()}
                             </div>
                           </div>
                           <div className="flex gap-4 text-right">
                             <div className="space-y-0.5">
                                <div className="text-xs text-white font-mono">{(sub.runtime * 1000).toFixed(0)}ms</div>
                                <div className="text-[9px] uppercase text-muted-foreground font-bold tracking-tighter">Runtime</div>
                             </div>
                             <div className="space-y-0.5">
                                <div className="text-xs text-white font-mono">{(sub.memory / 1024).toFixed(1)}MB</div>
                                <div className="text-[9px] uppercase text-muted-foreground font-bold tracking-tighter">Memory</div>
                             </div>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-black hover:bg-white/10 transition-colors" />

        {/* Right Pane: Code Editor & Console */}
        <Panel defaultSize={60} minSize={40}>
          <PanelGroup direction="vertical">
            
            {/* Top: Editor */}
            <Panel defaultSize={65} minSize={30}>
              <div className="h-full flex flex-col bg-[#1e1e1e]">
                <div className="h-10 border-b border-white/5 bg-[#0a0a0c] flex items-center px-4">
                  <div className="flex items-center gap-2 group cursor-pointer relative">
                    <FluidDropdown 
                      value={language}
                      onSelect={(id) => handleLanguageChange(id as any)}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || '')}
                    options={{
                      fontSize: 14,
                      fontFamily: 'geist-mono, monospace',
                      minimap: { enabled: false },
                      padding: { top: 20 },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                    }}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 bg-black hover:bg-white/10 transition-colors" />

            {/* Bottom: Console */}
            <Panel defaultSize={35} minSize={10}>
              <div className="h-full bg-[#121214] flex flex-col">
                <Tabs value={consoleTab} onValueChange={setConsoleTab} className="h-full flex flex-col">
                  <div className="px-4 pt-1 border-b border-white/5 flex items-center justify-between">
                    <TabsList className="bg-transparent gap-4">
                      <TabsTrigger value="testcase" className="data-[state=active]:text-white relative h-9 px-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:hidden data-[state=active]:after:block">
                        Testcase
                      </TabsTrigger>
                      <TabsTrigger value="result" className="data-[state=active]:text-white relative h-9 px-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:hidden data-[state=active]:after:block">
                        Result
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 font-mono text-sm no-scrollbar">
                    <TabsContent value="testcase" className="m-0 space-y-4">
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="space-y-2">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Case {idx + 1}</p>
                          <div className="bg-[#0a0a0c] p-3 rounded-lg text-slate-400 border border-white/5">
                            {tc.input}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="result" className="m-0 h-full">
                      {(isRunning || isSubmitting) ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                          <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Executing on Judge0 Server...</p>
                        </div>
                      ) : submitResult ? (
                        /* Submission Results */
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                             {submitResult.status === 'Accepted' ? (
                               <CheckCircle2 className="w-6 h-6 text-green-500" />
                             ) : (
                               <XCircle className="w-6 h-6 text-red-500" />
                             )}
                             <h3 className={`text-xl font-black ${submitResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                               {submitResult.status}
                             </h3>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                             <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                               <Clock className="w-4 h-4 text-muted-foreground" />
                               <div className="text-xs">Runtime: <span className="text-white font-bold">{submitResult.runtime?.toFixed(0) || 0} ms</span></div>
                             </div>
                             <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                               <HardDrive className="w-4 h-4 text-muted-foreground" />
                               <div className="text-xs">Memory: <span className="text-white font-bold">{(submitResult.memory / 1024).toFixed(1)} MB</span></div>
                             </div>
                           </div>

                           <div className="space-y-4 pt-4 border-t border-white/5">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Test Case Details</p>
                             <div className="space-y-3">
                               {submitResult.results?.slice(0, 3).map((r: any, i: number) => (
                                 <div key={i} className="p-3 bg-[#0a0a0c] border border-white/5 rounded-xl space-y-2">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Case {i + 1}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {r.passed ? 'Passed' : 'Failed'}
                                      </span>
                                   </div>
                                   {!r.passed && (
                                     <div className="grid grid-cols-2 gap-4 pt-2">
                                       <div className="space-y-1">
                                          <p className="text-[9px] text-muted-foreground uppercase font-bold">Expected</p>
                                          <pre className="text-[11px] text-slate-300 bg-white/5 p-2 rounded">{r.expected}</pre>
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[9px] text-muted-foreground uppercase font-bold">Actual</p>
                                          <pre className="text-[11px] text-red-200 bg-red-500/5 p-2 rounded border border-red-500/10">{r.stdout || '(no output)'}</pre>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               ))}
                               {submitResult.results?.length > 3 && (
                                 <p className="text-[10px] text-center text-muted-foreground italic">+ {submitResult.results.length - 3} more hidden test cases</p>
                               )}
                             </div>
                           </div>
                        </div>
                      ) : runResult ? (
                        /* Run Code Results */
                        <div className="space-y-4">
                           {runResult.stderr || runResult.compile_output || runResult.status?.id > 4 ? (
                             <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-2">
                               <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                                 <AlertCircle className="w-3 h-3" /> {runResult.status?.description || 'Error'}
                               </div>
                               <pre className="text-xs text-red-200/60 overflow-x-auto whitespace-pre-wrap">{runResult.stderr || runResult.compile_output || runResult.message}</pre>
                             </div>
                           ) : (
                             <div className="space-y-4">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Standard Output</p>
                                  <pre className="bg-[#0a0a0c] p-4 rounded-xl border border-white/5 text-slate-300 min-h-[50px] font-mono whitespace-pre-wrap">{runResult.stdout || '(No output)'}</pre>
                                </div>
                                {runResult.time && (
                                  <div className="text-[10px] text-muted-foreground font-bold italic tracking-tighter">
                                    Process finished in {runResult.time}s • {runResult.memory}KB memory
                                  </div>
                                )}
                             </div>
                           )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                          <Terminal className="w-10 h-10 mb-2" />
                          <p className="text-xs">Run your code to see the magic happen...</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Panel>

          </PanelGroup>
        </Panel>

      </PanelGroup>

    </div>
  )
}
