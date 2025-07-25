import { LanguageLevel } from '@/types';

export interface User {
  id: string;
  username: string;
  email?: string;
  password_hash: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
}

export interface UserExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  is_correct: boolean;
  user_answer: string;
  attempted_at: Date;
}

export interface AdminConfig {
  id: string;
  claude_api_key?: string;
  updated_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
}

export interface ProgressStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracyRate: number;
  levelProgress: Record<LanguageLevel, { total: number; correct: number }>;
  topicProgress: Record<string, { total: number; correct: number }>;
  recentAttempts: UserExerciseAttempt[];
}

// Temporary stub implementation for deployment
export class UserDatabase {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Stub methods - to be implemented after fixing SQL conversion
  static async initializeTables() {
    console.log('⚠️ UserDatabase.initializeTables - stub implementation');
    return Promise.resolve();
  }

  static async registerUser(username: string, password: string, email?: string): Promise<User> {
    console.log('⚠️ UserDatabase.registerUser - stub implementation');
    throw new Error('User registration not implemented yet');
  }

  static async loginUser(username: string, password: string): Promise<{ user: User; token: string }> {
    console.log('⚠️ UserDatabase.loginUser - stub implementation');
    throw new Error('User login not implemented yet');
  }

  static async recordAttempt(userId: string, exerciseId: string, isCorrect: boolean, userAnswer: string): Promise<UserExerciseAttempt> {
    console.log('⚠️ UserDatabase.recordAttempt - stub implementation');
    throw new Error('Recording attempts not implemented yet');
  }

  static async getUserProgress(userId: string): Promise<ProgressStats> {
    console.log('⚠️ UserDatabase.getUserProgress - stub implementation');
    throw new Error('Getting user progress not implemented yet');
  }

  static async getCorrectlyAnsweredExercises(userId: string): Promise<string[]> {
    console.log('⚠️ UserDatabase.getCorrectlyAnsweredExercises - stub implementation');
    return [];
  }

  static async setClaudeApiKey(apiKey: string): Promise<void> {
    console.log('⚠️ UserDatabase.setClaudeApiKey - stub implementation');
  }

  static async getClaudeApiKey(): Promise<string | null> {
    console.log('⚠️ UserDatabase.getClaudeApiKey - stub implementation');
    return null;
  }

  static async getDatabaseStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalExercises: number;
    totalAttempts: number;
    averageAccuracy: string;
  }> {
    console.log('⚠️ UserDatabase.getDatabaseStats - stub implementation');
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalExercises: 0,
      totalAttempts: 0,
      averageAccuracy: '0.0'
    };
  }
}