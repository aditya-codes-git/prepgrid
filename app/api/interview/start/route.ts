import { createClient } from "@supabase/supabase-js"

// Using service role key or anon key (ensure env var exists or fallback to anon)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { role, difficulty, resumeData, user_id } = body

    const primary_skills = resumeData?.primary_skills || []
    const tech_stack = resumeData?.tech_stack || []
    const weaknesses = resumeData?.weaknesses || []

    const prompt = `You are a senior technical interviewer.

Start a mock interview.

Return ONLY valid JSON:

{
  "question": "string",
  "difficulty": "easy | medium | hard",
  "topic": "string",
  "subtopic": "string"
}

Role: ${role}
Difficulty: ${difficulty}
Skills: ${primary_skills}
Tech: ${tech_stack}
Weaknesses: ${weaknesses}
`

    if (!process.env.GROQ_API_KEY) {
      console.error('[ERROR] GROQ_API_KEY is missing in environment variables');
      return Response.json({ error: "AI configuration error" }, { status: 500 });
    }

    //----------------------------------------
    // USE FETCH INSTEAD OF SDK
    //----------------------------------------
    let parsed
    try {
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
        const errorText = await response.text();
        console.error(`[ERROR] Groq API Start Error (${response.status}):`, errorText);
        throw new Error(`Groq API Error: ${response.status}`);
      }

      const data = await response.json()
      let raw = data?.choices?.[0]?.message?.content || ""
      
      console.log(`[DEBUG] Start Question Raw Content for ${role}:`, raw)

      if (!raw) {
        console.error('[ERROR] Groq returned empty response for start question')
        throw new Error('Empty AI response')
      }

      // CLEAN RESPONSE
      raw = raw.replace(/```json/g, "").replace(/```/g, "").trim()

      parsed = JSON.parse(raw)
      console.log(`[DEBUG] Parsed Start Question:`, parsed)
    } catch (err) {
      console.error("[ERROR] Groq Parse/API Error:", err)
      // FALLBACK IF JSON FAILS OR API ERROR
      parsed = {
        question: `Can you introduce yourself and explain what you consider the most challenging technical project you've worked on related to ${role}?`,
        difficulty: difficulty || "medium",
        topic: "Experience",
        subtopic: "Introduction",
      }
    }

    // FINAL SAFETY CHECK
    if (!parsed.question || parsed.question.length < 5) {
      console.warn('[WARN] Question too short, using secondary fallback')
      parsed.question = `Let's start with your expertise: What are the fundamental principles of being a great ${role}?`
    }

    //----------------------------------------
    // SUPABASE INTEGRATION (Preserved for session tracking)
    //----------------------------------------
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user_id || null,
        role,
        difficulty,
      })
      .select()
      .single()

    if (sessionError || !session) {
      console.warn("Could not insert session, proceeding without DB save:", sessionError)
    }

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
        success: false,
        error: "Interview start failed",
        fallback: "What is a core concept in your role?",
      }),
      { status: 500 }
    )
  }
}
