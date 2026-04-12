'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrainCircuit, Send, Loader2, CheckCircle2, ChevronRight, Target } from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'

type SessionState = 'loading' | 'question' | 'evaluating' | 'feedback' | 'finished'

interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvement: string[];
  confidence: string;
  topic: string;
  subtopic: string;
  evaluation_summary: string;
  next_difficulty: string;
  next_question: string;
  question_type: string;
  expected_answer_points: string[];
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading session...</div>}>
      <SessionContent />
    </Suspense>
  )
}

function SessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'Software Engineer'
  const { user } = useAuth()

  const [state, setState] = useState<SessionState>('loading')
  const [questionCount, setQuestionCount] = useState(1)
  const [difficulty, setDifficulty] = useState('Medium')
  
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  
  const [cumulativeScore, setCumulativeScore] = useState(0)
  const [resumeProfile, setResumeProfile] = useState<any>(null)
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([])

  // Load resume data from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('prepgrid_resume')
      if (stored) setResumeProfile(JSON.parse(stored))
    } catch {} // Graceful fallback if no resume data
  }, [])

  // Fetch initial question
  useEffect(() => {
    if (state === 'loading') {
      fetchQuestion()
    }
  }, [state])

  const fetchQuestion = async () => {
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_question',
          role,
          difficulty,
          candidateProfile: resumeProfile,
          previousQuestions
        })
      })
      const data = await res.json()
      setCurrentQuestion(data.question)
      setPreviousQuestions(prev => [...prev, data.question])
      setState('question')
    } catch (err) {
      console.error(err)
      setCurrentQuestion('Explain the principles of RESTful APIs and how you design them for scalability.')
      setState('question')
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setState('evaluating')

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          role,
          difficulty,
          previousQuestion: currentQuestion,
          userAnswer: answer,
          candidateProfile: resumeProfile,
          previousQuestions
        })
      })
      const data = await res.json()
      setFeedback(data)
      setCumulativeScore(prev => prev + data.score)
      setState('feedback')
    } catch (err) {
      console.error(err)
      // Fallback
      setFeedback({
        score: 7,
        strengths: ["Clear communication", "Addressed the core concept"],
        weaknesses: ["Lacked deep technical details"],
        improvement: ["Could be more detailed", "Provide concrete examples"],
        confidence: "medium",
        topic: "General",
        subtopic: "General",
        evaluation_summary: "A decent answer but needs more depth.",
        next_difficulty: "Medium",
        next_question: "Can you provide an example of how you used this in a real project?",
        question_type: "follow-up",
        expected_answer_points: ["Mention real project", "Explain implementation Details"]
      })
      setCumulativeScore(prev => prev + 7)
      setState('feedback')
    }
  }

  const handleNext = async () => {
    if (questionCount >= 2) {
      setState('finished')
      await saveSessionToDB()
    } else {
      // Use dynamically generated difficulty and question
      if (feedback?.next_difficulty) setDifficulty(feedback.next_difficulty)
      if (feedback?.next_question) setCurrentQuestion(feedback.next_question)
      
      setQuestionCount(prev => prev + 1)
      setAnswer('')
      setFeedback(null)
      setState('question') // Go straight to the next question
    }
  }

  const saveSessionToDB = async () => {
    if (!user) return
    const finalScore = Math.round((cumulativeScore + (feedback?.score || 0)) / (questionCount + 1)*10)
    
    // Safety check max 10
    const normalizedScore = Math.min(10, Math.max(0, finalScore))

    await supabase.from('interviews').insert({
      user_id: user.id,
      role,
      score: normalizedScore,
      feedback: {
        last_strengths: feedback?.strengths,
        last_improvements: feedback?.improvement,
        topic_trend: feedback?.topic
      }
    })
  }

  if (state === 'loading' || state === 'evaluating') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <BrainCircuit className={`w-16 h-16 text-primary relative z-10 ${state === 'evaluating' ? 'animate-pulse' : ''}`} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {state === 'loading' ? 'Generating Question...' : 'Evaluating Answer...'}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {state === 'loading' 
            ? `Analyzing ${role} requirements for a ${difficulty} level question.` 
            : `PrepGrid AI is assessing correctness, depth, and clarity.`}
        </p>
      </div>
    )
  }

  if (state === 'finished') {
    const finalAvg = Math.round(cumulativeScore / questionCount)
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center bg-[#0a0a0c] border border-white/10 rounded-3xl p-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
          <span className="text-4xl font-black text-green-400">{finalAvg}/10</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Interview Complete</h2>
        <p className="text-muted-foreground mb-8">
          Your average score across the session was {finalAvg}/10. Keep practicing to improve your technical communication!
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 pb-12">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-white leading-tight">{role} Interview</h2>
            <p className="text-xs text-muted-foreground">Question {questionCount} of 2 • {difficulty}</p>
          </div>
        </div>
        {feedback && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-white">Score: {feedback.score}/10</span>
          </div>
        )}
      </div>

      {state === 'question' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h3 className="text-lg text-white/90 leading-relaxed font-medium">
              "{currentQuestion}"
            </h3>
          </div>

          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              className="w-full h-64 p-6 bg-[#0a0a0c] border border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
            <button 
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-xl transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {state === 'feedback' && feedback && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Big Score Card */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-3xl flex-shrink-0 flex items-center justify-center flex-col min-w-[200px]">
              <span className={`text-6xl font-black ${
                feedback.score >= 8 ? 'text-green-400' : feedback.score >= 5 ? 'text-yellow-400' : 'text-red-400'
              }`}>{feedback.score}</span>
              <span className="text-sm font-bold text-muted-foreground mt-2 tracking-widest uppercase">Score</span>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h4>
                <ul className="list-disc pl-5 text-sm text-green-100/70 space-y-1">
                  {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/10 p-5 rounded-2xl">
                <h4 className="text-sm font-bold text-yellow-500 mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <Target className="w-4 h-4" /> Areas to Improve
                </h4>
                <ul className="list-disc pl-5 text-sm text-yellow-100/70 space-y-1">
                  {feedback.improvement.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-3 tracking-wide flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" /> Evaluation Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {feedback.evaluation_summary}
              </p>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold text-white mb-2 tracking-wide flex items-center gap-2">
                Expected Answer Points (Next Question)
              </h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {feedback.expected_answer_points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              {questionCount >= 2 ? 'Finish Session' : 'Next Question'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
