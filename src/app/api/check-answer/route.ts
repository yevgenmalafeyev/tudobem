import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  const { exercise, userAnswer, claudeApiKey, explanationLanguage = 'pt' } = await request.json();
  
  try {
    // Basic check without AI
    const isBasicallyCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    
    if (!claudeApiKey) {
      const correctMsg = explanationLanguage === 'pt' ? 'Correto! Muito bem.' : 
                        explanationLanguage === 'en' ? 'Correct! Well done.' : 
                        'Правильно! Молодець.';
      const incorrectMsg = explanationLanguage === 'pt' ? `Incorreto. A resposta correta é "${exercise.correctAnswer}".` : 
                          explanationLanguage === 'en' ? `Incorrect. The correct answer is "${exercise.correctAnswer}".` : 
                          `Неправильно. Правильна відповідь "${exercise.correctAnswer}".`;
      
      return NextResponse.json({
        isCorrect: isBasicallyCorrect,
        explanation: isBasicallyCorrect ? correctMsg : incorrectMsg
      });
    }

    // Enhanced check with Claude AI
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

    let prompt = '';
    
    if (explanationLanguage === 'pt') {
      prompt = `És um professor de português europeu. 

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
    } else if (explanationLanguage === 'en') {
      prompt = `You are a European Portuguese language teacher. 

Exercise Details:
- Sentence: "${exercise.sentence.replace('___', exercise.correctAnswer)}"
- Correct answer: "${exercise.correctAnswer}"
- Student's answer: "${userAnswer}"
- Level: ${exercise.level}
- Topic: ${exercise.topic}
- Hints provided: ${exercise.hint ? JSON.stringify(exercise.hint) : 'None'}

Evaluate if the student's answer is correct for this Portuguese exercise. Consider:
1. Exact matches
2. Minor spelling variations
3. Acceptable alternative forms
4. Conjugation accuracy
5. European Portuguese variants

Respond with a JSON object:
{
  "isCorrect": true/false,
  "explanation": "Detailed explanation in English"
}

For CORRECT answers: Give encouraging feedback and briefly explain why this form is correct.

For INCORRECT answers: Provide a detailed explanation that includes:
1. What the correct answer is
2. Why this specific form is needed in this context (grammar rule)
3. What the student's answer represents (if it's a valid form but wrong context)
4. The specific grammar rule that applies (e.g., "Conjuntivo is used after expressions of doubt/emotion/desire")

Examples of detailed explanations for incorrect answers:
- If correct is conjuntivo but student used presente: "The correct answer is 'tenha' (conjuntivo). Conjuntivo is required after expressions of doubt, emotion, or desire. Here, the phrase 'espero que' (I hope that) triggers the conjuntivo mood. Your answer 'tem' is the presente indicativo form, which is used for facts, but not after expressions of hope or wish."
- If correct is pretérito perfeito but student used presente: "The correct answer is 'foi' (pretérito perfeito). This past tense is needed because the action happened at a specific moment in the past. Your answer 'é' is presente, which describes current states, but the context indicates a completed past action."

Be encouraging but thorough in explanations for incorrect answers.`;
    } else {
      prompt = `Ти викладач європейської португальської мови.

Деталі вправи:
- Речення: "${exercise.sentence.replace('___', exercise.correctAnswer)}"
- Правильна відповідь: "${exercise.correctAnswer}"
- Відповідь студента: "${userAnswer}"
- Рівень: ${exercise.level}
- Тема: ${exercise.topic}
- Надані підказки: ${exercise.hint ? JSON.stringify(exercise.hint) : 'Немає'}

Оцени, чи правильна відповідь студента для цієї вправи з португальської мови. Враховуй:
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

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const result = JSON.parse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking answer:', error);
    
    // Fallback to basic check
    const isCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    return NextResponse.json({
      isCorrect,
      explanation: isCorrect 
        ? (explanationLanguage === 'pt' ? 'Correto! Muito bem.' : 
           explanationLanguage === 'en' ? 'Correct! Well done.' : 
           'Правильно! Молодець.')
        : (explanationLanguage === 'pt' ? `Incorreto. A resposta correta é "${exercise.correctAnswer}".` : 
           explanationLanguage === 'en' ? `Incorrect. The correct answer is "${exercise.correctAnswer}".` : 
           `Неправильно. Правильна відповідь "${exercise.correctAnswer}".`)
    });
  }
}