import { ProblemReport, ProblemReportWithExercise, AIPromptTemplate, ProblemType, AIAssistanceResponse } from '@/types/problem-report';
import { sql, executeUnsafeSQL } from './database-adapter';

interface ProblemReportRow {
  id: string;
  user_id: string | null;
  exercise_id: string;
  problem_type: string;
  user_comment: string;
  status: string;
  processed_by: string | null;
  admin_comment: string | null;
  ai_response: string | Record<string, unknown> | null;
  created_at: string;
  processed_at: string | null;
}

interface ProblemReportWithExerciseRow extends ProblemReportRow {
  sentence: string;
  correct_answer: string;
  hint: string;
  multiple_choice_options: string[];
  level: string;
  topic: string;
  explanation: string;
  reporter_username: string | null;
  reporter_email: string | null;
}

interface AIPromptTemplateRow {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

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
      
      const report = result.rows[0] as unknown as ProblemReportRow;
      return {
        id: report.id,
        userId: report.user_id || undefined,
        exerciseId: report.exercise_id,
        problemType: report.problem_type as ProblemType,
        userComment: report.user_comment,
        status: report.status as 'pending' | 'accepted' | 'declined',
        processedBy: report.processed_by || undefined,
        adminComment: report.admin_comment || undefined,
        aiResponse: report.ai_response ? 
          (typeof report.ai_response === 'string' ? JSON.parse(report.ai_response) : report.ai_response) : 
          undefined,
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
      
      const total = parseInt((countResult.rows[0] as { total: string }).total);
      const totalPages = Math.ceil(total / pageSize);

      // Get reports with exercise data and user information
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
              e.explanation_en as explanation,
              u.username as reporter_username,
              u.email as reporter_email
            FROM problem_reports pr
            JOIN exercises e ON pr.exercise_id = e.id
            LEFT JOIN users u ON pr.user_id = u.id
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
              e.explanation_en as explanation,
              u.username as reporter_username,
              u.email as reporter_email
            FROM problem_reports pr
            JOIN exercises e ON pr.exercise_id = e.id
            LEFT JOIN users u ON pr.user_id = u.id
            ORDER BY pr.created_at DESC
            LIMIT ${pageSize} OFFSET ${offset}
          `;

      const reports: ProblemReportWithExercise[] = (result.rows as unknown as ProblemReportWithExerciseRow[]).map((row: ProblemReportWithExerciseRow) => ({
        id: row.id,
        userId: row.user_id || undefined,
        exerciseId: row.exercise_id,
        problemType: row.problem_type as ProblemType,
        userComment: row.user_comment,
        status: row.status as 'pending' | 'accepted' | 'declined',
        adminComment: row.admin_comment || undefined,
        aiResponse: row.ai_response ? 
          (typeof row.ai_response === 'string' ? JSON.parse(row.ai_response) : row.ai_response) : 
          undefined,
        createdAt: new Date(row.created_at),
        processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
        processedBy: row.processed_by || undefined,
        reporterUsername: row.reporter_username || undefined,
        reporterEmail: row.reporter_email || undefined,
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

  static async getProblemReportById(reportId: string): Promise<ProblemReportWithExercise | null> {
    try {
      const result = await sql`
        SELECT 
          pr.*,
          e.sentence,
          e.correct_answer,
          e.hint,
          e.multiple_choice_options,
          e.level,
          e.topic,
          e.explanation_en as explanation,
          u.username as reporter_username,
          u.email as reporter_email
        FROM problem_reports pr
        JOIN exercises e ON pr.exercise_id = e.id
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.id = ${reportId}
      `;

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0] as unknown as ProblemReportWithExerciseRow;
      return {
        id: row.id,
        userId: row.user_id || undefined,
        exerciseId: row.exercise_id,
        problemType: row.problem_type as ProblemType,
        userComment: row.user_comment,
        status: row.status as 'pending' | 'accepted' | 'declined',
        adminComment: row.admin_comment || undefined,
        aiResponse: row.ai_response ? 
          (typeof row.ai_response === 'string' ? JSON.parse(row.ai_response) : row.ai_response) : 
          undefined,
        createdAt: new Date(row.created_at),
        processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
        processedBy: row.processed_by || undefined,
        reporterUsername: row.reporter_username || undefined,
        reporterEmail: row.reporter_email || undefined,
        exercise: {
          sentence: row.sentence,
          correctAnswer: row.correct_answer,
          hint: row.hint,
          multipleChoiceOptions: row.multiple_choice_options || [],
          level: row.level,
          topic: row.topic,
          explanation: row.explanation,
        },
      };
    } catch (error) {
      console.error('Error getting problem report by ID:', error);
      throw error;
    }
  }

  static async updateProblemReportStatus(
    reportId: string,
    status: 'pending' | 'accepted' | 'declined',
    processedBy: string | null,
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

      const report = result.rows[0] as unknown as ProblemReportRow;
      return {
        id: report.id,
        userId: report.user_id || undefined,
        exerciseId: report.exercise_id,
        problemType: report.problem_type as ProblemType,
        userComment: report.user_comment,
        status: report.status as 'pending' | 'accepted' | 'declined',
        processedBy: report.processed_by || undefined,
        adminComment: report.admin_comment || undefined,
        aiResponse: report.ai_response ? 
          (typeof report.ai_response === 'string' ? JSON.parse(report.ai_response) : report.ai_response) : 
          undefined,
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

      const template = result.rows[0] as unknown as AIPromptTemplateRow;
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

  static async executeSQLCorrection(sqlCorrection: string): Promise<{ success: boolean; error?: string; rowsAffected?: number }> {
    try {
      console.log('🔧 Executing SQL correction:', sqlCorrection);
      
      // Security validation: Only allow safe UPDATE statements on the exercises table
      const trimmedSQL = sqlCorrection.trim();
      
      // Check if it's a valid UPDATE statement for exercises table
      if (!trimmedSQL.match(/^UPDATE\s+exercises\s+SET\s+.+\s+WHERE\s+id\s*=\s*'[a-f0-9-]+'\s*;?\s*$/i)) {
        return { 
          success: false, 
          error: 'SQL statement must be a safe UPDATE on exercises table with WHERE id clause' 
        };
      }
      
      // Check that only allowed columns are being updated
      const allowedColumns = ['sentence', 'correct_answer', 'hint', 'multiple_choice_options', 'explanation_pt', 'explanation_en', 'explanation_uk'];
      const setClause = trimmedSQL.match(/SET\s+(.+?)\s+WHERE/i)?.[1];
      
      if (!setClause) {
        return { success: false, error: 'Invalid SET clause in SQL statement' };
      }
      
      // Parse the SET clause to check columns
      const columnUpdates = setClause.split(',').map(update => {
        const columnName = update.trim().split(/\s*=\s*/)[0].trim();
        return columnName.toLowerCase();
      });
      
      const invalidColumns = columnUpdates.filter(col => !allowedColumns.includes(col));
      if (invalidColumns.length > 0) {
        return { 
          success: false, 
          error: `Invalid columns in UPDATE: ${invalidColumns.join(', ')}. Only allowed: ${allowedColumns.join(', ')}` 
        };
      }
      
      // Execute the SQL with proper error handling
      const result = await executeUnsafeSQL(trimmedSQL);
      
      console.log('✅ SQL execution result:', result);
      
      return { 
        success: true, 
        rowsAffected: result.rowCount 
      };
      
    } catch (error) {
      console.error('❌ SQL execution error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown SQL execution error' 
      };
    }
  }

  // Execute SQL correction and update report status in a single transaction-like operation
  static async executeSQLCorrectionAndUpdateStatus(
    reportId: string,
    sqlCorrection: string,
    processedBy: string,
    adminComment: string,
    aiResponse: AIAssistanceResponse
  ): Promise<{ success: boolean; error?: string; report?: ProblemReport }> {
    try {
      console.log('🔧 Executing SQL correction and updating status...');
      
      // First execute the SQL correction
      const executionResult = await this.executeSQLCorrection(sqlCorrection);
      
      if (!executionResult.success) {
        return {
          success: false,
          error: `SQL execution failed: ${executionResult.error}`
        };
      }
      
      console.log('✅ SQL executed successfully, now updating report status...');
      
      // Add a delay to allow any connection cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try using the original method first as fallback
      try {
        console.log('🔄 Attempting to use original updateProblemReportStatus method...');
        const updatedReport = await this.updateProblemReportStatus(
          reportId,
          'accepted',
          processedBy,
          adminComment,
          aiResponse
        );
        
        console.log('✅ Report status updated successfully via original method');
        return {
          success: true,
          report: updatedReport
        };
      } catch (originalMethodError) {
        console.error('❌ Original method failed, trying raw SQL approach:', originalMethodError);
        
        // Fallback to raw SQL approach
        const escapedComment = adminComment.replace(/'/g, "''");
        const escapedAiResponse = JSON.stringify(aiResponse).replace(/'/g, "''");
        
        const updateSQL = `
          UPDATE problem_reports 
          SET 
            status = 'accepted',
            processed_by = ${processedBy ? `'${processedBy}'` : 'NULL'},
            admin_comment = '${escapedComment}',
            ai_response = '${escapedAiResponse}',
            processed_at = NOW()
          WHERE id = '${reportId}'
          RETURNING *
        `;
        
        console.log('🔍 Generated update SQL:', updateSQL);
        console.log('🔍 Parameters:', { reportId, processedBy, escapedComment: escapedComment.substring(0, 50) + '...' });
        
        const updateResult = await executeUnsafeSQL(updateSQL);
        
        if (updateResult.rowCount === 0) {
          return {
            success: false,
            error: 'Problem report not found for status update'
          };
        }
        
        const reportRow = updateResult.rows[0] as unknown as ProblemReportRow;
        const updatedReport: ProblemReport = {
          id: reportRow.id,
          userId: reportRow.user_id || undefined,
          exerciseId: reportRow.exercise_id,
          problemType: reportRow.problem_type as ProblemType,
          userComment: reportRow.user_comment,
          status: reportRow.status as 'pending' | 'accepted' | 'declined',
          processedBy: reportRow.processed_by || undefined,
          adminComment: reportRow.admin_comment || undefined,
          aiResponse: reportRow.ai_response ? 
            (typeof reportRow.ai_response === 'string' ? JSON.parse(reportRow.ai_response) : reportRow.ai_response) : 
            undefined,
          createdAt: new Date(reportRow.created_at),
          processedAt: reportRow.processed_at ? new Date(reportRow.processed_at) : undefined,
        };
        
        console.log('✅ Report status updated successfully via raw SQL fallback');
        
        return {
          success: true,
          report: updatedReport
        };
      }
      
    } catch (error) {
      console.error('❌ Unified SQL correction and status update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in unified operation'
      };
    }
  }
}