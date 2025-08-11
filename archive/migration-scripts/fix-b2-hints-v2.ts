#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface Exercise {
  id: string | null;
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint?: string;
  multipleChoiceOptions?: string[];
  explanations?: {
    pt?: string;
    en?: string;
    uk?: string;
  };
  difficultyScore?: number;
  usageCount?: number;
}

/**
 * Generates appropriate hints based on exercise content and requirements
 * Following the principle of minimum necessary information
 */
function generateHint(exercise: Exercise): string {
  const sentence = exercise.sentence.toLowerCase();
  const correctAnswer = exercise.correctAnswer.toLowerCase();
  const topic = exercise.topic;

  // Rule: If hint makes it too easy, don't add it
  if (isObviousAnswer(sentence, correctAnswer)) {
    return "";
  }

  // Handle verb forms - most common case for B2 subjunctive topics
  if (isVerbForm(correctAnswer, topic)) {
    return generateMinimalVerbHint(sentence, correctAnswer);
  }

  // Handle comparisons (less common in B2 conjunctive topics but may exist)
  if (hasComparison(topic)) {
    return generateComparisonHint();
  }

  // Handle other grammatical elements - only if absolutely necessary
  return generateMinimalContextualHint();
}

/**
 * Checks if the answer is obviously derivable from context
 */
function isObviousAnswer(sentence: string, correctAnswer: string): boolean {
  // Cases where preposition + article contractions are obvious
  if (/vou.*cinema|vai.*escola|vem.*casa/i.test(sentence) && 
      ['ao', 'à', 'do', 'da', 'no', 'na'].includes(correctAnswer)) {
    return true;
  }

  // If the sentence structure clearly indicates what's needed
  if (sentence.includes('é importante que') || sentence.includes('é necessário que') ||
      sentence.includes('é bom que') || sentence.includes('é provável que')) {
    // These clearly indicate subjunctive is needed, so basic forms might be obvious
    // But we still need to check if the specific verb is clear
    return false;
  }

  return false;
}

/**
 * Checks if the correct answer is a verb form
 */
function isVerbForm(answer: string, topic: string): boolean {
  // B2 topics are mostly about subjunctive verb forms
  if (topic.includes('conjuntivo') || topic.includes('futuro') || 
      topic.includes('preterito') || topic.includes('imperfeito')) {
    return true;
  }

  // Common verb endings in Portuguese
  const verbEndings = /^(.*)(ar|er|ir|am|em|ou|ei|eu|a|e|o|as|es|os|amos|emos|imos)$/;
  return verbEndings.test(answer);
}

/**
 * Generates MINIMAL hint for verb forms
 * Only includes information that cannot be derived from sentence
 */
function generateMinimalVerbHint(sentence: string, correctAnswer: string): string {
  const infinitive = inferInfinitive(correctAnswer, sentence);
  
  // First check: Is the verb clearly indicated in the sentence?
  if (isVerbClearFromContext(sentence, infinitive)) {
    // Verb is clear, check if person is clear
    if (isPersonClearFromContext(sentence)) {
      // Both verb and person are clear
      // Check if tense is clear from context
      if (isTenseClearFromContext(sentence)) {
        // Everything is clear - no hint needed
        return "";
      } else {
        // Only tense is unclear - but we avoid giving tense hints unless absolutely necessary
        // For B2 subjunctive topics, the subjunctive mood is usually implied by context
        return "";
      }
    } else {
      // Verb is clear but person is not
      const person = inferPersonOnly(correctAnswer);
      return person ? `(${person})` : "";
    }
  } else {
    // Verb is not clear from context
    if (!infinitive) {
      return ""; // Can't determine infinitive
    }
    
    // Check if person is clear
    if (isPersonClearFromContext(sentence)) {
      // Person is clear, only need verb
      return infinitive;
    } else {
      // Neither verb nor person is clear
      const person = inferPersonOnly(correctAnswer);
      if (person && isPersonAbsolutelyNecessary(sentence)) {
        return `${infinitive} (${person})`;
      }
      return infinitive; // Default to just infinitive
    }
  }
}

/**
 * Checks if the verb/infinitive is clear from sentence context
 */
function isVerbClearFromContext(sentence: string, infinitive: string): boolean {
  if (!infinitive) return false;
  
  const sentenceLower = sentence.toLowerCase();
  
  // Direct check: is the infinitive mentioned in the sentence?
  if (sentenceLower.includes(infinitive)) {
    return true;
  }
  
  // Check for related forms of the verb in the sentence
  const stem = infinitive.replace(/[aei]r$/, '');
  if (sentenceLower.includes(stem)) {
    return true;
  }
  
  // Check for semantic context that makes the verb obvious
  // For example: "_____ a ata" clearly suggests "ler"
  const contextualVerbs: Record<string, string[]> = {
    'ler': ['ata', 'livro', 'texto', 'documento', 'artigo', 'instruções'],
    'chegar': ['atrasado', 'tarde', 'cedo', 'pontual'],
    'ter': ['tempo', 'dinheiro', 'paciência', 'razão', 'culpa'],
    'fazer': ['trabalho', 'tarefa', 'exercício'],
    'ir': ['embora', 'depressa', 'tarde'],
    'vir': ['cedo', 'tarde', 'depressa', 'amanhã'],
    'ser': ['importante', 'necessário', 'bom', 'mau', 'difícil', 'fácil'],
    'estar': ['presente', 'ausente', 'disponível', 'ocupado']
  };
  
  for (const [verb, contexts] of Object.entries(contextualVerbs)) {
    if (verb === infinitive) {
      for (const context of contexts) {
        if (sentenceLower.includes(context)) {
          return true; // Context makes verb obvious
        }
      }
    }
  }
  
  return false;
}

/**
 * Checks if person is clear from sentence pronouns or context
 */
function isPersonClearFromContext(sentence: string): boolean {
  const sentenceLower = sentence.toLowerCase();
  
  // Clear subject pronouns
  const pronounPatterns = [
    /\bque eu\b/,
    /\bque tu\b/,
    /\bque ele\b/,
    /\bque ela\b/,
    /\bque nós\b/,
    /\bque vós\b/,
    /\bque eles\b/,
    /\bque elas\b/,
    /\bque você\b/,
    /\bque vocês\b/
  ];
  
  for (const pattern of pronounPatterns) {
    if (pattern.test(sentenceLower)) {
      return true;
    }
  }
  
  // Clear subject indicators (definite subjects that indicate person)
  const clearSubjectPatterns = [
    // 3rd person singular indicators
    /\btodos\b/,           // "todos" = 3rd plural
    /\balguém\b/,          // "alguém" = 3rd singular
    /\ba equipa\b/,        // "a equipa" = 3rd singular
    /\ba empresa\b/,       // "a empresa" = 3rd singular
    /\bo diretor\b/,       // "o diretor" = 3rd singular
    /\bo cliente\b/,       // "o cliente" = 3rd singular
    /\ba diretora\b/,      // "a diretora" = 3rd singular
    /\bo projeto\b/,       // "o projeto" = 3rd singular
    /\ba reunião\b/,       // "a reunião" = 3rd singular
    /\btudo\b/,            // "tudo" = 3rd singular
    /\bnada\b/,            // "nada" = 3rd singular
    /\bisso\b/,            // "isso" = 3rd singular
    
    // 3rd person plural indicators  
    /\bas pessoas\b/,      // "as pessoas" = 3rd plural
    /\bos alunos\b/,       // "os alunos" = 3rd plural
    /\bos estudantes\b/,   // "os estudantes" = 3rd plural
    /\bos colaboradores\b/, // "os colaboradores" = 3rd plural
    /\bos clientes\b/,     // "os clientes" = 3rd plural
    /\bas equipas\b/,      // "as equipas" = 3rd plural
    /\bos resultados\b/,   // "os resultados" = 3rd plural
    /\bas contas\b/,       // "as contas" = 3rd plural
    
    // Names (3rd person singular)
    /\bmaria\b/,
    /\bjoão\b/,
    /\bana\b/,
    /\bcarlos\b/,
    
    // Demonstratives
    /\bestes?\b/,          // "este/esta/estes/estas" = 3rd
    /\besses?\b/,          // "esse/essa/esses/essas" = 3rd
    /\baqueles?\b/         // "aquele/aquela/aqueles/aquelas" = 3rd
  ];
  
  for (const pattern of clearSubjectPatterns) {
    if (pattern.test(sentenceLower)) {
      return true;
    }
  }
  
  // Check for clear contextual indicators
  if (sentenceLower.includes('para mim') || sentenceLower.includes('comigo')) {
    return true; // 1st person singular
  }
  if (sentenceLower.includes('para ti') || sentenceLower.includes('contigo')) {
    return true; // 2nd person singular
  }
  if (sentenceLower.includes('para nós') || sentenceLower.includes('connosco')) {
    return true; // 1st person plural
  }
  
  // Check for definite articles + nouns (usually 3rd person)
  // Pattern: "que" followed by definite article + noun
  if (/\bque\s+(o|a|os|as)\s+\w+\b/.test(sentenceLower)) {
    return true;
  }
  
  return false;
}

/**
 * Checks if tense is clear from sentence context
 */
function isTenseClearFromContext(sentence: string): boolean {
  const sentenceLower = sentence.toLowerCase();
  
  // Subjunctive triggers make tense clear
  if (sentenceLower.includes('é importante que') || 
      sentenceLower.includes('é necessário que') ||
      sentenceLower.includes('duvido que') ||
      sentenceLower.includes('embora') ||
      sentenceLower.includes('talvez')) {
    return true; // Present subjunctive context
  }
  
  if (sentenceLower.includes('se eu') || 
      sentenceLower.includes('se tu') ||
      sentenceLower.includes('se ele')) {
    // Could be imperfect subjunctive or future subjunctive
    // Need more context, but often clear from the main clause
    return sentenceLower.includes('seria') || sentenceLower.includes('teria');
  }
  
  if (sentenceLower.includes('quando') || 
      sentenceLower.includes('assim que') ||
      sentenceLower.includes('logo que')) {
    return true; // Future subjunctive context
  }
  
  if (sentenceLower.includes('oxalá') || 
      sentenceLower.includes('tomara') ||
      sentenceLower.includes('quem dera')) {
    return true; // Exclamatory/wish context
  }
  
  return false;
}

/**
 * Checks if person information is absolutely necessary
 */
function isPersonAbsolutelyNecessary(sentence: string): boolean {
  // If there's no subject at all in the sentence, person might be necessary
  const sentenceLower = sentence.toLowerCase();
  
  // If sentence has no clear subject indicators
  if (!sentenceLower.includes('que') && 
      !sentenceLower.includes('eu') &&
      !sentenceLower.includes('tu') &&
      !sentenceLower.includes('ele') &&
      !sentenceLower.includes('ela') &&
      !sentenceLower.includes('nós') &&
      !sentenceLower.includes('vocês') &&
      !sentenceLower.includes('eles') &&
      !sentenceLower.includes('elas')) {
    return true;
  }
  
  return false;
}

/**
 * Infers the infinitive form from the conjugated verb
 */
function inferInfinitive(conjugatedForm: string, sentence: string): string {
  // Common Portuguese verb patterns for B2 level subjunctives
  const verbMappings: Record<string, string> = {
    // Irregular verbs commonly used in B2 subjunctive
    'seja': 'ser',
    'sejam': 'ser',
    'tenha': 'ter', 
    'tenham': 'ter',
    'haja': 'haver',
    'dê': 'dar',
    'deem': 'dar',
    'esteja': 'estar',
    'estejam': 'estar',
    'vá': 'ir',
    'vão': 'ir',
    'faça': 'fazer',
    'façam': 'fazer',
    'saiba': 'saber',
    'saibam': 'saber',
    'possa': 'poder',
    'possam': 'poder',
    'queira': 'querer',
    'queiram': 'querer',
    'venha': 'vir',
    'venham': 'vir',
    'ponha': 'pôr',
    'ponham': 'pôr',
    'diga': 'dizer',
    'digam': 'dizer',
    'traga': 'trazer',
    'tragam': 'trazer',
    'ouça': 'ouvir',
    'ouçam': 'ouvir',
    'veja': 'ver',
    'vejam': 'ver',
    'leiam': 'ler',
    'leia': 'ler',

    // Past subjunctive forms
    'fosse': 'ser',
    'fossem': 'ser',
    'tivesse': 'ter',
    'tivessem': 'ter',
    'houvesse': 'haver',
    'houvessem': 'haver',
    'desse': 'dar',
    'dessem': 'dar',
    'estivesse': 'estar',
    'estivessem': 'estar',
    'fizesse': 'fazer',
    'fizessem': 'fazer',
    'soubesse': 'saber',
    'soubessem': 'saber',
    'pudesse': 'poder',
    'pudessem': 'poder',
    'quisesse': 'querer',
    'quisessem': 'querer',
    'viesse': 'vir',
    'viessem': 'vir',
    'pusesse': 'pôr',
    'pusessem': 'pôr',
    'dissesse': 'dizer',
    'dissessem': 'dizer',
    'trouxesse': 'trazer',
    'trouxessem': 'trazer',
    'ouvisse': 'ouvir',
    'ouvissem': 'ouvir',

    // Future subjunctive
    'for': 'ser',
    'forem': 'ser',
    'tiver': 'ter',
    'tiverem': 'ter',
    'houver': 'haver',
    'houverem': 'haver',
    'der': 'dar',
    'derem': 'dar',
    'estiver': 'estar',
    'estiverem': 'estar',
    'fizer': 'fazer',
    'fizerem': 'fazer',
    'souber': 'saber',
    'souberem': 'saber',
    'puder': 'poder',
    'puderem': 'poder',
    'quiser': 'querer',
    'quiserem': 'querer',
    'vier': 'vir',
    'vierem': 'vir',
    'puser': 'pôr',
    'puserem': 'pôr',
    'disser': 'dizer',
    'disserem': 'dizer',
    'trouxer': 'trazer',
    'trouxerem': 'trazer',

    // Regular verbs
    'fale': 'falar',
    'falem': 'falar',
    'chegue': 'chegar',
    'cheguem': 'chegar',
    'estude': 'estudar',
    'estudem': 'estudar',
    'trabalhe': 'trabalhar',
    'trabalhem': 'trabalhar',
    'coma': 'comer',
    'comam': 'comer',
    'beba': 'beber',
    'bebam': 'beber',
    'aprenda': 'aprender',
    'aprendam': 'aprender',
    'abra': 'abrir',
    'abram': 'abrir',
    'parta': 'partir',
    'partam': 'partir',
    'durma': 'dormir',
    'durmam': 'dormir',
    'corra': 'correr',
    'corram': 'correr'
  };

  // Direct lookup first
  if (verbMappings[conjugatedForm.toLowerCase()]) {
    return verbMappings[conjugatedForm.toLowerCase()];
  }

  // Try to find verb in sentence context
  const words = sentence.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
      // Check if this infinitive could produce the conjugated form
      if (couldProduceForm(word, conjugatedForm)) {
        return word;
      }
    }
  }

  return ''; // Cannot determine infinitive
}

/**
 * Check if an infinitive could produce the given conjugated form
 */
function couldProduceForm(infinitive: string, conjugated: string): boolean {
  const stem = infinitive.replace(/[aei]r$/, '');
  return conjugated.toLowerCase().startsWith(stem.toLowerCase());
}

/**
 * Infers only the person (not tense)
 */
function inferPersonOnly(conjugatedForm: string): string {
  // Try to infer from verb ending if not clear from pronouns
  if (conjugatedForm.endsWith('o')) return '1ª sing.';
  if (conjugatedForm.endsWith('s')) return '2ª sing.';
  if (conjugatedForm.endsWith('mos')) return '1ª pl.';
  if (conjugatedForm.endsWith('is') || conjugatedForm.endsWith('des')) return '2ª pl.';
  if (conjugatedForm.endsWith('m') || conjugatedForm.endsWith('em') || conjugatedForm.endsWith('am')) return '3ª pl.';
  
  // Default to 3rd singular as it's most common
  return '3ª sing.';
}

/**
 * Checks if topic involves comparison
 */
function hasComparison(topic: string): boolean {
  return topic.includes('vs') || topic.includes('comparacao');
}

/**
 * Generates comparison hint in format "option1 / option2"
 */
function generateComparisonHint(): string {
  // This would be rare in B2 subjunctive topics
  return "";
}

/**
 * Generates minimal contextual hint for non-verb cases
 */
function generateMinimalContextualHint(): string {
  // For most B2 topics, the grammatical context is clear from the sentence structure
  return "";
}

/**
 * Main function to process the exercises file
 */
async function processB2Hints() {
  const inputPath = path.join(process.cwd(), 'excercises', 'chatgpt_portuguese_B2_exercises.json');
  const outputPath = path.join(process.cwd(), 'excercises', 'chatgpt_portuguese_B2_exercises_minimal.json');

  console.log('Reading B2 exercises from:', inputPath);
  
  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  const exercises: Exercise[] = JSON.parse(fileContent);
  
  console.log(`Processing ${exercises.length} exercises with MINIMAL hints...`);
  
  let hintsAdded = 0;
  let hintsKeptEmpty = 0;

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    // const oldHint = exercise.hint || ''; // Not needed for processing
    const newHint = generateHint(exercise);
    
    exercise.hint = newHint;
    
    if (newHint === '') {
      hintsKeptEmpty++;
      if ((i + 1) % 10 === 0 || i < 10) {
        console.log(`Exercise ${i + 1}: No hint needed - "${exercise.sentence.substring(0, 50)}..."`);
      }
    } else {
      hintsAdded++;
      if ((i + 1) % 10 === 0 || i < 10) {
        console.log(`Exercise ${i + 1}: Hint "${newHint}" - "${exercise.sentence.substring(0, 50)}..."`);
      }
    }
  }

  console.log('\nWriting updated exercises to:', outputPath);
  fs.writeFileSync(outputPath, JSON.stringify(exercises, null, 2), 'utf-8');
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total exercises processed: ${exercises.length}`);
  console.log(`Hints added: ${hintsAdded}`);
  console.log(`Hints kept empty: ${hintsKeptEmpty}`);
  console.log(`Output saved to: ${outputPath}`);
}

// Run the script
if (require.main === module) {
  processB2Hints().catch(console.error);
}