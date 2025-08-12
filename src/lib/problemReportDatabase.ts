import { ProblemReport, ProblemReportWithExercise, AIPromptTemplate, ProblemType, AIAssistanceResponse } from '@/types/problem-report';

// Vercel implementation
class VercelProblemReportDatabase {
  static async createProblemReport(data: {
    userId?: string;
    exerciseId: string;
    problemType: ProblemType;
    userComment: string;
  }): Promise<ProblemReport> {
    const { sql } = await import('@vercel/postgres');
    
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
      
      const report = result.rows[0];
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
    const { sql } = await import('@vercel/postgres');
    
    try {
      const offset = (page - 1) * pageSize;
      
      // Get total count
      const countResult = status 
        ? await sql`
            SELECT COUNT(*) as total
            FROM problem_reports pr
            WHERE pr.status = ${status}
          `
        : await sql`
            SELECT COUNT(*) as total
            FROM problem_reports pr
          `;
      
      const total = parseInt(countResult.rows[0].total);
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
            LIMIT ${pageSize}
            OFFSET ${offset}
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
            LIMIT ${pageSize}
            OFFSET ${offset}
          `;

      const reports: ProblemReportWithExercise[] = result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        exerciseId: row.exercise_id as string,
        problemType: row.problem_type as ProblemType,
        userComment: row.user_comment as string,
        status: row.status as 'pending' | 'accepted' | 'declined',
        adminComment: row.admin_comment as string,
        aiResponse: row.ai_response ? JSON.parse(row.ai_response as string) : null,
        createdAt: new Date(row.created_at as string),
        processedAt: row.processed_at ? new Date(row.processed_at as string) : undefined,
        processedBy: row.processed_by as string,
        exercise: {
          id: row.exercise_id as string,
          sentence: row.sentence as string,
          correctAnswer: row.correct_answer as string,
          hint: row.hint as string,
          multipleChoiceOptions: (row.multiple_choice_options as string[]) || [],
          level: row.level as string,
          topic: row.topic as string,
          explanation: row.explanation as string,
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
    const { sql } = await import('@vercel/postgres');
    
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

      const report = result.rows[0];
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
    const { sql } = await import('@vercel/postgres');
    
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

      const template = result.rows[0];
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

// Local implementation
class LocalProblemReportDatabase {
  private static async getPool() {
    const { Pool } = await import('pg');
    
    if (!global.localProblemReportPool) {
      global.localProblemReportPool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: false,
      });
    }
    return global.localProblemReportPool;
  }

  static async createProblemReport(data: {
    userId?: string;
    exerciseId: string;
    problemType: ProblemType;
    userComment: string;
  }): Promise<ProblemReport> {
    try {
      const pool = await this.getPool();
      
      const result = await pool.query(
        `INSERT INTO problem_reports (
          user_id, exercise_id, problem_type, user_comment, status
        ) VALUES ($1, $2, $3, $4, 'pending')
        RETURNING *`,
        [data.userId || null, data.exerciseId, data.problemType, data.userComment]
      );
      
      const report = result.rows[0];
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
      const pool = await this.getPool();
      const offset = (page - 1) * pageSize;
      
      // Get total count
      const countQuery = status 
        ? 'SELECT COUNT(*) as total FROM problem_reports pr WHERE pr.status = $1'
        : 'SELECT COUNT(*) as total FROM problem_reports pr';
      
      const countParams = status ? [status] : [];
      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / pageSize);

      // Get reports with exercise data
      const reportsQuery = status
        ? `SELECT 
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
          WHERE pr.status = $1
          ORDER BY pr.created_at DESC
          LIMIT $2 OFFSET $3`
        : `SELECT 
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
          LIMIT $1 OFFSET $2`;

      const reportsParams = status ? [status, pageSize, offset] : [pageSize, offset];
      const result = await pool.query(reportsQuery, reportsParams);

      const reports: ProblemReportWithExercise[] = result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        exerciseId: row.exercise_id as string,
        problemType: row.problem_type as ProblemType,
        userComment: row.user_comment as string,
        status: row.status as 'pending' | 'accepted' | 'declined',
        adminComment: row.admin_comment as string,
        aiResponse: row.ai_response ? JSON.parse(row.ai_response as string) : null,
        createdAt: new Date(row.created_at as string),
        processedAt: row.processed_at ? new Date(row.processed_at as string) : undefined,
        processedBy: row.processed_by as string,
        exercise: {
          id: row.exercise_id as string,
          sentence: row.sentence as string,
          correctAnswer: row.correct_answer as string,
          hint: row.hint as string,
          multipleChoiceOptions: (row.multiple_choice_options as string[]) || [],
          level: row.level as string,
          topic: row.topic as string,
          explanation: row.explanation as string,
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
      const pool = await this.getPool();
      
      const result = await pool.query(
        `UPDATE problem_reports 
        SET 
          status = $2,
          processed_by = $3,
          admin_comment = $4,
          ai_response = $5,
          processed_at = NOW()
        WHERE id = $1
        RETURNING *`,
        [
          reportId,
          status,
          processedBy,
          adminComment || null,
          aiResponse ? JSON.stringify(aiResponse) : null
        ]
      );

      if (result.rowCount === 0) {
        throw new Error('Problem report not found');
      }

      const report = result.rows[0];
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
      const pool = await this.getPool();
      
      const result = await pool.query(
        `SELECT * FROM ai_prompt_templates 
        WHERE name = 'problem-report-analysis'
        ORDER BY created_at DESC 
        LIMIT 1`
      );

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

      const template = result.rows[0];
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

// Smart Database pattern - automatically chooses between Vercel and Local
export class ProblemReportDatabase {
  private static _isLocal: boolean | undefined;
  private static _activeDatabase: typeof VercelProblemReportDatabase | typeof LocalProblemReportDatabase;

  private static isLocalMode(): boolean {
    if (this._isLocal === undefined) {
      const url = process.env.POSTGRES_URL;
      this._isLocal = !!(url && (url.includes('localhost') || url.includes('127.0.0.1')));
      console.log('🗄️ [DEBUG] ProblemReportDatabase mode check:', {
        postgresUrl: url ? `${url.substring(0, 30)}...` : 'NOT_SET',
        isLocal: this._isLocal,
        databaseType: this._isLocal ? 'LocalProblemReportDatabase' : 'VercelProblemReportDatabase'
      });
    }
    return this._isLocal;
  }

  private static getActiveDatabase() {
    if (!this._activeDatabase) {
      this._activeDatabase = this.isLocalMode() ? LocalProblemReportDatabase : VercelProblemReportDatabase;
      console.log('🗄️ [DEBUG] Using ProblemReport database adapter:', this.isLocalMode() ? 'Local' : 'Vercel');
    }
    return this._activeDatabase;
  }

  static async createProblemReport(data: {
    userId?: string;
    exerciseId: string;
    problemType: ProblemType;
    userComment: string;
  }): Promise<ProblemReport> {
    return this.getActiveDatabase().createProblemReport(data);
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
    return this.getActiveDatabase().getProblemReports(page, pageSize, status);
  }

  static async updateProblemReportStatus(
    reportId: string,
    status: 'pending' | 'accepted' | 'declined',
    processedBy: string,
    adminComment?: string,
    aiResponse?: AIAssistanceResponse
  ): Promise<ProblemReport> {
    return this.getActiveDatabase().updateProblemReportStatus(reportId, status, processedBy, adminComment, aiResponse);
  }

  static async getAIPromptTemplate(): Promise<AIPromptTemplate> {
    return this.getActiveDatabase().getAIPromptTemplate();
  }

  static async executeSQLCorrection(sqlCorrection: string): Promise<{ success: boolean; error?: string }> {
    return this.getActiveDatabase().executeSQLCorrection(sqlCorrection);
  }
}

// Global variable for local pool
declare global {
  var localProblemReportPool: import('pg').Pool;
}