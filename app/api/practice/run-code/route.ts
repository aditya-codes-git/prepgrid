import { NextResponse } from 'next/server';

const JUDGE0_API_URL = 'https://ce.judge0.com';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { source_code, language_id, stdin } = await req.json();

    // 1. Submit code to Judge0
    const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: Buffer.from(source_code || '').toString('base64'),
        language_id: language_id,
        stdin: stdin ? Buffer.from(String(stdin)).toString('base64') : null
      })
    });

    if (!submitResponse.ok) {
      throw new Error(`Judge0 API Submission Error: ${submitResponse.statusText}`);
    }

    const { token } = await submitResponse.json();

    if (!token) {
      throw new Error('Failed to get submission token from Judge0');
    }

    // 2. Poll for results
    let data;
    let attempts = 0;
    const MAX_ATTEMPTS = 15;

    while (attempts < MAX_ATTEMPTS) {
      const pollResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`);
      
      if (!pollResponse.ok) {
        throw new Error(`Judge0 API Polling Error: ${pollResponse.statusText}`);
      }

      data = await pollResponse.json();

      // status.id > 2 means finished (3=Accepted, 4=Wrong Answer, 5=Time Limit Exceeded, 6=Compilation Error, etc.)
      if (data.status?.id > 2) {
        break;
      }

      await delay(1000); // 1 second delay
      attempts++;
    }

    if (attempts >= MAX_ATTEMPTS) {
      throw new Error('Execution timed out while waiting for Judge0 results.');
    }

    // Decode base64 outputs
    const result = {
      stdout: data.stdout ? Buffer.from(data.stdout, 'base64').toString() : null,
      stderr: data.stderr ? Buffer.from(data.stderr, 'base64').toString() : null,
      compile_output: data.compile_output ? Buffer.from(data.compile_output, 'base64').toString() : null,
      message: data.message ? Buffer.from(data.message, 'base64').toString() : null,
      status: data.status,
      time: data.time,
      memory: data.memory,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Run Code Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
