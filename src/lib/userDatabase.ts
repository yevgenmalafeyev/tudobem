import { Pool, Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LanguageLevel } from '@/types';

let pool: Pool | null = null;

// For testing: reset the pool to use new environment variables
export function resetPool(): void {
  if (pool) {
    pool.end();
    pool = null;
  }
}

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
  username: string; // Will store full name for new users
  email?: string;
  password_hash: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
  email_verified?: boolean;
  app_language?: string;
  explanation_language?: string;
  learning_mode?: string;
  levels_enabled?: string[];
  topics_enabled?: string[];
  email_marketing_consent?: boolean;
  oauth_provider?: string;
}

export interface UserExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_level: string;
  exercise_topic: string;
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
  private static readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

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
          is_active BOOLEAN DEFAULT TRUE,
          email_verified BOOLEAN DEFAULT FALSE,
          app_language VARCHAR(10) DEFAULT 'pt',
          explanation_language VARCHAR(10) DEFAULT 'pt',
          learning_mode VARCHAR(20) DEFAULT 'typing',
          levels_enabled TEXT[] DEFAULT ARRAY['A1','A2','B1','B2','C1','C2'],
          topics_enabled TEXT[] DEFAULT ARRAY[]::TEXT[],
          email_marketing_consent BOOLEAN DEFAULT FALSE,
          oauth_provider VARCHAR(50)
        )
      `);

      // User exercise attempts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_exercise_attempts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
          exercise_level VARCHAR(10) NOT NULL,
          exercise_topic VARCHAR(100) NOT NULL,
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
      await client.query(`CREATE INDEX IF NOT EXISTS idx_user_attempts_level ON user_exercise_attempts(user_id, exercise_level)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_user_attempts_topic ON user_exercise_attempts(user_id, exercise_topic)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)`);

      // Initialize admin config if it doesn't exist
      const configResult = await client.query('SELECT COUNT(*) as count FROM admin_config');
      if (parseInt(configResult.rows[0].count) === 0) {
        await client.query('INSERT INTO admin_config (claude_api_key) VALUES (NULL)');
      }

      // Create NextAuth tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL,
          "userId" INTEGER NOT NULL,
          type VARCHAR(255) NOT NULL,
          provider VARCHAR(255) NOT NULL,
          "providerAccountId" VARCHAR(255) NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at BIGINT,
          id_token TEXT,
          scope TEXT,
          session_state TEXT,
          token_type TEXT,
          PRIMARY KEY (id)
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL,
          "userId" INTEGER NOT NULL,
          expires TIMESTAMPTZ NOT NULL,
          "sessionToken" VARCHAR(255) NOT NULL,
          PRIMARY KEY (id)
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS users_nextauth (
          id SERIAL,
          name VARCHAR(255),
          email VARCHAR(255),
          "emailVerified" TIMESTAMPTZ,
          image TEXT,
          PRIMARY KEY (id)
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS verification_tokens (
          identifier TEXT NOT NULL,
          expires TIMESTAMPTZ NOT NULL,
          token TEXT NOT NULL,
          PRIMARY KEY (identifier, token)
        )
      `);

      // Create indexes for NextAuth tables
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_providerAccountId_key ON accounts (provider, "providerAccountId")`);
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS sessions_sessionToken_key ON sessions ("sessionToken")`);
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS users_nextauth_email_key ON users_nextauth (email)`);

      await client.end();
      console.log('✅ User database and NextAuth tables initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing user database tables:', error);
      throw error;
    }
  }

  // User Registration
  static async registerUser(
    username: string, 
    password: string, 
    email?: string, 
    emailMarketingConsent: boolean = false,
    oauthProvider?: string
  ): Promise<User> {
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

      // Create user (inactive by default if email provided, active if no email)
      const isActive = !email || !!oauthProvider; // Active if no email verification needed OR OAuth user
      const emailVerified = !!oauthProvider; // OAuth users are pre-verified
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash, is_active, email_verified, email_marketing_consent, oauth_provider) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [username, email || null, passwordHash, isActive, emailVerified, emailMarketingConsent, oauthProvider || null]
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
        { expiresIn: '30d' }
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

  // Verify Session Token with Auto-Renewal
  static async verifyToken(token: string): Promise<User | null> {
    try {
      if (!token || typeof token !== 'string' || token.trim() === '') {
        return null;
      }

      const pool = getPool();
      
      // Verify JWT token
      try {
        jwt.verify(token, this.JWT_SECRET);
      } catch (jwtError) {
        console.log('JWT verification failed:', jwtError instanceof Error ? jwtError.message : 'Unknown error');
        return null;
      }
      
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

      const session = sessionResult.rows[0];
      const user = session as User;

      // Auto-renew if session expires within 7 days (25% of 30-day duration)
      const expiresAt = new Date(session.expires_at);
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      if (expiresAt <= sevenDaysFromNow) {
        // Extend session by 30 days from now
        const newExpiresAt = new Date(now.getTime() + this.SESSION_DURATION);
        await pool.query(
          'UPDATE user_sessions SET expires_at = $1 WHERE session_token = $2',
          [newExpiresAt.toISOString(), token]
        );
        console.log(`🔄 Auto-renewed session for user ${user.username}`);
      }

      return user;
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
    exerciseLevel: string,
    exerciseTopic: string,
    isCorrect: boolean, 
    userAnswer: string
  ): Promise<UserExerciseAttempt> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'INSERT INTO user_exercise_attempts (user_id, exercise_id, exercise_level, exercise_topic, is_correct, user_answer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, exerciseId, exerciseLevel, exerciseTopic, isCorrect, userAnswer]
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
          exercise_level as level,
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts
        WHERE user_id = $1
        GROUP BY exercise_level
        ORDER BY exercise_level
      `, [userId]);

      // Progress by topic
      const topicResult = await pool.query(`
        SELECT 
          exercise_topic as topic,
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_attempts
        FROM user_exercise_attempts
        WHERE user_id = $1
        GROUP BY exercise_topic
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

  // Email verification methods
  static async verifyEmail(email: string): Promise<User | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'UPDATE users SET email_verified = true, is_active = true WHERE email = $1 AND email_verified = false RETURNING *',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  static async loginUserByEmail(email: string): Promise<{ user: User; token: string }> {
    try {
      const pool = getPool();
      
      // Find user by email
      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true AND email_verified = true',
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found or not verified');
      }

      const user = userResult.rows[0] as User;

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Create session token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        this.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Save session to database
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      await pool.query(
        'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt.toISOString()]
      );

      return { user, token };
    } catch (error) {
      console.error('Error logging in user by email:', error);
      throw error;
    }
  }

  static async generateEmailVerificationToken(email: string): Promise<string> {
    const token = jwt.sign(
      { email, type: 'email_verification' },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return token;
  }

  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the verification link
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;
    
    console.log('📧 Email verification link for', email);
    console.log('🔗 Verification URL:', verificationUrl);
    
    // TODO: Replace with actual email sending logic
    // Example with SendGrid:
    // await sgMail.send({
    //   to: email,
    //   from: 'noreply@tudobem.app',
    //   subject: 'Verify your email address',
    //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`
    // });
  }

  // Password reset methods
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async generatePasswordResetToken(email: string): Promise<string> {
    const token = jwt.sign(
      { email, type: 'password_reset' },
      this.JWT_SECRET,
      { expiresIn: '1h' } // Reset tokens expire in 1 hour
    );
    return token;
  }

  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // In a real application, you would integrate with an email service
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    
    console.log('🔑 Password reset link for', email);
    console.log('🔗 Reset URL:', resetUrl);
    
    // TODO: Replace with actual email sending logic
    // Example with SendGrid:
    // await sgMail.send({
    //   to: email,
    //   from: 'noreply@tudobem.app',
    //   subject: 'Reset your password',
    //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    // });
  }

  static async resetPassword(email: string, newPassword: string): Promise<User | null> {
    try {
      const pool = getPool();
      
      // Hash the new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update the password
      const result = await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 AND is_active = true RETURNING *',
        [passwordHash, email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Load user configuration
  static async getUserConfiguration(userId: string): Promise<{
    appLanguage: string;
    explanationLanguage: string;
    learningMode: string;
    levelsEnabled: string[];
    topicsEnabled: string[];
  } | null> {
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT app_language, explanation_language, learning_mode, levels_enabled, topics_enabled FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        appLanguage: user.app_language || 'pt',
        explanationLanguage: user.explanation_language || 'pt',
        learningMode: user.learning_mode || 'typing',
        levelsEnabled: user.levels_enabled || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        topicsEnabled: user.topics_enabled || []
      };
    } catch (error) {
      console.error('Error loading user configuration:', error);
      return null;
    }
  }

  // Save user configuration
  static async saveUserConfiguration(
    userId: string,
    config: {
      appLanguage: string;
      explanationLanguage: string;
      learningMode: string;
      levelsEnabled: string[];
      topicsEnabled: string[];
    }
  ): Promise<boolean> {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE users SET app_language = $1, explanation_language = $2, learning_mode = $3, levels_enabled = $4, topics_enabled = $5 WHERE id = $6',
        [config.appLanguage, config.explanationLanguage, config.learningMode, config.levelsEnabled, config.topicsEnabled, userId]
      );
      return true;
    } catch (error) {
      console.error('Error saving user configuration:', error);
      return false;
    }
  }

}