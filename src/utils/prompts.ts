import { ExplanationLanguage } from '@/types';

export function generateExercisePrompt(levels: string[], selectedTopics: string[], topicNames: string[], masteredWords: Record<string, unknown> = {}): string {
  const masteredWordsList = Object.values(masteredWords).map(word => (word as { word: string }).word).join(', ');
  const avoidMasteredText = masteredWordsList ? 
    `\n\nPALAVRAS JÁ DOMINADAS (evitar estas formas específicas): ${masteredWordsList}\nNota: Outras formas do mesmo verbo podem ser usadas.` : '';

  return `Cria um exercício de português europeu EXCLUSIVAMENTE para os níveis ${levels.join(', ')}.
    
Tópicos a focar EXCLUSIVAMENTE: ${topicNames.join(', ')}${avoidMasteredText}

REGRAS OBRIGATÓRIAS:
1. O exercício DEVE ser estritamente de um dos níveis especificados: ${levels.join(', ')}
2. O exercício DEVE ser estritamente de um dos tópicos especificados: ${topicNames.join(', ')}
3. NÃO cries exercícios para outros níveis ou tópicos
4. A complexidade DEVE corresponder exactamente ao nível especificado

Cria um exercício de preenchimento de espaços em português europeu. Retorna um objeto JSON com:
- sentence: Uma frase em português com exatamente um espaço em branco marcado como "___"
- correctAnswer: A palavra/frase correta para preencher o espaço
- topic: Um dos IDs de tópico: ${selectedTopics.join(', ')} (OBRIGATÓRIO)
- level: Um de: ${levels.join(', ')} (OBRIGATÓRIO)
- hint: Um objeto com dicas úteis incluindo:
  - infinitive: A forma infinitiva do verbo (se aplicável)
  - person: A pessoa gramatical APENAS se não for óbvia pelo contexto da frase
  - form: A forma/tempo gramatical sendo usado (ex: "presente indicativo", "imperativo", etc.)

A frase deve ser natural e apropriada para o nível especificado. Foca em variantes do português europeu.
Para exercícios de verbos, inclui sempre o infinitivo. 

REGRAS PARA A PESSOA:
- NÃO incluas "person" se o sujeito está explícito na frase (ex: "eu", "tu", "ele", "ela", "nós", "vós", "eles", "elas")
- NÃO incluas "person" se o sujeito é claro pelo contexto (ex: "O menino", "A Maria", "Os estudantes")
- SÓ incluas "person" quando o sujeito não está presente e pode ser ambíguo (ex: "___falo português" onde pode ser "eu falo" ou "tu falas")

Exemplos corretos:

Exemplo 1 - Sujeito claro pelo contexto (NÃO incluir person):
{
  "sentence": "O menino ___ alto.",
  "correctAnswer": "está",
  "topic": "ser-estar",
  "level": "A1",
  "hint": {
    "infinitive": "estar"
  }
}

Exemplo 2 - Sujeito explícito (NÃO incluir person):
{
  "sentence": "Ele ___ muito bem português.",
  "correctAnswer": "fala",
  "topic": "present-indicative",
  "level": "A1",
  "hint": {
    "infinitive": "falar"
  }
}

Exemplo 3 - Sujeito ambíguo (INCLUIR person):
{
  "sentence": "___ cedo para o trabalho.",
  "correctAnswer": "Vou",
  "topic": "present-indicative",
  "level": "A1",
  "hint": {
    "infinitive": "ir",
    "person": "1ª pessoa"
  }
}

Exemplo 4 - Imperativo sem sujeito explícito (INCLUIR person):
{
  "sentence": "___!",
  "correctAnswer": "Vem",
  "topic": "imperative-mood",
  "level": "B1",
  "hint": {
    "infinitive": "vir",
    "person": "2ª pessoa singular"
  }
}`;
}

export function generateBatchExercisePrompt(levels: string[], selectedTopics: string[], topicNames: string[], masteredWords: Record<string, unknown> = {}): string {
  const masteredWordsList = Object.values(masteredWords).map(word => (word as { word: string }).word).join(', ');
  const avoidMasteredText = masteredWordsList ? 
    `\n\nPALAVRAS JÁ DOMINADAS (evitar estas formas específicas): ${masteredWordsList}\nNota: Outras formas do mesmo verbo podem ser usadas.` : '';

  return `Cria 10 exercícios de português europeu seguindo estas regras OBRIGATÓRIAS:

REGRAS DE SELEÇÃO:
1. Para cada exercício, escolhe ALEATORIAMENTE um nível de: ${levels.join(', ')}
2. Para cada exercício, escolhe ALEATORIAMENTE um tópico de: ${topicNames.join(', ')}
3. Cada exercício deve ter nível e tópico independentes (pode repetir combinações)${avoidMasteredText}

FORMATO OBRIGATÓRIO para cada exercício:
- sentence: Uma frase com exatamente um espaço "_____"
- correctAnswer: A resposta correta
- topic: ID do tópico de ${selectedTopics.join(', ')}
- level: Nível de ${levels.join(', ')}
- hint: Objeto com dicas (infinitive, person se aplicável, form)
- multipleChoiceOptions: Array de 4 opções (1 correta + 3 incorretas) já embaralhadas
- explanations: Objeto com explicações detalhadas em 3 idiomas:
  - pt: Explicação detalhada em português sobre por que a resposta está correta
  - en: Detailed explanation in English about why the answer is correct
  - uk: Детальне пояснення українською про те, чому відповідь правильна

REGRAS PARA OPÇÕES MÚLTIPLAS:
1. Criar 3 distratores plausíveis mas errados
2. Mesma categoria gramatical que a resposta correta
3. Adequados ao nível do exercício
4. Representar erros comuns
5. Completamente diferentes (não apenas maiúsculas/minúsculas)

REGRAS PARA EXPLICAÇÕES (em todos os 3 idiomas):
1. Explicar por que a resposta está correta
2. Mencionar regras gramaticais relevantes
3. Dar contexto sobre o uso
4. Ser adequada ao nível do exercício
5. Manter consistência entre os idiomas (mesmo conteúdo, idiomas diferentes)

REGRAS PARA PESSOA:
- NÃO incluas "person" se sujeito explícito na frase
- SÓ incluas "person" quando sujeito ausente e ambíguo

Exemplo de estrutura:
[
  {
    "sentence": "Ele ___ muito bem português.",
    "correctAnswer": "fala",
    "topic": "present-indicative",
    "level": "A1",
    "hint": {
      "infinitive": "falar"
    },
    "multipleChoiceOptions": ["fala", "falou", "falará", "falava"],
    "explanations": {
      "pt": "Usamos 'fala' porque é a terceira pessoa do singular do presente do indicativo do verbo 'falar'. No presente do indicativo, os verbos terminados em -ar fazem a conjugação: eu falo, tu falas, ele/ela fala.",
      "en": "We use 'fala' because it's the third person singular of the present indicative of the verb 'falar' (to speak). In the present indicative, verbs ending in -ar conjugate as: eu falo, tu falas, ele/ela fala.",
      "uk": "Ми використовуємо 'fala', тому що це третя особа однини теперішнього часу дієслова 'falar' (говорити). В теперішньому часі дієслова на -ar відмінюються так: eu falo, tu falas, ele/ela fala."
    }
  }
]

Retorna um array JSON com exatamente 10 exercícios seguindo esta estrutura.`;
}

export function generateMultipleChoicePrompt(exercise: { 
  sentence: string; 
  correctAnswer: string; 
  level: string; 
  topic: string; 
  hint?: {
    infinitive?: string;
    person?: string;
    form?: string;
  };
}, explanationLanguage: ExplanationLanguage): string {
  const prompts = {
    pt: `És um professor de português europeu especializado em criar exercícios de escolha múltipla.

Exercício:
- Frase: "${exercise.sentence}"
- Resposta correta: "${exercise.correctAnswer}"
- Nível: ${exercise.level}
- Tópico: ${exercise.topic}
- Dica: ${exercise.hint ? JSON.stringify(exercise.hint) : 'Nenhuma'}

Cria 3 opções incorretas (distratores) que sejam plausíveis mas erradas. Os distratores devem:
1. Ser da mesma categoria gramatical que a resposta correta
2. Ser adequados ao nível ${exercise.level}
3. Parecer plausíveis no contexto da frase
4. Representar erros comuns que estudantes fazem
5. Ter comprimento e complexidade similares à resposta correta
6. SER COMPLETAMENTE DIFERENTES da resposta correta (não apenas maiúsculas/minúsculas diferentes)
7. Ser semanticamente distintos, não apenas variações ortográficas

IMPORTANTE: Se a resposta correta for "${exercise.correctAnswer}", NÃO uses "${exercise.correctAnswer.toLowerCase()}", "${exercise.correctAnswer.toUpperCase()}", nem variações que diferem apenas em maiúsculas/minúsculas.

Por exemplo:
- Se a resposta correta é um verbo conjugado, os distratores devem ser outras conjugações do mesmo verbo ou verbos similares
- Se é um substantivo, usar substantivos relacionados ou com terminações similares
- Se é um adjetivo, usar adjetivos com concordância diferente ou sinónimos incorretos

Se não conseguires criar 3 distratores verdadeiramente diferentes, cria menos (1 ou 2), mas todos devem ser únicos e diferentes.

Responde apenas com um array JSON de strings (os distratores):
["distrator1", "distrator2", "distrator3"] ou ["distrator1", "distrator2"] se só conseguires 2 únicos`,

    en: `You are a European Portuguese teacher specialized in creating multiple choice exercises.

Exercise:
- Sentence: "${exercise.sentence}"
- Correct answer: "${exercise.correctAnswer}"
- Level: ${exercise.level}
- Topic: ${exercise.topic}
- Hint: ${exercise.hint ? JSON.stringify(exercise.hint) : 'None'}

Create 3 incorrect options (distractors) that are plausible but wrong. The distractors should:
1. Be from the same grammatical category as the correct answer
2. Be appropriate for ${exercise.level} level
3. Seem plausible in the sentence context
4. Represent common mistakes students make
5. Have similar length and complexity to the correct answer
6. BE COMPLETELY DIFFERENT from the correct answer (not just different case)
7. Be semantically distinct, not just spelling variations

IMPORTANT: If the correct answer is "${exercise.correctAnswer}", DO NOT use "${exercise.correctAnswer.toLowerCase()}", "${exercise.correctAnswer.toUpperCase()}", or any variations that differ only in capitalization.

For example:
- If the correct answer is a conjugated verb, distractors should be other conjugations of the same verb or similar verbs
- If it's a noun, use related nouns or ones with similar endings
- If it's an adjective, use adjectives with different agreement or incorrect synonyms

If you cannot create 3 truly different distractors, create fewer (1 or 2), but all must be unique and different.

Respond only with a JSON array of strings (the distractors):
["distractor1", "distractor2", "distractor3"] or ["distractor1", "distractor2"] if you can only create 2 unique ones`,

    uk: `Ти викладач європейської португальської мови, який спеціалізується на створенні вправ з множинним вибором.

Вправа:
- Речення: "${exercise.sentence}"
- Правильна відповідь: "${exercise.correctAnswer}"
- Рівень: ${exercise.level}
- Тема: ${exercise.topic}
- Підказка: ${exercise.hint ? JSON.stringify(exercise.hint) : 'Немає'}

Створи 3 неправильні варіанти (відволікачі), які є правдоподібними, але помилковими. Відволікачі повинні:
1. Бути з тієї ж граматичної категорії, що й правильна відповідь
2. Бути відповідними для рівня ${exercise.level}
3. Здаватися правдоподібними в контексті речення
4. Представляти типові помилки, які роблять студенти
5. Мати подібну довжину та складність до правильної відповіді
6. БУТИ ПОВНІСТЮ РІЗНИМИ від правильної відповіді (не просто різні великі/малі літери)
7. Бути семантично відмінними, а не просто орфографічними варіаціями

ВАЖЛИВО: Якщо правильна відповідь "${exercise.correctAnswer}", НЕ використовуй "${exercise.correctAnswer.toLowerCase()}", "${exercise.correctAnswer.toUpperCase()}", чи будь-які варіації, що відрізняються лише регістром.

Наприклад:
- Якщо правильна відповідь - це дієслово у певній формі, відволікачі повинні бути іншими формами того ж дієслова або подібних дієслів
- Якщо це іменник, використовуй пов'язані іменники або з подібними закінченнями
- Якщо це прикметник, використовуй прикметники з іншим узгодженням або неправильні синоніми

Якщо ти не можеш створити 3 справді різних відволікачі, створи менше (1 або 2), але всі повинні бути унікальними та різними.

Відповідай тільки JSON масивом рядків (відволікачі):
["відволікач1", "відволікач2", "відволікач3"] або ["відволікач1", "відволікач2"] якщо можеш створити лише 2 унікальних`
  };

  return prompts[explanationLanguage];
}