-- Fix topic names in database to match configuration topics
-- This script updates mismatched topic names to align with the configuration

BEGIN;

-- Update topics to match configuration names
UPDATE exercises SET topic = 'condicional-presente' WHERE topic = 'conditional-simple';
UPDATE exercises SET topic = 'pronomes-pessoais' WHERE topic = 'direct-object-pronouns';  
UPDATE exercises SET topic = 'futuro-imperfeito' WHERE topic = 'future-simple';
UPDATE exercises SET topic = 'futuro-conjuntivo-conjuncoes' WHERE topic = 'future-subjunctive';
UPDATE exercises SET topic = 'imperativo-positivo-negativo' WHERE topic = 'imperative-mood';
UPDATE exercises SET topic = 'imperfeito-idade-tempo' WHERE topic = 'imperfect';
UPDATE exercises SET topic = 'se-preterito-imperfeito-conjuntivo' WHERE topic = 'imperfect-subjunctive';
UPDATE exercises SET topic = 'mais-que-perfeito-composto-conjuntivo' WHERE topic = 'pluperfect-subjunctive';
UPDATE exercises SET topic = 'presente-indicativo-regulares' WHERE topic = 'present-indicative';
UPDATE exercises SET topic = 'presente-conjuntivo-regulares' WHERE topic = 'present-subjunctive';
UPDATE exercises SET topic = 'verbo-estar' WHERE topic = 'ser-estar';

-- Handle special cases
-- 'articles' could map to 'artigos-definidos-indefinidos' but let's check levels first
UPDATE exercises SET topic = 'artigos-definidos-indefinidos' WHERE topic = 'articles';

-- 'passive-voice' should map to 'voz-passiva' (already exists in config)
UPDATE exercises SET topic = 'voz-passiva' WHERE topic = 'passive-voice';

-- 'preterite-perfect' should map to 'preterito-perfeito-simples' (already exists in config)  
UPDATE exercises SET topic = 'preterito-perfeito-simples' WHERE topic = 'preterite-perfect';

-- For 'greetings', this is basic vocabulary and doesn't have a direct analogue
-- We could map it to a general A1 topic or leave it for manual review
-- UPDATE exercises SET topic = 'presente-indicativo-regulares' WHERE topic = 'greetings';

-- Verify the changes
SELECT 'UPDATED TOPICS:' as status;
SELECT topic, COUNT(*) as count 
FROM exercises 
WHERE topic IN (
    'condicional-presente', 'pronomes-pessoais', 'futuro-imperfeito', 
    'futuro-conjuntivo-conjuncoes', 'imperativo-positivo-negativo', 
    'imperfeito-idade-tempo', 'se-preterito-imperfeito-conjuntivo',
    'mais-que-perfeito-composto-conjuntivo', 'presente-indicativo-regulares',
    'presente-conjuntivo-regulares', 'verbo-estar', 'artigos-definidos-indefinidos',
    'voz-passiva', 'preterito-perfeito-simples'
) 
GROUP BY topic 
ORDER BY topic;

-- Check if any old topic names remain
SELECT 'REMAINING MISMATCHED TOPICS:' as status;
SELECT DISTINCT topic 
FROM exercises 
WHERE topic IN (
    'conditional-simple', 'direct-object-pronouns', 'future-simple',
    'future-subjunctive', 'imperative-mood', 'imperfect', 'imperfect-subjunctive',
    'pluperfect-subjunctive', 'present-indicative', 'present-subjunctive',
    'ser-estar', 'articles', 'passive-voice', 'preterite-perfect', 'greetings'
);

COMMIT;