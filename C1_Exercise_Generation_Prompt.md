# Portuguese C1 Level Exercise Generation Prompt

Generate **10 complete exercises** for each of the following C1 level European Portuguese grammar topics. Each exercise must be a fill-in-the-blank format and include all required components for database import.

## C1 Topics to Generate (10 exercises each):

1. **condicional-preterito** - Condicional pretérito
2. **hipoteses-irreais-passado** - Hipóteses irreais no passado
3. **discurso-direto-indireto-avancado** - Discurso direto e indireto - avançado
4. **gerundio-simples-avancado** - Gerúndio simples - usos avançados
5. **participio-passado** - Particípio passado
6. **infinitivo-pessoal-impessoal** - Infinitivo pessoal vs impessoal
7. **voz-passiva-avancada** - Voz passiva - avançada
8. **colocacao-pronominal-avancada** - Colocação pronominal - avançada
9. **pronomes-pessoais-avancados** - Pronomes pessoais - avançados
10. **regencia-verbal** - Regência verbal
11. **preposicoes-avancadas** - Preposições avançadas
12. **concordancia-avancada** - Concordância avançada
13. **estruturas-enfaticas** - Estruturas enfáticas
14. **frases-complexas** - Frases complexas
15. **subordinadas-temporais** - Subordinadas temporais
16. **subordinadas-causais** - Subordinadas causais
17. **subordinadas-condicionais** - Subordinadas condicionais
18. **subordinadas-concessivas** - Subordinadas concessivas
19. **subordinadas-finais** - Subordinadas finais
20. **subordinadas-consecutivas** - Subordinadas consecutivas

## Required JSON Structure:

For each exercise, generate a complete JSON object with the following exact structure:

```json
{
  "id": null,
  "sentence": "Portuguese sentence with _____ indicating the gap",
  "correctAnswer": "correct answer in Portuguese",
  "topic": "exact-topic-id-from-list-above",
  "level": "C1",
  "hint": "Portuguese hint text (e.g., 'fazer (1ª pessoa singular)' or 'poder / conseguir')",
  "multipleChoiceOptions": [
    "correct answer",
    "distractor 1", 
    "distractor 2",
    "distractor 3"
  ],
  "explanations": {
    "pt": "Detailed explanation in Portuguese explaining why this is correct and quoting the relevant grammar rule",
    "en": "Detailed explanation in English explaining why this is correct and quoting the relevant grammar rule",
    "uk": "Detailed explanation in Ukrainian explaining why this is correct and quoting the relevant grammar rule"
  },
  "difficultyScore": 0.6,
  "usageCount": 0
}
```
- "id" should always be null

## Exercise Creation Guidelines:

### 1. Sentence Construction:
- Use authentic, natural Portuguese suitable for C1 level
- Create realistic, contextual sentences (daily life, work, relationships, etc.)
- Place the gap (\_\_\_) at the position where the answer should go
- Sentences should be 8-20 words long

### 2. Correct Answers:
- Must be grammatically correct for the C1 level
- Should focus on the specific topic's grammar point
- Use appropriate verb forms, pronouns, prepositions, etc.

### 3. Hints:
- Keep hints in Portuguese
- Each hint should contain minimum necessary information to solve the exercise. For example, if the gap should contain a verb and it is not clear from the rest of the sentence which verb that is - the hint should contain the infinitive form of the appropriate verb. If it's unambigously clear which verb is expected the hint shall not contain the verb inifitive
- If the sentence contains clear subject indicators (like "todos", "alguém", "a equipa", "os alunos", "as pessoas", specific names, or definite subject nouns), don't include person information in the hint even if there's no explicit pronoun.
- Only add person information when the subject is truly ambiguous or missing entirely from the sentence.
- If the sentence indirectly tells about in which person the verb is to be used, make sure the hint doesn't contain the person. Only if it's impossible to understand the person to be used from the sentence context - add the person info it to the hint.
- The format of the hint for verbs: "infinitive" or "infinitive (person)" or "infinitive (tense/person)" e.g., "fazer", "fazer (2a pessoa singular)" etc. Avoid mentioning the tense, only add it to the hint if it's absolutely necessary to make solving the task feasible and the sentence doesn't give any indirect data to make the conclusion on what tense shall be used.
- The format of the hint for comparisons: "option1 / option2" e.g., "poder / conseguir"  
- The format of the hint for other topics: brief contextual hint e.g., "preposição contraída"
- If the hint makes it too easy to solve the task, don't add it. For example, the exercise is "Vou _____ cinema com os meus amigos.". For such exercise don't put any hint because it is clear that it should have a preposition for the verb vou - 'a' and the article for the word "cinema" - 'o'. The correct answer is obviously 'a'+'o' = 'ao'. In such case leave the hint empty.

### 4. Multiple Choice Options:
- Always include exactly 4 options except for cases when it is impossible to offer enough somehow plausible distractors
- One of the options should be the correct answer. The correct option must not be always coming first like in the example JSON. Shuffle the correct option's position in the JSON so that it's sometimes 1st, sometimes 2nd, sometimes 3rd and sometimes 4th.
- Create 3 plausible distractors that test common mistakes:
  - Wrong verb form/tense
  - Confusion with similar words
  - Common grammatical errors
- All options should be the same part of speech and fit grammatically

### 5. Explanations:
- Clear grammar explanation for the student learning Portuguese  
- Each explanation should be 2-4 sentences long
- Focus on the specific grammar point of that topic

### 6. Topic-Specific Focus:
- **condicional-preterito**: Past conditional tense usage and formation
- **hipoteses-irreais-passado**: Unreal hypotheses in past contexts
- **discurso-direto-indireto-avancado**: Advanced speech reporting transformations
- **gerundio-simples-avancado**: Advanced gerund uses beyond basic patterns
- **participio-passado**: Past participle forms and agreement rules
- **infinitivo-pessoal-impessoal**: Personal vs impersonal infinitive distinction
- **voz-passiva-avancada**: Advanced passive voice constructions
- **colocacao-pronominal-avancada**: Advanced pronoun placement rules
- **subordinadas**: Various subordinate clause types with appropriate conjunctions and moods

## Output Format:

Provide the complete JSON array containing all 200 exercises (10 per topic × 20 topics):

```json
[
  {
    // Exercise 1 for condicional-preterito
  },
  {
    // Exercise 2 for condicional-preterito  
  },
  // ... continue for all exercises
]
```

## Quality Requirements:
- All Portuguese must be grammatically correct and natural
- Difficulty appropriate for C1 level (advanced)
- Each topic should have varied sentence structures and contexts
- Distractors should be pedagogically useful (test real confusion points)
- Explanations should be clear and educational
- All JSON must be valid and properly formatted

Generate the complete JSON array now.