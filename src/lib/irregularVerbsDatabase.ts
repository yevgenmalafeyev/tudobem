import { Pool } from 'pg';
import type { 
  IrregularVerb, 
  IrregularVerbExercise, 
  VerbTense, 
  VerbPerson
} from '@/types/irregular-verbs';

import { 
  TENSE_DISPLAY_NAMES,
  PERSON_DISPLAY_NAMES
} from '@/types/irregular-verbs';

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev'
});

export class IrregularVerbsDatabase {
  // Map VerbTense types to database field prefixes
  static getTenseFieldPrefix(tense: VerbTense): string {
    const mapping: Record<VerbTense, string> = {
      'presente_indicativo': 'presente_ind',
      'pps': 'pps',
      'preterito_imperfeito': 'pret_imp', 
      'imperativo_positivo': 'imp_pos',
      'imperativo_negativo': 'imp_neg',
      'infinitivo_pessoal': 'inf_pes',
      'futuro_imperfeito': 'fut_imp',
      'condicional_presente': 'cond_pres',
      'conjuntivo_presente': 'conj_pres',
      'conjuntivo_passado': 'conj_pass',
      'conjuntivo_futuro': 'conj_fut',
      'participio_passado': 'participio_passado'
    };
    return mapping[tense] || tense;
  }
  
  static async initializeTables() {
    const client = await pool.connect();
    
    try {
      // Check if table exists
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'irregular_verbs'
        );
      `);
      
      if (!result.rows[0].exists) {
        throw new Error('irregular_verbs table does not exist. Run create-irregular-verbs-table.ts first.');
      }
      
      console.log('✅ Irregular verbs database initialized');
    } finally {
      client.release();
    }
  }

  static async getAllVerbs(): Promise<IrregularVerb[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM irregular_verbs 
        ORDER BY infinitive
      `);
      
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async getVerbByInfinitive(infinitive: string): Promise<IrregularVerb | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM irregular_verbs 
        WHERE infinitive = $1
      `, [infinitive]);
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async generateExercise(
    enabledTenses: VerbTense[], 
    excludeRecentVerbs: string[] = [],
    includeVos: boolean = false
  ): Promise<IrregularVerbExercise | null> {
    const client = await pool.connect();
    
    try {
      // Get a random verb (excluding recently used ones)
      let verbQuery = 'SELECT * FROM irregular_verbs';
      let queryParams: string[] = [];
      
      if (excludeRecentVerbs.length > 0) {
        const placeholders = excludeRecentVerbs.map((_, i) => `$${i + 1}`).join(',');
        verbQuery += ` WHERE infinitive NOT IN (${placeholders})`;
        queryParams = excludeRecentVerbs;
      }
      
      verbQuery += ' ORDER BY RANDOM() LIMIT 1';
      
      const verbResult = await client.query(verbQuery, queryParams);
      
      if (verbResult.rows.length === 0) {
        return null;
      }
      
      const verb = verbResult.rows[0] as IrregularVerb;
      
      // Select a random tense from enabled tenses
      const randomTense = enabledTenses[Math.floor(Math.random() * enabledTenses.length)];
      
      // Select a random person (excluding 'eu' for imperativo since it doesn't exist)
      let availablePersons: VerbPerson[] = ['eu', 'tu', 'ele_ela', 'nos', 'eles_elas'];
      if (includeVos) {
        availablePersons.push('vos');
      }
      
      if (randomTense === 'imperativo_positivo') {
        availablePersons = ['tu', 'ele_ela', 'nos', 'eles_elas'];
        if (includeVos) {
          availablePersons.push('vos');
        }
      } else if (randomTense === 'imperativo_negativo') {
        // Imperativo Negativo only makes sense for 2nd person singular
        availablePersons = ['tu'];
      }
      
      if (randomTense === 'participio_passado') {
        // Particípio passado doesn't have persons, just return the form
        const correctAnswer = verb.participio_passado;
        const correctAnswerAlt = verb.participio_passado_alt;
        
        if (!correctAnswer) {
          return null; // Skip if this verb doesn't have this form
        }
        
        return {
          id: `${verb.infinitive}_${randomTense}_participio`,
          infinitive: verb.infinitive,
          targetTense: randomTense,
          targetPerson: 'eu', // Not used for particípio
          correctAnswer,
          correctAnswerAlt,
          question: `Qual é o particípio passado do verbo "${verb.infinitive}"?`
        };
      }
      
      const randomPerson = availablePersons[Math.floor(Math.random() * availablePersons.length)];
      
      // Get the correct answer for this tense and person
      const tensePrefix = this.getTenseFieldPrefix(randomTense);
      const fieldName = `${tensePrefix}_${randomPerson}`;
      const altFieldName = `${tensePrefix}_${randomPerson}_alt`;
      
      const correctAnswer = verb[fieldName as keyof typeof verb] as string;
      const correctAnswerAlt = verb[altFieldName as keyof typeof verb] as string;
      
      if (!correctAnswer) {
        // Try another exercise if this combination doesn't exist
        return this.generateExercise(enabledTenses, excludeRecentVerbs);
      }
      
      // Generate question text
      const tenseDisplayName = TENSE_DISPLAY_NAMES[randomTense as keyof typeof TENSE_DISPLAY_NAMES] || randomTense;
      const personDisplayName = PERSON_DISPLAY_NAMES[randomPerson as keyof typeof PERSON_DISPLAY_NAMES] || randomPerson;
      
      const question = `Conjugue o verbo "${verb.infinitive}" no ${tenseDisplayName}, ${personDisplayName}`;
      
      return {
        id: `${verb.infinitive}_${randomTense}_${randomPerson}`,
        infinitive: verb.infinitive,
        targetTense: randomTense,
        targetPerson: randomPerson,
        correctAnswer,
        correctAnswerAlt,
        question
      };
      
    } finally {
      client.release();
    }
  }

  static async generateMultipleChoiceOptions(
    exercise: IrregularVerbExercise,
    numOptions: number = 4,
    includeVos: boolean = false
  ): Promise<string[]> {
    const client = await pool.connect();
    
    try {
      const verb = await this.getVerbByInfinitive(exercise.infinitive);
      if (!verb) return [exercise.correctAnswer, 'foi', 'estava', 'tinha'];
      
      const allForms: string[] = [];
      
      // Special handling for particípio passado - get from other verbs
      if (exercise.targetTense === 'participio_passado') {
        const otherVerbsResult = await client.query(`
          SELECT participio_passado, participio_passado_alt 
          FROM irregular_verbs 
          WHERE infinitive != $1 
          AND participio_passado IS NOT NULL
          ORDER BY RANDOM()
          LIMIT 10
        `, [exercise.infinitive]);
        
        for (const row of otherVerbsResult.rows) {
          if (row.participio_passado && row.participio_passado !== exercise.correctAnswer) {
            allForms.push(row.participio_passado);
          }
          if (row.participio_passado_alt && row.participio_passado_alt !== exercise.correctAnswer) {
            allForms.push(row.participio_passado_alt);
          }
        }
      } else {
        // Smart distractor selection based on the exercise type
        
        // 2a. Imperativo Negativo (always 2nd person singular)
        if (exercise.targetTense === 'imperativo_negativo') {
          // Distractors from 2nd person of: imperativo positivo, presente indicativo, pps
          const distTenses: VerbTense[] = ['imperativo_positivo', 'presente_indicativo', 'pps'];
          const person = 'tu'; // Only 2nd person singular
          
          for (const tense of distTenses) {
            const tensePrefix = this.getTenseFieldPrefix(tense);
            const fieldName = `${tensePrefix}_${person}`;
            const form = verb[fieldName as keyof typeof verb] as string;
            if (form && form !== exercise.correctAnswer && form !== exercise.correctAnswerAlt) {
              allForms.push(form);
            }
            
            // Also check alternative forms
            const altFieldName = `${tensePrefix}_${person}_alt`;
            const altForm = verb[altFieldName as keyof typeof verb] as string;
            if (altForm && altForm !== exercise.correctAnswer && altForm !== exercise.correctAnswerAlt) {
              allForms.push(altForm);
            }
          }
        }
        // 2b. Imperativo Positivo 2nd person singular OR Conjuntivo Presente 2nd person
        else if ((exercise.targetTense === 'imperativo_positivo' && exercise.targetPerson === 'tu') ||
                 (exercise.targetTense === 'conjuntivo_presente' && exercise.targetPerson === 'tu')) {
          // Distractors from 2nd person of: imperativo negativo, presente indicativo, pps
          const distTenses: VerbTense[] = ['imperativo_negativo', 'presente_indicativo', 'pps'];
          const person = 'tu';
          
          for (const tense of distTenses) {
            const tensePrefix = this.getTenseFieldPrefix(tense);
            const fieldName = `${tensePrefix}_${person}`;
            const form = verb[fieldName as keyof typeof verb] as string;
            if (form && form !== exercise.correctAnswer && form !== exercise.correctAnswerAlt) {
              allForms.push(form);
            }
            
            // Also check alternative forms
            const altFieldName = `${tensePrefix}_${person}_alt`;
            const altForm = verb[altFieldName as keyof typeof verb] as string;
            if (altForm && altForm !== exercise.correctAnswer && altForm !== exercise.correctAnswerAlt) {
              allForms.push(altForm);
            }
          }
        }
        // 2c. Imperativo Positivo 3rd person singular OR Conjuntivo Presente 3rd person singular
        else if ((exercise.targetTense === 'imperativo_positivo' && exercise.targetPerson === 'ele_ela') ||
                 (exercise.targetTense === 'conjuntivo_presente' && exercise.targetPerson === 'ele_ela')) {
          // Distractors from 3rd person of: imperativo positivo (if not target), presente indicativo, pps
          const distTenses: VerbTense[] = ['presente_indicativo', 'pps'];
          // Note: Imperativo Positivo 3rd person is the same as Conjuntivo Presente 3rd person,
          // so we don't need to add it as a distractor if it's the target
          if (exercise.targetTense !== 'imperativo_positivo') {
            distTenses.push('imperativo_positivo');
          }
          
          const person = 'ele_ela';
          
          for (const tense of distTenses) {
            const tensePrefix = this.getTenseFieldPrefix(tense);
            const fieldName = `${tensePrefix}_${person}`;
            const form = verb[fieldName as keyof typeof verb] as string;
            if (form && form !== exercise.correctAnswer && form !== exercise.correctAnswerAlt) {
              allForms.push(form);
            }
            
            // Also check alternative forms
            const altFieldName = `${tensePrefix}_${person}_alt`;
            const altForm = verb[altFieldName as keyof typeof verb] as string;
            if (altForm && altForm !== exercise.correctAnswer && altForm !== exercise.correctAnswerAlt) {
              allForms.push(altForm);
            }
          }
        }
        // Default behavior for other cases - use various forms from different tenses
        else {
          const tenses: VerbTense[] = [
            'presente_indicativo', 'pps', 'preterito_imperfeito', 
            'imperativo_positivo', 'imperativo_negativo', 'infinitivo_pessoal',
            'futuro_imperfeito', 'condicional_presente', 'conjuntivo_presente',
            'conjuntivo_passado', 'conjuntivo_futuro'
          ];
          
          const persons: VerbPerson[] = ['eu', 'tu', 'ele_ela', 'nos', 'eles_elas'];
          if (includeVos) {
            persons.push('vos');
          }
          
          // Collect all forms of this verb except the correct answer
          for (const tense of tenses) {
            if (tense === exercise.targetTense) continue; // Skip the target tense
            
            const tensePrefix = this.getTenseFieldPrefix(tense);
            
            for (const person of persons) {
              const fieldName = `${tensePrefix}_${person}`;
              const form = verb[fieldName as keyof typeof verb] as string;
              if (form && form !== exercise.correctAnswer && form !== exercise.correctAnswerAlt) {
                allForms.push(form);
              }
              
              // Also check alternative forms
              const altFieldName = `${tensePrefix}_${person}_alt`;
              const altForm = verb[altFieldName as keyof typeof verb] as string;
              if (altForm && altForm !== exercise.correctAnswer && altForm !== exercise.correctAnswerAlt) {
                allForms.push(altForm);
              }
            }
          }
          
          // Add particípio passado if not the target
          if (verb.participio_passado && verb.participio_passado !== exercise.correctAnswer) {
            allForms.push(verb.participio_passado);
          }
          if (verb.participio_passado_alt && verb.participio_passado_alt !== exercise.correctAnswer) {
            allForms.push(verb.participio_passado_alt);
          }
        }
      }
      
      // Remove duplicates and shuffle
      const uniqueForms = [...new Set(allForms)];
      
      // If we don't have enough distractors from smart selection, add more from other tenses
      if (uniqueForms.length < numOptions - 1) {
        // Add some common forms from the same verb
        const additionalTenses: VerbTense[] = ['preterito_imperfeito', 'futuro_imperfeito', 'condicional_presente'];
        const additionalPersons: VerbPerson[] = ['eu', 'tu', 'ele_ela'];
        if (includeVos) {
          additionalPersons.push('vos');
        }
        
        for (const tense of additionalTenses) {
          const tensePrefix = this.getTenseFieldPrefix(tense);
          for (const person of additionalPersons) {
            const fieldName = `${tensePrefix}_${person}`;
            const form = verb[fieldName as keyof typeof verb] as string;
            if (form && form !== exercise.correctAnswer && form !== exercise.correctAnswerAlt && !uniqueForms.includes(form)) {
              uniqueForms.push(form);
              if (uniqueForms.length >= numOptions - 1) break;
            }
          }
          if (uniqueForms.length >= numOptions - 1) break;
        }
      }
      
      // Sort by similarity to correct answer (same length, similar endings)
      const correctAnswer = exercise.correctAnswer.toLowerCase();
      const similarForms = uniqueForms.sort((a, b) => {
        const aScore = this.getSimilarityScore(a.toLowerCase(), correctAnswer);
        const bScore = this.getSimilarityScore(b.toLowerCase(), correctAnswer);
        return bScore - aScore; // Higher score first
      });
      
      // Take the most similar forms as distractors
      const distractors = similarForms.slice(0, numOptions - 1);
      
      // If we still don't have enough distractors, add fallback options
      if (distractors.length < numOptions - 1) {
        const fallbackOptions = [
          'sido', 'feito', 'dito', 'visto', 'dado', 'vindo', 'posto', 'tido', 
          'era', 'foi', 'está', 'tinha', 'faz', 'vai', 'vem', 'dá', 'diz', 'pode'
        ];
        
        const additionalOptions = fallbackOptions.filter(opt => 
          opt !== exercise.correctAnswer && 
          opt !== exercise.correctAnswerAlt && 
          !distractors.includes(opt)
        );
        
        distractors.push(...additionalOptions.slice(0, numOptions - 1 - distractors.length));
      }
      
      // Ensure we have exactly numOptions - 1 distractors
      const finalDistractors = distractors.slice(0, numOptions - 1);
      
      // Combine with correct answer and shuffle again
      const options = [...finalDistractors, exercise.correctAnswer].sort(() => Math.random() - 0.5);
      
      // Ensure we always return exactly numOptions options
      while (options.length < numOptions) {
        const fallback = ['foi', 'era', 'está', 'tem'][options.length - 1] || 'teste';
        if (!options.includes(fallback)) {
          options.push(fallback);
        } else {
          options.push(`teste${options.length}`);
        }
      }
      
      return options.slice(0, numOptions);
      
    } finally {
      client.release();
    }
  }
  
  // Helper method to calculate similarity between two strings
  static getSimilarityScore(str1: string, str2: string): number {
    let score = 0;
    
    // Same length bonus
    if (str1.length === str2.length) score += 2;
    
    // Similar ending bonus (last 2-3 characters)
    const ending1 = str1.slice(-2);
    const ending2 = str2.slice(-2);
    if (ending1 === ending2) score += 3;
    
    const ending1_3 = str1.slice(-3);
    const ending2_3 = str2.slice(-3);
    if (ending1_3 === ending2_3) score += 1;
    
    // Similar beginning bonus
    if (str1[0] === str2[0]) score += 1;
    
    // Length difference penalty
    score -= Math.abs(str1.length - str2.length) * 0.5;
    
    return score;
  }

  static async getStats() {
    const client = await pool.connect();
    
    try {
      const totalResult = await client.query('SELECT COUNT(*) as count FROM irregular_verbs');
      const verbsResult = await client.query(`
        SELECT infinitive, created_at 
        FROM irregular_verbs 
        ORDER BY infinitive
      `);
      
      return {
        totalVerbs: parseInt(totalResult.rows[0].count),
        verbs: verbsResult.rows.map(row => ({
          infinitive: row.infinitive,
          createdAt: row.created_at
        }))
      };
    } finally {
      client.release();
    }
  }
}