import { COMMON_PORTUGUESE_WORDS, FALLBACK_DISTRACTORS_COUNT } from '@/constants';
import { filterValidDistractors } from '@/utils/validation';

export function generateBasicDistractors(correctAnswer: string): string[] {
  const distractors: string[] = [];
  
  // Generate different types of variations based on word characteristics
  if (correctAnswer.length > 2) {
    // Add common Portuguese endings
    if (!correctAnswer.endsWith('s')) {
      distractors.push(correctAnswer + 's'); // Add plural ending
    }
    if (correctAnswer.length > 3) {
      distractors.push(correctAnswer.slice(0, -1) + 'a'); // Change last letter
      distractors.push(correctAnswer.slice(0, -2) + 'ou'); // Change ending
      distractors.push(correctAnswer.slice(0, -1) + 'e'); // Change to -e ending
    }
    if (correctAnswer.length > 4) {
      distractors.push(correctAnswer.slice(0, -2) + 'ar'); // Infinitive ending
      distractors.push(correctAnswer.slice(0, -3) + 'ido'); // Past participle ending
    }
  }
  
  // Add some common Portuguese words as fallback
  const relevantCommons = COMMON_PORTUGUESE_WORDS.filter(word => 
    word !== correctAnswer.toLowerCase() && 
    word.length <= correctAnswer.length + 2 && 
    word.length >= correctAnswer.length - 2
  );
  
  distractors.push(...relevantCommons.slice(0, 2));
  
  return distractors.slice(0, FALLBACK_DISTRACTORS_COUNT);
}

export function processMultipleChoiceOptions(correctAnswer: string, distractors: string[]) {
  const validDistractors = filterValidDistractors(correctAnswer, distractors);
  return [correctAnswer, ...validDistractors];
}