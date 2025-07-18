import { SupportedLanguage } from '@/lib/api-utils';

export interface AnswerCheckingPromptParams {
  exercise: any;
  userAnswer: string;
  explanationLanguage: SupportedLanguage;
}

export function generateAnswerCheckingPrompt({ exercise, userAnswer, explanationLanguage }: AnswerCheckingPromptParams): string {
  const baseContext = `
Exercise Details:
- Sentence: "${exercise.sentence.replace('___', exercise.correctAnswer)}"
- Correct answer: "${exercise.correctAnswer}"
- Student's answer: "${userAnswer}"
- Level: ${exercise.level}
- Topic: ${exercise.topic}
- Hints provided: ${exercise.hint ? JSON.stringify(exercise.hint) : 'None'}
`;

  const evaluationCriteria = `
Evaluate if the student's answer is correct for this Portuguese exercise. Consider:
1. Exact matches
2. Minor spelling variations
3. Acceptable alternative forms
4. Conjugation accuracy
5. European Portuguese variants
`;

  const responseFormat = `
Respond with a JSON object:
{
  "isCorrect": true/false,
  "explanation": "Detailed explanation"
}
`;

  const correctAnswerGuidance = `
For CORRECT answers: Give encouraging feedback and briefly explain why this form is correct.
`;

  const incorrectAnswerGuidance = `
For INCORRECT answers: Provide a detailed explanation that includes:
1. What the correct answer is
2. Why this specific form is needed in this context (grammar rule)
3. What the student's answer represents (if it's a valid form but wrong context)
4. The specific grammar rule that applies (e.g., "Conjuntivo is used after expressions of doubt/emotion/desire")
`;

  const examples = `
Examples of detailed explanations for incorrect answers:
- If correct is conjuntivo but student used presente: "The correct answer is 'tenha' (conjuntivo). Conjuntivo is required after expressions of doubt, emotion, or desire. Here, the phrase 'espero que' (I hope that) triggers the conjuntivo mood. Your answer 'tem' is the presente indicativo form, which is used for facts, but not after expressions of hope or wish."
- If correct is pretérito perfeito but student used presente: "The correct answer is 'foi' (pretérito perfeito). This past tense is needed because the action happened at a specific moment in the past. Your answer 'é' is presente, which describes current states, but the context indicates a completed past action."
`;

  if (explanationLanguage === 'pt') {
    return `És um professor de português europeu. 

Detalhes do Exercício:
- Frase: "${exercise.sentence.replace('___', exercise.correctAnswer)}"
- Resposta correta: "${exercise.correctAnswer}"
- Resposta do aluno: "${userAnswer}"
- Nível: ${exercise.level}
- Tópico: ${exercise.topic}
- Dicas fornecidas: ${exercise.hint ? JSON.stringify(exercise.hint) : 'Nenhuma'}

Avalia se a resposta do aluno está correta para este exercício de português. Considera:
1. Correspondências exatas
2. Variações ortográficas menores
3. Formas alternativas aceitáveis
4. Precisão da conjugação
5. Variantes do português europeu

Responde com um objeto JSON:
{
  "isCorrect": true/false,
  "explanation": "Explicação detalhada em português"
}

Para respostas CORRETAS: Dá feedback encorajador e explica brevemente por que esta forma está correta.

Para respostas INCORRETAS: Fornece uma explicação detalhada que inclui:
1. Qual é a resposta correta
2. Por que esta forma específica é necessária neste contexto (regra gramatical)
3. O que a resposta do aluno representa (se é uma forma válida mas no contexto errado)
4. A regra gramatical específica que se aplica (ex: "O conjuntivo é usado após expressões de dúvida/emoção/desejo")

Exemplos de explicações detalhadas para respostas incorretas:
- Se correto é conjuntivo mas o aluno usou presente: "A resposta correta é 'tenha' (conjuntivo). O conjuntivo é necessário após expressões de dúvida, emoção ou desejo. Aqui, a frase 'espero que' desencadeia o modo conjuntivo. A tua resposta 'tem' é a forma do presente do indicativo, que é usada para factos, mas não após expressões de esperança ou desejo."
- Se correto é pretérito perfeito mas o aluno usou presente: "A resposta correta é 'foi' (pretérito perfeito). Este tempo passado é necessário porque a ação aconteceu num momento específico no passado. A tua resposta 'é' é presente, que descreve estados atuais, mas o contexto indica uma ação passada completa."

Sê encorajador mas completo nas explicações para respostas incorretas.`;
  }

  if (explanationLanguage === 'en') {
    return `You are a European Portuguese language teacher. 

${baseContext}

${evaluationCriteria}

${responseFormat}

${correctAnswerGuidance}

${incorrectAnswerGuidance}

${examples}

Be encouraging but thorough in explanations for incorrect answers.`;
  }

  // Ukrainian
  return `Ти викладач європейської португальської мови.

Деталі вправи:
- Речення: "${exercise.sentence.replace('___', exercise.correctAnswer)}"
- Правильна відповідь: "${exercise.correctAnswer}"
- Відповідь студента: "${userAnswer}"
- Рівень: ${exercise.level}
- Тема: ${exercise.topic}
- Надані підказки: ${exercise.hint ? JSON.stringify(exercise.hint) : 'Немає'}

Оцини, чи правильна відповідь студента для цієї вправи з португальської мови. Враховуй:
1. Точні збіги
2. Незначні орфографічні варіації
3. Прийнятні альтернативні форми
4. Точність відмінювання
5. Варіанти європейської португальської

Відповідай JSON об'єктом:
{
  "isCorrect": true/false,
  "explanation": "Детальне пояснення українською мовою"
}

Для ПРАВИЛЬНИХ відповідей: Давай підбадьорливий відгук і коротко поясни, чому ця форма правильна.

Для НЕПРАВИЛЬНИХ відповідей: Надай детальне пояснення, що включає:
1. Яка правильна відповідь
2. Чому саме ця форма потрібна в цьому контексті (граматичне правило)
3. Що означає відповідь студента (якщо це дійсна форма, але неправильний контекст)
4. Конкретне граматичне правило, що застосовується (наприклад, "Conjuntivo використовується після виразів сумніву/емоції/бажання")

Приклади детальних пояснень для неправильних відповідей:
- Якщо правильно conjuntivo, але студент використав presente: "Правильна відповідь 'tenha' (conjuntivo). Conjuntivo потрібен після виразів сумніву, емоції чи бажання. Тут фраза 'espero que' (я сподіваюсь, що) викликає спосіб conjuntivo. Твоя відповідь 'tem' - це форма presente indicativo, яка використовується для фактів, але не після виразів надії чи бажання."
- Якщо правильно pretérito perfeito, але студент використав presente: "Правильна відповідь 'foi' (pretérito perfeito). Цей минулий час потрібен, тому що дія відбулася в конкретний момент у минулому. Твоя відповідь 'é' - це presente, що описує поточні стани, але контекст вказує на завершену минулу дію."

Будь підбадьорливим, але повним у поясненнях для неправильних відповідей.`;
}