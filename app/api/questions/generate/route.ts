import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { track } = await req.json()

    if (!track) {
      return NextResponse.json({ error: 'Track is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing in environment variables')
      return NextResponse.json({ error: 'AI configuration error' }, { status: 500 })
    }

    const prompt = `You are a senior technical interviewer at a top-tier product company (like Google, Meta, or Stripe).

Your task is to generate a set of high-quality, industry-standard interview questions.

Role/Track: ${track}

Requirements:
- Generate exactly 6 questions.
- Difficulty: Medium (challenging but fair for college students/entry-level engineers).
- **Uniqueness**: Avoid basic definitions (e.g., "What is a Closure?"). Focus on application and decision-making.
- **Industry Standard**: Reflect real-world scenarios found in high-concurrency, scalable, or complex production environments.
- **Problem Solving**: Each question should require the candidate to explain "how" or "why" they would approach a specific scenario.
- **Concatenation**: Keep each question concise (max 2–3 lines).
- **No Answers**: Do NOT include answers, explanations, or numbering inside the question strings.

Output format (STRICT JSON):
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
    "Question 6"
  ]
}

Ensure the questions reflect modern standards (2026+) and cover diverse subtopics of the ${track} role.
`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Groq API Error (${response.status}):`, errorText)
      return NextResponse.json({ error: `AI Provider error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      console.error('Groq returned empty response content')
      throw new Error('No content returned from AI')
    }

    // Parse to ensure it's valid JSON before returning
    const parsed = JSON.parse(content)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Question Generation Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions. Please try again.' },
      { status: 500 }
    )
  }
}
