import { ProblemReport, ProblemReportWithExercise, AIPromptTemplate, ProblemType, AIAssistanceResponse } from '@/types/problem-report';
import { sql } from './database-adapter';

// Initialize problem reports table
export async function initializeProblemReportsTable() {
  try {
    // Create problem_reports table
    await sql`
      CREATE TABLE IF NOT EXISTS problem_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        exercise_id UUID NOT NULL,
        problem_type TEXT NOT NULL CHECK (problem_type IN ('incorrect_answer', 'missing_option', 'wrong_hint', 'translation_error', 'other')),
        user_comment TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
        processed_by TEXT,
        admin_comment TEXT,
        ai_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_reports_status ON problem_reports(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_reports_created_at ON problem_reports(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_problem_reports_exercise_id ON problem_reports(exercise_id)`;

    // Create AI prompt templates table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_prompt_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log('Problem reports tables initialized successfully');
  } catch (error) {
    console.error('Error initializing problem reports tables:', error);
    throw error;
  }
}

export class ProblemReportDatabase {
  static async createProblemReport(data: {
    userId?: string;
    exerciseId: string;
    problemType: ProblemType;
    userComment: string;
  }): Promise<ProblemReport> {
    try {
      const result = await sql`
        INSERT INTO problem_reports (
          user_id, exercise_id, problem_type, user_comment, status
        ) VALUES (
          ${data.userId || null},
          ${data.exerciseId},
          ${data.problemType},
          ${data.userComment},
          'pending'
        )
        RETURNING *
      `;
      
      const report = result.rows[0] as any;
      return {
        id: report.id,
        userId: report.user_id,
        exerciseId: report.exercise_id,
        problemType: report.problem_type,
        userComment: report.user_comment,
        status: report.status,
        processedBy: report.processed_by,
        adminComment: report.admin_comment,
        aiResponse: report.ai_response ? JSON.parse(report.ai_response) : null,
        createdAt: new Date(report.created_at),
        processedAt: report.processed_at ? new Date(report.processed_at) : undefined,
      };
    } catch (error) {
      console.error('Error creating problem report:', error);
      throw error;
    }
  }

  static async getProblemReports(
    page: number = 1,
    pageSize: number = 20,
    status?: 'pending' | 'accepted' | 'declined'
  ): Promise<{
    reports: ProblemReportWithExercise[];
    total: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * pageSize;
      
      // Get total count
      const countResult = status 
        ? await sql`SELECT COUNT(*) as total FROM problem_reports WHERE status = ${status}`
        : await sql`SELECT COUNT(*) as total FROM problem_reports`;
      
      const total = parseInt((countResult.rows[0] as any).total);
      const totalPages = Math.ceil(total / pageSize);

      // Get reports with exercise data
      const result = status
        ? await sql`
            SELECT 
              pr.*,
              e.sentence,
              e.correct_answer,
              e.hint,
              e.multiple_choice_options,
              e.level,
              e.topic,
              e.explanation_en as explanation
            FROM problem_reports pr
            JOIN exercises e ON pr.exercise_id = e.id
            WHERE pr.status = ${status}
            ORDER BY pr.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset}
          `
        : await sql`
            SELECT 
              pr.*,
              e.sentence,
              e.correct_answer,
              e.hint,
              e.multiple_choice_options,
              e.level,
              e.topic,
              e.explanation_en as explanation
            FROM problem_reports pr
            JOIN exercises e ON pr.exercise_id = e.id
            ORDER BY pr.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset}
          `;

      const reports: ProblemReportWithExercise[] = result.rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        problemType: row.problem_type as ProblemType,
        userComment: row.user_comment,
        status: row.status as 'pending' | 'accepted' | 'declined',
        adminComment: row.admin_comment,
        aiResponse: row.ai_response ? JSON.parse(row.ai_response) : null,
        createdAt: new Date(row.created_at),
        processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
        processedBy: row.processed_by,
        exercise: {
          id: row.exercise_id,
          sentence: row.sentence,
          correctAnswer: row.correct_answer,
          hint: row.hint,
          multipleChoiceOptions: row.multiple_choice_options || [],
          level: row.level,
          topic: row.topic,
          explanation: row.explanation,
        },
      }));

      return {
        reports,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error getting problem reports:', error);
      throw error;
    }
  }

  static async updateProblemReportStatus(
    reportId: string,
    status: 'pending' | 'accepted' | 'declined',
    processedBy: string,
    adminComment?: string,
    aiResponse?: AIAssistanceResponse
  ): Promise<ProblemReport> {
    try {
      const result = await sql`
        UPDATE problem_reports 
        SET 
          status = ${status},
          processed_by = ${processedBy},
          admin_comment = ${adminComment || null},
          ai_response = ${aiResponse ? JSON.stringify(aiResponse) : null},
          processed_at = NOW()
        WHERE id = ${reportId}
        RETURNING *
      `;

      if (result.rowCount === 0) {
        throw new Error('Problem report not found');
      }

      const report = result.rows[0] as any;
      return {
        id: report.id,
        userId: report.user_id,
        exerciseId: report.exercise_id,
        problemType: report.problem_type,
        userComment: report.user_comment,
        status: report.status,
        processedBy: report.processed_by,
        adminComment: report.admin_comment,
        aiResponse: report.ai_response ? JSON.parse(report.ai_response) : null,
        createdAt: new Date(report.created_at),
        processedAt: report.processed_at ? new Date(report.processed_at) : undefined,
      };
    } catch (error) {
      console.error('Error updating problem report:', error);
      throw error;
    }
  }

  static async getAIPromptTemplate(): Promise<AIPromptTemplate> {
    try {
      const result = await sql`
        SELECT * FROM ai_prompt_templates 
        WHERE name = 'problem-report-analysis'
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      if (result.rows.length === 0) {
        // Return default template if none exists
        return {
          id: 'default',
          name: 'problem-report-analysis',
          content: `You are an AI assistant helping to analyze Portuguese language exercise problem reports.

Analyze the following problem report:

Problem Type: {problemType}
User Comment: {userComment}
Exercise: {exerciseSentence}
Correct Answer: {correctAnswer}
Hint: {hint}
Multiple Choice Options: {options}

Based on this information, please:

1. Determine if this is a valid issue (true/false)
2. Provide a clear explanation of whether the user's concern is legitimate
3. If there's an actual error, suggest a SQL correction to fix it

Respond in this format:
Valid Issue: [true/false]
Explanation: [Your explanation]
SQL Correction: [SQL UPDATE statement if needed, or "None required"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      const template = result.rows[0] as any;
      return {
        id: template.id,
        name: template.name,
        content: template.content,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at),
      };
    } catch (error) {
      console.error('Error getting AI prompt template:', error);
      throw error;
    }
  }

  static async executeSQLCorrection(sqlCorrection: string): Promise<{ success: boolean; error?: string }> {
    // For security reasons, SQL execution is disabled
    // This would need proper implementation with strict validation
    console.log('SQL correction would execute:', sqlCorrection);
    
    return { 
      success: false, 
      error: 'SQL execution is disabled for security reasons. This feature needs proper implementation.' 
    };
  }
}