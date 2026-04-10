'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FileCode2, Edit, Trash2, Plus, Loader2, Eye, EyeOff, Search, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Question {
  id: number
  title: string
  difficulty: string
  topic: string
  is_active: boolean
  is_featured: boolean
  description: string
  test_cases: any[]
  function_signatures: any
  constraints: any[]
  created_at: string
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: false })
    
    if (data) setQuestions(data)
    setLoading(false)
  }

  async function toggleActive(id: number, current: boolean) {
    const { error } = await supabase
      .from('questions')
      .update({ is_active: !current })
      .eq('id', id)
    if (!error) {
      setQuestions(q => q.map(item => item.id === id ? { ...item, is_active: !current } : item))
    }
  }

  async function toggleFeatured(id: number, current: boolean) {
    const { error } = await supabase
      .from('questions')
      .update({ is_featured: !current })
      .eq('id', id)
    if (!error) {
      setQuestions(q => q.map(item => item.id === id ? { ...item, is_featured: !current } : item))
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (!error) {
      setQuestions(q => q.filter(item => item.id !== id))
    }
  }

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    q.topic.toLowerCase().includes(search.toLowerCase())
  )

  const diffColors: Record<string, string> = {
    easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    hard: 'text-red-400 bg-red-400/10 border-red-400/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Questions Library</h1>
          <p className="text-sm text-muted-foreground">Manage coding challenges and curriculum.</p>
        </div>
        <Link 
          href="/admin/questions/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Add Question
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by title or topic..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="rounded-xl border border-white/5 bg-[#0a0a0c] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5 text-muted-foreground uppercase tracking-wider text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Topic</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Loading questions...</div>
                </td>
              </tr>
            ) : filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No questions found.</td>
              </tr>
            ) : (
              filteredQuestions.map(q => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white flex items-center gap-2">
                      {q.title}
                      {q.is_featured && <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary">FEATURED</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase border ${diffColors[q.difficulty.toLowerCase()] || diffColors.medium}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {q.topic}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleActive(q.id, q.is_active)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                        q.is_active ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 text-muted-foreground hover:text-white'
                      }`}
                    >
                      {q.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {q.is_active ? 'ACTIVE' : 'DRAFT'}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/practice/${q.id}`}
                      target="_blank"
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/admin/questions/edit/${q.id}`}
                      className="p-1.5 text-muted-foreground hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-400/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
