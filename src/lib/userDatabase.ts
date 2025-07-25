import { Pool, Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LanguageLevel } from '@/types';

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
      // For production, use connection string without SSL initially
      pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    }
  }
  return pool;
}

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

export class UserDatabase {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Initialize all user-related database tables
  static async initializeTables() {
    try {
      const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      
      await client.connect();
      
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
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          claude_api_key TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User sessions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON user_exercise_attempts(user_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_user_attempts_exercise_id ON user_exercise_attempts(exercise_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_user_attempts_correct ON user_exercise_attempts(user_id, is_correct)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)`);

      // Initialize admin config if it doesn't exist
      const configResult = await client.query('SELECT COUNT(*) as count FROM admin_config');
      if (parseInt(configResult.rows[0].count) === 0) {
        await client.query('INSERT INTO admin_config (claude_api_key) VALUES (NULL)');
      }

      await client.end();
      console.log('✅ User database tables initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing user database tables:', error);
      throw error;
    }
  }

  // User Registration
  static async registerUser(username: string, password: string, email?: string): Promise<User> {
    try {
      const pool = getPool();
      
      // Check if username already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('Username already exists');
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );
        
        if (existingEmail.rows.length > 0) {
          throw new Error('Email already exists');
        }
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email || null, passwordHash]
      );

      return result.rows[0] as User;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // User Login
  static async loginUser(username: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const pool = getPool();
      
      // Find user by username
      const userResult = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND is_active = true',
        [username]
      );

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
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Create session token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        this.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Save session to database
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      await pool.query(
        'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt.toISOString()]
      );

      return { user, token };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  // Verify Session Token
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const pool = getPool();
      
      // Verify JWT token
      jwt.verify(token, this.JWT_SECRET);
      
      // Check if session exists in database and hasn't expired
      const sessionResult = await pool.query(`
        SELECT s.*, u.* FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = $1 
        AND s.expires_at > CURRENT_TIMESTAMP
        AND u.is_active = true
      `, [token]);

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
      const pool = getPool();
      await pool.query('DELETE FROM user_sessions WHERE session_token = $1', [token]);
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
      const pool = getPool();
      const result = await pool.query(
        'INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, user_answer) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, exerciseId, isCorrect, userAnswer]
      );

      return result.rows[0] as UserExerciseAttempt;
    } catch (error) {
      console.error('Error recording exercise attempt:', error);
      throw error;
    }
  }

  // Get User's Correctly Answered Exercise IDs
  static async getCorrectlyAnsweredExercises(userId: string): Promise<string[]> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT DISTINCT exercise_id FROM user_exercise_attempts WHERE user_id = $1 AND is_correct = true',
        [userId]
      );

      return result.rows.map(row => row.exercise_id);
    } catch (error) {
      console.error('Error getting correctly answered exercises:', error);
      throw error;
    }
  }

  // Get User Progress Statistics
  static async getUserProgress(userId: string): Promise<ProgressStats> {
    try {
      const pool = getPool();
      
      // Total attempts
      const totalResult = await pool.query(
        'SELECT COUNT(*) as total FROM user_exercise_attempts WHERE user_id = $1',
        [userId]
      );

      // Correct attempts
      const correctResult = await pool.query(
        'SELECT COUNT(*) as correct FROM user_exercise_attempts WHERE user_id = $1 AND is_correct = true',
        [userId]
      );

      // Progress by level
      const levelResult = await pool.query(`
        SELECT 
          e.level,
          COUNT(uea.*) as total_attempts,
          COUNT(CASE WHEN uea.is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts uea
        JOIN exercises e ON uea.exercise_id = e.id
        WHERE uea.user_id = $1
        GROUP BY e.level
        ORDER BY e.level
      `, [userId]);

      // Progress by topic
      const topicResult = await pool.query(`
        SELECT 
          e.topic,
          COUNT(uea.*) as total_attempts,
          COUNT(CASE WHEN uea.is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts uea
        JOIN exercises e ON uea.exercise_id = e.id
        WHERE uea.user_id = $1
        GROUP BY e.topic
        ORDER BY total_attempts DESC
      `, [userId]);

      // Recent attempts
      const recentResult = await pool.query(`
        SELECT * FROM user_exercise_attempts 
        WHERE user_id = $1 
        ORDER BY attempted_at DESC 
        LIMIT 10
      `, [userId]);

      const totalAttempts = parseInt(totalResult.rows[0]?.total || '0');
      const correctAttempts = parseInt(correctResult.rows[0]?.correct || '0');
      const accuracyRate = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      // Build level progress object
      const levelProgress: Record<LanguageLevel, { total: number; correct: number }> = {
        A1: { total: 0, correct: 0 },
        A2: { total: 0, correct: 0 },
        B1: { total: 0, correct: 0 },
        B2: { total: 0, correct: 0 },
        C1: { total: 0, correct: 0 },
        C2: { total: 0, correct: 0 }
      };
      
      levelResult.rows.forEach(row => {
        const level = row.level as LanguageLevel;
        levelProgress[level] = {
          total: parseInt(row.total_attempts),
          correct: parseInt(row.correct_attempts)
        };
      });

      // Build topic progress object
      const topicProgress: Record<string, { total: number; correct: number }> = {};
      topicResult.rows.forEach(row => {
        topicProgress[row.topic] = {
          total: parseInt(row.total_attempts),
          correct: parseInt(row.correct_attempts)
        };
      });

      return {
        totalAttempts,
        correctAttempts,
        accuracyRate,
        levelProgress,
        topicProgress,
        recentAttempts: recentResult.rows as UserExerciseAttempt[]
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Admin: Get Claude API Key
  static async getClaudeApiKey(): Promise<string | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT claude_api_key FROM admin_config ORDER BY updated_at DESC LIMIT 1'
      );

      return result.rows[0]?.claude_api_key || null;
    } catch (error) {
      console.error('Error getting Claude API key:', error);
      throw error;
    }
  }

  // Admin: Set Claude API Key
  static async setClaudeApiKey(apiKey: string): Promise<void> {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE admin_config SET claude_api_key = $1, updated_at = CURRENT_TIMESTAMP',
        [apiKey]
      );
    } catch (error) {
      console.error('Error updating Claude API key:', error);
      throw error;
    }
  }

  // Admin: Get Database Statistics
  static async getDatabaseStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalExercises: number;
    totalAttempts: number;
    averageAccuracy: string;
  }> {
    try {
      const pool = getPool();
      
      // Get comprehensive stats in one query
      const statsResult = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
          (SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE expires_at > CURRENT_TIMESTAMP) as active_users,
          (SELECT COUNT(*) FROM exercises) as total_exercises,
          (SELECT COUNT(*) FROM user_exercise_attempts) as total_attempts,
          (SELECT 
            CASE 
              WHEN COUNT(*) > 0 
              THEN ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 1)
              ELSE 0 
            END
           FROM user_exercise_attempts
          ) as average_accuracy
      `);

      const stats = statsResult.rows[0];

      return {
        totalUsers: parseInt(stats?.total_users || '0'),
        activeUsers: parseInt(stats?.active_users || '0'),
        totalExercises: parseInt(stats?.total_exercises || '0'),
        totalAttempts: parseInt(stats?.total_attempts || '0'),
        averageAccuracy: stats?.average_accuracy?.toString() || '0.0'
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP');
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }
}