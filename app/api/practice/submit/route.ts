/** Supabase SSR Route Handler */
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const JUDGE0_API_URL = 'https://ce.judge0.com';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { problem_id, source_code, language_id, language_name } = await req.json();
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Fetch all test cases
    const { data: testCases, error: tcError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('problem_id', problem_id);

    if (tcError || !testCases) throw new Error('Could not fetch test cases');

    let passedCount = 0;
    const results = [];
    let totalRuntime = 0;
    let maxMemory = 0;
    let finalStatus = 'Accepted';

    // 2. Wrap and Run Test Cases
    for (const tc of testCases) {
      const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: Buffer.from(source_code || '').toString('base64'),
          language_id: language_id,
          stdin: Buffer.from(tc.input || '').toString('base64')
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

        // status.id > 2 means finished
        if (data.status?.id > 2) {
          break;
        }

        await delay(1000); // 1 second delay
        attempts++;
      }

      if (attempts >= MAX_ATTEMPTS) {
        throw new Error('Execution timed out while waiting for Judge0 results for a test case.');
      }
      
      const stdout = data.stdout ? Buffer.from(data.stdout, 'base64').toString().trim() : '';
      const expected = tc.expected_output.trim();
      
      const passed = stdout === expected;
      if (passed) passedCount++;
      else if (finalStatus === 'Accepted') finalStatus = 'Wrong Answer';

      results.push({
        test_case_id: tc.id,
        passed,
        stdout,
        expected,
        status: data.status?.description,
        is_hidden: tc.is_hidden
      });

      totalRuntime += parseFloat(data.time || '0');
      maxMemory = Math.max(maxMemory, parseFloat(data.memory || '0'));
    }

    // 3. Store submission
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        problem_id: problem_id,
        code: source_code,
        language: language_name,
        status: finalStatus,
        runtime: totalRuntime / testCases.length,
        memory: maxMemory
      })
      .select()
      .single();

    return NextResponse.json({
      submission_id: submission?.id,
      status: finalStatus,
      passed_count: passedCount,
      total_count: testCases.length,
      results: results.filter(r => !r.is_hidden), // Hide hidden test cases from results
      runtime: totalRuntime,
      memory: maxMemory
    });

  } catch (error: any) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
