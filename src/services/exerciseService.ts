import { Exercise, LanguageLevel } from '@/types';
import { getRandomElement } from '@/utils/arrays';

export const fallbackExercises: Record<string, Exercise[]> = {
  'A1': [
    {
      id: '1',
      sentence: 'Eu ___ português.',
      gapIndex: 1,
      correctAnswer: 'falo',
      topic: 'present-indicative',
      level: 'A1',
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    },
    {
      id: '2',
      sentence: 'Ela ___ professora.',
      gapIndex: 1,
      correctAnswer: 'é',
      topic: 'ser-estar',
      level: 'A1',
      hint: {
        infinitive: 'ser',
        form: 'present indicative'
      }
    },
    {
      id: '3',
      sentence: 'Nós ___ uma casa grande.',
      gapIndex: 1,
      correctAnswer: 'temos',
      topic: 'present-indicative',
      level: 'A1',
      hint: {
        infinitive: 'ter',
        form: 'present indicative'
      }
    },
    {
      id: '4',
      sentence: '___ casa é muito bonita.',
      gapIndex: 0,
      correctAnswer: 'A',
      topic: 'articles',
      level: 'A1',
      hint: {
        form: 'definite article (feminine singular)'
      }
    },
    {
      id: '5',
      sentence: 'O menino ___ alto.',
      gapIndex: 1,
      correctAnswer: 'está',
      topic: 'ser-estar',
      level: 'A1',
      hint: {
        infinitive: 'estar',
        form: 'present indicative (temporary state)'
      }
    }
  ],
  'A2': [
    {
      id: '6',
      sentence: 'Ontem eu ___ ao cinema.',
      gapIndex: 1,
      correctAnswer: 'fui',
      topic: 'preterite-perfect',
      level: 'A2',
      hint: {
        infinitive: 'ir',
        form: 'pretérito perfeito (simple past)'
      }
    },
    {
      id: '7',
      sentence: 'Quando era criança, ___ muito feliz.',
      gapIndex: 1,
      correctAnswer: 'era',
      topic: 'imperfect',
      level: 'A2',
      hint: {
        infinitive: 'ser',
        person: '1ª pessoa',
        form: 'pretérito imperfeito (imperfect)'
      }
    },
    {
      id: '8',
      sentence: 'Amanhã nós ___ viajar.',
      gapIndex: 1,
      correctAnswer: 'vamos',
      topic: 'future-simple',
      level: 'A2',
      hint: {
        infinitive: 'ir',
        form: 'future with ir + infinitive'
      }
    },
    {
      id: '9',
      sentence: 'Eu ___ vi ontem.',
      gapIndex: 1,
      correctAnswer: 'te',
      topic: 'direct-object-pronouns',
      level: 'A2',
      hint: {
        form: 'direct object pronoun (you - informal)'
      }
    }
  ],
  'B1': [
    {
      id: '10',
      sentence: 'É importante que tu ___ cedo.',
      gapIndex: 1,
      correctAnswer: 'chegues',
      topic: 'present-subjunctive',
      level: 'B1',
      hint: {
        infinitive: 'chegar',
        form: 'present subjunctive'
      }
    },
    {
      id: '11',
      sentence: 'Se eu tivesse tempo, ___ contigo.',
      gapIndex: 1,
      correctAnswer: 'iria',
      topic: 'conditional-simple',
      level: 'B1',
      hint: {
        infinitive: 'ir',
        form: 'conditional simple'
      }
    },
    {
      id: '12',
      sentence: '___ aqui!',
      gapIndex: 0,
      correctAnswer: 'Vem',
      topic: 'imperative-mood',
      level: 'B1',
      hint: {
        infinitive: 'vir',
        person: '2ª pessoa singular',
        form: 'imperative (informal command)'
      }
    }
  ],
  'B2': [
    {
      id: '13',
      sentence: 'Se eu ___ rico, compraria uma casa.',
      gapIndex: 1,
      correctAnswer: 'fosse',
      topic: 'imperfect-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'ser',
        form: 'imperfect subjunctive'
      }
    },
    {
      id: '14',
      sentence: 'Quando ___ tempo, falaremos.',
      gapIndex: 1,
      correctAnswer: 'houver',
      topic: 'future-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'haver',
        form: 'future subjunctive (impersonal)'
      }
    },
    {
      id: '15',
      sentence: 'A casa ___ construída pelos operários.',
      gapIndex: 1,
      correctAnswer: 'foi',
      topic: 'passive-voice',
      level: 'B2',
      hint: {
        infinitive: 'ser',
        form: 'passive voice (simple past)'
      }
    },
    {
      id: '16',
      sentence: 'É importante que ele ___ a verdade.',
      gapIndex: 1,
      correctAnswer: 'diga',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'dizer',
        form: 'present subjunctive'
      }
    },
    {
      id: '17',
      sentence: 'Embora ___ difícil, conseguiu acabar o trabalho.',
      gapIndex: 1,
      correctAnswer: 'fosse',
      topic: 'imperfect-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'ser',
        form: 'imperfect subjunctive'
      }
    },
    {
      id: '18',
      sentence: 'Se ele ___ estudado, teria passado no exame.',
      gapIndex: 1,
      correctAnswer: 'tivesse',
      topic: 'pluperfect-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'ter',
        form: 'pluperfect subjunctive'
      }
    },
    {
      id: '19',
      sentence: 'Espero que ___ tempo para nos encontrarmos.',
      gapIndex: 1,
      correctAnswer: 'haja',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'haver',
        form: 'present subjunctive'
      }
    },
    {
      id: '20',
      sentence: 'Caso você ___ interessado, contacte-nos.',
      gapIndex: 1,
      correctAnswer: 'esteja',
      topic: 'present-subjunctive',
      level: 'B2',
      hint: {
        infinitive: 'estar',
        form: 'present subjunctive'
      }
    }
  ]
};

export function getFallbackExercise(levels: LanguageLevel[], masteredWords: Record<string, unknown> = {}, selectedTopics: string[] = []): Exercise | null {
  console.log('getFallbackExercise called with levels:', levels, 'topics:', selectedTopics);
  
  // Handle null/undefined/empty levels
  if (!levels || !Array.isArray(levels) || levels.length === 0) {
    console.warn('Invalid levels parameter:', levels);
    return null;
  }
  
  // Get exercises for the requested levels only - no fallback to A1
  const availableExercises = levels.flatMap(level => {
    const exercisesForLevel = fallbackExercises[level] || [];
    console.log(`Exercises for level ${level}:`, exercisesForLevel.length);
    return exercisesForLevel;
  });
  
  console.log('Total available exercises for selected levels:', availableExercises.length);
  
  // If no exercises for selected levels, return null - don't fallback to A1
  if (availableExercises.length === 0) {
    console.warn('No exercises available for selected levels:', levels);
    return null;
  }
  
  // Filter by selected topics if any are specified
  let topicFilteredExercises = availableExercises;
  if (selectedTopics.length > 0) {
    topicFilteredExercises = availableExercises.filter(exercise => 
      selectedTopics.includes(exercise.topic)
    );
    console.log('Topic filtered exercises:', topicFilteredExercises.length);
  }
  
  // Filter out mastered words
  const filteredExercises = topicFilteredExercises.filter(exercise => {
    const wordKey = `${exercise.correctAnswer}:${exercise.hint?.infinitive || ''}:${exercise.hint?.form || ''}`;
    const isMastered = !!masteredWords[wordKey];
    return !isMastered;
  });
  
  console.log('Final filtered exercises (after removing mastered):', filteredExercises.length);
  
  // Return an exercise
  if (filteredExercises.length > 0) {
    const selected = getRandomElement(filteredExercises) || null;
    console.log('Selected exercise:', selected?.level, selected?.correctAnswer, selected?.topic);
    return selected;
  }
  
  // If all are mastered, return a random one anyway from the topic/level filtered set
  if (topicFilteredExercises.length > 0) {
    console.log('All exercises mastered, returning random one for review');
    const selected = getRandomElement(topicFilteredExercises) || null;
    console.log('Selected mastered exercise for review:', selected?.level, selected?.correctAnswer, selected?.topic);
    return selected;
  }
  
  console.error('No exercises available for levels:', levels, 'and topics:', selectedTopics);
  return null;
}

export function createExercise(exerciseData: {
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint?: {
    infinitive?: string;
    person?: string;
    form?: string;
  };
}): Exercise {
  return {
    id: Date.now().toString(),
    sentence: exerciseData.sentence,
    gapIndex: exerciseData.sentence.indexOf('___'),
    correctAnswer: exerciseData.correctAnswer,
    topic: exerciseData.topic,
    level: exerciseData.level as LanguageLevel,
    hint: exerciseData.hint
  };
}