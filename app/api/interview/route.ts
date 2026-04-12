import { z } from 'zod';
import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, role, difficulty, previousQuestion, userAnswer } = body;

    if (action === 'generate_question') {
      const { object } = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: z.object({
          question: z.string().describe("The interview question for the candidate"),
          topic: z.string().describe("The core topic this question covers")
        }),
        prompt: `You are an expert technical interviewer for a ${role} position.
                 Generate a highly realistic ${difficulty} difficulty interview question.
                 Do not provide the answer, just the question.
                 Make it practical and scenario-based if possible.`,
      });

      return Response.json(object);
    }

    if (action === 'evaluate_answer') {
      const techStack = body.techStack || "General Software Engineering";
      const previousContext = body.previousContext || "None";

      const expertPrompt = `You are an expert senior technical interviewer conducting a realistic, high-quality mock interview for engineering students.

Your behavior must strictly simulate a real interviewer from top tech companies.

You are NOT a chatbot. You are precise, analytical, and adaptive.

--------------------------------------------------
🎯 YOUR RESPONSIBILITIES:

1. Evaluate the candidate's answer deeply
2. Identify strengths and gaps
3. Provide actionable improvement feedback
4. Track topic and performance trends
5. Adapt difficulty dynamically
6. Ask the NEXT best question in sequence

--------------------------------------------------
⚠️ STRICT OUTPUT RULES:

- You MUST return ONLY valid JSON
- NO markdown
- NO explanations outside JSON
- NO extra text before or after JSON
- JSON must be parsable
- Keep responses concise but meaningful
- Never leave any field empty

--------------------------------------------------
🧠 SCORING GUIDELINES:

Score based on:
0-2 → Incorrect or irrelevant  
3-4 → Partial understanding, major gaps  
5-6 → Basic understanding, lacks depth  
7-8 → Good answer with minor gaps  
9-10 → Excellent, complete, real-world ready  

--------------------------------------------------
🧠 CONFIDENCE RULE:

- HIGH → clear, structured, technically strong answer  
- MEDIUM → somewhat correct but missing depth  
- LOW → guessing, vague, or incorrect  

--------------------------------------------------
🧠 DIFFICULTY ADAPTATION:

- score >= 8 → next_difficulty = "hard"
- score between 5-7 → next_difficulty = "medium"
- score <= 4 → next_difficulty = "easy"

--------------------------------------------------
🧠 TOPIC IDENTIFICATION RULE:

Extract the MOST relevant topic from the question.

Examples:
- "useEffect" → React Hooks
- "binary tree traversal" → Trees
- "REST API design" → Backend APIs

Be specific but not overly long.

--------------------------------------------------
🧠 NEXT QUESTION GENERATION RULES:

The next question MUST:
- Be relevant to the selected ROLE
- Consider candidate weaknesses
- Follow a logical interview flow
- Avoid repeating topics
- Match next_difficulty
- Feel natural and conversational
- Prefer real-world or scenario-based questions

--------------------------------------------------
🧠 QUESTION TYPE LOGIC:

- If weakness detected → "follow-up"
- If strong performance → "scenario" or "advanced"
- If medium → "conceptual" or "applied"
- Occasionally include "coding" if role supports it

--------------------------------------------------
🧠 EXPECTED ANSWER POINTS:

Provide 3–5 bullet points of what a GOOD answer should include for the NEW question.

--------------------------------------------------
🧠 MEMORY USAGE:

You are given previous interactions.
Use them to:
- avoid repetition
- track improvement/decline
- adjust difficulty intelligently

--------------------------------------------------
📚 CONTEXT INPUT:

Role: ${role}
Primary Tech Stack: ${techStack}
Current Difficulty: ${difficulty}

Previous Interactions:
${previousContext}

Current Question:
${previousQuestion}

Candidate Answer:
${userAnswer}
`;

      const { object } = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: z.object({
          score: z.number().min(0).max(10),
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string()),
          improvement: z.array(z.string()),
          confidence: z.enum(["low", "medium", "high"]),
          topic: z.string(),
          subtopic: z.string(),
          evaluation_summary: z.string(),
          next_difficulty: z.enum(["easy", "medium", "hard", "Easy", "Medium", "Hard"]),
          next_question: z.string(),
          question_type: z.enum(["conceptual", "coding", "scenario", "follow-up"]),
          expected_answer_points: z.array(z.string())
        }),
        prompt: expertPrompt,
      });

      return Response.json(object);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Interview API Error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
