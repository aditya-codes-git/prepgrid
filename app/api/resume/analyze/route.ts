import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // ── 1. Parse the uploaded file ──────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // ── 2. Extract text from PDF or DOCX ────────────────────────────────
    try {
      if (fileName.endsWith('.pdf')) {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        extractedText = data.text || '';
      } else if (fileName.endsWith('.docx')) {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } else {
        return Response.json(
          { error: 'Unsupported file format. Please upload a .pdf or .docx file.' },
          { status: 400 }
        );
      }
    } catch (parseError: any) {
      console.error('File parsing error:', parseError);
      return Response.json(
        { error: `Could not read the file. Make sure the ${fileName.endsWith('.pdf') ? 'PDF' : 'DOCX'} is not corrupted or password-protected.` },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return Response.json(
        { error: 'Could not extract enough text from the resume. It may be an image-only scan — please use a text-based resume.' },
        { status: 400 }
      );
    }

    // ── 3. Build the AI prompt ──────────────────────────────────────────
    const expertPrompt = `You are an expert technical recruiter and AI career advisor.

Analyze the following resume text and return a JSON object with EXACTLY this structure. Return ONLY the JSON object, no other text, no markdown, no code fences.

{
  "candidate_summary": "2-3 line professional summary",
  "experience_level": "beginner or intermediate or advanced",
  "recommended_roles": ["Frontend Engineer", "Backend Engineer", "Full Stack", "DSA"],
  "primary_skills": ["skill1", "skill2"],
  "secondary_skills": ["skill1", "skill2"],
  "tech_stack": ["tech1", "tech2"],
  "projects_analysis": [
    {
      "project_name": "name",
      "description": "what it does",
      "tech_used": ["tech1"],
      "complexity": "low or medium or high"
    }
  ],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "focus_areas_for_interview": ["area1", "area2"],
  "role_fit_explanation": {
    "Role Name": "why this role fits"
  }
}

RULES:
- experience_level must be exactly one of: beginner, intermediate, advanced
- recommended_roles: only include roles actually relevant to this candidate from: Frontend Engineer, Backend Engineer, Full Stack, DSA
- Do NOT leave any field empty, use empty arrays [] if needed
- Return ONLY valid JSON, nothing else

RESUME TEXT:
${extractedText}`;

    // ── 4. Call the AI model using generateText (compatible with all Groq models) ──
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: expertPrompt,
    });

    // ── 5. Parse the JSON response ──────────────────────────────────────
    // Strip any markdown code fences the model might add
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error('JSON parse error. Raw AI response:', text);
      return Response.json(
        { error: 'AI returned an invalid response. Please try again.' },
        { status: 500 }
      );
    }

    // ── 6. Validate essential fields exist ───────────────────────────────
    if (!parsed.candidate_summary || !parsed.recommended_roles) {
      console.error('Missing essential fields in AI response:', parsed);
      return Response.json(
        { error: 'AI response was incomplete. Please try again.' },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error('Resume API Error:', error?.message || error);
    return Response.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
