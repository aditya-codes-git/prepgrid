'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Clock, Brain, User as UserIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface UserProfile {
  id: string
  email: string
  full_name: string
  created_at: string
  submissions: any[]
  interviews: any[]
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, email, full_name, created_at,
          submissions(id),
          interviews(score)
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setUsers(data as any)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">Monitor platform engagement.</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#0a0a0c] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5 text-muted-foreground uppercase tracking-wider text-xs font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Questions Solved</th>
              <th className="px-6 py-4">Interviews</th>
              <th className="px-6 py-4">Avg Score</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found.</td>
              </tr>
            ) : (
              users.map(u => {
                const solvedCount = u.submissions?.length || 0;
                const interviewCount = u.interviews?.length || 0;
                const avgScore = interviewCount > 0 
                  ? (u.interviews.reduce((acc, curr) => acc + curr.score, 0) / interviewCount).toFixed(1)
                  : '-';
                
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.full_name || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      {solvedCount}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {interviewCount}
                    </td>
                    <td className="px-6 py-4">
                      {interviewCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                          <Brain className="w-3 h-3" /> {avgScore}/10
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
