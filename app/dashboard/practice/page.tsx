'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, Search, Filter, CheckCircle2, ChevronRight } from 'lucide-react'
import { problems } from '@/lib/data/questions'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'

export default function PracticeHubPage() {
  const [activeFilter, setActiveFilter] = useState('All Topics')
  const [searchQuery, setSearchQuery] = useState('')
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set())
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchSubmissions() {
      if (!user) return
      
      const { data, error } = await supabase
        .from('submissions')
        .select('question_id')
        .eq('user_id', user.id)
        .eq('status', 'solved')

      if (data && !error) {
        const ids = new Set(data.map(sub => sub.question_id))
        setSolvedIds(ids)
      }
    }
    fetchSubmissions()
  }, [user])

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTopic = activeFilter === 'All Topics' || p.topic === activeFilter
    return matchesSearch && matchesTopic
  })

  // Unique topics from dataset
  const topics = ['All Topics', ...Array.from(new Set(problems.map(p => p.topic)))]

  // Calculate progress
  const totalSolved = solvedIds.size
  const totalProblems = problems.length
  const progressPercent = Math.round((totalSolved / totalProblems) * 100)

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto">
      
      {/* Header section with progress */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/10 rounded-3xl p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl pointer-events-none">
          <div className="w-48 h-48 bg-blue-500 rounded-full" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            Coding Practice
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-md">
            Master algorithms and data structures. Pick a problem, write your code, and verify it against test cases.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 bg-[#050505] p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="relative w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center">
            {/* Simple CSS ring equivalent */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
              <circle 
                cx="30" cy="30" r="28" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                className="text-blue-500 transition-all duration-1000 ease-out" 
                strokeDasharray="176" 
                strokeDashoffset={176 - (176 * progressPercent) / 100}
              />
            </svg>
            <span className="font-bold text-lg text-white">{totalSolved}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-0.5">Problems Solved</p>
            <p className="text-xs text-muted-foreground">Out of {totalProblems} available</p>
          </div>
        </div>
      </section>

      {/* Problem list section */}
      <section className="rounded-3xl border border-white/10 bg-[#0a0a0c] overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div className="relative flex-1 w-full min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search problems..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-foreground focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-2 sm:pb-0">
            {topics.map((topic) => (
              <button 
                key={topic}
                onClick={() => setActiveFilter(topic)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === topic 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-white/5">
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No problems found matching your criteria.
            </div>
          ) : (
            filteredProblems.map((p) => {
              const isSolved = solvedIds.has(p.id)
              return (
                <div 
                  key={p.id} 
                  onClick={() => router.push(`/dashboard/practice/${p.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:px-6 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 flex justify-center shrink-0">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors">{p.id}. {p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 sm:mt-0 pl-10 sm:pl-0 shrink-0">
                    <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md">{p.topic}</span>
                    <span className={`w-20 text-center text-xs font-bold rounded-full py-1.5 ${
                      p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                      p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {p.difficulty}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors hidden md:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

    </div>
  )
}
