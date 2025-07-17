import { Topic } from '@/types';

export const topics: Topic[] = [
  // A1 Level - Basic Grammar
  { id: 'present-indicative', name: 'Present Indicative', namePt: 'Presente do Indicativo', levels: ['A1'] },
  { id: 'ser-estar', name: 'Ser vs Estar', namePt: 'Ser vs Estar', levels: ['A1'] },
  { id: 'articles', name: 'Articles (definite/indefinite)', namePt: 'Artigos (definidos/indefinidos)', levels: ['A1'] },
  { id: 'noun-gender', name: 'Noun Gender and Number', namePt: 'Gênero e Número dos Substantivos', levels: ['A1'] },
  { id: 'basic-adjectives', name: 'Basic Adjective Agreement', namePt: 'Concordância Básica dos Adjetivos', levels: ['A1'] },
  { id: 'possessive-adjectives', name: 'Possessive Adjectives', namePt: 'Adjetivos Possessivos', levels: ['A1'] },
  { id: 'question-formation', name: 'Question Formation', namePt: 'Formação de Perguntas', levels: ['A1'] },
  { id: 'negation', name: 'Negation', namePt: 'Negação', levels: ['A1'] },
  
  // A2 Level - Expanding Grammar
  { id: 'preterite-perfect', name: 'Pretérito Perfeito (Simple Past)', namePt: 'Pretérito Perfeito', levels: ['A2'] },
  { id: 'imperfect', name: 'Pretérito Imperfeito (Imperfect)', namePt: 'Pretérito Imperfeito', levels: ['A2'] },
  { id: 'future-simple', name: 'Future Simple', namePt: 'Futuro Simples', levels: ['A2'] },
  { id: 'direct-object-pronouns', name: 'Direct Object Pronouns', namePt: 'Pronomes Objeto Direto', levels: ['A2'] },
  { id: 'indirect-object-pronouns', name: 'Indirect Object Pronouns', namePt: 'Pronomes Objeto Indireto', levels: ['A2'] },
  { id: 'comparatives', name: 'Comparatives and Superlatives', namePt: 'Comparativos e Superlativos', levels: ['A2'] },
  { id: 'prepositions-basic', name: 'Basic Prepositions', namePt: 'Preposições Básicas', levels: ['A2'] },
  { id: 'reflexive-pronouns', name: 'Reflexive Pronouns', namePt: 'Pronomes Reflexivos', levels: ['A2'] },
  
  // B1 Level - Intermediate Grammar
  { id: 'present-subjunctive', name: 'Present Subjunctive', namePt: 'Presente do Subjuntivo', levels: ['B1'] },
  { id: 'conditional-simple', name: 'Simple Conditional', namePt: 'Condicional Simples', levels: ['B1'] },
  { id: 'imperative-mood', name: 'Imperative Mood', namePt: 'Modo Imperativo', levels: ['B1'] },
  { id: 'perfect-tenses', name: 'Perfect Tenses (Compound)', namePt: 'Tempos Perfeitos (Compostos)', levels: ['B1'] },
  { id: 'relative-pronouns', name: 'Relative Pronouns', namePt: 'Pronomes Relativos', levels: ['B1'] },
  { id: 'gerund-participle', name: 'Gerund and Participle', namePt: 'Gerúndio e Particípio', levels: ['B1'] },
  { id: 'pronominal-placement', name: 'Pronominal Placement', namePt: 'Colocação Pronominal', levels: ['B1'] },
  { id: 'por-vs-para', name: 'Por vs Para', namePt: 'Por vs Para', levels: ['B1'] },
  
  // B2 Level - Advanced Grammar
  { id: 'imperfect-subjunctive', name: 'Imperfect Subjunctive', namePt: 'Imperfeito do Subjuntivo', levels: ['B2'] },
  { id: 'future-subjunctive', name: 'Future Subjunctive', namePt: 'Futuro do Subjuntivo', levels: ['B2'] },
  { id: 'conditional-perfect', name: 'Conditional Perfect', namePt: 'Condicional Perfeito', levels: ['B2'] },
  { id: 'passive-voice', name: 'Passive Voice', namePt: 'Voz Passiva', levels: ['B2'] },
  { id: 'infinitive-forms', name: 'Infinitive Forms (personal/impersonal)', namePt: 'Formas do Infinitivo (pessoal/impessoal)', levels: ['B2'] },
  { id: 'subjunctive-uses', name: 'Subjunctive Uses and Triggers', namePt: 'Usos e Desencadeadores do Subjuntivo', levels: ['B2'] },
  { id: 'complex-prepositions', name: 'Complex Prepositions', namePt: 'Preposições Complexas', levels: ['B2'] },
  
  // C1 Level - Sophisticated Grammar
  { id: 'pluperfect-subjunctive', name: 'Pluperfect Subjunctive', namePt: 'Mais-que-perfeito do Subjuntivo', levels: ['C1'] },
  { id: 'future-perfect-subjunctive', name: 'Future Perfect Subjunctive', namePt: 'Futuro Perfeito do Subjuntivo', levels: ['C1'] },
  { id: 'literary-tenses', name: 'Literary Tenses', namePt: 'Tempos Literários', levels: ['C1'] },
  { id: 'advanced-syntax', name: 'Advanced Syntax Structures', namePt: 'Estruturas Sintáticas Avançadas', levels: ['C1'] },
  { id: 'stylistic-inversion', name: 'Stylistic Inversion', namePt: 'Inversão Estilística', levels: ['C1'] },
  { id: 'discourse-markers', name: 'Discourse Markers', namePt: 'Marcadores Discursivos', levels: ['C1'] },
  
  // C2 Level - Mastery Grammar
  { id: 'archaic-forms', name: 'Archaic and Historical Forms', namePt: 'Formas Arcaicas e Históricas', levels: ['C2'] },
  { id: 'regional-grammar', name: 'Regional Grammar Variations', namePt: 'Variações Gramaticais Regionais', levels: ['C2'] },
  { id: 'formal-register', name: 'Formal Register Grammar', namePt: 'Gramática de Registro Formal', levels: ['C2'] },
  { id: 'complex-subordination', name: 'Complex Subordination', namePt: 'Subordinação Complexa', levels: ['C2'] },
  { id: 'advanced-concordance', name: 'Advanced Concordance Rules', namePt: 'Regras Avançadas de Concordância', levels: ['C2'] },
  
  // Multi-level topics
  { id: 'verb-conjugation', name: 'Verb Conjugation Patterns', namePt: 'Padrões de Conjugação Verbal', levels: ['A1', 'A2', 'B1'] },
  { id: 'pronoun-system', name: 'Pronoun System', namePt: 'Sistema de Pronomes', levels: ['A1', 'A2', 'B1', 'B2'] },
  { id: 'adjective-placement', name: 'Adjective Placement and Agreement', namePt: 'Colocação e Concordância dos Adjetivos', levels: ['A1', 'A2', 'B1'] },
  { id: 'sentence-structure', name: 'Sentence Structure', namePt: 'Estrutura da Frase', levels: ['A2', 'B1', 'B2'] },
];