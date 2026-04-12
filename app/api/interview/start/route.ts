import { Groq } from "groq-sdk"
import { createClient } from "@supabase/supabase-js"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Using service role key or anon key (ensure env var exists or fallback to anon)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { role, difficulty, resumeData, user_id } = body

    const primary_skills = resumeData?.primary_skills?.join(", ") || "None"
    const tech_stack = resumeData?.tech_stack?.join(", ") || "None"
    const weaknesses = resumeData?.weaknesses?.join(", ") || "None"

    const prompt = `You are a senior technical interviewer.

Start a mock interview.

Return ONLY valid JSON.

Format:
{
  "question": "string",
  "difficulty": "easy | medium | hard",
  "topic": "string",
  "subtopic": "string"
}

Rules:
- Ask only ONE question
- Do NOT return empty values
- Keep it realistic and role-based

Context:
Role: ${role}
Difficulty: ${difficulty}
Skills: ${primary_skills}
Tech: ${tech_stack}
Weaknesses: ${weaknesses}
`

    let parsed
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-70b-8192",
      })

      const raw = completion.choices[0]?.message?.content || ""

      // CLEAN RESPONSE
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      parsed = JSON.parse(cleaned)
    } catch (err) {
      // FALLBACK IF JSON FAILS
      parsed = {
        question: "Can you explain a core concept related to your role?",
        difficulty: "medium",
        topic: "general",
        subtopic: "basics",
      }
    }

    // FINAL SAFETY CHECK
    if (!parsed.question || parsed.question.length < 5) {
      parsed.question = "Explain a key concept in your domain."
    }

    // SUPABASE INTEGRATION - Insert session
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user_id || null, // Default to null if no user_id passed
        role,
        difficulty,
      })
      .select()
      .single()

    if (sessionError || !session) {
      console.warn("Could not insert session, proceeding without DB save:", sessionError)
    }

    // Store first question if session was created
    if (session) {
      await supabase.from("interview_questions").insert({
        session_id: session.id,
        question: parsed.question,
        topic: parsed.topic,
        difficulty: parsed.difficulty,
      })
    }

    // FINAL RESPONSE
    return Response.json({
      success: true,
      sessionId: session?.id || "temp-session-id",
      question: parsed.question,
      topic: parsed.topic,
      difficulty: parsed.difficulty,
    })
  } catch (error) {
    console.error("API error:", error)
    return new Response(
      JSON.stringify({
        error: "AI generation failed",
        fallback: "What is a core concept in your role?",
      }),
      { status: 500 }
    )
  }
}
