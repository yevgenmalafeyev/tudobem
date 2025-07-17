# Database Setup for Portuguese Learning App

## Database Solution: Vercel Postgres

This app uses **Vercel Postgres** as the database to store generated exercises, enabling users without AI API keys to access pre-generated content.

## Setup Instructions

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Create Vercel Postgres Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a database name (e.g., `portuguese-learning-db`)
6. Select region closest to your users
7. Click "Create"

### 3. Connect Database to Your Project
1. In Vercel Dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. The following variables will be automatically added:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 4. Local Development Setup
Create a `.env.local` file with the database connection string:
```
POSTGRES_URL="your_postgres_connection_string"
```

## Database Schema

The database automatically creates the following table structure:

### `exercises` table:
- `id` (UUID) - Primary key
- `sentence` (TEXT) - Exercise sentence with blank
- `correct_answer` (TEXT) - Correct answer
- `topic` (VARCHAR) - Topic ID
- `level` (VARCHAR) - CEFR level (A1, A2, B1, B2, C1, C2)
- `hint_infinitive` (VARCHAR) - Verb infinitive form
- `hint_person` (VARCHAR) - Grammatical person
- `hint_form` (VARCHAR) - Grammatical form
- `multiple_choice_options` (TEXT[]) - Array of 4 options
- `explanation_pt` (TEXT) - Portuguese explanation
- `explanation_en` (TEXT) - English explanation
- `explanation_uk` (TEXT) - Ukrainian explanation
- `created_at` (TIMESTAMP) - Creation timestamp

### Indexes for Performance:
- `idx_exercises_level` - Level-based queries
- `idx_exercises_topic` - Topic-based queries
- `idx_exercises_level_topic` - Combined level+topic queries

## How It Works

### For Users WITH AI API Key:
1. AI generates batch of 10 exercises with explanations in all 3 languages
2. Exercises are automatically saved to database
3. User receives fresh, personalized exercises
4. Database grows with high-quality content

### For Users WITHOUT AI API Key:
1. System fetches random exercises from database
2. Returns exercises matching user's selected levels/topics
3. Uses appropriate language explanation based on user preference
4. Fallback to hardcoded exercises if database is empty

## API Endpoints

### `/api/generate-batch-exercises`
- Generates 10 exercises with AI (if API key provided)
- Saves exercises to database
- Returns database exercises (if no API key)

### `/api/database-stats`
- Returns database statistics
- Shows total exercises, breakdown by level/topic

## Database Operations

### Exercise Storage:
```typescript
// Save exercises to database
await ExerciseDatabase.saveBatchExercises(exercises);
```

### Exercise Retrieval:
```typescript
// Get exercises by level and topic
const exercises = await ExerciseDatabase.getRandomExercises(
  ['A1', 'A2'], 
  ['present-indicative', 'ser-estar'], 
  10
);

// Get exercises by level only
const exercises = await ExerciseDatabase.getRandomExercisesByLevel(['A1'], 10);
```

### Statistics:
```typescript
// Get database statistics
const stats = await ExerciseDatabase.getStats();
```

## Benefits

1. **Free Tier Friendly**: Uses Vercel Postgres free tier (256 MB storage)
2. **Shared Database**: All users contribute to and benefit from the same database
3. **Multi-language Support**: Explanations in Portuguese, English, and Ukrainian
4. **Automatic Population**: Database grows automatically as users with API keys generate exercises
5. **Offline Capability**: Users without API keys can still learn with database content
6. **Performance**: Indexed queries for fast exercise retrieval

## Monitoring

- Use `/api/database-stats` to monitor database growth
- Check Vercel Dashboard for usage metrics
- Monitor logs for database operation success/failures

## Deployment

1. Deploy to Vercel
2. Database connection is automatically configured
3. Tables are created automatically on first API call
4. No additional setup required