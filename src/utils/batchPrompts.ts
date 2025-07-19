import { LanguageLevel } from '@/types';
import { EnhancedExercise } from '@/types/enhanced';

/**
 * Generate comprehensive prompt for batch exercise creation
 */
export const generateBatchExercisePrompt = (
  levels: LanguageLevel[], 
  topics: string[], 
  topicNames: string[],
  masteredWords: Record<string, unknown>,
  count: number = 10
): string => {
  const masteredWordsList = Object.keys(masteredWords);
  
  return `You are an expert Portuguese language teacher creating exercises for European Portuguese learners.

Generate exactly ${count} diverse fill-in-the-blank exercises with the following specifications:

**TARGET LEVELS**: ${levels.join(', ')} (CEFR framework)
**TOPICS**: ${topicNames.join(', ')}
**AVOID THESE MASTERED WORDS**: ${masteredWordsList.length > 0 ? masteredWordsList.join(', ') : 'None'}

For each exercise, provide:

1. **Sentence**: European Portuguese with one gap marked as "___"
2. **Correct Answer**: The word/phrase that fills the gap
3. **Multiple Choice Options**: 2-4 total options (including correct answer)
   - Options should be plausible distractors for the grammar point
   - Focus on common mistakes learners make
   - Randomize the position of the correct answer
4. **Explanations** in 3 languages explaining WHY the answer is correct:
   - Portuguese: Natural, concise explanation for Portuguese speakers
   - English: Clear grammar explanation for English speakers  
   - Ukrainian: Clear explanation in Ukrainian

**QUALITY REQUIREMENTS**:
- Vary sentence length and complexity within the level
- Use authentic European Portuguese expressions and vocabulary
- Ensure grammar explanations are pedagogically sound
- Make distractors challenging but fair (common learner mistakes)
- Include cultural context where appropriate
- Avoid repetitive sentence structures
- Test different aspects of each grammar topic

**DIFFICULTY DISTRIBUTION**:
- For A1-A2: Simple present, basic vocabulary, common verbs
- For B1-B2: Complex tenses, subjunctive, advanced structures
- For C1-C2: Nuanced grammar, idiomatic expressions, formal/informal registers

**OUTPUT FORMAT** (strict JSON array, no additional text):
[
  {
    "sentence": "Eu ___ ao cinema ontem à noite.",
    "correctAnswer": "fui", 
    "gapIndex": 1,
    "topic": "preterite-perfect",
    "level": "A2",
    "hint": {
      "infinitive": "ir",
      "form": "pretérito perfeito"
    },
    "multipleChoiceOptions": ["fui", "ia", "vou", "fosse"],
    "explanations": {
      "pt": "Usamos 'fui' (pretérito perfeito do verbo 'ir') para ações específicas e completas no passado.",
      "en": "We use 'fui' (simple past of 'ir') for specific completed actions in the past.",
      "uk": "Ми використовуємо 'fui' (минулий час дієслова 'ir') для конкретних завершених дій у минулому."
    }
  }
]

Generate ${count} high-quality exercises now:`;
};

/**
 * Validate the structure of generated exercises
 */
export const validateBatchExerciseResponse = (exercises: unknown[]): boolean => {
  if (!Array.isArray(exercises)) {
    console.error('Response is not an array');
    return false;
  }

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i] as Record<string, unknown>;
    
    // Check required fields
    const requiredFields = ['sentence', 'correctAnswer', 'gapIndex', 'topic', 'level', 'multipleChoiceOptions', 'explanations'];
    for (const field of requiredFields) {
      if (!(field in exercise)) {
        console.error(`Exercise ${i}: Missing required field '${field}'`);
        return false;
      }
    }

    // Validate sentence structure
    if (typeof exercise.sentence !== 'string' || !exercise.sentence.includes('___')) {
      console.error(`Exercise ${i}: Invalid sentence format`);
      return false;
    }

    // Validate multiple choice options
    if (!Array.isArray(exercise.multipleChoiceOptions) || 
        exercise.multipleChoiceOptions.length < 2 || 
        exercise.multipleChoiceOptions.length > 4) {
      console.error(`Exercise ${i}: Invalid multiple choice options`);
      return false;
    }

    // Check if correct answer is in options
    if (!exercise.multipleChoiceOptions.includes(exercise.correctAnswer)) {
      console.error(`Exercise ${i}: Correct answer not in options`);
      return false;
    }

    // Validate explanations
    if (typeof exercise.explanations !== 'object' || 
        !exercise.explanations.pt || 
        !exercise.explanations.en || 
        !exercise.explanations.uk) {
      console.error(`Exercise ${i}: Invalid explanations structure`);
      return false;
    }

    // Validate level
    if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(exercise.level)) {
      console.error(`Exercise ${i}: Invalid level '${exercise.level}'`);
      return false;
    }
  }

  return true;
};

/**
 * Post-process and clean up generated exercises
 */
export const processGeneratedExercises = (exercises: unknown[]): EnhancedExercise[] => {
  return exercises.map((exercise, index) => {
    const ex = exercise as Record<string, unknown>;
    // Ensure gapIndex is calculated correctly
    const gapIndex = (ex.sentence as string).indexOf('___');
    if (gapIndex === -1) {
      console.warn(`Exercise ${index}: No gap found, using provided gapIndex`);
    }

    // Clean up sentence (remove extra spaces, normalize)
    const cleanSentence = (ex.sentence as string).replace(/\s+/g, ' ').trim();

    // Shuffle multiple choice options to randomize correct answer position
    const shuffledOptions = [...(ex.multipleChoiceOptions as string[])].sort(() => Math.random() - 0.5);

    // Ensure explanations are trimmed and properly formatted
    const explanations = ex.explanations as Record<string, string>;
    const cleanExplanations = {
      pt: explanations.pt?.trim() || '',
      en: explanations.en?.trim() || '',
      uk: explanations.uk?.trim() || ''
    };

    return {
      ...ex,
      sentence: cleanSentence,
      gapIndex: gapIndex !== -1 ? gapIndex : (ex.gapIndex as number),
      multipleChoiceOptions: shuffledOptions,
      explanations: cleanExplanations,
      id: `generated-${Date.now()}-${index}`, // Temporary ID for client-side use
      source: 'ai',
      difficultyScore: 0.5,
      usageCount: 0
    } as EnhancedExercise;
  });
};

/**
 * Generate prompt for missing exercises (when database doesn't have enough)
 */
export const generateSupplementaryPrompt = (
  levels: LanguageLevel[],
  topics: string[],
  existingExercises: EnhancedExercise[],
  needed: number
): string => {
  const usedAnswers = existingExercises.map(ex => ex.correctAnswer);
  
  return `You are creating ${needed} additional Portuguese exercises to supplement an existing set.

**AVOID THESE ANSWERS**: ${usedAnswers.join(', ')}
**REQUIREMENTS**: Same as previous request
**TARGET**: ${needed} exercises for levels ${levels.join(', ')} and topics ${topics.join(', ')}

Focus on different vocabulary and structures from the existing exercises to provide variety.

Generate ${needed} exercises in the same JSON format:`;
};