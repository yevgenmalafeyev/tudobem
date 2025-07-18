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

export function processMultipleChoiceOptions(correctAnswer: string, distractors: string[]): string[] {
  const validDistractors = filterValidDistractors(correctAnswer, distractors);
  
  // Always ensure we have at least 3 unique options including the correct answer
  const options = new Set<string>();
  options.add(correctAnswer); // Always include correct answer first
  
  // Add valid distractors
  for (const distractor of validDistractors) {
    if (options.size < 4) {
      options.add(distractor);
    }
  }
  
  // If we still don't have enough options, generate more basic distractors
  while (options.size < 4) {
    const fallbackDistractors = generateFallbackDistractors(correctAnswer, Array.from(options));
    let added = false;
    
    for (const fallback of fallbackDistractors) {
      if (!options.has(fallback) && options.size < 4) {
        options.add(fallback);
        added = true;
      }
    }
    
    // If we can't generate more unique options, break to avoid infinite loop
    if (!added) break;
  }
  
  return Array.from(options);
}

// Helper function to generate fallback distractors when we don't have enough
function generateFallbackDistractors(correctAnswer: string, existingOptions: string[]): string[] {
  const fallbacks: string[] = [];
  const base = correctAnswer.toLowerCase();
  
  // Try various transformations
  const transformations = [
    base + 's',
    base + 'a',
    base + 'o',
    base + 'e',
    base + 'r',
    base + 'do',
    base + 'da',
    base + 'os',
    base + 'as',
    base.slice(0, -1) + 'a',
    base.slice(0, -1) + 'o',
    base.slice(0, -1) + 'e',
    base.slice(0, -2) + 'ar',
    base.slice(0, -2) + 'er',
    base.slice(0, -2) + 'ir',
    base.slice(0, -2) + 'ou',
    base.slice(0, -2) + 'ei',
    base.slice(0, -2) + 'ão'
  ];
  
  // Add transformations that don't exist in existing options
  for (const transformation of transformations) {
    if (transformation !== base && 
        transformation.length > 1 && 
        !existingOptions.includes(transformation) &&
        !existingOptions.includes(transformation.charAt(0).toUpperCase() + transformation.slice(1))) {
      fallbacks.push(transformation);
    }
  }
  
  return fallbacks;
}