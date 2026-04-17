import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: NextRequest) {
    try {
        const { code, language, stdin, expected_output } = await req.json()

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
        }

        const prompt = `You are a code execution engine. Your job is to mentally execute the given code and return what it would output.

Language: ${language}
Input (stdin): ${stdin || '(none)'}
Expected output: ${expected_output || '(not specified)'}

Code:
\`\`\`${language}
${code}
\`\`\`

Instructions:
1. Trace through the code mentally.
2. Determine what stdout output it would produce.
3. Check for any syntax errors or runtime errors.
4. Compare the actual output with the expected output.

Respond with ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "stdout": "<what the code would print to stdout>",
  "stderr": "<any error message, or empty string if no error>",
  "compile_output": "<compiler error if any, or empty string>",
  "passed": <true if output matches expected or code runs successfully, false otherwise>,
  "status": "<Accepted | Wrong Answer | Runtime Error | Compile Error>"
}`

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0,
            }),
        })

        const data = await response.json()
        const rawText = data.choices?.[0]?.message?.content || '{}'

        // Strip markdown fences if present
        const cleaned = rawText.replace(/```json|```/g, '').trim()
        const result = JSON.parse(cleaned)

        return NextResponse.json(result)
    } catch (err) {
        console.error('Execute API error:', err)
        return NextResponse.json({
            stdout: '',
            stderr: 'Execution service error. Please try again.',
            compile_output: '',
            passed: false,
            status: 'Runtime Error',
        })
    }
}