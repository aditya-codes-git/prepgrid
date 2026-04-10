'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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

// --- MOCK DATA ---
const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", status: "solved", acceptance: "52.3%" },
  { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", status: "unsolved", acceptance: "34.1%" },
  { id: 3, title: "Merge k Sorted Lists", difficulty: "Hard", status: "unsolved", acceptance: "50.9%" },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", status: "solved", acceptance: "40.6%" },
  { id: 5, title: "LRU Cache", difficulty: "Medium", status: "unsolved", acceptance: "41.8%" },
  { id: 6, title: "Median of Two Sorted Arrays", difficulty: "Hard", status: "unsolved", acceptance: "38.2%" },
]

const recentActivity = [
  { action: "Solved", target: "Two Sum", time: "2 hours ago", color: "text-green-400" },
  { action: "Interview", target: "System Design Mock", time: " yesterday", color: "text-purple-400" },
  { action: "Attempted", target: "LRU Cache", time: "2 days ago", color: "text-yellow-400" },
]

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('All Topics')

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* SECTION 1: QUICK START */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Welcome back, Engineer</h1>
            <p className="text-muted-foreground mt-1 text-sm">Pick up right where you left off.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Practice */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
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

          {/* Card 2: AI Interview (Highlighted) */}
          <div className="group relative rounded-2xl border border-primary/30 bg-primary/[0.05] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.3)]">
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
            <p className="relative z-10 text-sm text-muted-foreground mb-6 line-clamp-2">Experience a realistic behavioral and technical interview driven by PrepGrid AI.</p>
            <button className="relative z-10 flex items-center justify-center w-full gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
              <Play className="w-4 h-4 fill-current" />
              Start Interview
            </button>
          </div>

          {/* Card 3: System Design */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">System Design</h3>
                <p className="text-xs text-muted-foreground">Architecture & Scalability</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Design distributed systems and prepare for senior engineering rounds.</p>
            <button className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Begin Module <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN GRID: Left (Practice), Right (Stats & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width) - Practice Engine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Recommended Problems
            </h2>
            <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">View All</button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0c] overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search problems..." 
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-foreground focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {['All Topics', 'Arrays', 'Strings', 'DP', 'Graphs'].map((topic) => (
                  <button 
                    key={topic}
                    onClick={() => setActiveFilter(topic)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      activeFilter === topic 
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]' 
                        : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
                <button className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors ml-2">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Problem List */}
            <div className="divide-y divide-white/5">
              {problems.map((p) => (
                <div key={p.id} className="group flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-6 flex justify-center">
                      {p.status === 'solved' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-white/90 group-hover:text-white transition-colors">{p.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="hidden sm:inline-block text-xs text-muted-foreground">{p.acceptance} Acc.</span>
                    <span className={`w-20 text-center text-xs font-bold rounded-full py-1 ${
                      p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                      p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width) - Widgets */}
        <div className="space-y-6">
          
          {/* Stats & Insights */}
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-secondary" /> Performance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">42</span>
                <span className="text-xs text-muted-foreground mt-1">Problems Solved</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">92%</span>
                <span className="text-xs text-muted-foreground mt-1">Avg Interview Score</span>
              </div>
              <div className="col-span-2 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.02] p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Insight</span>
                  <p className="text-sm font-medium text-white mt-0.5">Focus on Dynamic Programming</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500/20" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" /> Activity
            </h2>
            <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-5">
              <div className="relative border-l border-white/10 ml-3 space-y-6">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="relative pl-6">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#0a0a0c] border-2 border-primary/50" />
                    <p className="text-sm text-white font-medium">
                      <span className={activity.color}>{activity.action}</span> {activity.target}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
