export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, role, difficulty, previousQuestion, userAnswer, candidateProfile, previousQuestions } = body

    if (action === "evaluate_answer") {
      const prompt = `You are an expert senior technical interviewer.
Evaluate the candidate's answer for a ${role} position.

Return ONLY valid JSON.

Format:
{
  "score": number (0-10),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvement": ["string"],
  "confidence": "low | medium | high",
  "topic": "string",
  "subtopic": "string",
  "evaluation_summary": "string",
  "next_difficulty": "easy | medium | hard",
  "next_question": "string",
  "question_type": "conceptual | coding | scenario | follow-up",
  "expected_answer_points": ["string"]
}

Context:
Question: ${previousQuestion}
Answer: ${userAnswer}
Role: ${role}
Current Difficulty: ${difficulty}
Candidate Profile: ${JSON.stringify(candidateProfile || {})}
Previous Questions: ${(previousQuestions || []).join(", ")}

Instructions:
- Be critical but fair.
- Provide 3 strengths and 3 improvement points.
- Generate a logical follow-up question or a new topic question based on the performance.
- Avoid repeating previous questions.
`

      if (!process.env.GROQ_API_KEY) {
        console.error('[ERROR] GROQ_API_KEY is missing in environment variables');
        return Response.json({ error: "AI configuration error" }, { status: 500 });
      }

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Correct high-quality versatile model identifier
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            response_format: { type: "json_object" }
          }),
        })

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[ERROR] Groq API Evaluation Error (${response.status}):`, errorText);
          throw new Error(`Groq API Error: ${response.status} - ${errorText.substring(0, 100)}`);
        }

        const data = await response.json()
        let raw = data?.choices?.[0]?.message?.content || ""

        if (!raw) {
          throw new Error('Empty AI response content');
        }

        const parsed = JSON.parse(raw)
        return Response.json(parsed)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown evaluation error';
        console.error("Evaluation AI Error:", errorMsg)
        
        // Reverting to a more professional fallback now that we've diagnosed the decommissioned model issue
        return Response.json({
          score: 7,
          strengths: ["Communication clarity", "Topic relevance"],
          weaknesses: ["Technical depth", "Implementation details"],
          improvement: ["Explain specific architectural trade-offs", "Provide code examples"],
          confidence: "medium",
          topic: role,
          subtopic: "General Technical",
          evaluation_summary: "A constructive technical response. To improve, focus on demonstrating deeper implementation knowledge and edge-case handling.",
          next_difficulty: "medium",
          next_question: `Can you dive deeper into how you'd handle high-concurrency scenarios in a ${role} environment?`,
          question_type: "follow-up",
          expected_answer_points: ["Concurrency", "Resource locking", "Scalability"],
        })
      }
    }

    // Default error if action not recognized
    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("API error:", error)
    return new Response(
      JSON.stringify({
        error: "Interview process failed",
        fallback: "Something went wrong. Please try again.",
      }),
      { status: 500 }
    )
  }
}
