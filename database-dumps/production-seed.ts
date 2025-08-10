#!/usr/bin/env tsx

/**
 * Production Database Seed Script
 * Generated automatically from local database dump
 * Last updated: 2025-08-10T09:13:08.073Z
 */

import { LocalDatabase } from '@/lib/localDatabase';
import { LanguageLevel } from '@/types';
import { EnhancedExercise } from '@/types/enhanced';

const EXERCISES_DATA = [
  {
    "id": "663d9120-457e-4fbe-bb0d-02cd595277d9",
    "sentence": "Quem quer que ___ este documento deve assiná-lo imediatamente.",
    "gapIndex": 14,
    "correctAnswer": "receba",
    "topic": "oracoes-relativas-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "recebesse",
      "receberá",
      "recebe",
      "receba"
    ],
    "explanations": {
      "pt": "Com 'quem quer que' usa-se sempre o conjuntivo por se referir a uma pessoa indefinida.",
      "en": "With 'quem quer que' we always use the subjunctive as it refers to an indefinite person.",
      "uk": "З 'quem quer que' завжди використовуємо суб'юнктив, оскільки йдеться про невизначену особу."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "receber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:17.826Z",
    "updatedAt": "2025-08-09T23:16:44.026Z"
  },
  {
    "id": "8fccc998-6de6-4c88-9b20-1a950905484d",
    "sentence": "Espero que ___ um bom fim de semana em Lisboa.",
    "gapIndex": 11,
    "correctAnswer": "tenhas",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "tens",
      "teres",
      "tenhas",
      "tivesses"
    ],
    "explanations": {
      "pt": "Após 'espero que' usa-se o presente do conjuntivo para expressar desejo ou esperança.",
      "en": "After 'espero que' we use the present subjunctive to express hope or desire.",
      "uk": "Після 'espero que' використовуємо теперішній час суб'юнктиву для вираження надії чи бажання."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "tu",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:17.824Z",
    "updatedAt": "2025-08-09T23:45:27.023Z"
  },
  {
    "id": "4ea81fc1-d216-438b-bf09-41df8a8b2111",
    "sentence": "O relatório ___ ser entregue até amanhã ao meio-dia.",
    "gapIndex": 12,
    "correctAnswer": "tem de",
    "topic": "dever-ter-de",
    "level": "B1",
    "multipleChoiceOptions": [
      "tem de",
      "deve",
      "teria de",
      "há de"
    ],
    "explanations": {
      "pt": "'Ter de' expressa uma obrigação mais forte e inevitável que 'dever'.",
      "en": "'Ter de' expresses a stronger, non-negotiable obligation compared to 'dever'.",
      "uk": "'Ter de' виражає сильніше, безумовне зобов'язання порівняно з 'dever'."
    },
    "hint": {
      "focus": "strict requirement",
      "concept": "obligation expression"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:17.822Z",
    "updatedAt": "2025-07-26T15:16:17.822Z"
  },
  {
    "id": "045dc384-d4f2-461e-a428-ed27ad9571cc",
    "sentence": "Quando ___ a Lisboa, vou visitar o Mosteiro dos Jerónimos.",
    "gapIndex": 7,
    "correctAnswer": "for",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "vá",
      "irei",
      "vou",
      "for"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'quando' (when) referring to the future, we use the future subjunctive.",
      "uk": "З 'quando' (коли), що відноситься до майбутнього, ми використовуємо майбутній час суб'юнктива."
    },
    "hint": {
      "form": "futuro do conjuntivo",
      "infinitive": "ir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:11.024Z",
    "updatedAt": "2025-07-26T15:16:11.024Z"
  },
  {
    "id": "957b3f7c-020a-4c0f-a6d8-c0e24e6649de",
    "sentence": "É fundamental que ___ as regras do jogo antes de começar.",
    "gapIndex": 18,
    "correctAnswer": "saibamos",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "soubemos",
      "sabermos",
      "sabemos",
      "saibamos"
    ],
    "explanations": {
      "pt": "Após 'é fundamental que', usamos o presente do conjuntivo para expressar necessidade.",
      "en": "After 'é fundamental que' (it is fundamental that), we use the present subjunctive to express necessity.",
      "uk": "Після 'é fundamental que' (важливо, щоб) ми використовуємо теперішній час суб'юнктива для вираження необхідності."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:11.023Z",
    "updatedAt": "2025-07-26T15:16:11.023Z"
  },
  {
    "id": "355f980a-00c3-4b9c-9ddd-287880488dfb",
    "sentence": "Não ___ terminar o trabalho ontem porque estava doente.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "podia",
      "pude",
      "consegui"
    ],
    "explanations": {
      "pt": "'Conseguir' indica capacidade física ou logística de realizar algo, enquanto 'poder' indica permissão ou possibilidade.",
      "en": "'Conseguir' indicates physical or logistical ability to do something, while 'poder' indicates permission or possibility.",
      "uk": "'Conseguir' вказує на фізичну або логістичну здатність щось зробити, тоді як 'poder' вказує на дозвіл або можливість."
    },
    "hint": {
      "form": "preterite indicative",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:11.020Z",
    "updatedAt": "2025-08-09T23:45:27.029Z"
  },
  {
    "id": "8b759cb4-519d-4f2e-b3cb-a4779daa1e93",
    "sentence": "Por mais que eu ___ estudar português, ainda cometo erros.",
    "gapIndex": 16,
    "correctAnswer": "tenha",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tiver",
      "tinha",
      "ter"
    ],
    "explanations": {
      "pt": "Após 'por mais que', usamos sempre o presente do conjuntivo para expressar uma concessão no presente.",
      "en": "After 'por mais que' (no matter how much), we always use the present subjunctive to express a present concession.",
      "uk": "Після 'por mais que' (як би не) ми завжди використовуємо теперішній час суб'юнктива для вираження поступки в теперішньому часі."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:11.013Z",
    "updatedAt": "2025-07-26T15:16:11.013Z"
  },
  {
    "id": "7ffbb794-2356-41b3-8a97-b69f493965bf",
    "sentence": "___ alguém que fale chinês nesta empresa?",
    "gapIndex": 0,
    "correctAnswer": "Conheces",
    "topic": "saber-conhecer",
    "level": "B1",
    "multipleChoiceOptions": [
      "Conheces",
      "Sabes",
      "Tens",
      "Podes"
    ],
    "explanations": {
      "pt": "'Conhecer' refere-se a estar familiarizado com pessoas.",
      "en": "'Conhecer' refers to being acquainted with people.",
      "uk": "'Conhecer' означає бути знайомим з людьми."
    },
    "hint": {
      "person": "tu",
      "infinitive": "conhecer"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.293Z",
    "updatedAt": "2025-08-09T23:45:27.029Z"
  },
  {
    "id": "6161e80d-7616-46be-ae60-01f4c9fde0bb",
    "sentence": "Quero que tu ___ cá amanhã cedo.",
    "gapIndex": 13,
    "correctAnswer": "estejas",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "estejas",
      "estás",
      "estarás",
      "estivesses"
    ],
    "explanations": {
      "pt": "Após 'querer que', usamos o presente do conjuntivo para expressar desejo.",
      "en": "After 'querer que', we use present subjunctive to express desire.",
      "uk": "Після 'querer que' вживається теперішній час суб'юнктива для вираження бажання."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.292Z",
    "updatedAt": "2025-08-09T23:16:44.039Z"
  },
  {
    "id": "783acb00-28b9-42cf-9ea4-5e24e6bff4a7",
    "sentence": "O relatório ___ entregue ao diretor ontem.",
    "gapIndex": 12,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "estava",
      "seria",
      "foi",
      "tinha"
    ],
    "explanations": {
      "pt": "Na voz passiva no pretérito perfeito, usamos 'foi' + particípio passado.",
      "en": "In passive voice in simple past, we use 'foi' + past participle.",
      "uk": "У пасивному стані в минулому часі використовуємо 'foi' + дієприкметник минулого часу."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.292Z",
    "updatedAt": "2025-07-26T08:07:03.292Z"
  },
  {
    "id": "efb26096-44bd-4aa9-9d8a-484a5b8aea1e",
    "sentence": "Embora ___ chover, vamos fazer o piquenique.",
    "gapIndex": 7,
    "correctAnswer": "possa",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "pudesse",
      "poderá",
      "pode",
      "possa"
    ],
    "explanations": {
      "pt": "'Embora' exige o presente do conjuntivo para expressar uma possibilidade no presente.",
      "en": "'Embora' requires present subjunctive to express a present possibility.",
      "uk": "Після 'embora' вживається теперішній час суб'юнктива для вираження теперішньої можливості."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "poder"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.291Z",
    "updatedAt": "2025-08-09T23:16:44.041Z"
  },
  {
    "id": "2909fbbc-6aa7-4823-8d1c-8ac542606731",
    "sentence": "Não ___ falar com ela por causa do barulho.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "podia",
      "pude",
      "consigo",
      "consegui"
    ],
    "explanations": {
      "pt": "'Conseguir' indica capacidade ou êxito numa tentativa específica.",
      "en": "'Conseguir' indicates ability or success in a specific attempt.",
      "uk": "'Conseguir' вказує на здатність або успіх у конкретній спробі."
    },
    "hint": {
      "form": "preterite indicative",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.290Z",
    "updatedAt": "2025-08-09T23:45:27.029Z"
  },
  {
    "id": "4b5b4572-1b7e-4fb7-ae08-6b75838476e0",
    "sentence": "Se eu ___ mais tempo, teria ido à festa.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tiver",
      "tinha",
      "tivesse"
    ],
    "explanations": {
      "pt": "Em condicionais irreais no passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal conditional sentences about the past, we use the imperfect subjunctive after 'se'.",
      "uk": "У нереальних умовних реченнях про минуле після 'se' вживається імперфект суб'юнктива."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.289Z",
    "updatedAt": "2025-08-09T23:16:44.042Z"
  },
  {
    "id": "9a0ef98f-8bc8-453c-9193-4a42cb64f43a",
    "sentence": "A pessoa ___ livro estou a ler é portuguesa.",
    "gapIndex": 9,
    "correctAnswer": "cujo",
    "topic": "pronomes-relativos",
    "level": "B1",
    "multipleChoiceOptions": [
      "cujo",
      "que",
      "qual",
      "onde"
    ],
    "explanations": {
      "pt": "'Cujo' é usado para indicar posse e concorda em género e número com o objeto possuído.",
      "en": "'Cujo' is used to indicate possession and agrees in gender and number with the possessed object.",
      "uk": "'Cujo' використовується для позначення володіння і узгоджується в роді та числі з об'єктом володіння."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.977Z",
    "updatedAt": "2025-07-26T08:07:02.977Z"
  },
  {
    "id": "6e5d5247-6065-4f64-958f-9750a56f6310",
    "sentence": "É possível que ela já ___ chegado a casa.",
    "gapIndex": 22,
    "correctAnswer": "tenha",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tem",
      "tinha",
      "tiver"
    ],
    "explanations": {
      "pt": "Após expressões de possibilidade, usamos o pretérito perfeito composto do conjuntivo.",
      "en": "After expressions of possibility, we use the present perfect subjunctive.",
      "uk": "Після виразів можливості ми використовуємо складений перфект кон'юнктива."
    },
    "hint": {
      "form": "present perfect subjunctive",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.976Z",
    "updatedAt": "2025-08-09T23:16:44.043Z"
  },
  {
    "id": "68d1f846-39ab-4bf1-b1f3-66ed7caa1b8d",
    "sentence": "Quando ___ a Lisboa, visitarei o Mosteiro dos Jerónimos.",
    "gapIndex": 7,
    "correctAnswer": "vier",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "vem",
      "venho",
      "viria",
      "vier"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'quando' referring to the future, we use the future subjunctive.",
      "uk": "З 'quando', що відноситься до майбутнього, ми використовуємо майбутній час кон'юнктива."
    },
    "hint": {
      "form": "future subjunctive",
      "infinitive": "vir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.976Z",
    "updatedAt": "2025-08-09T23:16:44.043Z"
  },
  {
    "id": "a852177a-0100-4e92-b72b-905fb8e9ddd5",
    "sentence": "O documento ___ entregue ao diretor esta manhã.",
    "gapIndex": 12,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B2",
    "multipleChoiceOptions": [
      "estava",
      "tem",
      "foi",
      "seria"
    ],
    "explanations": {
      "pt": "Na voz passiva, usamos o verbo 'ser' no tempo adequado + particípio passado.",
      "en": "In passive voice, we use the verb 'ser' in the appropriate tense + past participle.",
      "uk": "У пасивному стані ми використовуємо дієслово 'ser' у відповідному часі + дієприкметник минулого часу."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.975Z",
    "updatedAt": "2025-07-26T08:07:02.975Z"
  },
  {
    "id": "2110e36b-92d5-406c-84d0-ace8b6951cfa",
    "sentence": "Espero que ___ resolver este problema sozinho.",
    "gapIndex": 11,
    "correctAnswer": "consigas",
    "topic": "presente-conjuntivo-regulares",
    "level": "B1",
    "multipleChoiceOptions": [
      "consegues",
      "podes",
      "consigas"
    ],
    "explanations": {
      "pt": "Após 'espero que', usamos o presente do conjuntivo para expressar desejo ou esperança.",
      "en": "After 'espero que', we use the present subjunctive to express wish or hope.",
      "uk": "Після 'espero que' ми використовуємо теперішній час кон'юнктива для вираження бажання або надії."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "tu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.975Z",
    "updatedAt": "2025-08-09T23:45:27.029Z"
  },
  {
    "id": "4cee74cf-a3fb-4c85-9173-4253270d91dc",
    "sentence": "Se ___ que ele estava doente, teria levado medicamentos.",
    "gapIndex": 3,
    "correctAnswer": "soubesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "soube",
      "saberia",
      "sabia",
      "soubesse"
    ],
    "explanations": {
      "pt": "Em condicionais irreais no passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal conditionals in the past, we use the imperfect subjunctive after 'se'.",
      "uk": "У нереальних умовних реченнях минулого часу ми використовуємо імперфект кон'юнктива після 'se'."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.974Z",
    "updatedAt": "2025-08-09T23:16:44.044Z"
  },
  {
    "id": "ef8802e6-e6f7-4440-9d68-fe7c42b8a023",
    "sentence": "Não ___ ir à festa porque estou doente.",
    "gapIndex": 4,
    "correctAnswer": "posso",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "posso",
      "sei",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'poder' para expressar impossibilidade por circunstâncias externas ou permissão.",
      "en": "We use 'poder' to express impossibility due to external circumstances or permission.",
      "uk": "Ми використовуємо 'poder', щоб висловити неможливість через зовнішні обставини або дозвіл."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.971Z",
    "updatedAt": "2025-07-26T08:07:02.971Z"
  },
  {
    "id": "ce158a34-ca32-449e-8648-ca9d1ed2faed",
    "sentence": "Tomara que ___ tudo bem no exame!",
    "gapIndex": 11,
    "correctAnswer": "corra",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "corria",
      "corra",
      "corre",
      "correr"
    ],
    "explanations": {
      "pt": "Após 'tomara que', expressando desejo, usa-se o presente do conjuntivo.",
      "en": "After 'tomara que', expressing wish, we use the present subjunctive.",
      "uk": "Після 'tomara que', що виражає бажання, ми використовуємо теперішній час умовного способу."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "correr"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.427Z",
    "updatedAt": "2025-08-09T23:16:44.045Z"
  },
  {
    "id": "95c2834b-8d69-4308-adc2-7cc6a64e8797",
    "sentence": "O documento ___ enviado pelo correio na semana passada.",
    "gapIndex": 12,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "foi",
      "era",
      "tinha sido",
      "seria"
    ],
    "explanations": {
      "pt": "Na voz passiva no pretérito perfeito, usamos 'foi' + particípio passado.",
      "en": "In the passive voice in the simple past, we use 'foi' + past participle.",
      "uk": "У пасивному стані в минулому часі ми використовуємо 'foi' + дієприкметник минулого часу."
    },
    "hint": {
      "tense": "past",
      "voice": "passive"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.427Z",
    "updatedAt": "2025-07-26T08:05:35.427Z"
  },
  {
    "id": "2b7a8cfe-a3bf-4fc2-8d84-9940d8de51c8",
    "sentence": "Assim que ___ o trabalho, envio-te uma mensagem.",
    "gapIndex": 10,
    "correctAnswer": "terminar",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "termine",
      "terminei",
      "terminasse",
      "terminar"
    ],
    "explanations": {
      "pt": "Com 'assim que' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'assim que' referring to the future, we use the future subjunctive.",
      "uk": "З 'assim que', що відноситься до майбутнього, ми використовуємо майбутній час умовного способу."
    },
    "hint": {
      "context": "future time",
      "conjunction": "assim que"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.426Z",
    "updatedAt": "2025-07-26T08:05:35.426Z"
  },
  {
    "id": "3f3a2f0c-e3bb-4da7-9c17-0b0b7a75597f",
    "sentence": "Se ___ que ela estivesse doente, teria ligado antes.",
    "gapIndex": 3,
    "correctAnswer": "tivesse sabido",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "soubesse",
      "tivesse sabido",
      "sabia",
      "tinha sabido"
    ],
    "explanations": {
      "pt": "O mais-que-perfeito composto do conjuntivo é usado em condições irreais no passado.",
      "en": "The compound pluperfect subjunctive is used in unreal conditions in the past.",
      "uk": "Складений плюсквамперфект умовного способу використовується в нереальних умовах у минулому."
    },
    "hint": {
      "form": "pluperfect subjunctive",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.425Z",
    "updatedAt": "2025-08-09T23:17:09.298Z"
  },
  {
    "id": "1fe74c96-8b13-4ad6-bd31-63451908ff14",
    "sentence": "Quando ___ a verdade, fiquei muito surpreendido.",
    "gapIndex": 7,
    "correctAnswer": "soube",
    "topic": "saber-conhecer",
    "level": "B2",
    "multipleChoiceOptions": [
      "soube",
      "sabia",
      "conheci",
      "conhecia"
    ],
    "explanations": {
      "pt": "Usamos 'saber' quando nos referimos ao momento em que tomamos conhecimento de uma informação.",
      "en": "We use 'saber' when referring to the moment we learn or find out information.",
      "uk": "Ми використовуємо 'saber', коли говоримо про момент, коли ми дізнаємося інформацію."
    },
    "hint": {
      "form": "pretérito perfeito",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.425Z",
    "updatedAt": "2025-08-09T23:17:09.301Z"
  },
  {
    "id": "901277e6-386f-4587-9f05-e14ba72da9b8",
    "sentence": "Não ___ fazer o trabalho porque estava doente.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consegui",
      "pude",
      "podia",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar capacidade física ou prática de realizar algo, especialmente quando há um impedimento concreto.",
      "en": "We use 'conseguir' to express physical or practical ability, especially when there's a concrete impediment (like illness).",
      "uk": "Ми використовуємо 'conseguir' для вираження фізичної або практичної здатності, особливо коли є конкретна перешкода (як хвороба)."
    },
    "hint": {
      "form": "pretérito perfeito",
      "person": "1st person singular"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.424Z",
    "updatedAt": "2025-08-09T23:17:09.302Z"
  },
  {
    "id": "983d501e-676f-488c-ab4a-7a4487f8bf79",
    "sentence": "___ pessoas ainda não entregaram os documentos.",
    "gapIndex": 0,
    "correctAnswer": "Algumas",
    "topic": "pronomes-indefinidos",
    "level": "B1",
    "multipleChoiceOptions": [
      "Nenhumas",
      "Quaisquer",
      "Algumas",
      "Todos"
    ],
    "explanations": {
      "pt": "'Algumas' indica uma quantidade parcial indefinida de pessoas.",
      "en": "'Algumas' indicates an indefinite partial quantity of people.",
      "uk": "'Algumas' вказує на невизначену часткову кількість людей."
    },
    "hint": {
      "type": "indefinite pronoun",
      "quantity": "partial"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.553Z",
    "updatedAt": "2025-07-26T08:05:34.553Z"
  },
  {
    "id": "154d3645-cf1d-4be5-ba85-495e1c12b8ac",
    "sentence": "A carta ___ escrita pelo diretor ontem.",
    "gapIndex": 8,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "seria",
      "está",
      "era",
      "foi"
    ],
    "explanations": {
      "pt": "Na voz passiva no pretérito perfeito, usamos 'foi' + particípio passado.",
      "en": "In the passive voice in the simple past, we use 'foi' + past participle.",
      "uk": "У пасивному стані в минулому часі ми використовуємо 'foi' + дієприкметник минулого часу."
    },
    "hint": {
      "form": "passive voice - pretérito perfeito",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.552Z",
    "updatedAt": "2025-08-09T23:17:09.303Z"
  },
  {
    "id": "e07c4acb-1c4a-4e54-81d3-967b1d809890",
    "sentence": "Quando ___ o trabalho, avisa-me.",
    "gapIndex": 7,
    "correctAnswer": "acabares",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "acabaste",
      "acabarás",
      "acabas",
      "acabares"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'quando' referring to the future, we use future subjunctive.",
      "uk": "З 'quando', що стосується майбутнього, використовуємо майбутній час суб'юнктива."
    },
    "hint": {
      "form": "future subjunctive",
      "person": "tu",
      "infinitive": "acabar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.551Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "1670cb87-578e-43dd-8b5c-03f35f8b0586",
    "sentence": "O relatório ___ ser entregue até amanhã.",
    "gapIndex": 12,
    "correctAnswer": "tem de",
    "topic": "dever-ter-de",
    "level": "B1",
    "multipleChoiceOptions": [
      "precisa de",
      "deve",
      "tem de",
      "há de"
    ],
    "explanations": {
      "pt": "'Ter de' exprime uma obrigação mais forte e inevitável do que 'dever'.",
      "en": "'Ter de' expresses a stronger and more unavoidable obligation than 'dever'.",
      "uk": "'Ter de' виражає сильніше та неминуче зобов'язання порівняно з 'dever'."
    },
    "hint": {
      "context": "obligation",
      "distinction": "dever vs ter de"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.547Z",
    "updatedAt": "2025-07-26T08:05:34.547Z"
  },
  {
    "id": "abe5d7ad-a6dc-4654-b46e-398701132c83",
    "sentence": "Embora ele ___ que está errado, continua a insistir.",
    "gapIndex": 11,
    "correctAnswer": "saiba",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "sabe",
      "soubesse",
      "saiba",
      "conheça"
    ],
    "explanations": {
      "pt": "Após 'embora', usamos o presente do conjuntivo para expressar uma concessão no presente.",
      "en": "After 'embora' (although), we use the present subjunctive to express a present concession.",
      "uk": "Після 'embora' (хоча) ми використовуємо теперішній час суб'єктивного способу для вираження поступки в теперішньому часі."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.544Z",
    "updatedAt": "2025-08-09T23:17:09.304Z"
  },
  {
    "id": "1fb5a19b-f3a1-42d1-a1d4-e1ca1fa3abe5",
    "sentence": "Não ___ dormir por causa do barulho.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consegui",
      "pude",
      "podia",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar uma capacidade específica que não foi alcançada devido a um impedimento concreto.",
      "en": "We use 'conseguir' to express a specific ability that wasn't achieved due to a concrete impediment.",
      "uk": "Ми використовуємо 'conseguir' для вираження конкретної здатності, яка не була досягнута через певну перешкоду."
    },
    "hint": {
      "form": "pretérito perfeito",
      "person": "1st person singular"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.542Z",
    "updatedAt": "2025-08-09T23:17:09.304Z"
  },
  {
    "id": "17313336-39a0-4daf-a701-2df11cda51a9",
    "sentence": "Procuro uma casa ___ tenha vista para o mar.",
    "gapIndex": 17,
    "correctAnswer": "que",
    "topic": "oracoes-relativas-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "que",
      "qual",
      "cuja",
      "onde"
    ],
    "explanations": {
      "pt": "Nas orações relativas com conjuntivo, usamos 'que' para expressar desejo ou busca.",
      "en": "In relative clauses with subjunctive, we use 'que' to express desire or search.",
      "uk": "У відносних реченнях з кон'юнктивом використовуємо 'que' для вираження бажання чи пошуку."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.785Z",
    "updatedAt": "2025-07-26T08:05:31.785Z"
  },
  {
    "id": "d1eb907e-c653-4561-be5c-277dacf2de50",
    "sentence": "___ quer que seja, não pode entrar sem identificação.",
    "gapIndex": 0,
    "correctAnswer": "Quem",
    "topic": "pronomes-indefinidos",
    "level": "B1",
    "multipleChoiceOptions": [
      "Quem",
      "Qual",
      "Que",
      "Cujo"
    ],
    "explanations": {
      "pt": "'Quem quer que' é uma expressão indefinida que significa 'qualquer pessoa que'.",
      "en": "'Quem quer que' is an indefinite expression meaning 'whoever'.",
      "uk": "'Quem quer que' - це неозначений вираз, що означає 'хто б не'."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.785Z",
    "updatedAt": "2025-07-26T08:05:31.785Z"
  },
  {
    "id": "23ee0ec5-fc8a-4011-9263-35d44c1e4467",
    "sentence": "Duvido que ele ___ conseguido terminar o projeto a tempo.",
    "gapIndex": 15,
    "correctAnswer": "tenha",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "teve",
      "tivesse",
      "tem"
    ],
    "explanations": {
      "pt": "Após 'duvidar que', usamos o pretérito perfeito composto do conjuntivo.",
      "en": "After 'duvidar que', we use the present perfect subjunctive.",
      "uk": "Після 'duvidar que' використовуємо складений перфект кон'юнктива."
    },
    "hint": {
      "form": "present perfect subjunctive",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.784Z",
    "updatedAt": "2025-08-09T23:17:09.305Z"
  },
  {
    "id": "5d71b742-357d-42e1-89d6-d7eef9cd3d46",
    "sentence": "Quando ___ o relatório, enviarei por email.",
    "gapIndex": 7,
    "correctAnswer": "tiver",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenho",
      "tiver",
      "tivesse",
      "ter"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'quando' referring to the future, we use the future subjunctive.",
      "uk": "З 'quando', що стосується майбутнього, використовуємо майбутній час кон'юнктива."
    },
    "hint": {
      "form": "future subjunctive",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.784Z",
    "updatedAt": "2025-08-09T23:17:09.305Z"
  },
  {
    "id": "31d98f1a-66f1-42a0-a3d1-7a9b6c7c5de6",
    "sentence": "Esta carta ___ escrita pelo diretor ontem.",
    "gapIndex": 11,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "era",
      "estava",
      "foi",
      "tinha"
    ],
    "explanations": {
      "pt": "Na voz passiva com ação concluída, usamos 'ser' no pretérito perfeito.",
      "en": "In passive voice for completed actions, we use 'ser' in simple past.",
      "uk": "У пасивному стані для завершених дій використовуємо 'ser' у простому минулому часі."
    },
    "hint": {
      "form": "passive voice - pretérito perfeito",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.783Z",
    "updatedAt": "2025-08-09T23:17:09.305Z"
  },
  {
    "id": "e31a3167-87f8-4ad2-a739-ac5c9359bafe",
    "sentence": "Não ___ trabalhar hoje porque estou doente.",
    "gapIndex": 4,
    "correctAnswer": "consigo",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "posso",
      "devo",
      "sei"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar capacidade física ou mental específica, não permissão.",
      "en": "We use 'conseguir' to express specific physical or mental ability, not permission.",
      "uk": "Ми використовуємо 'conseguir' для вираження конкретної фізичної або розумової здатності, а не дозволу."
    },
    "hint": {
      "form": "present indicative",
      "person": "1st person singular"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.781Z",
    "updatedAt": "2025-08-09T23:17:09.306Z"
  },
  {
    "id": "0092846f-f2d7-400e-a980-550d9fc49cf1",
    "sentence": "Se eu ___ mais tempo, teria acabado o trabalho.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tivesse",
      "tinha",
      "tiver"
    ],
    "explanations": {
      "pt": "Em condições irreais no passado, usa-se o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal past conditions, we use the imperfect subjunctive after 'se'.",
      "uk": "У нереальних умовах минулого після 'se' використовуємо імперфект суб'юнктива."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-09T23:17:09.306Z"
  },
  {
    "id": "de9e7f82-cf7d-4094-9da5-bfa5949380ae",
    "sentence": "___ me disseram que o restaurante fechou.",
    "gapIndex": 0,
    "correctAnswer": "Disseram-",
    "topic": "colocacao-pronominal",
    "level": "B2",
    "multipleChoiceOptions": [
      "Disseram-",
      "Me disseram",
      "Disseram me",
      "-Me disseram"
    ],
    "explanations": {
      "pt": "No início da frase, o pronome deve ser enclítico (após o verbo com hífen).",
      "en": "At the beginning of a sentence, the pronoun must be enclitic (after the verb with hyphen).",
      "uk": "На початку речення займенник має бути енклітичним (після дієслова з дефісом)."
    },
    "hint": {
      "form": "pretérito perfeito",
      "infinitive": "dizer"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-09T23:17:09.307Z"
  },
  {
    "id": "d369d7a5-bc7d-45d1-b048-13eaef30517a",
    "sentence": "Quando ___ promover um evento, avise-nos com antecedência.",
    "gapIndex": 7,
    "correctAnswer": "quiser",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "quer",
      "quereria",
      "queira",
      "quiser"
    ],
    "explanations": {
      "pt": "Após 'quando' referindo-se ao futuro, usa-se o futuro do conjuntivo.",
      "en": "After 'quando' referring to the future, we use the future subjunctive.",
      "uk": "Після 'quando', що стосується майбутнього, використовуємо майбутній час суб'юнктива."
    },
    "hint": {
      "form": "future subjunctive",
      "infinitive": "querer"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-09T23:17:09.307Z"
  },
  {
    "id": "faf83bb9-9658-4e4c-9044-43040a6d5f00",
    "sentence": "A declaração ___ ser entregue até amanhã.",
    "gapIndex": 13,
    "correctAnswer": "tem de",
    "topic": "dever-ter-de",
    "level": "B1",
    "multipleChoiceOptions": [
      "tem de",
      "deve",
      "há de",
      "precise de"
    ],
    "explanations": {
      "pt": "'Ter de' expressa uma obrigação absoluta, mais forte que 'dever', que sugere recomendação.",
      "en": "'Ter de' expresses absolute obligation, stronger than 'dever', which suggests recommendation.",
      "uk": "'Ter de' виражає абсолютне зобов'язання, сильніше ніж 'dever', який передає рекомендацію."
    },
    "hint": {
      "context": "strict obligation",
      "formality": "neutral"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.229Z",
    "updatedAt": "2025-07-26T08:05:31.229Z"
  },
  {
    "id": "66376e9c-475a-40a3-91dd-02185ec327ed",
    "sentence": "Duvido que ela ___ a verdade sobre o acontecimento.",
    "gapIndex": 15,
    "correctAnswer": "saiba",
    "topic": "saber-conhecer",
    "level": "B2",
    "multipleChoiceOptions": [
      "saiba",
      "conheça",
      "conhece",
      "sabe"
    ],
    "explanations": {
      "pt": "'Saber' é usado para conhecimento de informações específicas, e 'duvidar' exige o conjuntivo.",
      "en": "'Saber' is used for knowledge of specific information, and 'duvidar' requires the subjunctive.",
      "uk": "'Saber' використовується для знання конкретної інформації, а після 'duvidar' вживається суб'юнктив."
    },
    "hint": {
      "mood": "present subjunctive",
      "context": "knowledge of facts"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.229Z",
    "updatedAt": "2025-07-26T08:05:31.229Z"
  },
  {
    "id": "f3b68d0e-b1d6-43a1-9084-3b8d5b7625c6",
    "sentence": "Não ___ abrir a porta porque estava trancada.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "consegui",
      "pude",
      "podia"
    ],
    "explanations": {
      "pt": "'Conseguir' indica uma tentativa real que falhou, enquanto 'poder' indicaria apenas possibilidade teórica.",
      "en": "'Conseguir' is used here because it indicates an actual attempt that failed, rather than theoretical possibility.",
      "uk": "'Conseguir' вказує на реальну спробу, яка не вдалася, а не на теоретичну можливість."
    },
    "hint": {
      "form": "pretérito perfeito",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.228Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "0f6a9ae9-b478-48f2-be76-4821b942720d",
    "sentence": "Espero que ___ resolver o problema sozinha.",
    "gapIndex": 11,
    "correctAnswer": "consigas",
    "topic": "verbos-opiniao-sentimento",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigas",
      "consegues",
      "conseguires",
      "conseguir"
    ],
    "explanations": {
      "pt": "Após 'espero que', usamos o presente do conjuntivo para expressar desejo ou esperança.",
      "en": "After 'espero que' (I hope that), we use the present subjunctive to express wish or hope.",
      "uk": "Після 'espero que' (я сподіваюся, що) ми використовуємо теперішній час суб'єктивного способу для вираження бажання або надії."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "person": "tu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.143Z",
    "updatedAt": "2025-08-09T23:45:27.036Z"
  },
  {
    "id": "fd4b9622-f115-40a0-be34-d442a81fdbfa",
    "sentence": "Se ___ mais cedo, teríamos apanhado o comboio.",
    "gapIndex": 3,
    "correctAnswer": "tivéssemos saído",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tínhamos saído",
      "tivéssemos saído",
      "saíssemos",
      "teríamos saído"
    ],
    "explanations": {
      "pt": "Em condições irreais no passado, usamos o mais-que-perfeito do conjuntivo na condição.",
      "en": "For unreal past conditions, we use the pluperfect subjunctive in the if-clause.",
      "uk": "Для нереальних умов у минулому використовуємо давноминулий час суб'юнктиву в умовному реченні."
    },
    "hint": {
      "form": "pretérito mais-que-perfeito do conjuntivo",
      "person": "nós",
      "infinitive": "ter + saído"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.143Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "71b691b3-7f71-4ef2-a5f7-e43e3240ccb6",
    "sentence": "O relatório ___ enviado ao diretor amanhã.",
    "gapIndex": 12,
    "correctAnswer": "será",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "seria",
      "será",
      "foi",
      "é"
    ],
    "explanations": {
      "pt": "Na voz passiva no futuro, usamos 'ser' no futuro + particípio passado.",
      "en": "In the passive voice future, we use 'ser' in the future tense + past participle.",
      "uk": "У пасивному стані майбутнього часу ми використовуємо 'ser' у майбутньому часі + дієприкметник минулого часу."
    },
    "hint": {
      "form": "futuro do indicativo",
      "person": "ele/ela",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.142Z",
    "updatedAt": "2025-08-09T23:45:27.036Z"
  },
  {
    "id": "8254dd59-1e3b-4942-a1e8-1a2258a08165",
    "sentence": "Embora ___ muito trabalho, vou ajudar-te.",
    "gapIndex": 7,
    "correctAnswer": "tenha",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tinha",
      "tem",
      "tiver"
    ],
    "explanations": {
      "pt": "Após 'embora', usamos o presente do conjuntivo para expressar uma concessão no presente.",
      "en": "After 'embora' (although), we use the present subjunctive to express a concession in the present.",
      "uk": "Після 'embora' (хоча) ми використовуємо теперішній час суб'єктивного способу для вираження поступки."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "person": "eu",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.141Z",
    "updatedAt": "2025-08-09T23:45:27.025Z"
  },
  {
    "id": "2839ae11-a032-4c6f-ac13-7ae08bce21da",
    "sentence": "Quando ___ a verdade, fiquei muito desiludido.",
    "gapIndex": 7,
    "correctAnswer": "soube",
    "topic": "saber-conhecer",
    "level": "B2",
    "multipleChoiceOptions": [
      "conhecia",
      "sabia",
      "conheci",
      "soube"
    ],
    "explanations": {
      "pt": "'Saber' é usado para indicar o momento em que se toma conhecimento de uma informação.",
      "en": "'Saber' is used to indicate the moment of learning or finding out information.",
      "uk": "'Saber' використовується для позначення моменту, коли дізнаєшся інформацію."
    },
    "hint": {
      "form": "pretérito perfeito",
      "person": "eu",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.140Z",
    "updatedAt": "2025-08-09T23:45:27.026Z"
  },
  {
    "id": "c2ae8aff-2dab-465f-86f5-09cdf1a6f5bc",
    "sentence": "Não ___ ir à reunião hoje porque estou doente.",
    "gapIndex": 4,
    "correctAnswer": "posso",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "posso",
      "devo",
      "sei"
    ],
    "explanations": {
      "pt": "Usamos 'poder' para expressar impossibilidade devido a circunstâncias externas ou permissão.",
      "en": "We use 'poder' to express impossibility due to external circumstances or permission, not physical ability.",
      "uk": "Ми використовуємо 'poder' для вираження неможливості через зовнішні обставини або дозвіл."
    },
    "hint": {
      "context": "physical/circumstantial inability",
      "distinction": "poder vs conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.137Z",
    "updatedAt": "2025-07-26T08:05:31.137Z"
  },
  {
    "id": "0933d63b-e8f4-4e70-967f-89dfa2eef09a",
    "sentence": "Espero que vocês ___ um bom fim de semana.",
    "gapIndex": 17,
    "correctAnswer": "tenham",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "terão",
      "tenham",
      "têm",
      "tiveram"
    ],
    "explanations": {
      "pt": "Após 'espero que' usamos o presente do conjuntivo.",
      "en": "After 'espero que' (I hope that) we use the present subjunctive.",
      "uk": "Після 'espero que' (я сподіваюся, що) використовуємо теперішній час кон'юнктива."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "person": "eles/elas",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.223Z",
    "updatedAt": "2025-08-09T23:45:27.028Z"
  },
  {
    "id": "ccccfa12-58e0-4299-889c-116da40b7669",
    "sentence": "___ alunos fizeram o exame hoje.",
    "gapIndex": 0,
    "correctAnswer": "Alguns",
    "topic": "pronomes-indefinidos",
    "level": "B1",
    "multipleChoiceOptions": [
      "Alguns",
      "Qualquer",
      "Todo",
      "Cada"
    ],
    "explanations": {
      "pt": "Usamos 'alguns' para indicar uma quantidade indefinida no plural.",
      "en": "We use 'alguns' (some) to indicate an indefinite plural quantity.",
      "uk": "Ми використовуємо 'alguns' (деякі) для позначення невизначеної кількості у множині."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.223Z",
    "updatedAt": "2025-07-25T14:59:25.223Z"
  },
  {
    "id": "a8e48b10-fe9a-4505-85af-b81b5c5f38a2",
    "sentence": "O relatório ___ entregue ao diretor amanhã.",
    "gapIndex": 12,
    "correctAnswer": "será",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "será",
      "estará",
      "vai ser",
      "é"
    ],
    "explanations": {
      "pt": "Na voz passiva com futuro, usamos 'ser' no futuro + particípio passado.",
      "en": "In passive voice for future actions, we use future tense of 'ser' + past participle.",
      "uk": "У пасивному стані для майбутніх дій використовуємо майбутній час 'ser' + дієприкметник минулого часу."
    },
    "hint": {
      "form": "futuro do indicativo",
      "person": "ele/ela",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.222Z",
    "updatedAt": "2025-08-09T23:45:27.029Z"
  },
  {
    "id": "b498e7f9-4dbc-42d2-af26-24f1e7cbaa84",
    "sentence": "Quem quer que ___ essa decisão terá de assumir a responsabilidade.",
    "gapIndex": 14,
    "correctAnswer": "tome",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "tomar",
      "tomará",
      "toma",
      "tome"
    ],
    "explanations": {
      "pt": "Após 'quem quer que' usa-se sempre o presente do conjuntivo.",
      "en": "After 'quem quer que' (whoever) we always use the present subjunctive.",
      "uk": "Після 'quem quer que' (хто б не) завжди використовуємо теперішній час кон'юнктива."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "person": "ele/ela",
      "infinitive": "tomar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.221Z",
    "updatedAt": "2025-08-09T23:45:27.031Z"
  },
  {
    "id": "a5fa8e5f-2edd-4564-9b2b-6cdd0955f8f2",
    "sentence": "Assim que ___ o trabalho, envio-te uma mensagem.",
    "gapIndex": 10,
    "correctAnswer": "acabar",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "acabar",
      "acabaria",
      "acabe",
      "acabasse"
    ],
    "explanations": {
      "pt": "Com 'assim que' referindo-se ao futuro, utilizamos o futuro do conjuntivo.",
      "en": "With 'assim que' (as soon as) referring to the future, we use the future subjunctive.",
      "uk": "З 'assim que' (як тільки) щодо майбутнього використовуємо майбутній час кон'юнктива."
    },
    "hint": {
      "form": "futuro do conjuntivo",
      "infinitive": "acabar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.221Z",
    "updatedAt": "2025-08-09T23:17:35.054Z"
  },
  {
    "id": "f6f632bd-a260-4958-8279-3b8a325e176e",
    "sentence": "Se eu ___ que ia chover, teria trazido um guarda-chuva.",
    "gapIndex": 6,
    "correctAnswer": "soubesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "soubesse",
      "sabia",
      "saberia",
      "soube"
    ],
    "explanations": {
      "pt": "Em condicionais irreais no passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal past conditionals, we use the imperfect subjunctive after 'se' (if).",
      "uk": "У нереальних умовних реченнях минулого часу ми використовуємо імперфект суб'юнктива після 'se' (якщо)."
    },
    "hint": {
      "form": "pretérito imperfeito do conjuntivo",
      "person": "eu",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.220Z",
    "updatedAt": "2025-08-09T23:45:27.031Z"
  },
  {
    "id": "38072d26-5603-4b0c-b116-3715caff6632",
    "sentence": "Ela não ___ sair ontem porque estava doente.",
    "gapIndex": 8,
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "conseguiu",
      "pôde",
      "podia",
      "conseguia"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar capacidade física ou circunstancial específica num momento concreto.",
      "en": "We use 'conseguir' to express physical or circumstantial ability at a specific moment.",
      "uk": "Ми використовуємо 'conseguir' для вираження фізичної або обставинної здатності в конкретний момент."
    },
    "hint": {},
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.218Z",
    "updatedAt": "2025-07-25T14:59:25.218Z"
  },
  {
    "id": "dd98e2c5-cd70-43b7-b54e-5907507ba3cc",
    "sentence": "Tenho certeza de que ela ___ resolver o problema sozinha.",
    "gapIndex": 25,
    "correctAnswer": "conseguirá",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "poderá",
      "conseguirá",
      "pode"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar capacidade específica de realizar algo.",
      "en": "We use 'conseguir' to express specific ability to accomplish something.",
      "uk": "Використовуємо 'conseguir' для вираження конкретної здатності щось виконати."
    },
    "hint": {
      "form": "futuro do indicativo",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.773Z",
    "updatedAt": "2025-07-25T14:59:24.773Z"
  },
  {
    "id": "d45a2d5b-ed67-48be-8d57-0347c9cadf68",
    "sentence": "Quem quer que ___ à festa deve trazer uma sobremesa.",
    "gapIndex": 14,
    "correctAnswer": "venha",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "vem",
      "venha",
      "vier",
      "vir"
    ],
    "explanations": {
      "pt": "Após 'quem quer que', usamos o presente do conjuntivo para expressar indefinição.",
      "en": "After 'quem quer que' (whoever), we use present subjunctive to express indefiniteness.",
      "uk": "Після 'quem quer que' (хто б не) використовуємо теперішній час суб'єктивного способу для вираження невизначеності."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "vir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.772Z",
    "updatedAt": "2025-07-25T14:59:24.772Z"
  },
  {
    "id": "0f1c0764-ffec-491f-beb2-5f7fc6351695",
    "sentence": "O livro ___ na semana passada já está esgotado.",
    "gapIndex": 8,
    "correctAnswer": "publicado",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "publicado",
      "publicando",
      "que publicou"
    ],
    "explanations": {
      "pt": "Na voz passiva adjetiva, usamos o particípio passado como adjetivo.",
      "en": "In adjectival passive voice, we use the past participle as an adjective.",
      "uk": "У пасивному стані прикметника використовуємо дієприкметник минулого часу як прикметник."
    },
    "hint": {
      "form": "particípio passado",
      "infinitive": "publicar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.772Z",
    "updatedAt": "2025-07-25T14:59:24.772Z"
  },
  {
    "id": "0a824625-0ca6-496b-a512-f7005f46a903",
    "sentence": "Assim que ___ o trabalho, posso ir ter contigo.",
    "gapIndex": 10,
    "correctAnswer": "conseguir",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "consiga",
      "conseguir",
      "consigo"
    ],
    "explanations": {
      "pt": "Com 'assim que' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'assim que' (as soon as) referring to the future, we use the future subjunctive.",
      "uk": "З 'assim que' (як тільки), що відноситься до майбутнього, використовуємо майбутній час суб'єктивного способу."
    },
    "hint": {
      "form": "futuro do conjuntivo",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.771Z",
    "updatedAt": "2025-07-25T14:59:24.771Z"
  },
  {
    "id": "63b8cd3c-e682-48da-9314-2a7f103288e0",
    "sentence": "Se ___ que ia chover, tinha trazido um guarda-chuva.",
    "gapIndex": 3,
    "correctAnswer": "soubesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "sabia",
      "soubesse",
      "conhecesse",
      "saberia"
    ],
    "explanations": {
      "pt": "Com condicionais irreais no passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "With unreal past conditionals, we use the imperfect subjunctive after 'se'.",
      "uk": "У нереальних умовних реченнях минулого часу після 'se' вживаємо імперфект кон'юнктива."
    },
    "hint": {
      "form": "imperfeito do conjuntivo",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.770Z",
    "updatedAt": "2025-07-26T08:05:31.782Z"
  },
  {
    "id": "a785d5b6-0649-4ce4-9483-ff1205e2e38c",
    "sentence": "Embora ___ falar cinco línguas, ela ainda quer aprender mais.",
    "gapIndex": 7,
    "correctAnswer": "saiba",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B1",
    "multipleChoiceOptions": [
      "sabe",
      "saiba",
      "saber"
    ],
    "explanations": {
      "pt": "Após 'embora', usamos o presente do conjuntivo. 'Saiba' é a forma correta do verbo 'saber'.",
      "en": "After 'embora' (although), we use present subjunctive. 'Saiba' is the correct form of 'saber'.",
      "uk": "Після 'embora' (хоча) використовуємо теперішній час суб'єктивного способу. 'Saiba' - правильна форма дієслова 'saber'."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.765Z",
    "updatedAt": "2025-07-25T14:59:24.765Z"
  },
  {
    "id": "05ac45ec-d200-4394-ae3a-b56f5dc4de3b",
    "sentence": "___ horas são?",
    "gapIndex": 0,
    "correctAnswer": "Que",
    "topic": "interrogativos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Que",
      "Qual",
      "Quanto"
    ],
    "explanations": {
      "pt": "Para perguntar as horas, usamos 'Que horas são?'",
      "en": "To ask for the time, we use 'Que horas são?'",
      "uk": "Щоб запитати про час, ми використовуємо 'Que horas são?'"
    },
    "hint": {
      "form": "pronome interrogativo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.624Z",
    "updatedAt": "2025-07-25T14:50:31.624Z"
  },
  {
    "id": "157c920e-3bfb-44e0-8192-e2d819e1890a",
    "sentence": "O meu carro é ___ pequeno.",
    "gapIndex": 14,
    "correctAnswer": "muito",
    "topic": "demonstrativos-invariaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "muita",
      "muito",
      "muitos"
    ],
    "explanations": {
      "pt": "'Muito' é invariável quando usado como advérbio de intensidade.",
      "en": "'Muito' is invariable when used as an adverb of intensity.",
      "uk": "'Muito' є незмінним, коли використовується як прислівник інтенсивності."
    },
    "hint": {
      "form": "advérbio de intensidade"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.623Z",
    "updatedAt": "2025-07-25T14:50:31.623Z"
  },
  {
    "id": "565020ce-5650-4f7f-9753-714577cecde5",
    "sentence": "___ menina é minha prima.",
    "gapIndex": 0,
    "correctAnswer": "Esta",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Este",
      "Aquela",
      "Esse",
      "Esta"
    ],
    "explanations": {
      "pt": "'Esta' é usado para indicar algo próximo de quem fala, no feminino singular.",
      "en": "'Esta' is used to indicate something close to the speaker, in feminine singular.",
      "uk": "'Esta' використовується для позначення чогось близького до мовця, у жіночому роді однини."
    },
    "hint": {
      "form": "demonstrativo feminino singular"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.620Z",
    "updatedAt": "2025-07-25T14:50:31.620Z"
  },
  {
    "id": "e28e261f-854d-42d4-b8a6-91af2045eeee",
    "sentence": "Ele ___ a estudar português.",
    "gapIndex": 4,
    "correctAnswer": "está",
    "topic": "presente-continuo",
    "level": "A1",
    "multipleChoiceOptions": [
      "estou",
      "estás",
      "está"
    ],
    "explanations": {
      "pt": "No presente contínuo, usamos 'está' (3ª pessoa) + a + infinitivo.",
      "en": "In present continuous, we use 'está' (3rd person) + a + infinitive.",
      "uk": "У теперішньому тривалому часі ми використовуємо 'está' (3-тя особа) + a + інфінітив."
    },
    "hint": {
      "form": "presente + a + infinitivo",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.618Z",
    "updatedAt": "2025-07-25T14:50:31.618Z"
  },
  {
    "id": "03900fb6-5918-46cc-a796-965a2cabe088",
    "sentence": "Tu ___ o livro na mochila.",
    "gapIndex": 3,
    "correctAnswer": "tens",
    "topic": "verbo-ter",
    "level": "A1",
    "multipleChoiceOptions": [
      "temos",
      "tem",
      "tens"
    ],
    "explanations": {
      "pt": "Com a segunda pessoa singular (tu), usamos 'tens' para expressar posse.",
      "en": "With second person singular (you), we use 'tens' to express possession.",
      "uk": "З другою особою однини (ти) ми використовуємо 'tens' для вираження володіння."
    },
    "hint": {
      "form": "presente",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.615Z",
    "updatedAt": "2025-07-25T14:50:31.615Z"
  },
  {
    "id": "b62182dd-5dd1-43b6-8d25-35d2cc3b3560",
    "sentence": "A Maria está ___ supermercado.",
    "gapIndex": 13,
    "correctAnswer": "no",
    "topic": "preposicoes",
    "level": "A1",
    "multipleChoiceOptions": [
      "no",
      "ao",
      "na",
      "em"
    ],
    "explanations": {
      "pt": "'No' é a contração da preposição 'em' com o artigo 'o'.",
      "en": "'No' is the contraction of the preposition 'em' with the article 'o'.",
      "uk": "'No' - це скорочення прийменника 'em' з артиклем 'o'."
    },
    "hint": {
      "type": "contraction",
      "elements": "em + o"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.601Z",
    "updatedAt": "2025-07-25T14:50:30.601Z"
  },
  {
    "id": "201a5382-a1f3-46c4-95e9-6443772bb8de",
    "sentence": "O João ___ as mãos antes de comer.",
    "gapIndex": 7,
    "correctAnswer": "lava-se",
    "topic": "pronomes-reflexos",
    "level": "A1",
    "multipleChoiceOptions": [
      "lava-se",
      "se lava",
      "lava"
    ],
    "explanations": {
      "pt": "Com verbos reflexivos, o pronome '-se' liga-se ao verbo com hífen.",
      "en": "With reflexive verbs, the pronoun '-se' is connected to the verb with a hyphen.",
      "uk": "З рефлексивними дієсловами займенник '-se' приєднується до дієслова через дефіс."
    },
    "hint": {
      "form": "presente",
      "infinitive": "lavar-se"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.595Z",
    "updatedAt": "2025-07-25T14:50:30.595Z"
  },
  {
    "id": "68112b2f-61e7-4caa-bc37-f75328cd560e",
    "sentence": "___ carro é vermelho.",
    "gapIndex": 0,
    "correctAnswer": "Este",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Este",
      "Esse",
      "Aquele"
    ],
    "explanations": {
      "pt": "'Este' é usado para objetos próximos de quem fala.",
      "en": "'Este' is used for objects close to the speaker.",
      "uk": "'Este' використовується для об'єктів, близьких до мовця."
    },
    "hint": {
      "type": "demonstrative",
      "proximity": "near speaker"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.595Z",
    "updatedAt": "2025-07-25T14:50:30.595Z"
  },
  {
    "id": "ca1dccd6-42ab-4c97-9d13-9b0a49f572fe",
    "sentence": "Nós ___ fazer os trabalhos de casa.",
    "gapIndex": 4,
    "correctAnswer": "temos",
    "topic": "verbo-ter",
    "level": "A1",
    "multipleChoiceOptions": [
      "temos",
      "tenho",
      "têm",
      "tem"
    ],
    "explanations": {
      "pt": "Com o pronome 'nós', a forma correta do verbo 'ter' é 'temos'.",
      "en": "With the pronoun 'nós' (we), the correct form of the verb 'ter' is 'temos'.",
      "uk": "З займенником 'nós' (ми) правильна форма дієслова 'ter' - 'temos'."
    },
    "hint": {
      "form": "presente",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.594Z",
    "updatedAt": "2025-07-25T14:50:30.594Z"
  },
  {
    "id": "bb6d34f1-167d-475e-838f-0c8c68f706cd",
    "sentence": "Tu ___ muito bem português.",
    "gapIndex": 3,
    "correctAnswer": "falas",
    "topic": "presente-indicativo-regulares",
    "level": "A1",
    "multipleChoiceOptions": [
      "falo",
      "fala",
      "falas"
    ],
    "explanations": {
      "pt": "Com 'tu', usamos a terminação '-as' nos verbos regulares da primeira conjugação.",
      "en": "With 'tu', we use the ending '-as' for regular first conjugation verbs.",
      "uk": "З 'tu' ми використовуємо закінчення '-as' для правильних дієслів першої дієвідміни."
    },
    "hint": {
      "form": "presente",
      "infinitive": "falar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.593Z",
    "updatedAt": "2025-07-25T14:50:30.593Z"
  },
  {
    "id": "40af3567-0d15-488d-8e15-19f5c46e8c0b",
    "sentence": "Ela ___ em casa agora.",
    "gapIndex": 4,
    "correctAnswer": "está",
    "topic": "verbo-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "está",
      "é",
      "estás",
      "estão"
    ],
    "explanations": {
      "pt": "Usamos 'está' (3ª pessoa singular do verbo estar) para indicar localização temporária.",
      "en": "We use 'está' (3rd person singular of estar) to indicate temporary location.",
      "uk": "Ми використовуємо 'está' (3-тя особа однини дієслова estar) для позначення тимчасового місцезнаходження."
    },
    "hint": {
      "form": "presente",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.592Z",
    "updatedAt": "2025-07-25T14:50:30.592Z"
  },
  {
    "id": "e0efee74-a16a-4e49-9dc8-10f90c12c560",
    "sentence": "Ontem ___ muito no parque.",
    "gapIndex": 6,
    "correctAnswer": "brinquei",
    "topic": "preterito-perfeito-simples",
    "level": "A1",
    "multipleChoiceOptions": [
      "brincava",
      "brincando",
      "brinquei",
      "brinco"
    ],
    "explanations": {
      "pt": "Usamos o pretérito perfeito para ações concluídas no passado.",
      "en": "We use the simple past for completed actions in the past.",
      "uk": "Ми використовуємо простий минулий час для завершених дій у минулому."
    },
    "hint": {
      "form": "pretérito perfeito",
      "infinitive": "brincar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.288Z",
    "updatedAt": "2025-07-25T14:50:29.288Z"
  },
  {
    "id": "e8933edb-b530-49da-a51e-d94dd9a491c5",
    "sentence": "___ livro está na mesa?",
    "gapIndex": 0,
    "correctAnswer": "Que",
    "topic": "interrogativos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Que",
      "Qual",
      "Quem",
      "Onde"
    ],
    "explanations": {
      "pt": "'Que' é usado para fazer perguntas sobre a identidade de objetos.",
      "en": "'Que' is used to ask questions about the identity of objects.",
      "uk": "'Que' використовується для запитань про ідентифікацію предметів."
    },
    "hint": {
      "type": "pronome interrogativo",
      "usage": "objetos"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.288Z",
    "updatedAt": "2025-07-25T14:50:29.288Z"
  },
  {
    "id": "d16da99d-bafb-48c1-b9f5-7f5976164c07",
    "sentence": "O Pedro ___ os dentes todas as manhãs.",
    "gapIndex": 8,
    "correctAnswer": "lava-se",
    "topic": "pronomes-reflexos",
    "level": "A1",
    "multipleChoiceOptions": [
      "se lava",
      "lava",
      "lave-se",
      "lava-se"
    ],
    "explanations": {
      "pt": "Com verbos reflexivos, o pronome '-se' liga-se ao verbo com hífen.",
      "en": "With reflexive verbs, the pronoun '-se' is connected to the verb with a hyphen.",
      "uk": "З рефлексивними дієсловами займенник '-se' приєднується до дієслова через дефіс."
    },
    "hint": {
      "form": "presente",
      "infinitive": "lavar-se"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.287Z",
    "updatedAt": "2025-07-25T14:50:29.287Z"
  },
  {
    "id": "8a7a37a2-5e69-46e1-9736-b91b09c5cdd6",
    "sentence": "___ caneta é vermelha.",
    "gapIndex": 0,
    "correctAnswer": "Esta",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Aquela",
      "Esse",
      "Este",
      "Esta"
    ],
    "explanations": {
      "pt": "'Esta' é usado para objetos femininos próximos de quem fala.",
      "en": "'Esta' is used for feminine objects close to the speaker.",
      "uk": "'Esta' використовується для жіночих предметів, близьких до мовця."
    },
    "hint": {
      "type": "demonstrativo",
      "proximity": "próximo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.287Z",
    "updatedAt": "2025-07-25T14:50:29.287Z"
  },
  {
    "id": "8eaf1e89-8000-4d3c-b8ca-1f9865ac725e",
    "sentence": "Tu ___ dois irmãos.",
    "gapIndex": 3,
    "correctAnswer": "tens",
    "topic": "verbo-ter",
    "level": "A1",
    "multipleChoiceOptions": [
      "tem",
      "tems",
      "tens",
      "tém"
    ],
    "explanations": {
      "pt": "Com 'tu', a forma correta do verbo 'ter' é 'tens'.",
      "en": "With 'tu' (you informal), the correct form of the verb 'ter' is 'tens'.",
      "uk": "З займенником 'tu' (ти) правильна форма дієслова 'ter' - 'tens'."
    },
    "hint": {
      "form": "presente",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.286Z",
    "updatedAt": "2025-07-25T14:50:29.286Z"
  },
  {
    "id": "bdd00f3f-20af-4763-b55c-1071d711b458",
    "sentence": "Eu ___ a estudar português agora.",
    "gapIndex": 3,
    "correctAnswer": "estou",
    "topic": "presente-continuo",
    "level": "A1",
    "multipleChoiceOptions": [
      "está",
      "sou",
      "estou"
    ],
    "explanations": {
      "pt": "Para formar o presente contínuo, usamos o verbo 'estar' + a + infinitivo.",
      "en": "To form the present continuous, we use the verb 'estar' + a + infinitive.",
      "uk": "Для утворення теперішнього тривалого часу використовуємо дієслово 'estar' + a + інфінітив."
    },
    "hint": {
      "form": "presente contínuo",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.286Z",
    "updatedAt": "2025-07-25T14:50:29.286Z"
  },
  {
    "id": "3c4039c3-0f34-4e58-87c2-81a00eded8b0",
    "sentence": "A Maria ___ muito feliz hoje.",
    "gapIndex": 8,
    "correctAnswer": "está",
    "topic": "verbo-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "é",
      "estão",
      "está",
      "tem"
    ],
    "explanations": {
      "pt": "Usamos 'está' (verbo estar) para estados temporários e emoções momentâneas.",
      "en": "We use 'está' (verb estar) for temporary states and momentary emotions.",
      "uk": "Ми використовуємо 'está' (дієслово estar) для тимчасових станів та моментних емоцій."
    },
    "hint": {
      "form": "presente",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.285Z",
    "updatedAt": "2025-07-25T14:50:29.285Z"
  },
  {
    "id": "124691b1-7d4f-429b-813a-d60bed95f958",
    "sentence": "___ mesa é grande.",
    "gapIndex": 0,
    "correctAnswer": "A",
    "topic": "artigos-definidos-indefinidos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Um",
      "A",
      "Uma",
      "O"
    ],
    "explanations": {
      "pt": "Usamos o artigo definido 'a' com substantivos femininos singulares.",
      "en": "We use the definite article 'a' with feminine singular nouns.",
      "uk": "Використовуємо означений артикль 'a' з іменниками жіночого роду в однині."
    },
    "hint": {
      "type": "artigo definido",
      "gender": "feminino"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.244Z",
    "updatedAt": "2025-07-25T14:50:29.244Z"
  },
  {
    "id": "b6864e3f-0e11-49ed-aa0a-40cc800ca690",
    "sentence": "Ela ___ na praia todos os dias.",
    "gapIndex": 4,
    "correctAnswer": "corre",
    "topic": "presente-indicativo-regulares",
    "level": "A1",
    "multipleChoiceOptions": [
      "corre",
      "corres",
      "corro"
    ],
    "explanations": {
      "pt": "Com 'ela', usamos a terceira pessoa do singular dos verbos regulares.",
      "en": "With 'she', we use the third person singular of regular verbs.",
      "uk": "З займенником 'вона' використовуємо третю особу однини правильних дієслів."
    },
    "hint": {
      "form": "presente",
      "infinitive": "correr"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.243Z",
    "updatedAt": "2025-07-25T14:50:29.243Z"
  },
  {
    "id": "226a5e42-8738-4246-a0e2-1c6524305fde",
    "sentence": "___ é o teu nome?",
    "gapIndex": 0,
    "correctAnswer": "Qual",
    "topic": "interrogativos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Quem",
      "Qual",
      "Como",
      "Que"
    ],
    "explanations": {
      "pt": "'Qual' é usado para perguntar o nome em português.",
      "en": "'Qual' is used to ask for someone's name in Portuguese.",
      "uk": "'Qual' використовується для запитання імені португальською мовою."
    },
    "hint": {
      "type": "pronome interrogativo",
      "usage": "identificação"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.243Z",
    "updatedAt": "2025-07-25T14:50:30.596Z"
  },
  {
    "id": "01433749-3489-48dd-ab64-0db2d6fb2ef2",
    "sentence": "Tu ___ muito café.",
    "gapIndex": 3,
    "correctAnswer": "tens",
    "topic": "verbo-ter",
    "level": "A1",
    "multipleChoiceOptions": [
      "tens",
      "tem",
      "temos"
    ],
    "explanations": {
      "pt": "Com o pronome 'tu', usamos 'tens' no presente do indicativo.",
      "en": "With the pronoun 'you' (informal), we use 'tens' in the present indicative.",
      "uk": "З займенником 'ти' використовуємо 'tens' в теперішньому часі."
    },
    "hint": {
      "form": "presente",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.242Z",
    "updatedAt": "2025-07-25T14:50:29.242Z"
  },
  {
    "id": "77dd2e83-c46e-48cd-b2c4-437210e0d990",
    "sentence": "___ livros são interessantes.",
    "gapIndex": 0,
    "correctAnswer": "Estes",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Aqueles",
      "Essa",
      "Este",
      "Estes"
    ],
    "explanations": {
      "pt": "Usamos 'estes' para objetos plurais masculinos próximos do falante.",
      "en": "We use 'estes' for plural masculine objects close to the speaker.",
      "uk": "Використовуємо 'estes' для множини чоловічого роду, що знаходяться поруч з мовцем."
    },
    "hint": {
      "type": "demonstrativo plural masculino",
      "proximity": "próximo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.241Z",
    "updatedAt": "2025-07-25T14:50:29.241Z"
  },
  {
    "id": "9a683cc0-8770-4558-830b-dad89bb7b10b",
    "sentence": "Ele ___ a trabalhar agora.",
    "gapIndex": 4,
    "correctAnswer": "está",
    "topic": "presente-continuo",
    "level": "A1",
    "multipleChoiceOptions": [
      "estou",
      "estás",
      "está"
    ],
    "explanations": {
      "pt": "No presente contínuo, usamos 'está' com a terceira pessoa do singular.",
      "en": "In the present continuous, we use 'está' with third person singular.",
      "uk": "У теперішньому тривалому часі використовуємо 'está' з третьою особою однини."
    },
    "hint": {
      "form": "presente + a + infinitivo",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.241Z",
    "updatedAt": "2025-07-25T14:50:29.241Z"
  },
  {
    "id": "7cd80516-bfd6-45f3-b9cc-400ad2399c5e",
    "sentence": "Eu ___ em Lisboa.",
    "gapIndex": 3,
    "correctAnswer": "estou",
    "topic": "verbo-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "estás",
      "sou",
      "está",
      "estou"
    ],
    "explanations": {
      "pt": "Com a primeira pessoa singular (eu), usamos 'estou' para indicar localização temporária.",
      "en": "With first person singular (I), we use 'estou' to indicate temporary location.",
      "uk": "З першою особою однини (я) ми використовуємо 'estou' для позначення тимчасового місцезнаходження."
    },
    "hint": {
      "form": "presente",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.240Z",
    "updatedAt": "2025-07-25T14:50:31.612Z"
  },
  {
    "id": "a7fffa77-9be3-4540-81b7-998005f9411b",
    "sentence": "Ontem eu ___ muito cedo.",
    "gapIndex": 9,
    "correctAnswer": "acordei",
    "topic": "preterito-perfeito-simples",
    "level": "A1",
    "multipleChoiceOptions": [
      "acordo",
      "acordei",
      "acordava"
    ],
    "explanations": {
      "pt": "O pretérito perfeito simples usa-se para ações concluídas no passado.",
      "en": "The simple past is used for completed actions in the past.",
      "uk": "Простий минулий час використовується для завершених дій у минулому."
    },
    "hint": {
      "form": "pretérito perfeito",
      "infinitive": "acordar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.216Z",
    "updatedAt": "2025-07-25T14:50:27.216Z"
  },
  {
    "id": "9fad1431-6fa9-46de-99e2-f1668df35994",
    "sentence": "Ela ___ as mãos antes de comer.",
    "gapIndex": 4,
    "correctAnswer": "lava-se",
    "topic": "pronomes-reflexos",
    "level": "A1",
    "multipleChoiceOptions": [
      "lava-se",
      "se lava",
      "lava"
    ],
    "explanations": {
      "pt": "Com verbos reflexivos, o pronome '-se' liga-se ao verbo com hífen.",
      "en": "With reflexive verbs, the pronoun '-se' is connected to the verb with a hyphen.",
      "uk": "З рефлексивними дієсловами займенник '-se' приєднується до дієслова через дефіс."
    },
    "hint": {
      "form": "presente",
      "infinitive": "lavar-se"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.213Z",
    "updatedAt": "2025-07-25T14:50:31.626Z"
  },
  {
    "id": "8a0a9205-69c3-434f-b1aa-eac54a0bdb13",
    "sentence": "___ é a tua caneta?",
    "gapIndex": 0,
    "correctAnswer": "Onde",
    "topic": "interrogativos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Quando",
      "Onde",
      "Como"
    ],
    "explanations": {
      "pt": "'Onde' é usado para perguntar sobre localização.",
      "en": "'Onde' (where) is used to ask about location.",
      "uk": "'Onde' (де) використовується для запитання про місцезнаходження."
    },
    "hint": {
      "uso": "lugar",
      "type": "palavra interrogativa"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.213Z",
    "updatedAt": "2025-07-25T14:50:27.213Z"
  },
  {
    "id": "e5321016-4e78-424b-8b5c-847d16c4c573",
    "sentence": "___ livro é interessante.",
    "gapIndex": 0,
    "correctAnswer": "Este",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Aquele",
      "Esse",
      "Este",
      "Esta"
    ],
    "explanations": {
      "pt": "'Este' usa-se para objetos próximos do falante.",
      "en": "'Este' is used for objects close to the speaker.",
      "uk": "'Este' використовується для об'єктів, близьких до мовця."
    },
    "hint": {
      "type": "demonstrativo",
      "proximity": "próximo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.212Z",
    "updatedAt": "2025-07-25T14:50:27.212Z"
  },
  {
    "id": "98b20f1f-4f01-4faf-bc1d-1125b97a40fb",
    "sentence": "Nós ___ a estudar português.",
    "gapIndex": 4,
    "correctAnswer": "estamos",
    "topic": "presente-continuo",
    "level": "A1",
    "multipleChoiceOptions": [
      "estamos",
      "somos",
      "estão"
    ],
    "explanations": {
      "pt": "O presente contínuo forma-se com o verbo 'estar' + a + infinitivo.",
      "en": "The present continuous is formed with 'estar' + a + infinitive.",
      "uk": "Теперішній тривалий час утворюється за допомогою 'estar' + a + інфінітив."
    },
    "hint": {
      "form": "presente contínuo",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.210Z",
    "updatedAt": "2025-07-25T14:50:27.210Z"
  },
  {
    "id": "b72ba086-76d3-4975-9178-fe8c2a2ade86",
    "sentence": "Por mais que ___ estudar, não consigo concentrar-me.",
    "gapIndex": 13,
    "correctAnswer": "tente",
    "topic": "presente-conjuntivo-regulares",
    "level": "B1",
    "multipleChoiceOptions": [
      "tentasse",
      "tentar",
      "tento",
      "tente"
    ],
    "explanations": {
      "pt": "A expressão 'por mais que' exige o uso do presente do conjuntivo.",
      "en": "The expression 'por mais que' (no matter how much) requires present subjunctive.",
      "uk": "Вираз 'por mais que' (як би не) вимагає теперішнього часу кон'юнктива."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "eu",
      "infinitive": "tentar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.442Z",
    "updatedAt": "2025-08-09T23:45:27.031Z"
  },
  {
    "id": "9536c3f0-037d-4256-abbc-27b67b06a5a5",
    "sentence": "Quem quer que ___ na reunião deve avisar com antecedência.",
    "gapIndex": 14,
    "correctAnswer": "esteja",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "estivesse",
      "estiver",
      "está",
      "esteja"
    ],
    "explanations": {
      "pt": "Após 'quem quer que', usamos o presente do conjuntivo.",
      "en": "After 'quem quer que' (whoever), we use present subjunctive.",
      "uk": "Після 'quem quer que' (хто б не) використовуємо теперішній час кон'юнктива."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "ele/ela",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.440Z",
    "updatedAt": "2025-08-09T23:45:27.032Z"
  },
  {
    "id": "237827f5-f107-4678-8690-7f7d9215fdbc",
    "sentence": "Não ___ tocar piano sem praticar regularmente.",
    "gapIndex": 4,
    "correctAnswer": "consegues",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "sabes",
      "podes",
      "consegues",
      "deves"
    ],
    "explanations": {
      "pt": "'Conseguir' indica capacidade física ou mental específica.",
      "en": "'Conseguir' indicates specific physical or mental ability.",
      "uk": "'Conseguir' вказує на конкретну фізичну або розумову здатність."
    },
    "hint": {
      "form": "present indicative",
      "person": "tu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.438Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "156349ee-7777-4ed1-818e-966f4d529463",
    "sentence": "A carta ___ enviada ontem pelo correio.",
    "gapIndex": 8,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "seja",
      "está",
      "era",
      "foi"
    ],
    "explanations": {
      "pt": "Na voz passiva no passado, usamos 'ser' no pretérito perfeito + particípio.",
      "en": "In passive voice in the past, we use 'ser' in simple past + participle.",
      "uk": "У пасивному стані в минулому часі використовуємо 'ser' у простому минулому + дієприкметник."
    },
    "hint": {
      "form": "preterite perfect",
      "person": "ele/ela",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.437Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "68855ba8-dca8-4693-8538-affe56463929",
    "sentence": "O João disse que ___ ao Porto na próxima semana.",
    "gapIndex": 17,
    "correctAnswer": "iria",
    "topic": "discurso-direto-indireto",
    "level": "B1",
    "multipleChoiceOptions": [
      "for",
      "ia",
      "vai",
      "iria"
    ],
    "explanations": {
      "pt": "No discurso indireto, o futuro transforma-se em condicional.",
      "en": "In reported speech, the future tense changes to conditional.",
      "uk": "У непрямій мові майбутній час змінюється на умовний."
    },
    "hint": {
      "form": "conditional",
      "person": "ele/ela",
      "infinitive": "ir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.436Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "23afac66-1f1b-4fe3-9480-55ba5d52daad",
    "sentence": "Assim que ___ os documentos, enviarei por email.",
    "gapIndex": 10,
    "correctAnswer": "receber",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "receberia",
      "recebi",
      "receba",
      "receber"
    ],
    "explanations": {
      "pt": "Com 'assim que' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "With 'assim que' (as soon as) referring to the future, we use the future subjunctive.",
      "uk": "З 'assim que' (як тільки) щодо майбутнього використовуємо майбутній час кон'юнктива."
    },
    "hint": {
      "form": "future subjunctive",
      "person": "eu",
      "infinitive": "receber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.434Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "1dbcf519-e5ba-44d3-ab9d-49751ba22d60",
    "sentence": "Se eu ___ mais tempo, teria estudado melhor para o exame.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "tinha",
      "tiver",
      "tenha"
    ],
    "explanations": {
      "pt": "Em condições irreais no passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal past conditions, we use the imperfect subjunctive after 'se' (if).",
      "uk": "У нереальних умовах минулого після 'se' (якби) використовуємо імперфект кон'юнктива."
    },
    "hint": {
      "form": "imperfeito do conjuntivo",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.430Z",
    "updatedAt": "2025-07-25T12:51:24.430Z"
  },
  {
    "id": "ed50a75f-fbe7-456f-b0d5-71ea2496f13c",
    "sentence": "Quando ___ o trabalho, poderemos ir de férias.",
    "gapIndex": 7,
    "correctAnswer": "acabarmos",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "acabamos",
      "acabarmos",
      "acabemos",
      "acabar"
    ],
    "explanations": {
      "pt": "Após 'quando' referindo-se ao futuro, usamos o futuro do conjuntivo.",
      "en": "After 'quando' referring to the future, we use the future subjunctive.",
      "uk": "Після 'quando', що відноситься до майбутнього, ми використовуємо майбутній час суб'юнктива."
    },
    "hint": {
      "form": "futuro do conjuntivo",
      "infinitive": "acabar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.388Z",
    "updatedAt": "2025-07-25T12:26:00.388Z"
  },
  {
    "id": "468c7407-d2e4-42d6-9386-8a66065209a3",
    "sentence": "Quem quer que ___ este documento deve assiná-lo.",
    "gapIndex": 14,
    "correctAnswer": "receba",
    "topic": "oracoes-relativas-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "receberá",
      "receba",
      "recebe",
      "receber"
    ],
    "explanations": {
      "pt": "Após 'quem quer que', usamos o presente do conjuntivo para expressar indefinição.",
      "en": "After 'quem quer que', we use the present subjunctive to express indefiniteness.",
      "uk": "Після 'quem quer que' ми використовуємо теперішній час суб'юнктива для вираження невизначеності."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "receber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.387Z",
    "updatedAt": "2025-07-25T12:26:00.387Z"
  },
  {
    "id": "79659b3f-eb96-4dad-bb09-726ecd924490",
    "sentence": "Se eu ___ mais tempo, teria ido visitar-te.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tinha",
      "tivesse",
      "tiver",
      "tenha"
    ],
    "explanations": {
      "pt": "Em condições irreais no passado, usamos 'se' + imperfeito do conjuntivo na oração condicional.",
      "en": "For unreal conditions in the past, we use 'se' + imperfect subjunctive in the conditional clause.",
      "uk": "Для нереальних умов у минулому ми використовуємо 'se' + імперфект суб'юнктива в умовному реченні."
    },
    "hint": {
      "form": "imperfeito do conjuntivo",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.386Z",
    "updatedAt": "2025-07-25T12:26:00.386Z"
  },
  {
    "id": "fc3902a5-85ee-4141-9682-54c75e772c6f",
    "sentence": "A notícia ___ divulgada pelos meios de comunicação ontem.",
    "gapIndex": 10,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "era",
      "seria",
      "foi",
      "estava"
    ],
    "explanations": {
      "pt": "Na voz passiva, usamos o verbo 'ser' no tempo adequado + particípio passado do verbo principal.",
      "en": "In passive voice, we use the verb 'ser' in the appropriate tense + past participle of the main verb.",
      "uk": "У пасивному стані ми використовуємо дієслово 'ser' у відповідному часі + дієприкметник минулого часу основного дієслова."
    },
    "hint": {
      "form": "preterite perfect",
      "person": "ele/ela",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.384Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "3833c501-5f9f-40ee-9243-13e955b5635f",
    "sentence": "Caso ele ___ à festa, avisa-me.",
    "gapIndex": 9,
    "correctAnswer": "venha",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "venha",
      "vem",
      "vier",
      "viesse"
    ],
    "explanations": {
      "pt": "Após 'caso', usamos o presente do conjuntivo para expressar uma possibilidade no presente ou futuro próximo.",
      "en": "After 'caso', we use the present subjunctive to express a possibility in the present or near future.",
      "uk": "Після 'caso' ми використовуємо теперішній час суб'юнктива для вираження можливості в теперішньому або найближчому майбутньому."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "vir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.382Z",
    "updatedAt": "2025-07-25T12:26:00.382Z"
  },
  {
    "id": "44ac898d-236c-4e90-a035-7f8725916d31",
    "sentence": "Não ___ atender o telefone porque estava ocupado.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "podia",
      "pude",
      "consegui"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' para expressar impossibilidade devido a circunstâncias específicas ou capacidade física.",
      "en": "We use 'conseguir' to express inability due to specific circumstances or physical capacity.",
      "uk": "Ми використовуємо 'conseguir' для вираження неможливості через конкретні обставини або фізичну здатність."
    },
    "hint": {
      "form": "preterite perfect",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.378Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "21d211ac-9c57-4466-88d0-40b70b08ccde",
    "sentence": "___ que precisares, podes contar comigo.",
    "gapIndex": 0,
    "correctAnswer": "Sempre que",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "Assim que",
      "Logo que",
      "Quando",
      "Sempre que"
    ],
    "explanations": {
      "pt": "'Sempre que' com futuro do conjuntivo expressa uma ação repetida no futuro.",
      "en": "'Sempre que' with future subjunctive expresses a repeated action in the future.",
      "uk": "'Sempre que' з майбутнім суб'юнктивом виражає повторювану дію в майбутньому."
    },
    "hint": {
      "context": "future reference",
      "conjunction": "temporal"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.487Z",
    "updatedAt": "2025-07-25T12:25:45.487Z"
  },
  {
    "id": "046ef050-ebe2-4f41-a50f-3e8c628c213c",
    "sentence": "Se eu ___ mais dinheiro, compraria uma casa.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "tinha",
      "tiver",
      "tenha"
    ],
    "explanations": {
      "pt": "Em condições hipotéticas no presente/futuro, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In hypothetical present/future conditions, we use the imperfect subjunctive after 'se'.",
      "uk": "У гіпотетичних умовах теперішнього/майбутнього часу ми використовуємо імперфект суб'юнктива після 'se'."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "person": "eu",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.486Z",
    "updatedAt": "2025-08-09T23:45:27.033Z"
  },
  {
    "id": "3a4c4848-7d4a-4bc3-866c-5ba572104144",
    "sentence": "A carta ___ ontem pelo carteiro.",
    "gapIndex": 8,
    "correctAnswer": "foi entregue",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "estava entregue",
      "foi entregue",
      "tinha entregue"
    ],
    "explanations": {
      "pt": "Na voz passiva, usamos 'ser' + particípio passado para ações concluídas.",
      "en": "In passive voice, we use 'ser' + past participle for completed actions.",
      "uk": "У пасивному стані ми використовуємо 'ser' + дієприкметник минулого часу для завершених дій."
    },
    "hint": {
      "form": "preterite perfect passive",
      "person": "ele/ela",
      "infinitive": "ser + entregar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.485Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "daff0680-2188-4fdb-8cea-676231304c82",
    "sentence": "Embora ele ___ que está errado, não quer admitir.",
    "gapIndex": 11,
    "correctAnswer": "saiba",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "soubesse",
      "sabe",
      "saber",
      "saiba"
    ],
    "explanations": {
      "pt": "Após 'embora', usamos o presente do conjuntivo do verbo 'saber'.",
      "en": "After 'embora' (although), we use the present subjunctive of the verb 'saber'.",
      "uk": "Після 'embora' (хоча) ми використовуємо теперішній час суб'юнктива дієслова 'saber'."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "ele/ela",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.483Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "7768e5e4-24af-4788-a162-6c66020d8d12",
    "sentence": "Não ___ fazer isso agora porque estou ocupado.",
    "gapIndex": 4,
    "correctAnswer": "posso",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "posso",
      "possa",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'poder' para expressar impossibilidade geral ou permissão, não capacidade física.",
      "en": "We use 'poder' to express general impossibility or permission, not physical ability.",
      "uk": "Ми використовуємо 'poder' для вираження загальної неможливості або дозволу, а не фізичної здатності."
    },
    "hint": {
      "context": "physical/general possibility",
      "distinction": "poder vs conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.480Z",
    "updatedAt": "2025-07-25T12:25:45.480Z"
  },
  {
    "id": "ca8ac0d4-64ed-4800-9935-468b773c16a9",
    "sentence": "Os documentos ___ ao diretor esta manhã.",
    "gapIndex": 14,
    "correctAnswer": "foram entregues",
    "topic": "voz-passiva",
    "level": "B1",
    "multipleChoiceOptions": [
      "foram entregues",
      "entregaram-se",
      "foram entregados"
    ],
    "explanations": {
      "pt": "Na voz passiva, usamos o verbo 'ser' + particípio passado do verbo principal.",
      "en": "In passive voice, we use the verb 'ser' + past participle of the main verb.",
      "uk": "У пасивному стані використовуємо дієслово 'ser' + дієприкметник минулого часу основного дієслова."
    },
    "hint": {
      "form": "voz passiva",
      "infinitive": "entregar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.084Z",
    "updatedAt": "2025-07-25T12:25:43.084Z"
  },
  {
    "id": "62a64724-9e43-4c27-8ad1-62a6ea1eb7c7",
    "sentence": "Quando ___ o trabalho, poderemos ir de férias.",
    "gapIndex": 7,
    "correctAnswer": "tivermos terminado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "teremos terminado",
      "tenhamos terminado",
      "tivermos terminado"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usamos o futuro perfeito do conjuntivo.",
      "en": "With 'quando' referring to the future, we use the future perfect subjunctive.",
      "uk": "З 'quando', що відноситься до майбутнього, ми використовуємо майбутній доконаний час суб'юнктива."
    },
    "hint": {
      "form": "futuro perfeito do conjuntivo",
      "infinitive": "terminar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.083Z",
    "updatedAt": "2025-07-25T12:25:45.484Z"
  },
  {
    "id": "7aeee8e6-0c6e-4f37-8b0e-089cd4089ac5",
    "sentence": "O livro ___ foi escrito por José Saramago ganhou o Prémio Nobel.",
    "gapIndex": 8,
    "correctAnswer": "que",
    "topic": "pronomes-relativos",
    "level": "B1",
    "multipleChoiceOptions": [
      "que",
      "onde",
      "qual",
      "cujo"
    ],
    "explanations": {
      "pt": "Usamos 'que' como pronome relativo para referir ao sujeito da oração anterior.",
      "en": "We use 'que' as a relative pronoun to refer to the subject of the previous clause.",
      "uk": "Ми використовуємо 'que' як відносний займенник для посилання на підмет попереднього речення."
    },
    "hint": {
      "function": "pronome relativo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.082Z",
    "updatedAt": "2025-07-26T15:16:11.022Z"
  },
  {
    "id": "c7619c07-e077-4ac7-84b3-2c49a8e7c6d4",
    "sentence": "Embora ele ___ muito dinheiro, vive de forma simples.",
    "gapIndex": 11,
    "correctAnswer": "tenha",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tem",
      "tiver",
      "tivesse"
    ],
    "explanations": {
      "pt": "Após 'embora', usamos o presente do conjuntivo para expressar contraste.",
      "en": "After 'embora' (although), we use the present subjunctive to express contrast.",
      "uk": "Після 'embora' (хоча) використовуємо теперішній час кон'юнктива для вираження контрасту."
    },
    "hint": {
      "form": "presente do conjuntivo",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.080Z",
    "updatedAt": "2025-07-25T12:25:43.080Z"
  },
  {
    "id": "9fc901d7-00b7-40e0-aa23-1ca0b3ff2a4c",
    "sentence": "Não ___ sair hoje porque estou doente.",
    "gapIndex": 4,
    "correctAnswer": "consigo",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "posso",
      "sei"
    ],
    "explanations": {
      "pt": "'Conseguir' indica capacidade física ou habilidade, enquanto 'poder' indica permissão.",
      "en": "'Conseguir' indicates physical ability or capability, while 'poder' indicates permission.",
      "uk": "'Conseguir' вказує на фізичну здатність, тоді як 'poder' вказує на дозвіл."
    },
    "hint": {
      "form": "present indicative",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.078Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "1d2017b1-c275-4496-9cdb-e8afe726ec9f",
    "sentence": "Se eu ___ mais tempo, teria feito um trabalho melhor.",
    "gapIndex": 6,
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tivesse",
      "tiver",
      "tinha"
    ],
    "explanations": {
      "pt": "Nas condicionais irreais do passado, usamos o imperfeito do conjuntivo após 'se'.",
      "en": "In unreal past conditionals, we use the imperfect subjunctive after 'se' (if).",
      "uk": "У нереальних умовних реченнях минулого часу після 'se' (якщо) використовуємо імперфект кон'юнктива."
    },
    "hint": {
      "form": "imperfeito do conjuntivo",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.074Z",
    "updatedAt": "2025-07-25T12:25:43.074Z"
  },
  {
    "id": "acb002ce-6597-49fb-9229-5194fb6a1875",
    "sentence": "Ela está ___ trabalhar no computador.",
    "gapIndex": 9,
    "correctAnswer": "a",
    "topic": "presente-continuo",
    "level": "A1",
    "multipleChoiceOptions": [
      "a",
      "de",
      "para"
    ],
    "explanations": {
      "pt": "No presente contínuo, usamos 'estar a' + infinitivo.",
      "en": "In the present continuous, we use 'estar a' + infinitive.",
      "uk": "У теперішньому тривалому часі ми використовуємо 'estar a' + інфінітив."
    },
    "hint": {
      "type": "preposição do presente contínuo"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.090Z",
    "updatedAt": "2025-07-25T12:22:48.090Z"
  },
  {
    "id": "15423f90-6242-4c4d-9345-1074aecb4298",
    "sentence": "___ moras em Lisboa?",
    "gapIndex": 0,
    "correctAnswer": "Onde",
    "topic": "interrogativos",
    "level": "A1",
    "multipleChoiceOptions": [
      "Onde",
      "Quando",
      "Quem",
      "Como"
    ],
    "explanations": {
      "pt": "'Onde' é usado para perguntar sobre localização.",
      "en": "'Onde' is used to ask about location.",
      "uk": "'Onde' використовується для запитання про місцезнаходження."
    },
    "hint": {
      "type": "palavra interrogativa de lugar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.089Z",
    "updatedAt": "2025-07-25T12:22:48.089Z"
  },
  {
    "id": "ebb712fc-7c4b-40d8-8ab1-109bc1187378",
    "sentence": "___ livros são interessantes?",
    "gapIndex": 0,
    "correctAnswer": "Estes",
    "topic": "demonstrativos-variaveis",
    "level": "A1",
    "multipleChoiceOptions": [
      "Essa",
      "Este",
      "Estes",
      "Aqueles"
    ],
    "explanations": {
      "pt": "'Estes' é o demonstrativo masculino plural para objetos próximos do falante.",
      "en": "'Estes' is the masculine plural demonstrative for objects close to the speaker.",
      "uk": "'Estes' - це вказівний займенник чоловічого роду множини для об'єктів, близьких до мовця."
    },
    "hint": {
      "type": "demonstrativo plural masculino"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.089Z",
    "updatedAt": "2025-07-25T12:22:48.089Z"
  },
  {
    "id": "cbc0c196-b8f8-45ff-8d0f-caf2ee8023b9",
    "sentence": "Eles ___ as mãos antes de comer.",
    "gapIndex": 5,
    "correctAnswer": "lavam-se",
    "topic": "pronomes-reflexos",
    "level": "A1",
    "multipleChoiceOptions": [
      "lavam-se",
      "se-lavam",
      "lavam"
    ],
    "explanations": {
      "pt": "Com verbos reflexivos, o pronome '-se' junta-se ao verbo na forma correta.",
      "en": "With reflexive verbs, the pronoun '-se' is attached to the verb in the correct form.",
      "uk": "З рефлексивними дієсловами займенник '-se' приєднується до дієслова у правильній формі."
    },
    "hint": {
      "form": "presente",
      "infinitive": "lavar-se"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.088Z",
    "updatedAt": "2025-07-25T12:22:48.088Z"
  },
  {
    "id": "c3c3ee8b-5e63-4cc1-af9e-624e2e5af7a6",
    "sentence": "___ menino está a brincar.",
    "gapIndex": 0,
    "correctAnswer": "O",
    "topic": "artigos-definidos-indefinidos",
    "level": "A1",
    "multipleChoiceOptions": [
      "O",
      "Os",
      "Um",
      "A"
    ],
    "explanations": {
      "pt": "Usamos o artigo definido 'o' para um substantivo masculino singular específico.",
      "en": "We use the definite article 'o' for a specific singular masculine noun.",
      "uk": "Ми використовуємо означений артикль 'o' для конкретного іменника чоловічого роду в однині."
    },
    "hint": {
      "type": "artigo definido masculino"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.088Z",
    "updatedAt": "2025-07-25T12:22:48.088Z"
  },
  {
    "id": "b88ae551-515d-4ede-8663-69e40c579a3c",
    "sentence": "Tu ___ uma casa bonita.",
    "gapIndex": 3,
    "correctAnswer": "tens",
    "topic": "verbo-ter",
    "level": "A1",
    "multipleChoiceOptions": [
      "tem",
      "tens",
      "temos"
    ],
    "explanations": {
      "pt": "Na segunda pessoa do singular, a forma correta do verbo 'ter' é 'tens'.",
      "en": "In second person singular, the correct form of the verb 'ter' (to have) is 'tens'.",
      "uk": "У другій особі однини правильна форма дієслова 'ter' (мати) - 'tens'."
    },
    "hint": {
      "form": "presente",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.087Z",
    "updatedAt": "2025-07-25T14:50:27.209Z"
  },
  {
    "id": "41ac3ee9-6282-415a-8b68-6e140bca1ae1",
    "sentence": "Eu ___ muito feliz hoje.",
    "gapIndex": 3,
    "correctAnswer": "estou",
    "topic": "verbo-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "és",
      "sou",
      "está",
      "estou"
    ],
    "explanations": {
      "pt": "Usamos 'estou' para expressar estados temporários na primeira pessoa do singular.",
      "en": "We use 'estou' (estar) for temporary states in first person singular.",
      "uk": "Ми використовуємо 'estou' для вираження тимчасового стану в першій особі однини."
    },
    "hint": {
      "form": "presente",
      "infinitive": "estar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.079Z",
    "updatedAt": "2025-07-25T14:50:27.207Z"
  },
  {
    "id": "e81801e7-e8f0-4ffe-bef7-e49b3b70a063",
    "sentence": "Eu ___ café todas as manhãs.",
    "gapIndex": 3,
    "correctAnswer": "bebo",
    "topic": "present-indicative",
    "level": "A1",
    "multipleChoiceOptions": [
      "bebo",
      "bebem",
      "beber",
      "bebe"
    ],
    "explanations": {
      "pt": "Com o pronome 'eu', usamos a forma 'bebo' no presente do indicativo para expressar uma ação habitual.",
      "en": "With the pronoun 'I' (eu), we use the form 'bebo' in the present indicative to express a habitual action.",
      "uk": "З займенником 'я' (eu) ми використовуємо форму 'bebo' в теперішньому часі для вираження звичної дії."
    },
    "hint": {
      "form": "presente do indicativo",
      "infinitive": "beber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T08:55:24.717Z",
    "updatedAt": "2025-07-25T08:55:24.717Z"
  },
  {
    "id": "ab200b18-57ff-4381-a99f-060835ec86f9",
    "sentence": "___ dia! Como está?",
    "gapIndex": 0,
    "correctAnswer": "Bom",
    "topic": "greetings",
    "level": "A1",
    "multipleChoiceOptions": [
      "Bom",
      "Boa",
      "Muito",
      "Bem"
    ],
    "explanations": {
      "pt": "Usamos 'Bom dia' como saudação formal durante o dia. 'Bom' concorda em género com a palavra masculina 'dia'.",
      "en": "We use 'Bom dia' as a formal greeting during the day. 'Bom' agrees in gender with the masculine noun 'dia'.",
      "uk": "Ми використовуємо 'Bom dia' як формальне вітання протягом дня. 'Bom' узгоджується в роді з іменником чоловічого роду 'dia'."
    },
    "hint": {
      "context": "formal greeting",
      "timeOfDay": "morning/day"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T08:21:12.586Z",
    "updatedAt": "2025-07-25T08:21:12.586Z"
  },
  {
    "id": "adcd71dc-cf54-4da5-b64c-56c5ebc54624",
    "sentence": "Embora ___ muito dinheiro, ele vive modestamente.",
    "gapIndex": 7,
    "correctAnswer": "tenha",
    "topic": "presente-conjuntivo-irregulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "tiver",
      "tem",
      "tenha"
    ],
    "explanations": {
      "pt": "'Embora' requer o uso do presente do conjuntivo para expressar uma concessão.",
      "en": "'Embora' requires the present subjunctive to express concession.",
      "uk": "'Embora' вимагає використання теперішнього часу умовного способу для вираження поступки."
    },
    "hint": {
      "form": "present subjunctive",
      "person": "ele/ela",
      "infinitive": "ter"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.130Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "63d45d02-d86a-4117-8024-385266bc1b12",
    "sentence": "A decisão ___ tomada pelo conselho administrativo.",
    "gapIndex": 10,
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B2",
    "multipleChoiceOptions": [
      "foi",
      "era",
      "seria",
      "tinha sido"
    ],
    "explanations": {
      "pt": "Na voz passiva, usamos 'ser' no tempo adequado + particípio passado do verbo principal.",
      "en": "In passive voice, we use 'ser' in the appropriate tense + past participle of the main verb.",
      "uk": "У пасивному стані ми використовуємо 'ser' у відповідному часі + дієприкметник минулого часу основного дієслова."
    },
    "hint": {
      "form": "simple past",
      "person": "ele/ela",
      "infinitive": "ser"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.129Z",
    "updatedAt": "2025-08-09T23:45:27.034Z"
  },
  {
    "id": "6e85f8ab-f3c6-4453-a86c-ef4154a33e0f",
    "sentence": "O relatório ___ ser entregue até amanhã.",
    "gapIndex": 12,
    "correctAnswer": "tem de",
    "topic": "dever-ter-de",
    "level": "B2",
    "multipleChoiceOptions": [
      "tem de",
      "deve",
      "tinha de",
      "devia"
    ],
    "explanations": {
      "pt": "'Ter de' expressa uma obrigação mais forte e inevitável que 'dever'.",
      "en": "'Ter de' expresses a stronger and more unavoidable obligation than 'dever'.",
      "uk": "'Ter de' виражає сильніше і неминуче зобов'язання порівняно з 'dever'."
    },
    "hint": {
      "context": "strict deadline",
      "distinction": "obligation vs moral duty"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.128Z",
    "updatedAt": "2025-07-25T07:56:04.128Z"
  },
  {
    "id": "f905e893-58a4-4ddd-a720-e7d963354989",
    "sentence": "Quando ___ que vais mudar de emprego?",
    "gapIndex": 7,
    "correctAnswer": "soubeste",
    "topic": "saber-conhecer",
    "level": "B1",
    "multipleChoiceOptions": [
      "sabes",
      "soubeste",
      "conheceste",
      "conhecias"
    ],
    "explanations": {
      "pt": "'Saber' é usado para informação adquirida ou conhecimento de fatos específicos.",
      "en": "'Saber' is used for acquired information or knowledge of specific facts.",
      "uk": "'Saber' використовується для позначення отриманої інформації або знання конкретних фактів."
    },
    "hint": {
      "form": "simple past",
      "person": "tu",
      "infinitive": "saber"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.127Z",
    "updatedAt": "2025-08-09T23:45:27.035Z"
  },
  {
    "id": "49febe5a-7858-458e-a6e9-3a6315e6d3f0",
    "sentence": "Não ___ ajudá-lo por estar doente.",
    "gapIndex": 4,
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "consegui",
      "pude",
      "podia"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' quando se trata de capacidade física ou habilidade específica para realizar algo.",
      "en": "We use 'conseguir' when referring to physical ability or specific capability to accomplish something.",
      "uk": "Ми використовуємо 'conseguir', коли йдеться про фізичну здатність або конкретну можливість щось зробити."
    },
    "hint": {
      "form": "simple past",
      "person": "eu",
      "infinitive": "conseguir"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.122Z",
    "updatedAt": "2025-08-09T23:45:27.036Z"
  },
  {
    "id": "1e8a8fd1-de33-4c10-b1ba-3c451c2e9890",
    "sentence": "Tu ___ sempre às oito horas?",
    "gapIndex": 3,
    "correctAnswer": "trabalhas",
    "topic": "presente-indicativo-regulares",
    "level": "A1",
    "multipleChoiceOptions": [
      "trabalho",
      "trabalha",
      "trabalhas"
    ],
    "explanations": {
      "pt": "Com o sujeito 'tu', usamos a segunda pessoa do singular 'trabalhas' no presente do indicativo.",
      "en": "With the subject 'tu' (you informal), we use the second person singular 'trabalhas' in the present indicative.",
      "uk": "З підметом 'tu' (ти) використовуємо другу особу однини 'trabalhas' в теперішньому часі."
    },
    "hint": {
      "form": "presente do indicativo",
      "infinitive": "trabalhar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.236Z",
    "updatedAt": "2025-07-21T14:46:17.236Z"
  },
  {
    "id": "8e105f82-3d82-4570-93cf-297b3a0c8b25",
    "sentence": "Nós ___ na universidade todos os dias.",
    "gapIndex": 4,
    "correctAnswer": "estudamos",
    "topic": "presente-indicativo-regulares",
    "level": "A1",
    "multipleChoiceOptions": [
      "estudamos",
      "estudam",
      "estudo",
      "estudas"
    ],
    "explanations": {
      "pt": "Com o sujeito 'nós', usamos a primeira pessoa do plural 'estudamos' no presente do indicativo.",
      "en": "With the subject 'nós' (we), we use the first person plural 'estudamos' in the present indicative.",
      "uk": "З підметом 'nós' (ми) використовуємо першу особу множини 'estudamos' в теперішньому часі."
    },
    "hint": {
      "form": "presente do indicativo",
      "infinitive": "estudar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.235Z",
    "updatedAt": "2025-07-21T14:46:17.235Z"
  },
  {
    "id": "2e5763cf-3c05-4803-adbe-11345bfe7bae",
    "sentence": "Ela ___ muito bem português.",
    "gapIndex": 4,
    "correctAnswer": "fala",
    "topic": "presente-indicativo-regulares",
    "level": "A1",
    "multipleChoiceOptions": [
      "falam",
      "falas",
      "falo",
      "fala"
    ],
    "explanations": {
      "pt": "Com o sujeito 'ela', usamos a terceira pessoa do singular 'fala' no presente do indicativo.",
      "en": "With the subject 'ela' (she), we use the third person singular 'fala' in the present indicative.",
      "uk": "З підметом 'ela' (вона) ми використовуємо третю особу однини 'fala' в теперішньому часі."
    },
    "hint": {
      "form": "presente do indicativo",
      "infinitive": "falar"
    },
    "source": "ai",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.229Z",
    "updatedAt": "2025-07-21T14:46:17.229Z"
  },
  {
    "id": "57578c2d-d864-4fa8-8175-83d42757e586",
    "sentence": "Caso você ___ interessado, contacte-nos.",
    "gapIndex": 1,
    "correctAnswer": "esteja",
    "topic": "present-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "esteja",
      "o",
      "de",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"esteja\" (present subjunctive).",
      "en": "We use \"esteja\" (present subjunctive).",
      "uk": "Ми використовуємо \"esteja\" (present subjunctive)."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "estar"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.067Z",
    "updatedAt": "2025-07-26T09:05:07.738Z"
  },
  {
    "id": "dfe211aa-d7ac-48e3-8e40-ac26300c4ffd",
    "sentence": "Espero que ___ tempo para nos encontrarmos.",
    "gapIndex": 1,
    "correctAnswer": "haja",
    "topic": "present-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "haja",
      "em",
      "um",
      "o"
    ],
    "explanations": {
      "pt": "Usamos \"haja\" (present subjunctive).",
      "en": "We use \"haja\" (present subjunctive).",
      "uk": "Ми використовуємо \"haja\" (present subjunctive)."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "haver"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.067Z",
    "updatedAt": "2025-07-26T09:05:07.737Z"
  },
  {
    "id": "4064e7b6-7a9d-42c1-b2ac-894ee1028100",
    "sentence": "Se ele ___ estudado, teria passado no exame.",
    "gapIndex": 1,
    "correctAnswer": "tivesse",
    "topic": "pluperfect-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "para",
      "em",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"tivesse\" (pluperfect subjunctive).",
      "en": "We use \"tivesse\" (pluperfect subjunctive).",
      "uk": "Ми використовуємо \"tivesse\" (pluperfect subjunctive)."
    },
    "hint": {
      "form": "pluperfect subjunctive",
      "infinitive": "ter"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-07-26T09:05:07.737Z"
  },
  {
    "id": "87003fdf-0adf-4915-aeb0-19a738cb269e",
    "sentence": "Embora ___ difícil, conseguiu acabar o trabalho.",
    "gapIndex": 1,
    "correctAnswer": "fosse",
    "topic": "imperfect-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "fosse",
      "com",
      "o",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"fosse\" (imperfect subjunctive).",
      "en": "We use \"fosse\" (imperfect subjunctive).",
      "uk": "Ми використовуємо \"fosse\" (imperfect subjunctive)."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "infinitive": "ser"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-07-26T09:05:07.737Z"
  },
  {
    "id": "a4781bd1-f6d6-49ee-a3af-0994884483b9",
    "sentence": "É importante que ele ___ a verdade.",
    "gapIndex": 1,
    "correctAnswer": "diga",
    "topic": "present-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "diga",
      "de",
      "um",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"diga\" (present subjunctive).",
      "en": "We use \"diga\" (present subjunctive).",
      "uk": "Ми використовуємо \"diga\" (present subjunctive)."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "dizer"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-07-26T09:05:07.736Z"
  },
  {
    "id": "3a315e0a-fce8-4d5e-9452-c13dc98e05a2",
    "sentence": "A casa ___ construída pelos operários.",
    "gapIndex": 1,
    "correctAnswer": "foi",
    "topic": "passive-voice",
    "level": "B2",
    "multipleChoiceOptions": [
      "foi",
      "com",
      "em",
      "de"
    ],
    "explanations": {
      "pt": "Usamos \"foi\" (passive voice (simple past)).",
      "en": "We use \"foi\" (passive voice (simple past)).",
      "uk": "Ми використовуємо \"foi\" (passive voice (simple past))."
    },
    "hint": {
      "form": "passive voice (simple past)",
      "infinitive": "ser"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.065Z",
    "updatedAt": "2025-07-26T09:05:07.736Z"
  },
  {
    "id": "d532b406-b978-4605-9acc-a0e7f78d6b45",
    "sentence": "Quando ___ tempo, falaremos.",
    "gapIndex": 1,
    "correctAnswer": "houver",
    "topic": "future-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "houver",
      "o",
      "em",
      "de"
    ],
    "explanations": {
      "pt": "Usamos \"houver\" (future subjunctive (impersonal)).",
      "en": "We use \"houver\" (future subjunctive (impersonal)).",
      "uk": "Ми використовуємо \"houver\" (future subjunctive (impersonal))."
    },
    "hint": {
      "form": "future subjunctive (impersonal)",
      "infinitive": "haver"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.065Z",
    "updatedAt": "2025-07-26T09:05:07.736Z"
  },
  {
    "id": "2d897e50-3583-4d9e-b6e2-bb1e126755fd",
    "sentence": "Se eu ___ rico, compraria uma casa.",
    "gapIndex": 1,
    "correctAnswer": "fosse",
    "topic": "imperfect-subjunctive",
    "level": "B2",
    "multipleChoiceOptions": [
      "fosse",
      "para",
      "com",
      "de"
    ],
    "explanations": {
      "pt": "Usamos \"fosse\" (imperfect subjunctive).",
      "en": "We use \"fosse\" (imperfect subjunctive).",
      "uk": "Ми використовуємо \"fosse\" (imperfect subjunctive)."
    },
    "hint": {
      "form": "imperfect subjunctive",
      "infinitive": "ser"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.064Z",
    "updatedAt": "2025-07-26T09:05:07.735Z"
  },
  {
    "id": "7fe9ec4d-d6e5-4c17-bc23-a003046b83aa",
    "sentence": "___ aqui!",
    "gapIndex": 0,
    "correctAnswer": "Vem",
    "topic": "imperative-mood",
    "level": "B1",
    "multipleChoiceOptions": [
      "Vem",
      "de",
      "para",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"Vem\" (imperative (informal command)).",
      "en": "We use \"Vem\" (imperative (informal command)).",
      "uk": "Ми використовуємо \"Vem\" (imperative (informal command))."
    },
    "hint": {
      "form": "imperative (informal command)",
      "person": "2ª pessoa singular",
      "infinitive": "vir"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.064Z",
    "updatedAt": "2025-07-26T09:05:07.735Z"
  },
  {
    "id": "9aa73fa1-314c-4e8a-a8fc-c3ddc8913c2c",
    "sentence": "Se eu tivesse tempo, ___ contigo.",
    "gapIndex": 1,
    "correctAnswer": "iria",
    "topic": "conditional-simple",
    "level": "B1",
    "multipleChoiceOptions": [
      "iria",
      "para",
      "de",
      "um"
    ],
    "explanations": {
      "pt": "Usamos \"iria\" (conditional simple).",
      "en": "We use \"iria\" (conditional simple).",
      "uk": "Ми використовуємо \"iria\" (conditional simple)."
    },
    "hint": {
      "form": "conditional simple",
      "infinitive": "ir"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-07-26T09:05:07.735Z"
  },
  {
    "id": "25c1f692-f42b-4018-99f7-850972ada2b7",
    "sentence": "É importante que tu ___ cedo.",
    "gapIndex": 1,
    "correctAnswer": "chegues",
    "topic": "present-subjunctive",
    "level": "B1",
    "multipleChoiceOptions": [
      "chegues",
      "em",
      "um",
      "para"
    ],
    "explanations": {
      "pt": "Usamos \"chegues\" (present subjunctive).",
      "en": "We use \"chegues\" (present subjunctive).",
      "uk": "Ми використовуємо \"chegues\" (present subjunctive)."
    },
    "hint": {
      "form": "present subjunctive",
      "infinitive": "chegar"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-07-26T09:05:07.734Z"
  },
  {
    "id": "4b6a52b1-7cdd-419e-be2f-ab773962f6c5",
    "sentence": "Eu ___ vi ontem.",
    "gapIndex": 1,
    "correctAnswer": "te",
    "topic": "direct-object-pronouns",
    "level": "A2",
    "multipleChoiceOptions": [
      "te",
      "o",
      "para",
      "um"
    ],
    "explanations": {
      "pt": "A resposta correta é \"te\".",
      "en": "The correct answer is \"te\".",
      "uk": "Правильна відповідь: \"te\"."
    },
    "hint": {
      "form": "direct object pronoun (you - informal)"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-07-26T09:05:07.734Z"
  },
  {
    "id": "66ea881b-e13a-47b8-b22a-50dad0e6c740",
    "sentence": "Amanhã nós ___ viajar.",
    "gapIndex": 1,
    "correctAnswer": "vamos",
    "topic": "future-simple",
    "level": "A2",
    "multipleChoiceOptions": [
      "vamos",
      "um",
      "em",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"vamos\" (future with ir + infinitive).",
      "en": "We use \"vamos\" (future with ir + infinitive).",
      "uk": "Ми використовуємо \"vamos\" (future with ir + infinitive)."
    },
    "hint": {
      "form": "future with ir + infinitive",
      "infinitive": "ir"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-19T13:59:16.062Z",
    "updatedAt": "2025-07-26T09:05:07.734Z"
  },
  {
    "id": "78f87ae1-cc62-4fb5-9dbd-e18665741b3e",
    "sentence": "Quando era criança, ___ muito feliz.",
    "gapIndex": 1,
    "correctAnswer": "era",
    "topic": "imperfect",
    "level": "A2",
    "multipleChoiceOptions": [
      "era",
      "um",
      "com",
      "o"
    ],
    "explanations": {
      "pt": "Usamos \"era\" (pretérito imperfeito (imperfect)).",
      "en": "We use \"era\" (pretérito imperfeito (imperfect)).",
      "uk": "Ми використовуємо \"era\" (pretérito imperfeito (imperfect))."
    },
    "hint": {
      "form": "pretérito imperfeito (imperfect)",
      "person": "1ª pessoa",
      "infinitive": "ser"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-19T13:59:16.062Z",
    "updatedAt": "2025-07-26T09:05:07.733Z"
  },
  {
    "id": "1665dffd-c253-46f0-b8a9-604f5a8aae01",
    "sentence": "Ontem eu ___ ao cinema.",
    "gapIndex": 1,
    "correctAnswer": "fui",
    "topic": "preterite-perfect",
    "level": "A2",
    "multipleChoiceOptions": [
      "fui",
      "foi",
      "era",
      "será"
    ],
    "explanations": {
      "pt": "Usamos \"fui\" (pretérito perfeito (simple past)).",
      "en": "We use \"fui\" (pretérito perfeito (simple past)).",
      "uk": "Ми використовуємо \"fui\" (pretérito perfeito (simple past))."
    },
    "hint": {
      "form": "pretérito perfeito (simple past)",
      "infinitive": "ir"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-19T13:59:16.061Z",
    "updatedAt": "2025-07-26T09:05:07.733Z"
  },
  {
    "id": "759d1b6b-36a9-46f6-9b33-7992c5f51208",
    "sentence": "O menino ___ alto.",
    "gapIndex": 1,
    "correctAnswer": "está",
    "topic": "ser-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "está",
      "é",
      "era",
      "seja"
    ],
    "explanations": {
      "pt": "Usamos \"está\" (present indicative (temporary state)).",
      "en": "We use \"está\" (present indicative (temporary state)).",
      "uk": "Ми використовуємо \"está\" (present indicative (temporary state))."
    },
    "hint": {
      "form": "present indicative (temporary state)",
      "infinitive": "estar"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 597,
    "createdAt": "2025-07-19T13:59:16.061Z",
    "updatedAt": "2025-07-26T09:05:07.732Z"
  },
  {
    "id": "819255cb-9a36-442e-b511-a9ac127b370e",
    "sentence": "___ casa é muito bonita.",
    "gapIndex": 0,
    "correctAnswer": "A",
    "topic": "articles",
    "level": "A1",
    "multipleChoiceOptions": [
      "A",
      "o",
      "a",
      "os"
    ],
    "explanations": {
      "pt": "\"A\" é o artigo correto neste contexto.",
      "en": "\"A\" is the correct article in this context.",
      "uk": "\"A\" - правильний артикль у цьому контексті."
    },
    "hint": {
      "form": "definite article (feminine singular)"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 597,
    "createdAt": "2025-07-19T13:59:16.060Z",
    "updatedAt": "2025-07-26T09:05:07.732Z"
  },
  {
    "id": "e3e581bc-d5ca-4e22-9dff-bedb74e2e7b3",
    "sentence": "Ela ___ professora.",
    "gapIndex": 1,
    "correctAnswer": "é",
    "topic": "ser-estar",
    "level": "A1",
    "multipleChoiceOptions": [
      "é",
      "está",
      "era",
      "seja"
    ],
    "explanations": {
      "pt": "Usamos \"é\" (present indicative).",
      "en": "We use \"é\" (present indicative).",
      "uk": "Ми використовуємо \"é\" (present indicative)."
    },
    "hint": {
      "form": "present indicative",
      "infinitive": "ser"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 597,
    "createdAt": "2025-07-19T13:59:16.059Z",
    "updatedAt": "2025-07-26T09:05:07.731Z"
  },
  {
    "id": "fc3469bc-6c25-4a4e-b22b-3449e9adc945",
    "sentence": "Eu ___ português.",
    "gapIndex": 1,
    "correctAnswer": "falo",
    "topic": "present-indicative",
    "level": "A1",
    "multipleChoiceOptions": [
      "falo",
      "falas",
      "fala",
      "falamos"
    ],
    "explanations": {
      "pt": "Usamos \"falo\" (present indicative).",
      "en": "We use \"falo\" (present indicative).",
      "uk": "Ми використовуємо \"falo\" (present indicative)."
    },
    "hint": {
      "form": "present indicative",
      "infinitive": "falar"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 605,
    "createdAt": "2025-07-19T13:59:16.056Z",
    "updatedAt": "2025-07-26T09:05:07.728Z"
  },
  {
    "id": "c29faa7d-1143-4fed-8394-b1536d7836e3",
    "sentence": "Nós ___ uma casa grande.",
    "gapIndex": 1,
    "correctAnswer": "temos",
    "topic": "present-indicative",
    "level": "A1",
    "multipleChoiceOptions": [
      "temos",
      "falo",
      "falas",
      "fala"
    ],
    "explanations": {
      "pt": "Usamos \"temos\" (present indicative).",
      "en": "We use \"temos\" (present indicative).",
      "uk": "Ми використовуємо \"temos\" (present indicative)."
    },
    "hint": {
      "form": "present indicative",
      "infinitive": "ter"
    },
    "source": "static",
    "difficultyScore": 0.5,
    "usageCount": 606,
    "createdAt": "2025-07-19T13:59:16.059Z",
    "updatedAt": "2025-07-26T15:55:00.499Z"
  }
];

export async function seedProductionDatabase(): Promise<void> {
  console.log('🌱 Seeding production database with local data...');
  
  try {
    // Initialize tables
    await LocalDatabase.initializeTables();
    
    // Clear existing exercises (production reset)
    console.log('🧹 Clearing existing production data...');
    await LocalDatabase.clearAllExercises();
    
    // Insert exercises in batches
    console.log(`📊 Inserting ${EXERCISES_DATA.length} exercises...`);
    let inserted = 0;
    
    for (const exercise of EXERCISES_DATA) {
      try {
        await LocalDatabase.addExercise({
          ...exercise,
          source: exercise.source as "ai" | "database" | "static" | "fallback" | undefined,
          level: exercise.level as LanguageLevel,
          createdAt: new Date(exercise.createdAt),
          updatedAt: new Date(exercise.updatedAt)
        } as EnhancedExercise);
        inserted++;
        if (inserted % 50 === 0) {
          console.log(`   Progress: ${inserted}/${EXERCISES_DATA.length} exercises inserted`);
        }
      } catch (error) {
        // Skip duplicates, log other errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('duplicate')) {
          console.warn(`   ⚠️ Skipped exercise: ${errorMessage}`);
        }
      }
    }
    
    // Verify results
    const stats = await LocalDatabase.getUsageStats();
    
    console.log(`\n✅ Production database seeded successfully!`);
    console.log(`📈 Final statistics:`);
    console.log(`   Total exercises: ${stats.totalExercises}`);
    console.log(`   By level: ${Object.entries(stats.exercisesByLevel).map(([k,v]) => `${k}:${v}`).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Production seeding failed:', error);
    throw error;
  }
}

// Allow running as standalone script
if (require.main === module) {
  seedProductionDatabase()
    .then(() => {
      console.log('Production seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Production seeding failed:', error);
      process.exit(1);
    });
}
