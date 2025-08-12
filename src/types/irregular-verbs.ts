// Types for irregular verbs feature

export interface IrregularVerb {
  id: string;
  infinitive: string;
  
  // Presente Indicativo
  presente_ind_eu?: string;
  presente_ind_tu?: string;
  presente_ind_ele_ela?: string;
  presente_ind_nos?: string;
  presente_ind_vos?: string;
  presente_ind_eles_elas?: string;
  
  // Alternative forms for Presente Indicativo
  presente_ind_eu_alt?: string;
  presente_ind_tu_alt?: string;
  presente_ind_ele_ela_alt?: string;
  presente_ind_nos_alt?: string;
  presente_ind_vos_alt?: string;
  presente_ind_eles_elas_alt?: string;
  
  // Pretérito Perfeito Simples (PPS)
  pps_eu?: string;
  pps_tu?: string;
  pps_ele_ela?: string;
  pps_nos?: string;
  pps_vos?: string;
  pps_eles_elas?: string;
  
  // Alternative forms for PPS
  pps_eu_alt?: string;
  pps_tu_alt?: string;
  pps_ele_ela_alt?: string;
  pps_nos_alt?: string;
  pps_vos_alt?: string;
  pps_eles_elas_alt?: string;
  
  // Pretérito Imperfeito
  pret_imp_eu?: string;
  pret_imp_tu?: string;
  pret_imp_ele_ela?: string;
  pret_imp_nos?: string;
  pret_imp_vos?: string;
  pret_imp_eles_elas?: string;
  
  // Alternative forms for Pretérito Imperfeito
  pret_imp_eu_alt?: string;
  pret_imp_tu_alt?: string;
  pret_imp_ele_ela_alt?: string;
  pret_imp_nos_alt?: string;
  pret_imp_vos_alt?: string;
  pret_imp_eles_elas_alt?: string;
  
  // Imperativo Positivo
  imp_pos_tu?: string;
  imp_pos_ele_ela?: string;
  imp_pos_nos?: string;
  imp_pos_vos?: string;
  imp_pos_eles_elas?: string;
  
  // Alternative forms for Imperativo Positivo
  imp_pos_tu_alt?: string;
  imp_pos_ele_ela_alt?: string;
  imp_pos_nos_alt?: string;
  imp_pos_vos_alt?: string;
  imp_pos_eles_elas_alt?: string;
  
  // Imperativo Negativo
  imp_neg_tu?: string;
  imp_neg_ele_ela?: string;
  imp_neg_nos?: string;
  imp_neg_vos?: string;
  imp_neg_eles_elas?: string;
  
  // Alternative forms for Imperativo Negativo
  imp_neg_tu_alt?: string;
  imp_neg_ele_ela_alt?: string;
  imp_neg_nos_alt?: string;
  imp_neg_vos_alt?: string;
  imp_neg_eles_elas_alt?: string;
  
  // Infinitivo Pessoal
  inf_pes_eu?: string;
  inf_pes_tu?: string;
  inf_pes_ele_ela?: string;
  inf_pes_nos?: string;
  inf_pes_vos?: string;
  inf_pes_eles_elas?: string;
  
  // Alternative forms for Infinitivo Pessoal
  inf_pes_eu_alt?: string;
  inf_pes_tu_alt?: string;
  inf_pes_ele_ela_alt?: string;
  inf_pes_nos_alt?: string;
  inf_pes_vos_alt?: string;
  inf_pes_eles_elas_alt?: string;
  
  // Futuro Imperfeito
  fut_imp_eu?: string;
  fut_imp_tu?: string;
  fut_imp_ele_ela?: string;
  fut_imp_nos?: string;
  fut_imp_vos?: string;
  fut_imp_eles_elas?: string;
  
  // Alternative forms for Futuro Imperfeito
  fut_imp_eu_alt?: string;
  fut_imp_tu_alt?: string;
  fut_imp_ele_ela_alt?: string;
  fut_imp_nos_alt?: string;
  fut_imp_vos_alt?: string;
  fut_imp_eles_elas_alt?: string;
  
  // Condicional Presente
  cond_pres_eu?: string;
  cond_pres_tu?: string;
  cond_pres_ele_ela?: string;
  cond_pres_nos?: string;
  cond_pres_vos?: string;
  cond_pres_eles_elas?: string;
  
  // Alternative forms for Condicional Presente
  cond_pres_eu_alt?: string;
  cond_pres_tu_alt?: string;
  cond_pres_ele_ela_alt?: string;
  cond_pres_nos_alt?: string;
  cond_pres_vos_alt?: string;
  cond_pres_eles_elas_alt?: string;
  
  // Conjuntivo Presente
  conj_pres_eu?: string;
  conj_pres_tu?: string;
  conj_pres_ele_ela?: string;
  conj_pres_nos?: string;
  conj_pres_vos?: string;
  conj_pres_eles_elas?: string;
  
  // Alternative forms for Conjuntivo Presente
  conj_pres_eu_alt?: string;
  conj_pres_tu_alt?: string;
  conj_pres_ele_ela_alt?: string;
  conj_pres_nos_alt?: string;
  conj_pres_vos_alt?: string;
  conj_pres_eles_elas_alt?: string;
  
  // Conjuntivo Passado (Imperfeito)
  conj_pass_eu?: string;
  conj_pass_tu?: string;
  conj_pass_ele_ela?: string;
  conj_pass_nos?: string;
  conj_pass_vos?: string;
  conj_pass_eles_elas?: string;
  
  // Alternative forms for Conjuntivo Passado
  conj_pass_eu_alt?: string;
  conj_pass_tu_alt?: string;
  conj_pass_ele_ela_alt?: string;
  conj_pass_nos_alt?: string;
  conj_pass_vos_alt?: string;
  conj_pass_eles_elas_alt?: string;
  
  // Conjuntivo Futuro
  conj_fut_eu?: string;
  conj_fut_tu?: string;
  conj_fut_ele_ela?: string;
  conj_fut_nos?: string;
  conj_fut_vos?: string;
  conj_fut_eles_elas?: string;
  
  // Alternative forms for Conjuntivo Futuro
  conj_fut_eu_alt?: string;
  conj_fut_tu_alt?: string;
  conj_fut_ele_ela_alt?: string;
  conj_fut_nos_alt?: string;
  conj_fut_vos_alt?: string;
  conj_fut_eles_elas_alt?: string;
  
  // Particípio Passado
  participio_passado?: string;
  participio_passado_alt?: string;
  
  created_at: string;
  updated_at: string;
}

// Tenses available for irregular verbs
export type VerbTense = 
  | 'presente_indicativo'
  | 'pps' 
  | 'preterito_imperfeito'
  | 'imperativo_positivo'
  | 'imperativo_negativo'
  | 'infinitivo_pessoal'
  | 'futuro_imperfeito'
  | 'condicional_presente'
  | 'conjuntivo_presente'
  | 'conjuntivo_passado'
  | 'conjuntivo_futuro'
  | 'participio_passado';

// Persons available for conjugation
export type VerbPerson = 
  | 'eu' 
  | 'tu' 
  | 'ele_ela' 
  | 'nos' 
  | 'vos' 
  | 'eles_elas';

// Configuration for irregular verbs
export interface IrregularVerbsConfig {
  enabledTenses: VerbTense[];
  showMultipleChoiceOptions: boolean;
}

// Exercise for irregular verbs
export interface IrregularVerbExercise {
  id: string;
  infinitive: string;
  targetTense: VerbTense;
  targetPerson: VerbPerson;
  correctAnswer: string;
  correctAnswerAlt?: string; // Alternative correct form
  multipleChoiceOptions?: string[];
  question: string; // E.g., "Conjugue o verbo 'ir' no Presente Indicativo, 3ª pessoa singular"
}

// User's answer to an irregular verb exercise
export interface IrregularVerbAnswer {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  correctAnswerAlt?: string;
  timeTaken: number;
}

// Tense display names in Portuguese
export const TENSE_DISPLAY_NAMES: Record<VerbTense, string> = {
  'presente_indicativo': 'Presente Indicativo',
  'pps': 'Pretérito Perfeito Simples',
  'preterito_imperfeito': 'Pretérito Imperfeito',
  'imperativo_positivo': 'Imperativo Positivo',
  'imperativo_negativo': 'Imperativo Negativo',
  'infinitivo_pessoal': 'Infinitivo Pessoal',
  'futuro_imperfeito': 'Futuro Imperfeito',
  'condicional_presente': 'Condicional Presente',
  'conjuntivo_presente': 'Conjuntivo Presente',
  'conjuntivo_passado': 'Conjuntivo Passado',
  'conjuntivo_futuro': 'Conjuntivo Futuro',
  'participio_passado': 'Particípio Passado'
};

// Person display names in Portuguese
export const PERSON_DISPLAY_NAMES: Record<VerbPerson, string> = {
  'eu': 'eu',
  'tu': 'tu',
  'ele_ela': 'ele/ela',
  'nos': 'nós',
  'vos': 'vós',
  'eles_elas': 'eles/elas'
};