import { Exercise, LanguageLevel } from '@/types';
import { getRandomElement } from '@/utils/arrays';

export const fallbackExercises: Record<string, Exercise[]> = {
  'A1': [
    {
      id: '1',
      sentence: 'Eu ___ português.',
      correctAnswer: 'falo',
      topic: 'present-indicative',
      level: 'A1',
      hint: 'falar'
    },
    {
      id: '2',
      sentence: 'Ela ___ professora.',
      correctAnswer: 'é',
      topic: 'ser-estar',
      level: 'A1',
      hint: 'ser'
    },
    {
      id: '3',
      sentence: 'Nós ___ uma casa grande.',
      correctAnswer: 'temos',
      topic: 'present-indicative',
      level: 'A1',
      hint: 'ter'
    },
    {
      id: '4',
      sentence: '___ casa é muito bonita.',
      correctAnswer: 'A',
      topic: 'articles',
      level: 'A1',
      hint: 'artigo definido'
    },
    {
      id: '5',
      sentence: 'O menino ___ alto.',
      correctAnswer: 'está',
      topic: 'ser-estar',
      level: 'A1',
      hint: 'estar'
    }
  ],
  'A2': [
    {
      id: '6',
      sentence: 'Ontem eu ___ ao cinema.',
      correctAnswer: 'fui',
      topic: 'preterite-perfect',
      level: 'A2',
      hint: 'ir'
    },
    {
      id: '7',
      sentence: 'Quando era criança, ___ muito feliz.',
      correctAnswer: 'era',
      topic: 'imperfect',
      level: 'A2',
      hint: 'ser'
    },
    {
      id: '8',
      sentence: 'Amanhã nós ___ viajar.',
      correctAnswer: 'vamos',
      topic: 'future-simple',
      level: 'A2',
      hint: 'ir'
    },
    {
      id: '9',
      sentence: 'Eu ___ vi ontem.',
      correctAnswer: 'te',
      topic: 'direct-object-pronouns',
      level: 'A2',
      hint: 'pronome'
    }
  ],
  'B1': [
    {
      id: '10',
      sentence: 'É importante que tu ___ cedo.',
      correctAnswer: 'chegues',
      topic: 'present-subjunctive',
      level: 'B1',
      hint: 'chegar'
    },
    {
      id: '11',
      sentence: 'Se eu tivesse tempo, ___ contigo.',
      correctAnswer: 'iria',
      topic: 'conditional-simple',
      level: 'B1',
      hint: 'ir'
    },
    {
      id: '12',
      sentence: '___ aqui!',
      correctAnswer: 'Vem',
      topic: 'imperative-mood',
      level: 'B1',
      hint: 'vir'
    }
  ],
  'B2': [
    {
      id: '13',
      sentence: 'Se eu ___ rico, compraria uma casa.',
      correctAnswer: 'fosse',
      topic: 'imperfect-subjunctive',
      level: 'B2',
      hint: 'ser'
    },
    {
      id: '14',
      sentence: 'Quando ___ tempo, falaremos.',
      correctAnswer: 'houver',
      topic: 'future-subjunctive',
      level: 'B2',
      hint: 'haver'
    },
    {
      id: '15',
      sentence: 'A casa ___ construída pelos operários.',
      correctAnswer: 'foi',
      topic: 'passive-voice',
      level: 'B2',
      hint: 'ser'
    },
    {
      id: '16',
      sentence: 'É importante que ele ___ a verdade.',
      correctAnswer: 'diga',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: 'dizer'
    },
    {
      id: '17',
      sentence: 'Embora ___ difícil, conseguiu acabar o trabalho.',
      correctAnswer: 'fosse',
      topic: 'imperfect-subjunctive',
      level: 'B2',
      hint: 'ser'
    },
    {
      id: '18',
      sentence: 'Se ele ___ estudado, teria passado no exame.',
      correctAnswer: 'tivesse',
      topic: 'pluperfect-subjunctive',
      level: 'B2',
      hint: 'ter'
    },
    {
      id: '19',
      sentence: 'Espero que ___ tempo para nos encontrarmos.',
      correctAnswer: 'haja',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: 'haver'
    },
    {
      id: '20',
      sentence: 'Caso você ___ interessado, contacte-nos.',
      correctAnswer: 'esteja',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: 'estar'
    }
  ]
};

export function getFallbackExercise(levels: LanguageLevel[], _masteredWords?: Record<string, unknown>, selectedTopics: string[] = []): Exercise | null {
  
  // Handle null/undefined/empty levels
  if (!levels || !Array.isArray(levels) || levels.length === 0) {
    return null;
  }
  
  // Get exercises for the requested levels only - no fallback to A1
  const availableExercises = levels.flatMap(level => {
    const exercisesForLevel = fallbackExercises[level] || [];
    return exercisesForLevel;
  });
  
  // If no exercises for selected levels, return null - don't fallback to A1
  if (availableExercises.length === 0) {
    return null;
  }
  
  // Filter by selected topics if any are specified
  let topicFilteredExercises = availableExercises;
  if (selectedTopics.length > 0) {
    topicFilteredExercises = availableExercises.filter(exercise => 
      selectedTopics.includes(exercise.topic)
    );
  }
  
  // NO CLIENT-SIDE FILTERING - Return any available exercise
  // Server-side filtering handles mastered words
  if (topicFilteredExercises.length > 0) {
    const selected = getRandomElement(topicFilteredExercises) || null;
    return selected;
  }
  
  return null;
}

let idCounter = 0;

export function createExercise(exerciseData: {
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint?: string;
}): Exercise {
  return {
    id: `${Date.now()}-${++idCounter}`,
    sentence: exerciseData.sentence,
    correctAnswer: exerciseData.correctAnswer,
    topic: exerciseData.topic,
    level: exerciseData.level as LanguageLevel,
    hint: exerciseData.hint
  };
}