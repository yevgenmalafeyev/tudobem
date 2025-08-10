#!/usr/bin/env npx tsx

import { LocalDatabase } from '@/lib/localDatabase';
import { EnhancedExercise } from '@/types/enhanced';

const exercisesToImport: EnhancedExercise[] = [
  {
    "id": "7c6c5b7d-6e48-4cc0-87b1-93a815312fa3",
    "sentence": "Ele _____ terminar o projeto antes do prazo, apesar das dificuldades.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "poderá",
      "pôde",
      "conseguiu",
      "conseguia"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para indicar que a pessoa foi capaz de realizar algo com esforço. 'Poder' indica permissão ou possibilidade, enquanto 'conseguir' foca no êxito da ação.",
      "en": "'Conseguir' is used to indicate that someone was able to accomplish something, often with effort. 'Poder' indicates permission or possibility, whereas 'conseguir' emphasizes successful completion.",
      "uk": "Дієслово 'conseguir' вживається, коли йдеться про те, що хтось зміг досягти чогось, часто доклавши зусиль. 'Poder' означає дозвіл або можливість, тоді як 'conseguir' підкреслює успішне виконання."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "4a33a3d7-01d4-4667-bcdd-828047b4f7e0",
    "sentence": "Quando éramos crianças, não _____ sair sozinhos à noite.",
    "correctAnswer": "podíamos",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "podemos",
      "conseguíamos",
      "podíamos",
      "conseguimos"
    ],
    "explanations": {
      "pt": "'Poder' aqui indica permissão. No passado, não tínhamos autorização para sair sozinhos, então 'podíamos' é correto.",
      "en": "Here 'poder' indicates permission. In the past, we did not have permission to go out alone, so 'podíamos' is correct.",
      "uk": "Тут 'poder' вказує на дозвіл. У минулому ми не мали дозволу виходити самі, тому правильним є 'podíamos'."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "0eeb346d-1a2e-40f7-9b21-7f06d50ffb4d",
    "sentence": "Não sei como ele _____ resolver aquele problema tão rápido.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "pôde",
      "conseguiu",
      "poderá",
      "conseguia"
    ],
    "explanations": {
      "pt": "'Conseguir' destaca que ele teve êxito na resolução do problema. 'Poder' indicaria apenas possibilidade, sem garantir sucesso.",
      "en": "'Conseguir' emphasizes that he successfully solved the problem. 'Poder' would only indicate possibility, without guaranteeing success.",
      "uk": "'Conseguir' підкреслює, що він успішно вирішив проблему. 'Poder' лише вказував би на можливість, без гарантії успіху."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "4c26c739-56d7-4d15-93ad-04fd1cfb3ed6",
    "sentence": "Você _____ me ajudar com as malas amanhã de manhã?",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "poderia",
      "pode",
      "conseguiria",
      "consegue"
    ],
    "explanations": {
      "pt": "Neste caso, 'poder' expressa pedido de ajuda, relacionado à permissão ou disponibilidade, não ao êxito.",
      "en": "Here, 'poder' expresses a request for help, related to permission or availability, not success.",
      "uk": "Тут 'poder' виражає прохання про допомогу, пов'язане з дозволом чи готовністю, а не з успіхом."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "b0c9a3b0-19b7-4f18-81e6-b88b6d67a39f",
    "sentence": "Eles só _____ entrar depois que o segurança verificou os documentos.",
    "correctAnswer": "puderam",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "podiam",
      "conseguiram",
      "puderam",
      "conseguiam"
    ],
    "explanations": {
      "pt": "'Puderam' indica que a permissão foi dada após a verificação, e só então foi possível entrar.",
      "en": "'Puderam' indicates that permission was given after verification, and only then they could enter.",
      "uk": "'Puderam' означає, що дозвіл було надано після перевірки, і лише тоді вони змогли увійти."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "4cd0845d-bff7-4b6d-9b4f-22dc844c8c47",
    "sentence": "Depois de meses de treino, ela finalmente _____ correr 10 km sem parar.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "conseguiu",
      "pôde",
      "podemos",
      "conseguia"
    ],
    "explanations": {
      "pt": "'Conseguir' enfatiza que ela alcançou o objetivo de correr 10 km sem parar, algo conquistado com esforço.",
      "en": "'Conseguir' emphasizes that she achieved the goal of running 10 km without stopping, something accomplished with effort.",
      "uk": "'Conseguir' підкреслює, що вона досягла мети пробігти 10 км без зупинки, чого вона досягла завдяки зусиллям."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "19a889a4-f22e-4c36-a93d-b77099c8fbd8",
    "sentence": "Você não _____ estacionar aqui, é proibido.",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "podia",
      "conseguia",
      "pode",
      "consegue"
    ],
    "explanations": {
      "pt": "'Poder' é usado para expressar permissão. Como é proibido, usamos 'não pode'.",
      "en": "'Poder' is used to express permission. Since it is forbidden, we use 'não pode'.",
      "uk": "'Poder' використовується для вираження дозволу. Оскільки це заборонено, ми кажемо 'não pode'."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "d7a8cf48-1d7f-4f18-9f36-2734eeaee853",
    "sentence": "Com este cartão, você _____ sacar dinheiro em qualquer caixa eletrônico.",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "poderá",
      "conseguirá",
      "pode",
      "consegue"
    ],
    "explanations": {
      "pt": "Aqui 'poder' expressa possibilidade ou permissão de sacar dinheiro com o cartão.",
      "en": "Here 'poder' expresses the possibility or permission to withdraw money with the card.",
      "uk": "Тут 'poder' виражає можливість або дозвіл зняти гроші з карткою."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "d29ccfe3-07db-49a2-a4a0-507bf6a5085e",
    "sentence": "Mesmo cansado, ele _____ terminar a maratona.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "poderá",
      "conseguiu",
      "conseguia",
      "pôde"
    ],
    "explanations": {
      "pt": "'Conseguir' mostra que ele alcançou o objetivo apesar do cansaço. É sobre êxito, não permissão.",
      "en": "'Conseguir' shows that he achieved the goal despite being tired. It's about success, not permission.",
      "uk": "'Conseguir' показує, що він досяг мети, незважаючи на втому. Йдеться про успіх, а не дозвіл."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  },
  {
    "id": "94a4a1fc-c9a0-48d7-a450-b4ad3eea5cf5",
    "sentence": "Se você estudar mais, _____ passar no exame.",
    "correctAnswer": "poderá",
    "topic": "poder-conseguir",
    "level": "B1",
    "hint": "poder / conseguir",
    "multipleChoiceOptions": [
      "poderá",
      "consegue",
      "pode",
      "conseguirá"
    ],
    "explanations": {
      "pt": "'Poder' indica possibilidade futura. Se estudar mais, haverá possibilidade de passar.",
      "en": "'Poder' indicates future possibility. If you study more, there will be a chance to pass.",
      "uk": "'Poder' вказує на можливість у майбутньому. Якщо ти більше вчитимешся, буде шанс скласти іспит."
    },
    "difficultyScore": 0.6,
    "usageCount": 0
  }
];

async function importExercises() {
  console.log('🚀 Starting exercise import...');
  
  try {
    // Initialize database tables if needed
    await LocalDatabase.initializeTables();
    console.log('✅ Database tables initialized');

    // Save exercises to database
    const savedIds = await LocalDatabase.saveExerciseBatch(exercisesToImport);
    
    console.log(`✅ Successfully imported ${savedIds.length}/${exercisesToImport.length} exercises`);
    console.log('📋 Imported exercise IDs:', savedIds);
    
    // Verify import by checking database
    const importedExercises = await LocalDatabase.getExercises({
      topics: ['poder-conseguir'],
      levels: ['B1'],
      limit: 20
    });
    
    console.log(`🔍 Verification: Found ${importedExercises.length} 'poder-conseguir' exercises in database`);
    
    // Display sample exercise to verify format
    if (importedExercises.length > 0) {
      const sample = importedExercises[0];
      console.log('\n📝 Sample imported exercise:');
      console.log(`   Sentence: ${sample.sentence}`);
      console.log(`   Answer: ${sample.correctAnswer}`);
      console.log(`   Hint: ${sample.hint}`);
      console.log(`   Options: ${JSON.stringify(sample.multipleChoiceOptions)}`);
      console.log(`   Explanation (PT): ${sample.explanations.pt}`);
    }

  } catch (error) {
    console.error('❌ Error importing exercises:', error);
    process.exit(1);
  }
}

// Run the import
importExercises();