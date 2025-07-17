import { LEVENSHTEIN_THRESHOLD } from '@/constants';

export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

export function filterValidDistractors(correctAnswer: string, distractors: string[]): string[] {
  const correct = correctAnswer.toLowerCase().trim();
  
  return distractors.filter(distractor => {
    if (!distractor || typeof distractor !== 'string') return false;
    
    const dist = distractor.toLowerCase().trim();
    
    // Filter out exact matches (case-insensitive)
    if (dist === correct) return false;
    
    // Filter out empty or very similar strings
    if (dist.length === 0) return false;
    
    // Filter out strings that are too similar
    if (dist.length === correct.length && levenshteinDistance(dist, correct) <= LEVENSHTEIN_THRESHOLD) {
      return false;
    }
    
    return true;
  }).slice(0, 3); // Limit to 3 valid distractors
}

export function isValidAnswer(answer: string): boolean {
  return Boolean(answer && answer.trim().length > 0);
}

export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim();
}