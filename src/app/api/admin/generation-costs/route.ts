import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    // Get generation costs by level
    const levelCostsQuery = `
      SELECT 
        level,
        SUM(total_cost_usd) as total_cost_usd,
        SUM(questions_generated) as total_questions,
        SUM(input_tokens) as total_input_tokens,
        SUM(output_tokens) as total_output_tokens,
        COUNT(*) as generation_count,
        MAX(created_at) as last_generation
      FROM generation_costs 
      GROUP BY level
      ORDER BY 
        CASE level 
          WHEN 'A1' THEN 1 
          WHEN 'A2' THEN 2 
          WHEN 'B1' THEN 3 
          WHEN 'B2' THEN 4 
          WHEN 'C1' THEN 5 
          WHEN 'C2' THEN 6 
          ELSE 7 
        END;
    `;

    // Get total costs across all levels
    const totalCostsQuery = `
      SELECT 
        SUM(total_cost_usd) as grand_total_cost_usd,
        SUM(questions_generated) as grand_total_questions,
        SUM(input_tokens) as grand_total_input_tokens,
        SUM(output_tokens) as grand_total_output_tokens,
        COUNT(*) as total_generations
      FROM generation_costs;
    `;

    const [levelCostsResult, totalCostsResult] = await Promise.all([
      pool.query(levelCostsQuery),
      pool.query(totalCostsQuery)
    ]);
    
    const levelCosts = levelCostsResult.rows.map(row => ({
      level: row.level,
      totalCostUsd: parseFloat(row.total_cost_usd || '0'),
      totalQuestions: parseInt(row.total_questions || '0'),
      totalInputTokens: parseInt(row.total_input_tokens || '0'),
      totalOutputTokens: parseInt(row.total_output_tokens || '0'),
      generationCount: parseInt(row.generation_count || '0'),
      lastGeneration: row.last_generation
    }));

    const totalCosts = totalCostsResult.rows[0] ? {
      grandTotalCostUsd: parseFloat(totalCostsResult.rows[0].grand_total_cost_usd || '0'),
      grandTotalQuestions: parseInt(totalCostsResult.rows[0].grand_total_questions || '0'),
      grandTotalInputTokens: parseInt(totalCostsResult.rows[0].grand_total_input_tokens || '0'),
      grandTotalOutputTokens: parseInt(totalCostsResult.rows[0].grand_total_output_tokens || '0'),
      totalGenerations: parseInt(totalCostsResult.rows[0].total_generations || '0')
    } : {
      grandTotalCostUsd: 0,
      grandTotalQuestions: 0,
      grandTotalInputTokens: 0,
      grandTotalOutputTokens: 0,
      totalGenerations: 0
    };

    return NextResponse.json({
      success: true,
      levelCosts,
      totalCosts
    });

  } catch (error) {
    console.error('Error fetching generation costs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch generation costs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}