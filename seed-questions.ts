import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { problems } from './lib/data/questions';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding questions to Supabase...");
  
  const mappedQuestions = problems.map(p => ({
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    description: p.description,
    function_signatures: p.starterCode || {},
    test_cases: p.examples || [],
    expected_output: "",
    constraints: p.constraints || [],
    is_active: true,
    is_featured: false
  }));

  const { data, error } = await supabase
    .from('questions')
    .insert(mappedQuestions)
    .select();

  if (error) {
    console.error("Error seeding questions:", error);
  } else {
    console.log(`Successfully seeded ${data.length} questions!`);
  }
}

seed();
