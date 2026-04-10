'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-context'
import { Activity, Target, BrainCircuit, CheckCircle2, TrendingUp, Search, Calendar } from 'lucide-react'

// Define Activity Interface
interface ActivityItem {
  id: string;
  type: 'submission' | 'interview';
  title: string;
  subtitle: string;
  timestamp: string;
  dateStr: string;
}

export default function ProfilePage() {
  const { user } = useAuth()
  
  const [stats, setStats] = useState({
    solvedCount: 0,
    interviewsTaken: 0,
    avgScore: 0,
    weakTopic: 'Not enough data'
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfileData()
    }
  }, [user])

  const fetchProfileData = async () => {
    setLoading(true)

    // Parallel fetch
    const [
      { data: subs },
      { data: ints },
      { data: questions }
    ] = await Promise.all([
      supabase.from('submissions').select('id, question_id, created_at, status').eq('user_id', user!.id).eq('status', 'solved'),
      supabase.from('interviews').select('id, role, score, created_at').eq('user_id', user!.id),
      supabase.from('questions').select('id, title, topic').eq('is_active', true)
    ])

    const solvedCount = subs?.length || 0
    const interviewsTaken = ints?.length || 0
    
    // Average Score
    const avgScore = interviewsTaken > 0 
      ? Math.round((ints!.reduce((acc, curr) => acc + curr.score, 0) / interviewsTaken) * 10) / 10 
      : 0

    // Compute Weak Topic dynamically based on fetched active questions
    let weakTopic = "Need more data"
    if (subs && subs.length > 0 && questions && questions.length > 0) {
      const topicCounts: Record<string, number> = {}
      questions.forEach(q => topicCounts[q.topic] = 0)
      
      subs.forEach(s => {
        const matchingQuestion = questions.find(q => q.id === s.question_id)
        if (matchingQuestion) {
          topicCounts[matchingQuestion.topic] = (topicCounts[matchingQuestion.topic] || 0) + 1
        }
      })

      // Find lowest mapped topic
      const topics = Object.keys(topicCounts)
      if (topics.length > 0) {
        let minTopic = topics[0]
        let minCount = topicCounts[minTopic]
        for (const topic of topics) {
          if (topicCounts[topic] < minCount) {
            minCount = topicCounts[topic]
            minTopic = topic
          }
        }
        weakTopic = minTopic || "Need more data"
      }
    }

    setStats({ solvedCount, interviewsTaken, avgScore, weakTopic })

    // Merge Activities
    const mergedActivity: ActivityItem[] = []
    
    if (subs) {
      subs.forEach(s => {
        const matchingQuestion = questions?.find(q => q.id === s.question_id)
        mergedActivity.push({
          id: `sub-${s.id}`,
          type: 'submission',
          title: 'Solved Question',
          subtitle: matchingQuestion?.title || `Question #${s.question_id}`,
          timestamp: s.created_at,
          dateStr: formatTimeAgo(new Date(s.created_at))
        })
      })
    }

    if (ints) {
      ints.forEach(i => {
        mergedActivity.push({
          id: `int-${i.id}`,
          type: 'interview',
          title: `Interview Score: ${i.score}/10`,
          subtitle: i.role,
          timestamp: i.created_at,
          dateStr: formatTimeAgo(new Date(i.created_at))
        })
      })
    }

    // Sort descending by timestamp
    mergedActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    setActivities(mergedActivity.slice(0, 5)) // Get latest 5
    
    setLoading(false)
  }

  const formatTimeAgo = (date: Date) => {
    const min = Math.floor((new Date().getTime() - date.getTime()) / 60000)
    if (min < 1) return `Just now`
    if (min < 60) return `${min} mins ago`
    if (min < 1440) return `${Math.floor(min/60)} hrs ago`
    return `${Math.floor(min/1440)} days ago`
  }

  // Use a fallback gradient if no avatar exists. 
  const initials = user?.user_metadata?.full_name?.substring(0, 2)?.toUpperCase() 
    || user?.email?.substring(0, 2)?.toUpperCase() 
    || 'U'

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* PROFILE HEADER */}
      <section className="flex flex-col sm:flex-row items-center gap-8 bg-white/[0.02] border border-white/10 rounded-3xl p-8 lg:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl pointer-events-none">
          <div className="w-48 h-48 bg-blue-500 rounded-full" />
        </div>
        
        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-2xl shadow-blue-500/20 border-4 border-white/5 relative z-10">
          {initials}
        </div>
        
        <div className="text-center sm:text-left relative z-10 flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
            {user?.user_metadata?.full_name || 'Anonymous Developer'}
          </h1>
          <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative -top-0.5" />
            {user?.email}
          </p>
          <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white shadow-lg">
              Preparing for technical interviews
            </span>
          </div>
        </div>
      </section>

      {/* THREE-COLUMN STATS LAYOUT */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
          {loading && <div className="absolute inset-0 bg-[#050505]/80 animate-pulse z-10" />}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Problems Solved</h2>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.solvedCount}</div>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
          {loading && <div className="absolute inset-0 bg-[#050505]/80 animate-pulse z-10" />}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Interviews Taken</h2>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.interviewsTaken}</div>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
          {loading && <div className="absolute inset-0 bg-[#050505]/80 animate-pulse z-10" />}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Avg Score</h2>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter flex items-baseline gap-2">
            {stats.avgScore} <span className="text-lg text-muted-foreground">/ 10</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WEAK AREA INSIGHT */}
        <section className="flex flex-col">
           <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 relative overflow-hidden h-full">
            {loading && <div className="absolute inset-0 bg-[#050505]/80 animate-pulse z-10" />}
            <div className="absolute top-0 right-0 p-8 opacity-20 blur-2xl pointer-events-none">
              <div className="w-32 h-32 bg-primary rounded-full" />
            </div>
            
            <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-3">
              <Target className="w-5 h-5" /> Focus Insight
            </h2>
            
            <p className="text-muted-foreground mb-3 text-sm font-medium">To improve your overall performance, you should dedicate your next session to:</p>
            <div className="text-3xl font-black text-white mt-auto capitalize tracking-tighter">
              {stats.weakTopic}
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY TIMELINE */}
        <section className="flex flex-col">
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0c] p-8 h-full relative">
            {loading && <div className="absolute inset-0 bg-[#050505]/80 animate-pulse z-10" />}
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Activity className="w-5 h-5 text-muted-foreground" /> Recent Activity
            </h2>

            {activities.length === 0 && !loading ? (
              <div className="text-center text-muted-foreground py-8">
                No activity yet. Start your journey!
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
                {activities.map((act) => (
                  <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-[#0a0a0c] bg-white/20 group-hover:bg-primary shrink-0 shadow transition-colors z-10" />
                    
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${act.type === 'submission' ? 'text-emerald-400' : 'text-primary'}`}>
                          {act.type === 'submission' ? 'Code Submitted' : 'Interview Completed'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          <Calendar className="w-3 h-3" />
                          {act.dateStr}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-0.5 truncate">{act.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{act.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  )
}
