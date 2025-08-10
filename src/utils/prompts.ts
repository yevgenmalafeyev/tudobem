
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
- hint: String simples com dica baseada no tópico (ex: "falar (3ª pessoa)" ou "poder / conseguir")
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
    "hint": "falar (3ª pessoa)",
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

