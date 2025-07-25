import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const isLocal = !!(process.env.POSTGRES_URL && 
                      (process.env.POSTGRES_URL.includes('localhost') || 
                       process.env.POSTGRES_URL.includes('127.0.0.1')));
    
    if (isLocal) {
      // Use local PostgreSQL
      pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: false
      });
    } else {
      // For production, we might need to implement Vercel Postgres connection
      throw new Error('Production PostgreSQL connection not implemented yet');
    }
  }
  return pool;
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export class UserDatabase {
  // TODO: Fix SQL template literals to use client.query pattern
  // Temporarily disabled for deployment
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Initialize all user-related database tables
  static async initializeTables() {
    try {
      const client = getPool();
      
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE
        )
      `);

      // User exercise attempts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_exercise_attempts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
          is_correct BOOLEAN NOT NULL,
          user_answer TEXT NOT NULL,
          attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Admin configuration table
      await sql`
        CREATE TABLE IF NOT EXISTS admin_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          claude_api_key TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // User sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes for better performance
      await sql`
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON user_exercise_attempts(user_id)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_attempts_exercise_id ON user_exercise_attempts(exercise_id)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_attempts_correct ON user_exercise_attempts(user_id, is_correct)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)
      `;

      // Initialize admin config if it doesn't exist
      const configCount = await sql`SELECT COUNT(*) as count FROM admin_config`;
      if (configCount.rows[0].count === 0) {
        await sql`
          INSERT INTO admin_config (claude_api_key) VALUES (NULL)
        `;
      }

      console.log('User database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing user database tables:', error);
      throw error;
    }
  }

  // User Registration
  static async registerUser(username: string, password: string, email?: string): Promise<User> {
    try {
      // Check if username already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE username = ${username}
      `;
      
      if (existingUser.rows.length > 0) {
        throw new Error('Username already exists');
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await sql`
          SELECT id FROM users WHERE email = ${email}
        `;
        
        if (existingEmail.rows.length > 0) {
          throw new Error('Email already exists');
        }
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await sql`
        INSERT INTO users (username, email, password_hash)
        VALUES (${username}, ${email || null}, ${passwordHash})
        RETURNING *
      `;

      return result.rows[0] as User;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // User Login
  static async loginUser(username: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Find user by username
      const userResult = await sql`
        SELECT * FROM users 
        WHERE username = ${username} AND is_active = true
      `;

      if (userResult.rows.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = userResult.rows[0] as User;

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      await sql`
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${user.id}
      `;

      // Create session token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        this.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Save session to database
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      await sql`
        INSERT INTO user_sessions (user_id, session_token, expires_at)
        VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
      `;

      return { user, token };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  // Verify Session Token
  static async verifyToken(token: string): Promise<User | null> {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      
      // Check if session exists in database and hasn't expired
      const sessionResult = await sql`
        SELECT s.*, u.* FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ${token} 
        AND s.expires_at > CURRENT_TIMESTAMP
        AND u.is_active = true
      `;

      if (sessionResult.rows.length === 0) {
        return null;
      }

      return sessionResult.rows[0] as User;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  // Logout User (invalidate session)
  static async logoutUser(token: string): Promise<void> {
    try {
      await sql`
        DELETE FROM user_sessions WHERE session_token = ${token}
      `;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }

  // Record Exercise Attempt
  static async recordAttempt(
    userId: string, 
    exerciseId: string, 
    isCorrect: boolean, 
    userAnswer: string
  ): Promise<UserExerciseAttempt> {
    try {
      const result = await sql`
        INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, user_answer)
        VALUES (${userId}, ${exerciseId}, ${isCorrect}, ${userAnswer})
        RETURNING *
      `;

      return result.rows[0] as UserExerciseAttempt;
    } catch (error) {
      console.error('Error recording exercise attempt:', error);
      throw error;
    }
  }

  // Get User's Correctly Answered Exercise IDs
  static async getCorrectlyAnsweredExercises(userId: string): Promise<string[]> {
    try {
      const result = await sql`
        SELECT DISTINCT exercise_id 
        FROM user_exercise_attempts 
        WHERE user_id = ${userId} AND is_correct = true
      `;

      return result.rows.map(row => row.exercise_id);
    } catch (error) {
      console.error('Error getting correctly answered exercises:', error);
      throw error;
    }
  }

  // Get User Progress Statistics
  static async getUserProgress(userId: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    accuracyRate: number;
    levelProgress: { level: string; correct: number; total: number }[];
    topicProgress: { topic: string; correct: number; total: number }[];
  }> {
    try {
      // Total attempts
      const totalResult = await sql`
        SELECT COUNT(*) as total FROM user_exercise_attempts 
        WHERE user_id = ${userId}
      `;

      // Correct attempts
      const correctResult = await sql`
        SELECT COUNT(*) as correct FROM user_exercise_attempts 
        WHERE user_id = ${userId} AND is_correct = true
      `;

      // Progress by level
      const levelResult = await sql`
        SELECT 
          e.level,
          COUNT(uea.*) as total_attempts,
          COUNT(CASE WHEN uea.is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts uea
        JOIN exercises e ON uea.exercise_id = e.id
        WHERE uea.user_id = ${userId}
        GROUP BY e.level
        ORDER BY e.level
      `;

      // Progress by topic
      const topicResult = await sql`
        SELECT 
          e.topic,
          COUNT(uea.*) as total_attempts,
          COUNT(CASE WHEN uea.is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts uea
        JOIN exercises e ON uea.exercise_id = e.id
        WHERE uea.user_id = ${userId}
        GROUP BY e.topic
        ORDER BY total_attempts DESC
      `;

      const totalAttempts = parseInt(totalResult.rows[0]?.total || '0');
      const correctAttempts = parseInt(correctResult.rows[0]?.correct || '0');
      const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      return {
        totalAttempts,
        correctAttempts,
        accuracyRate,
        levelProgress: levelResult.rows.map(row => ({
          level: row.level,
          correct: parseInt(row.correct_attempts),
          total: parseInt(row.total_attempts)
        })),
        topicProgress: topicResult.rows.map(row => ({
          topic: row.topic,
          correct: parseInt(row.correct_attempts),
          total: parseInt(row.total_attempts)
        }))
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Admin: Get Claude API Key
  static async getClaudeApiKey(): Promise<string | null> {
    try {
      const result = await sql`
        SELECT claude_api_key FROM admin_config 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;

      return result.rows[0]?.claude_api_key || null;
    } catch (error) {
      console.error('Error getting Claude API key:', error);
      throw error;
    }
  }

  // Admin: Update Claude API Key
  static async updateClaudeApiKey(apiKey: string): Promise<void> {
    try {
      await sql`
        UPDATE admin_config 
        SET claude_api_key = ${apiKey}, updated_at = CURRENT_TIMESTAMP
      `;
    } catch (error) {
      console.error('Error updating Claude API key:', error);
      throw error;
    }
  }

  // Admin: Get Database Statistics
  static async getDatabaseStats(): Promise<{
    total: number;
    byLevel: { level: string; count: number }[];
    userStats: {
      totalUsers: number;
      activeUsers: number;
      totalAttempts: number;
      correctAttempts: number;
    };
  }> {
    try {
      // Exercise statistics
      const totalResult = await sql`SELECT COUNT(*) as total FROM exercises`;
      const levelResult = await sql`
        SELECT level, COUNT(*) as count 
        FROM exercises 
        GROUP BY level 
        ORDER BY level
      `;

      // User statistics
      const userStatsResult = await sql`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
          (SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE expires_at > CURRENT_TIMESTAMP) as active_users,
          (SELECT COUNT(*) FROM user_exercise_attempts) as total_attempts,
          (SELECT COUNT(*) FROM user_exercise_attempts WHERE is_correct = true) as correct_attempts
      `;

      const userStats = userStatsResult.rows[0];

      return {
        total: parseInt(totalResult.rows[0]?.total || '0'),
        byLevel: levelResult.rows.map(row => ({
          level: row.level,
          count: parseInt(row.count)
        })),
        userStats: {
          totalUsers: parseInt(userStats?.total_users || '0'),
          activeUsers: parseInt(userStats?.active_users || '0'),
          totalAttempts: parseInt(userStats?.total_attempts || '0'),
          correctAttempts: parseInt(userStats?.correct_attempts || '0')
        }
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await sql`
        DELETE FROM user_sessions 
        WHERE expires_at < CURRENT_TIMESTAMP
      `;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }
}