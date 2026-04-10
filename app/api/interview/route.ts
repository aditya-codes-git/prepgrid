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
      const { object } = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: z.object({
          score: z.number().min(0).max(10).describe("Score out of 10"),
          strengths: z.array(z.string()).length(2).describe("Two precise strengths in their answer"),
          improvements: z.array(z.string()).length(2).describe("Two precise areas for improvement"),
          ideal_answer: z.string().describe("A concise example of an ideal 10/10 answer")
        }),
        prompt: `You are an expert technical interviewer evaluating a candidate for a ${role} role.
                 The candidate was asked the following question: "${previousQuestion}"
                 
                 Here is the candidate's answer:
                 "${userAnswer}"

                 Evaluate the answer for correctness, clarity, depth, and completeness.
                 Return an honest score out of 10 and structural feedback.`,
      });

      return Response.json(object);
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Interview API Error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
