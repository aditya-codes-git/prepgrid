'use client'

import { useEffect, useState } from 'react'
import { QuestionForm } from '../../QuestionForm'
import { supabase } from '@/lib/supabase'
import { v4 } from 'uuid'

export default function EditQuestion({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    async function fetchQ() {
      const { data } = await supabase.from('questions').select('*').eq('id', params.id).single()
      setData(data)
    }
    fetchQ()
  }, [params.id])

  if (!data) return <div className="animate-pulse">Loading question data...</div>

  return <QuestionForm initialData={data} />
}
