#!/usr/bin/env npx tsx

import { sql } from '@vercel/postgres';

/**
 * Script to remove quotes from hints in the database
 * 
 * This script handles:
 * 1. Simple quoted strings like "chegar" → chegar
 * 2. JSON objects that should be converted to simple text
 */

async function cleanQuotesFromHints() {
  console.log('🧹 Starting cleanup of quotes from hints...');
  
  try {
    // First, get all exercises with quotes in hints
    const exercisesWithQuotes = await sql`
      SELECT id, hint 
      FROM exercises 
      WHERE hint LIKE '%"%' OR hint LIKE '%''%'
    `;
    
    console.log(`📊 Found ${exercisesWithQuotes.rows.length} exercises with quotes in hints`);
    
    let cleanedCount = 0;
    let errorCount = 0;
    
    for (const exercise of exercisesWithQuotes.rows) {
      try {
        let cleanedHint = exercise.hint;
        
        // Check if it's a JSON object
        if (cleanedHint.startsWith('{') && cleanedHint.endsWith('}')) {
          try {
            const parsed = JSON.parse(cleanedHint);
            // Extract the infinitive if it exists, otherwise use a meaningful part
            if (parsed.infinitive) {
              cleanedHint = parsed.infinitive;
            } else if (parsed.form) {
              cleanedHint = parsed.form;
            } else {
              // Fallback to removing the JSON structure
              cleanedHint = cleanedHint.replace(/[{}]/g, '').split(',')[0].split(':')[1]?.trim()?.replace(/"/g, '') || cleanedHint;
            }
          } catch {
            console.warn(`⚠️  Failed to parse JSON hint for exercise ${exercise.id}: ${cleanedHint}`);
            // Fallback: just remove quotes
            cleanedHint = cleanedHint.replace(/"/g, '').replace(/'/g, '');
          }
        } else {
          // Simple case: remove surrounding quotes
          cleanedHint = cleanedHint.replace(/^["']/, '').replace(/["']$/, '');
          // Also remove any internal quotes that might be escaping
          cleanedHint = cleanedHint.replace(/\\"/g, '"').replace(/\\'/g, "'");
        }
        
        // Update the exercise in the database
        await sql`
          UPDATE exercises 
          SET hint = ${cleanedHint}
          WHERE id = ${exercise.id}
        `;
        
        console.log(`✅ Cleaned hint for exercise ${exercise.id}: "${exercise.hint}" → "${cleanedHint}"`);
        cleanedCount++;
        
      } catch (error) {
        console.error(`❌ Error cleaning hint for exercise ${exercise.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Cleanup completed!`);
    console.log(`✅ Successfully cleaned: ${cleanedCount} exercises`);
    console.log(`❌ Errors: ${errorCount} exercises`);
    
    // Verify the cleanup
    const remainingQuotes = await sql`
      SELECT COUNT(*) as count 
      FROM exercises 
      WHERE hint LIKE '%"%' OR hint LIKE '%''%'
    `;
    
    console.log(`📊 Remaining exercises with quotes: ${remainingQuotes.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Fatal error during cleanup:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  cleanQuotesFromHints()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { cleanQuotesFromHints };