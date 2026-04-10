'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  Code2, 
  Server, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Target, 
  Activity, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Search,
  Filter
} from 'lucide-react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'
import { problems } from '@/lib/data/questions'

interface PrepStats {
  solvedCount: number;
  avgScore: number;
  interviewsTaken: number;
  weakTopic: string;
}

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: Date;
  color: string;
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [stats, setStats] = useState<PrepStats>({ solvedCount: 0, avgScore: 0, interviewsTaken: 0, weakTopic: 'Analyzing...' })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    
    // 1. Fetch Submissions
    const { data: subs } = await supabase
      .from('submissions')
      .select('id, question_id, created_at, status')
      .eq('user_id', user!.id)
      .eq('status', 'solved')

    // 2. Fetch Interviews
    const { data: ints } = await supabase
      .from('interviews')
      .select('id, role, score, created_at')
      .eq('user_id', user!.id)

    // Calculate Stats
    const solvedCount = subs?.length || 0
    const interviewsTaken = ints?.length || 0
    const avgScore = interviewsTaken > 0 
      ? Math.round((ints!.reduce((acc, curr) => acc + curr.score, 0) / interviewsTaken) * 10) / 10 
      : 0

    // Calculate Weak Topic
    let weakTopic = "Need more data"
    if (subs && subs.length > 0) {
      const topicCounts: Record<string, number> = {}
      problems.forEach(p => topicCounts[p.topic] = 0)
      subs.forEach(s => {
        const prob = problems.find(p => p.id === s.question_id)
        if (prob) topicCounts[prob.topic] += 1
      })
      
      let minTopic = Object.keys(topicCounts)[0]
      let minCount = topicCounts[minTopic]
      for (const topic in topicCounts) {
        if (topicCounts[topic] < minCount) {
          minCount = topicCounts[topic]
          minTopic = topic
        }
      }
      weakTopic = minTopic || "Need more data"
    }

    setStats({ solvedCount, avgScore, interviewsTaken, weakTopic })

    // Merge Activities
    const mergedActivity: ActivityItem[] = []
    
    subs?.forEach(s => {
      const p = problems.find(prob => prob.id === s.question_id)
      mergedActivity.push({
        id: s.id,
        action: 'Solved',
        target: p?.title || `Question #${s.question_id}`,
        time: new Date(s.created_at),
        color: 'text-green-400'
      })
    })

    ints?.forEach(i => {
      mergedActivity.push({
        id: i.id,
        action: 'Interview',
        target: `${i.role} (${i.score}/10)`,
        time: new Date(i.created_at),
        color: 'text-primary'
      })
    })

    // Sort descending
    mergedActivity.sort((a, b) => b.time.getTime() - a.time.getTime())
    setActivities(mergedActivity.slice(0, 5)) // Top 5
    
    setIsLoading(false)
  }

  const formatTimeAgo = (date: Date) => {
    const min = Math.floor((new Date().getTime() - date.getTime()) / 60000)
    if (min < 60) return `${min} mins ago`
    if (min < 1440) return `${Math.floor(min/60)} hrs ago`
    return `${Math.floor(min/1440)} days ago`
  }

  // Pre-filter recommended problems (just hardcode top 5 unsolved if possible, or first 5)
  const recommendedProblems = problems.slice(0, 5)

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* SECTION 1: QUICK START */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Engineer'}</h1>
            <p className="text-muted-foreground mt-1 text-sm">Pick up right where you left off.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div onClick={() => router.push('/dashboard/practice')} className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:bg-white/[0.04] cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Coding Practice</h3>
                <p className="text-xs text-muted-foreground">Algorithms & Data Structures</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Master the fundamentals with curated problem sets tailored to your target companies.</p>
            <button className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
              Start Practicing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div onClick={() => router.push('/dashboard/interview')} className="group relative rounded-2xl border border-primary/30 bg-primary/[0.05] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.3)] cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-50 blur-2xl">
               <div className="w-24 h-24 bg-primary rounded-full" />
            </div>
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">AI Interview</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider">Ready</p>
                </div>
              </div>
            </div>
            <p className="relative z-10 text-sm text-muted-foreground mb-6 line-clamp-2">Experience a realistic behavioral/technical interview driven by PrepGrid AI.</p>
            <button className="relative z-10 flex items-center justify-center w-full gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
              <Play className="w-4 h-4 fill-current" />
              Start Interview
            </button>
          </div>

          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">System Design</h3>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Design distributed systems and prepare for senior engineering rounds.</p>
            <button disabled className="flex items-center gap-2 text-sm font-bold text-muted-foreground opacity-50">
              Not Available
            </button>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Practice Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Recommended Problems
            </h2>
            <button onClick={() => router.push('/dashboard/practice')} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">View All Hub</button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0c] overflow-hidden">
            <div className="divide-y divide-white/5">
              {recommendedProblems.map((p) => (
                <div key={p.id} onClick={() => router.push(`/dashboard/practice/${p.id}`)} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">{p.title}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{p.topic}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 sm:mt-0">
                    <span className={`w-20 text-center text-xs font-bold rounded-full py-1 ${
                      p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                      p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {p.difficulty}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Real Stats */}
        <div className="space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" /> Performance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {isLoading && <div className="absolute inset-0 bg-[#0a0a0c]/80 animate-pulse" />}
                <span className="text-3xl font-black text-white">{stats.solvedCount}</span>
                <span className="text-xs text-muted-foreground mt-1">Problems Solved</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {isLoading && <div className="absolute inset-0 bg-[#0a0a0c]/80 animate-pulse" />}
                <span className="text-3xl font-black text-white">{stats.avgScore}/10</span>
                <span className="text-xs text-muted-foreground mt-1">Avg AI Score</span>
              </div>
              <div className="col-span-2 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.02] p-4 flex items-center justify-between relative overflow-hidden">
                {isLoading && <div className="absolute inset-0 bg-[#0a0a0c]/80 animate-pulse" />}
                <div>
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Insight: Weak Topic</span>
                  <p className="text-sm font-medium text-white mt-0.5 capitalize">{stats.weakTopic}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500/20" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" /> Activity
            </h2>
            <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-5 min-h-[150px] relative">
              {isLoading && <div className="absolute inset-0 bg-[#0a0a0c]/80 animate-pulse z-10" />}
              
              {activities.length === 0 && !isLoading ? (
                <div className="text-center text-muted-foreground text-sm py-4">No recent activity. Keep practicing!</div>
              ) : (
                <div className="relative border-l border-white/10 ml-3 space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                      <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#0a0a0c] border-2 border-primary/50" />
                      <p className="text-sm text-white font-medium">
                        <span className={activity.color}>{activity.action}</span> {activity.target}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {formatTimeAgo(activity.time)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
