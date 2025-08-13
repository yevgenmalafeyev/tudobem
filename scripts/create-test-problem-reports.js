#!/usr/bin/env node
const { Client } = require('pg');

async function createTestProblemReports() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // First, create a test exercise if it doesn't exist
    const exerciseResult = await client.query(`
      INSERT INTO exercises (
        sentence, correct_answer, topic, level, hint, multiple_choice_options,
        explanation_pt, explanation_en, explanation_uk
      ) VALUES (
        'Vou _____ cinema.',
        'ao',
        'prepositions',
        'A2',
        'contracted preposition',
        '["a", "ao", "do", "da"]',
        'Usa-se "ao" (a + o) antes de substantivos masculinos.',
        'Use "ao" (a + o) before masculine nouns.',
        'Використовуйте "ao" (a + o) перед іменниками чоловічого роду.'
      )
      ON CONFLICT (sentence, correct_answer, topic, level) DO UPDATE SET
        created_at = EXCLUDED.created_at
      RETURNING id
    `);

    const exerciseId = exerciseResult.rows[0].id;
    console.log('Created/found test exercise with ID:', exerciseId);

    // Create test problem reports one by one to handle any issues
    const report1 = await client.query(`
      INSERT INTO problem_reports (
        user_id, exercise_id, problem_type, user_comment, status
      ) VALUES ('test-user-1', $1, 'incorrect_answer', 'The correct answer should be "a" not "ao"', 'pending')
      RETURNING id
    `, [exerciseId]);

    const report2 = await client.query(`
      INSERT INTO problem_reports (
        user_id, exercise_id, problem_type, user_comment, status
      ) VALUES ('test-user-2', $1, 'missing_option', 'Missing option "para" in the choices', 'pending')
      RETURNING id
    `, [exerciseId]);

    const report3 = await client.query(`
      INSERT INTO problem_reports (
        user_id, exercise_id, problem_type, user_comment, status
      ) VALUES ('test-user-3', $1, 'wrong_hint', 'The hint is not clear enough', 'accepted')
      RETURNING id
    `, [exerciseId]);
    
    console.log('Created problem reports:', [report1.rows[0].id, report2.rows[0].id, report3.rows[0].id]);

    console.log('Created test problem reports');
    await client.end();
    
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestProblemReports();