'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Target,
  Trophy,
  Activity,
  Code2,
  Cpu,
  BrainCircuit,
  Database,
  Globe,
  LayoutGrid,
  LucideIcon,
  Layers,
  Zap,
  Box,
  Binary,
  Code,
  Braces
} from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'
import { FluidDropdown, DropdownOption } from '@/components/ui/fluid-dropdown'

export default function PracticeListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [questions, setQuestions] = useState<any[]>([])
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      
      // Fetch Questions
      const { data: qData } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })
      
      if (qData) {
        setQuestions(qData)
      }

      // Fetch User Submissions to mark solved problems
      if (user) {
        const { data: submissions } = await supabase
          .from('submissions')
          .select('question_id')
          .eq('user_id', user.id)
          .eq('status', 'Accepted')
        
        if (submissions) {
          const solved = new Set<number>(submissions.map(s => s.question_id))
          setSolvedIds(solved)
        }
      }
      
      setIsLoading(false)
    }
    fetchData()
  }, [user])

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty
    const matchesTopic = !selectedTopic || q.topic === selectedTopic
    return matchesSearch && matchesDifficulty && matchesTopic
  })

  // Map unique topics to DropdownOptions
  const topicOptions: DropdownOption[] = [
    { id: 'all', label: 'All Topics', Icon: Layers, color: '#A06CD5' },
    ...Array.from(new Set(questions.map(q => q.topic)))
      .filter(Boolean)
      .map(topic => {
        let Icon: LucideIcon = Code
        let color = '#45B7D1'
        
        // Dynamic styling based on topic
        if (topic.includes('Array')) { Icon = Database; color = '#FF6B6B' }
        else if (topic.includes('DP')) { Icon = BrainCircuit; color = '#FFD93D' }
        else if (topic.includes('Bit')) { Icon = Binary; color = '#6BCB77' }
        else if (topic.includes('String')) { Icon = Globe; color = '#4D96FF' }
        else if (topic.includes('Linked')) { Icon = Activity; color = '#845EC2' }
        else if (topic.includes('Tree')) { Icon = Box; color = '#FF9671' }
        else if (topic.includes('Math')) { Icon = Zap; color = '#F9F871' }
        else if (topic.includes('Graph')) { Icon = Braces; color = '#00D7FF' }

        return { id: topic, label: topic, Icon, color }
      })
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-12 w-1/3 bg-white/5 rounded-xl mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Code Practice</h1>
            <p className="text-muted-foreground text-sm max-w-lg">
              Master algorithm patterns and data structures with our curated collection of technical interview problems.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-white">{solvedIds.size} / {questions.length} Solved</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-400">
                {Math.round((solvedIds.size / (questions.length || 1)) * 100)}% Progress
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search problems by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xl"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-[#0a0a0c] border border-white/10 rounded-2xl p-1">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedDifficulty === diff 
                    ? (diff === 'Easy' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                       diff === 'Medium' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 
                       'bg-red-500 text-white shadow-lg shadow-red-500/20')
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <FluidDropdown 
              options={topicOptions}
              value={selectedTopic || 'all'}
              onChange={(id) => setSelectedTopic(id)}
              className="w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Problem List */}
      <section>
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0c] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="col-span-1">Status</div>
            <div className="col-span-6 md:col-span-7">Title</div>
            <div className="col-span-3 md:col-span-2">Difficulty</div>
            <div className="col-span-2">Topic</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground italic flex flex-col items-center gap-4">
                <Target className="w-12 h-12 opacity-10" />
                <p>No problems found matching your filters.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedDifficulty(null); setSelectedTopic(null)}}
                  className="text-sm font-bold text-blue-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div 
                  key={q.id} 
                  onClick={() => router.push(`/dashboard/practice/${q.id}`)}
                  className="grid grid-cols-12 items-center px-6 py-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div className="col-span-1">
                    {solvedIds.has(q.id) ? (
                      <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-6 md:col-span-7 flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {q.id}. {q.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {q.description.substring(0, 80)}...
                    </span>
                  </div>
                  
                  <div className="col-span-3 md:col-span-2">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md ${
                      q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{q.topic}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-white transition-all opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Data Structures', Icon: Cpu, color: 'text-purple-400', count: questions.filter(q => q.topic.includes('Array') || q.topic.includes('Tree') || q.topic.includes('Graph')).length },
          { label: 'Algorithms', Icon: BrainCircuit, color: 'text-orange-400', count: questions.filter(q => q.topic.includes('Search') || q.topic.includes('Sort') || q.topic.includes('DP')).length },
          { label: 'Total Problems', Icon: LayoutGrid, color: 'text-blue-400', count: questions.length },
          { label: 'Solved', Icon: CheckCircle2, color: 'text-green-400', count: solvedIds.size }
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex items-center gap-4 group hover:bg-white/[0.04] transition-colors">
            <div className={`p-3 rounded-xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
              <item.Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">{item.label}</p>
              <p className="text-2xl font-black text-white">{item.count}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  )
}