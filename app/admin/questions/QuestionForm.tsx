'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save, Loader2, Code2 } from 'lucide-react'
import Link from 'next/link'

export function QuestionForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    topic: '',
    description: '',
    function_signatures: '{\n  "python": "def solve():\\n    pass",\n  "javascript": "function solve() {\\n\\n}",\n  "java": "class Solution {\\n    public void solve() {\\n\\n    }\\n}",\n  "cpp": "class Solution {\\npublic:\\n    void solve() {\\n\\n    }\\n};",\n  "c": "void solve() {\\n\\n}"\n}',
    test_cases: '[\n  {\n    "input": "Example Input",\n    "expected": "Example Output"\n  }\n]',
    constraints: '[\n  "Constraint 1"\n]',
    expected_output: '',
    is_active: true,
    is_featured: false
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        difficulty: initialData.difficulty || 'Easy',
        topic: initialData.topic || '',
        description: initialData.description || '',
        function_signatures: JSON.stringify(initialData.function_signatures || {}, null, 2),
        test_cases: JSON.stringify(initialData.test_cases || [], null, 2),
        constraints: JSON.stringify(initialData.constraints || [], null, 2),
        expected_output: initialData.expected_output || '',
        is_active: initialData.is_active ?? true,
        is_featured: initialData.is_featured ?? false
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        function_signatures: JSON.parse(formData.function_signatures),
        test_cases: JSON.parse(formData.test_cases),
        constraints: JSON.parse(formData.constraints)
      }

      if (initialData?.id) {
        await supabase.from('questions').update(payload).eq('id', initialData.id)
      } else {
        await supabase.from('questions').insert([payload])
      }

      router.push('/admin/questions')
      router.refresh()
    } catch (err: any) {
      alert("Error saving question. Ensure JSON fields are valid arrays/objects. " + err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/questions" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{initialData ? 'Edit Question' : 'Add New Question'}</h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {initialData ? 'Update Question' : 'Publish Question'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4 p-6 border border-white/5 bg-[#0a0a0c] rounded-2xl">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Basic Details</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Question Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="e.g. Two Sum"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Description (Markdown Supported)</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full h-40 p-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-primary/50 focus:outline-none transition-colors leading-relaxed"
                placeholder="Describe the problem..."
              />
            </div>
          </div>

          <div className="space-y-4 p-6 border border-white/5 bg-[#0a0a0c] rounded-2xl">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Technical Parameters
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Function Signatures (JSON)</label>
              <textarea 
                required
                value={formData.function_signatures}
                onChange={e => setFormData({...formData, function_signatures: e.target.value})}
                className="w-full h-48 p-4 font-mono text-xs rounded-xl bg-black/50 border border-white/5 focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Test Cases (JSON Array)</label>
                <textarea 
                  required
                  value={formData.test_cases}
                  onChange={e => setFormData({...formData, test_cases: e.target.value})}
                  className="w-full h-40 p-4 font-mono text-xs rounded-xl bg-black/50 border border-white/5 focus:border-primary/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Constraints (JSON Array)</label>
                <textarea 
                  required
                  value={formData.constraints}
                  onChange={e => setFormData({...formData, constraints: e.target.value})}
                  className="w-full h-40 p-4 font-mono text-xs rounded-xl bg-black/50 border border-white/5 focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 p-6 border border-white/5 bg-[#0a0a0c] rounded-2xl">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Metadata</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Difficulty</label>
              <select 
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
                className="w-full h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-primary/50 focus:outline-none"
              >
                <option value="Easy" className="bg-[#0a0a0c]">Easy</option>
                <option value="Medium" className="bg-[#0a0a0c]">Medium</option>
                <option value="Hard" className="bg-[#0a0a0c]">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Topic</label>
              <input 
                required
                type="text" 
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
                className="w-full h-12 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="e.g. Arrays, Dynamic Programming"
              />
            </div>
            
            <div className="pt-4 space-y-4 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 rounded border-white/10 bg-black/50 text-emerald-500 focus:ring-emerald-500/50"
                />
                <span className="text-sm font-medium">Active (Visible to users)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_featured}
                  onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-5 h-5 rounded border-white/10 bg-black/50 text-primary focus:ring-primary/50"
                />
                <span className="text-sm font-medium">Featured (Highlight on dashboard)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
