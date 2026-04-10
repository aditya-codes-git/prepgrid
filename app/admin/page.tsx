'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, FileCode2, Target, Activity } from 'lucide-react'

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    users: 0,
    questions: 0,
    interviews: 0
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch questions
      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })

      // Fetch interviews
      const { count: interviewsCount } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })

      setStats({
        users: usersCount || 0,
        questions: questionsCount || 0,
        interviews: interviewsCount || 0
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse flex gap-4">Loading analytics...</div>
  }

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Platform Questions', value: stats.questions, icon: FileCode2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Interviews Conducted', value: stats.interviews, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">Platform analytics and engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0c] flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Attempted Questions Placeholder */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0c]">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Most Attempted Questions
          </h3>
          <div className="mt-6 flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed border-white/10 rounded-xl">
            <p className="text-sm">Wait for more user data.</p>
          </div>
        </div>

        {/* Avg Score by Topic Placeholder */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0c]">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Avg Score by Topic
          </h3>
          <div className="mt-6 flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed border-white/10 rounded-xl">
            <p className="text-sm">Not enough interview data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
