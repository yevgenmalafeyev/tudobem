#!/usr/bin/env tsx

/**
 * Production Database Seed Script
 * Generated automatically from local database dump
 * Last updated: 2025-08-10T19:34:25.355Z
 */

import { LocalDatabase } from '@/lib/localDatabase';

const EXERCISES_DATA = [
  {
    "id": "a967d04b-44b2-4e0b-acdf-7f2c0ceec57c",
    "sentence": "Amanhã a esta hora já _____ a documentação.",
    "correctAnswer": "terei enviado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terei enviado",
      "teria enviado",
      "enviarei",
      "tenho enviado"
    ],
    "explanations": {
      "pt": "O futuro perfeito do indicativo forma-se com 'ter' no futuro + particípio: 'terei enviado'. Marca ação concluída no futuro.",
      "en": "The future perfect indicative is 'ter' in the future + past participle: 'terei enviado', marking a completed future action.",
      "uk": "Майбутній перфект індикатива: 'ter' у майбутньому + дієприкметник — 'terei enviado', дія завершена в майбутньому."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "31323963-f873-49ea-b68d-606d6462c987",
    "sentence": "Oxalá não _____ mais cancelamentos este mês!",
    "correctAnswer": "haja",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "haverá",
      "houve",
      "há",
      "haja"
    ],
    "explanations": {
      "pt": "Com 'oxalá' e existência, usa-se conjuntivo presente: 'haja'.",
      "en": "With 'oxalá' and existence, use the present subjunctive: 'haja'.",
      "uk": "З 'oxalá' для існування — презент кон'юнктива: 'haja'."
    },
    "hint": "haver",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "f6c75ff2-5230-41d3-b14e-604ec1bf22e0",
    "sentence": "Tomara que eu _____ forças para continuar!",
    "correctAnswer": "tenha",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenho",
      "terei",
      "tenha",
      "tivesse"
    ],
    "explanations": {
      "pt": "Com 'tomara que', 1.ª singular no conjuntivo presente: 'tenha'.",
      "en": "With 'tomara que', 1st sg in present subjunctive: 'tenha'.",
      "uk": "З 'tomara que' — 1-ша однини презент кон'юнктива: 'tenha'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "743f07d1-02ea-49b0-8725-c0be539e5d26",
    "sentence": "Quem me dera que eles _____ a minha ideia!",
    "correctAnswer": "aceitassem",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "aceitassem",
      "aceitarão",
      "aceitaram",
      "aceitam"
    ],
    "explanations": {
      "pt": "Desejo irreal passado/presente: imperfeito do conjuntivo 'aceitassem'.",
      "en": "Unreal wish about past/present: imperfect subjunctive 'aceitassem'.",
      "uk": "Нереальне побажання щодо минулого/теперішнього: імперфект кон'юнктива 'aceitassem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "1efbf780-bda0-4ceb-988e-08ad32b7c909",
    "sentence": "Oxalá tu _____ um ótimo dia hoje!",
    "correctAnswer": "tenhas",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terás",
      "tenhas",
      "tivesses",
      "tens"
    ],
    "explanations": {
      "pt": "Desejo positivo atual: presente do conjuntivo 'tenhas'.",
      "en": "Positive present wish: present subjunctive 'tenhas'.",
      "uk": "Позитивне побажання теперішнього: презент кон'юнктива 'tenhas'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "fe878989-1657-4fd0-a6b3-a25e6c3971d5",
    "sentence": "Tomara que as coisas _____ depressa!",
    "correctAnswer": "andem",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "andassem",
      "andam",
      "andem",
      "andarão"
    ],
    "explanations": {
      "pt": "Com 'tomara', usa-se presente do conjuntivo: 'andem'.",
      "en": "With 'tomara', use the present subjunctive: 'andem'.",
      "uk": "З 'tomara' вживається презент кон'юнктива: 'andem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "dbbc2df5-237a-4ed2-aaa7-b6a04e00a444",
    "sentence": "Quando voltares, eu já _____ de casa.",
    "correctAnswer": "terei saído",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "sair-ei",
      "teria saído",
      "terei saído",
      "sairei"
    ],
    "explanations": {
      "pt": "Anterioridade no futuro pede futuro perfeito: 'terei saído'.",
      "en": "Anteriority in the future requires the future perfect: 'terei saído'.",
      "uk": "Попередність у майбутньому позначається майбутнім перфектом: 'terei saído'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "8f6f3fce-ddd9-4cee-a03a-9344085be405",
    "sentence": "Quando sairmos, já _____ todas as luzes.",
    "correctAnswer": "teremos apagado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "temos apagado",
      "teremos apagado",
      "apagaremos",
      "teríamos apagado"
    ],
    "explanations": {
      "pt": "Sequência futura com anterioridade pede futuro perfeito: 'teremos apagado'.",
      "en": "A future sequence with anteriority requires the future perfect: 'teremos apagado'.",
      "uk": "Майбутня послідовність із попередністю — майбутній перфект: 'teremos apagado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "55bc97ff-7b3d-48b7-aa7e-25a4cb92b864",
    "sentence": "Daqui a pouco, vocês já _____ tudo o que precisavam.",
    "correctAnswer": "terão resolvido",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terão resolvido",
      "têm resolvido",
      "resolverão",
      "teriam resolvido"
    ],
    "explanations": {
      "pt": "Para ação concluída num momento futuro próximo, usa-se futuro perfeito: 'terão resolvido'.",
      "en": "For an action completed at a near-future point, use the future perfect: 'terão resolvido'.",
      "uk": "Для дії, завершеної в недалекому майбутньому, вживають майбутній перфект: 'terão resolvido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "a0f95132-f6d8-42a9-b098-b80977717093",
    "sentence": "Quando o cliente ligar, eu já _____ o orçamento.",
    "correctAnswer": "terei enviado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "enviarei",
      "tenho enviado",
      "terei enviado",
      "teria enviado"
    ],
    "explanations": {
      "pt": "Anterioridade em relação a um ponto futuro ('ligar') pede futuro perfeito: 'terei enviado'.",
      "en": "Anteriority to a future point ('ligar') requires the future perfect: 'terei enviado'.",
      "uk": "Попередність щодо майбутнього моменту ('ligar') — майбутній перфект: 'terei enviado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "31c2b5f6-8d4d-4dfe-afe5-99f7fa725b7c",
    "sentence": "Na próxima semana à esta hora, tu já _____ o exame.",
    "correctAnswer": "terás terminado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terias terminado",
      "tens terminado",
      "terminarás",
      "terás terminado"
    ],
    "explanations": {
      "pt": "Com marcador temporal futuro e conclusão, usa-se 'terás terminado'.",
      "en": "With a future time marker and completion, use 'terás terminado'.",
      "uk": "З майбутнім часовим маркером і завершенням — 'terás terminado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "cc3ad4f5-8185-41b2-9e80-1b3ac052a23f",
    "sentence": "Ao meio-dia, eu já _____ as compras todas.",
    "correctAnswer": "terei feito",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "farei",
      "teria feito",
      "terei feito",
      "tenho feito"
    ],
    "explanations": {
      "pt": "Ponto de referência futuro com ação concluída: futuro perfeito 'terei feito'.",
      "en": "Future reference point with completed action: future perfect 'terei feito'.",
      "uk": "Майбутня точка відліку з завершеною дією: майбутній перфект 'terei feito'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "b509c5b3-0c1c-457b-acf0-23042f37252a",
    "sentence": "Dentro de uma hora, eles já _____ o relatório final.",
    "correctAnswer": "terão concluído",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "teriam concluído",
      "concluirão",
      "terão concluído",
      "têm concluído"
    ],
    "explanations": {
      "pt": "Para ação futura anterior a outra, usa-se futuro perfeito: 'terão concluído'.",
      "en": "For an action completed before another future point, use the future perfect: 'terão concluído'.",
      "uk": "Для дії, завершеної до іншого майбутнього моменту, вживається майбутній перфект: 'terão concluído'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "ccef9f8f-395f-40df-b520-7f6e06e69177",
    "sentence": "Quando eles chegarem, nós já _____ tudo pronto.",
    "correctAnswer": "teremos deixado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "teríamos deixado",
      "deixaremos",
      "teremos deixado",
      "temos deixado"
    ],
    "explanations": {
      "pt": "Anterioridade relativamente a 'chegarem' pede futuro perfeito: 'teremos deixado'.",
      "en": "Being prior to 'chegarem' requires the future perfect: 'teremos deixado'.",
      "uk": "Попередність щодо 'chegarem' вимагає майбутнього перфекта: 'teremos deixado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "c2cdb4dc-f24d-46e7-813e-16d3b891ee0a",
    "sentence": "Até amanhã, a equipa _____ todos os testes.",
    "correctAnswer": "terá terminado",
    "topic": "futuro-perfeito-indicativo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terminará",
      "teria terminado",
      "terá terminado",
      "tem terminado"
    ],
    "explanations": {
      "pt": "Com 'até', indicando prazo futuro concluído, usa-se futuro perfeito: 'terá terminado'.",
      "en": "With 'até' indicating a completed future deadline, use the future perfect: 'terá terminado'.",
      "uk": "З 'até' та завершеним майбутнім терміном — майбутній перфект: 'terá terminado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.078Z",
    "updatedAt": "2025-08-10T19:28:53.078Z"
  },
  {
    "id": "24cab0d3-d2ec-45df-861e-4339966486b0",
    "sentence": "Oxalá _____ boas notícias em breve!",
    "correctAnswer": "cheguem",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegarão",
      "cheguem",
      "chegassem",
      "chegam"
    ],
    "explanations": {
      "pt": "Com 'oxalá', desejo provável pede presente do conjuntivo: 'cheguem'.",
      "en": "With 'oxalá', a hopeful wish takes the present subjunctive: 'cheguem'.",
      "uk": "З 'oxalá' для побажання вживається презент кон'юнктива: 'cheguem'."
    },
    "hint": "chegar (3ª pl.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "550a78b3-41ea-4d5e-8417-ec9d0e2c8fa9",
    "sentence": "Tomara que tu me _____ hoje mesmo!",
    "correctAnswer": "ligues",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "ligas",
      "ligasses",
      "ligues",
      "ligarás"
    ],
    "explanations": {
      "pt": "Com 'tomara que', usa-se presente do conjuntivo: 'ligues'.",
      "en": "With 'tomara que', use the present subjunctive: 'ligues'.",
      "uk": "З 'tomara que' потрібен презент кон'юнктива: 'ligues'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "ab78dc42-d65a-44d9-ad28-b3be6f2331a3",
    "sentence": "Quem me dera que este ano _____ diferente!",
    "correctAnswer": "fosse",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "fosse",
      "é",
      "será",
      "seria"
    ],
    "explanations": {
      "pt": "Desejo irreal usa imperfeito do conjuntivo: 'fosse'.",
      "en": "An unreal wish uses the imperfect subjunctive: 'fosse'.",
      "uk": "Нереальне бажання — імперфект кон'юнктива: 'fosse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "0ad61a92-8ddc-4c11-aa74-7f0b96a31bd4",
    "sentence": "Oxalá a equipa _____ o campeonato!",
    "correctAnswer": "vença",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "vença",
      "vence",
      "vencesse",
      "vencerá"
    ],
    "explanations": {
      "pt": "Desejo provável no presente: presente do conjuntivo 'vença'.",
      "en": "Likely wish in the present: present subjunctive 'vença'.",
      "uk": "Ймовірне побажання теперішнього: презент кон'юнктива 'vença'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "4bcba221-7138-446b-a26d-8080e0d874c3",
    "sentence": "Quem dera que tudo _____ certo no final!",
    "correctAnswer": "corresse",
    "topic": "frases-exclamativas-desejo",
    "level": "B2",
    "multipleChoiceOptions": [
      "correrá",
      "corre",
      "correria",
      "corresse"
    ],
    "explanations": {
      "pt": "Desejo sobre processo futuro irreal: imperfeito do conjuntivo 'corresse'.",
      "en": "Wish about an unreal future scenario: imperfect subjunctive 'corresse'.",
      "uk": "Побажання щодо нереального майбутнього: імперфект кон'юнктива 'corresse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "4e11a09e-993a-4f84-8d9d-61494f1fe5ad",
    "sentence": "Quando tu _____ o curso, candidata-te à vaga.",
    "correctAnswer": "tiveres terminado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiveres terminado",
      "tenhas terminado",
      "tiveste terminado",
      "teres terminado"
    ],
    "explanations": {
      "pt": "O futuro perfeito do conjuntivo é 'tiver + particípio' com concordância de pessoa: 'tiveres terminado'.",
      "en": "The future perfect subjunctive is 'tiver + past participle' with person agreement: 'tiveres terminado'.",
      "uk": "Майбутній перфект кон'юнктива: 'tiver' + дієприкметник із узгодженням особи: 'tiveres terminado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "38cfac4b-00ef-436f-ad74-5d933d653269",
    "sentence": "Assim que ela _____ as revisões, seguimos para produção.",
    "correctAnswer": "tiver feito",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "terá feito",
      "teve feito",
      "tenha feito",
      "tiver feito"
    ],
    "explanations": {
      "pt": "Após 'assim que' com valor futuro concluído, usa-se futuro perfeito do conjuntivo: 'tiver feito'.",
      "en": "After 'assim que' with completed-future value, use the future perfect subjunctive: 'tiver feito'.",
      "uk": "Після 'assim que' у значенні завершеного майбутнього — 'tiver feito'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "363546a7-0cc6-43f6-b04a-53f890aee527",
    "sentence": "Quando _____ o relatório, falamos com a direção.",
    "correctAnswer": "tivermos enviado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivermos enviado",
      "tivemos enviado",
      "tenhamos enviado",
      "temos enviado"
    ],
    "explanations": {
      "pt": "Marco temporal futuro concluído: 'tivermos enviado' (futuro perfeito do conjuntivo).",
      "en": "Completed future time marker: 'tivermos enviado' (future perfect subjunctive).",
      "uk": "Позначення завершеної майбутньої дії: 'tivermos enviado' — майбутній перфект кон'юнктива."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "c06e98a7-8b6a-4ad5-9e85-496258348fb4",
    "sentence": "Depois que _____ o pagamento, liberamos o acesso.",
    "correctAnswer": "tiverem processado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "têm processado",
      "tenham processado",
      "tiverem processado",
      "tiveram processado"
    ],
    "explanations": {
      "pt": "Sequência futura concluída pede o futuro perfeito do conjuntivo: 'tiverem processado'.",
      "en": "A completed future sequence needs the future perfect subjunctive: 'tiverem processado'.",
      "uk": "Завершена майбутня послідовність вимагає майбутнього перфекта кон'юнктива: 'tiverem processado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "0bfebd51-5b1a-4d75-8f92-1e348458851d",
    "sentence": "Logo que eu _____ tudo, descanso.",
    "correctAnswer": "tiver acabado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha acabado",
      "terei acabado",
      "tive acabado",
      "tiver acabado"
    ],
    "explanations": {
      "pt": "Projeção futura concluída: futuro perfeito do conjuntivo 'tiver acabado'.",
      "en": "Completed future projection: future perfect subjunctive 'tiver acabado'.",
      "uk": "Завершена майбутня подія: майбутній перфект кон'юнктива 'tiver acabado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "e83d5d3c-630e-4be4-b881-11daa80482f7",
    "sentence": "Assim que _____ a auditoria, enviem o relatório.",
    "correctAnswer": "tiverem concluído",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "têm concluído",
      "tiverem concluído",
      "tenham concluído",
      "tiveram concluído"
    ],
    "explanations": {
      "pt": "Com valor de 'depois de', usa-se futuro perfeito do conjuntivo: 'tiverem concluído'.",
      "en": "With a 'after' meaning, use the future perfect subjunctive: 'tiverem concluído'.",
      "uk": "У значенні 'після того як' — майбутній перфект кон'юнктива: 'tiverem concluído'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "279e4d86-e7a7-4063-91c9-03a40ee728b3",
    "sentence": "Logo que _____ a inspeção, abrimos ao público.",
    "correctAnswer": "tivermos passado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "teremos passado",
      "tivemos passado",
      "tenhamos passado",
      "tivermos passado"
    ],
    "explanations": {
      "pt": "Completude futura exige futuro perfeito do conjuntivo: 'tivermos passado'.",
      "en": "Future completeness requires the future perfect subjunctive: 'tivermos passado'.",
      "uk": "Завершеність у майбутньому — майбутній перфект кон'юнктива: 'tivermos passado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "f7251f45-b35e-45a0-a15a-59e8c531074e",
    "sentence": "Depois que tu _____ as tarefas, podes sair.",
    "correctAnswer": "tiveres concluído",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "teres concluído",
      "tiveres concluído",
      "tiveste concluído",
      "tenhas concluído"
    ],
    "explanations": {
      "pt": "Para 'tu', a forma é 'tiveres' + particípio: 'tiveres concluído'.",
      "en": "For 'tu', use 'tiveres' + participle: 'tiveres concluído'.",
      "uk": "Для 'ти' форма 'tiveres' + дієприкметник: 'tiveres concluído'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "08a5b505-f313-4808-8381-17cc2cef3084",
    "sentence": "Quando eles _____ as correções, seguimos com o teste.",
    "correctAnswer": "tiverem aplicado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiverem aplicado",
      "têm aplicado",
      "tenham aplicado",
      "tiveram aplicado"
    ],
    "explanations": {
      "pt": "Marco futuro concluído: 'tiverem aplicado' (futuro perfeito do conjuntivo).",
      "en": "Completed future marker: 'tiverem aplicado' (future perfect subjunctive).",
      "uk": "Позначення завершеності в майбутньому: 'tiverem aplicado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "518be62d-fec3-4844-ba7d-739d8345984a",
    "sentence": "Assim que _____ as contas, fechamos o mês.",
    "correctAnswer": "tivermos fechado",
    "topic": "futuro-perfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "fecharemos",
      "tivemos fechado",
      "tenhamos fechado",
      "tivermos fechado"
    ],
    "explanations": {
      "pt": "Completude futura antes da principal pede 'tivermos fechado'.",
      "en": "Future completion before the main clause requires 'tivermos fechado'.",
      "uk": "Завершеність у майбутньому перед головною частиною — 'tivermos fechado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "6694c84b-17a7-4746-a08a-2c15decffbf2",
    "sentence": "Se eu _____ a verdade, teria decidido diferente.",
    "correctAnswer": "tivesse sabido",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse sabido",
      "soube",
      "soubesse",
      "soubera"
    ],
    "explanations": {
      "pt": "O mais-que-perfeito composto do conjuntivo é 'tivesse + particípio': 'tivesse sabido', para condição contrafactual passada.",
      "en": "The compound pluperfect subjunctive is 'tivesse + past participle': 'tivesse sabido', for counterfactual past conditions.",
      "uk": "Складений плюсквамперфект кон'юнктива: 'tivesse + дієприкметник' — 'tivesse sabido' для контрфактичних умов у минулому."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "5f050502-e83b-498b-94d5-1f470281a7ad",
    "sentence": "Se eles _____ o prazo, o cliente não teria reclamado.",
    "correctAnswer": "tivessem cumprido",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "cumpririam",
      "tivessem cumprido",
      "tenham cumprido",
      "cumpriram"
    ],
    "explanations": {
      "pt": "Condição contrafactual passada usa 'tivessem + particípio': 'tivessem cumprido'.",
      "en": "Counterfactual past uses 'tivessem + participle': 'tivessem cumprido'.",
      "uk": "Контрфактичний минулий: 'tivessem + дієприкметник'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "9cbd414b-773d-4fe5-978a-bee3243fba0b",
    "sentence": "Se nós _____ o contrato, evitaríamos problemas legais.",
    "correctAnswer": "tivéssemos assinado",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "assinámos",
      "tivéssemos assinado",
      "tínhamos assinado",
      "teremos assinado"
    ],
    "explanations": {
      "pt": "Estrutura contrafactual passada: 'tivéssemos assinado'.",
      "en": "Past counterfactual structure: 'tivéssemos assinado'.",
      "uk": "Контрфактична минула структура: 'tivéssemos assinado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "579c64a4-b7b9-4734-a665-e97204ab4329",
    "sentence": "Se tu _____ mais cedo, apanhavas o comboio.",
    "correctAnswer": "tivesses chegado",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesses chegado",
      "chegaste",
      "chegavas",
      "chegarias"
    ],
    "explanations": {
      "pt": "Para 'tu', usa-se 'tivesses + particípio' na condição contrafactual.",
      "en": "For 'tu', use 'tivesses + participle' in counterfactual condition.",
      "uk": "Для 'ти' — 'tivesses + дієприкметник' у контрфактичній умові."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "18f9ab90-0b6c-4f66-a235-6aee8b9952ff",
    "sentence": "Se ela _____ a tempo, não perderia a entrevista.",
    "correctAnswer": "tivesse saído",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "saiu",
      "saía",
      "sairia",
      "tivesse saído"
    ],
    "explanations": {
      "pt": "Mais-que-perfeito composto do conjuntivo marca a condição passada não realizada.",
      "en": "The compound pluperfect subjunctive marks a past unreal condition.",
      "uk": "Складений плюсквамперфект кон'юнктива позначає нереальну минулу умову."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "9708302c-3455-438d-98de-16b6c2908b44",
    "sentence": "Se vocês _____ o backup, nada se teria perdido.",
    "correctAnswer": "tivessem feito",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "faziam",
      "fizeram",
      "tivessem feito",
      "fariam"
    ],
    "explanations": {
      "pt": "Condição contrafactual: 'tivessem feito' (tivessem + particípio).",
      "en": "Counterfactual condition: 'tivessem feito' (tivessem + participle).",
      "uk": "Контрфактична умова: 'tivessem feito' (tivessem + дієприкметник)."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "f6d19bd9-ad86-4a64-97ea-bf9ac786a25e",
    "sentence": "Se eu te _____ ontem, combinávamos logo.",
    "correctAnswer": "tivesse encontrado",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "encontrava",
      "encontraria",
      "encontrei",
      "tivesse encontrado"
    ],
    "explanations": {
      "pt": "Para passado não realizado, usa-se 'tivesse + particípio'.",
      "en": "For unreal past, use 'tivesse + participle'.",
      "uk": "Для нереального минулого — 'tivesse + дієприкметник'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "e64753d3-c113-474d-a7d3-9e93efd03666",
    "sentence": "Se a equipa _____ o plano, evitaria erros.",
    "correctAnswer": "tivesse seguido",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse seguido",
      "seguiria",
      "seguiu",
      "seguia"
    ],
    "explanations": {
      "pt": "Estrutura típica: 'se' + MqP composto do conjuntivo ('tivesse seguido').",
      "en": "Typical structure: 'se' + compound pluperfect subjunctive ('tivesse seguido').",
      "uk": "Типова структура: 'se' + складений плюсквамперфект кон'юнктива ('tivesse seguido')."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "1a38af37-100d-4e17-82e6-2125d08776b2",
    "sentence": "Se os prazos _____ claros, não haveria dúvidas.",
    "correctAnswer": "tivessem sido",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "seriam",
      "tivessem sido",
      "eram",
      "foram"
    ],
    "explanations": {
      "pt": "Passiva com MqP composto do conjuntivo: 'tivessem sido' + particípio.",
      "en": "Passive with compound pluperfect subjunctive: 'tivessem sido' + participle.",
      "uk": "Пасив із складеним плюсквамперфектом кон'юнктива: 'tivessem sido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "b4c6f45b-1cf7-4402-82e5-14b38bfc31c7",
    "sentence": "Se tu _____ a proposta, ganharíamos o cliente.",
    "correctAnswer": "tivesses enviado",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "enviavas",
      "tivesses enviado",
      "enviarás",
      "enviaste"
    ],
    "explanations": {
      "pt": "Condição passada contrafactual: 'tivesses enviado'.",
      "en": "Past counterfactual condition: 'tivesses enviado'.",
      "uk": "Контрфактична минула умова: 'tivesses enviado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.075Z",
    "updatedAt": "2025-08-10T19:28:53.075Z"
  },
  {
    "id": "88fa62b6-d6de-47fd-ba39-94a79e7abb86",
    "sentence": "É possível que eles _____ prazos muito apertados ultimamente.",
    "correctAnswer": "tenham cumprido",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenham cumprido",
      "têm cumprido",
      "tenham cumprir",
      "tiveram cumprido"
    ],
    "explanations": {
      "pt": "O pretérito perfeito composto do conjuntivo forma-se com 'ter' no conjuntivo + particípio: 'tenham cumprido'. Indica repetição recente.",
      "en": "The compound perfect subjunctive is 'ter' in subjunctive + past participle: 'tenham cumprido', often for recent repeated actions.",
      "uk": "Складений перфект кон'юнктива утворюється з 'ter' у кон'юнктиві + дієприкметник: 'tenham cumprido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "e565b202-4435-48d3-a621-700909a79a97",
    "sentence": "Mesmo que _____ tarde, envia o relatório hoje.",
    "correctAnswer": "seja",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "é",
      "será",
      "seja",
      "fosse"
    ],
    "explanations": {
      "pt": "Concessiva com 'mesmo que' pede presente do conjuntivo: 'seja'.",
      "en": "Concessive with 'mesmo que' takes the present subjunctive: 'seja'.",
      "uk": "Поступкова з 'mesmo que' вимагає презент кон'юнктива: 'seja'."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "f0a6c14a-fe3a-43c1-983e-6f6484e12efa",
    "sentence": "Embora tu não me _____, tentarei explicar outra vez.",
    "correctAnswer": "entendas",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "entendas",
      "entendes",
      "entendesses",
      "entenderás"
    ],
    "explanations": {
      "pt": "Com 'embora' e sujeito 'tu', usa-se presente do conjuntivo: 'entendas'.",
      "en": "With 'embora' and subject 'tu', use the present subjunctive: 'entendas'.",
      "uk": "З 'embora' та підметом 'ти' потрібен презент кон'юнктива: 'entendas'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "d7b39075-163d-49f7-ba5a-68536844212a",
    "sentence": "Por muito que _____, não conseguirás agradar a todos.",
    "correctAnswer": "faças",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "farás",
      "fizesses",
      "faças",
      "fazes"
    ],
    "explanations": {
      "pt": "Com 'por muito que', exige-se conjuntivo: 'faças'.",
      "en": "With 'por muito que', the subjunctive is required: 'faças'.",
      "uk": "Зі зворотом 'por muito que' потрібен кон'юнктив: 'faças'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "0797e98a-10a5-439d-ae2b-7a1cc31c410c",
    "sentence": "Ainda que _____ ajuda, prefere trabalhar sozinho.",
    "correctAnswer": "lhe ofereçam",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "lhe oferecem",
      "lhe ofereçam",
      "lhe oferecerão",
      "lhe oferecessem"
    ],
    "explanations": {
      "pt": "Concessiva 'ainda que' pede conjuntivo: 'lhe ofereçam'.",
      "en": "Concessive 'ainda que' takes the subjunctive: 'lhe ofereçam'.",
      "uk": "Поступкова 'ainda que' потребує кон'юнктива: 'lhe ofereçam'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "a69866cf-2c20-4e4c-8f87-cfe0d193068f",
    "sentence": "Mesmo que _____ tempo, não vou ao cinema hoje.",
    "correctAnswer": "tenha",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "tem",
      "tenha",
      "terá"
    ],
    "explanations": {
      "pt": "Concessão com 'mesmo que' no presente pede presente do conjuntivo: 'tenha'.",
      "en": "Concession with 'mesmo que' in the present requires the present subjunctive: 'tenha'.",
      "uk": "Поступка з 'mesmo que' в теперішньому — презент кон'юнктива: 'tenha'."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "0944f7a8-149d-4cd9-b74b-1540119af4f3",
    "sentence": "Se eu _____ cedo, passo pelo teu escritório.",
    "correctAnswer": "chegar",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegar",
      "chegar",
      "chegar",
      "chegar"
    ],
    "explanations": {
      "pt": "Com 'se' referindo-se ao futuro real, usa-se futuro do conjuntivo: 'se eu chegar'.",
      "en": "With 'se' for a real future condition, use the future subjunctive: 'se eu chegar'.",
      "uk": "Зі 'se' про реальну майбутню умову — майбутній кон'юнктив: 'se eu chegar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "2c546d96-e199-4c18-88e3-cb60151a5d50",
    "sentence": "Se vocês _____ disponibilidade, agendamos para sexta.",
    "correctAnswer": "tiverem",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiverem",
      "tenham",
      "têm",
      "terão"
    ],
    "explanations": {
      "pt": "Condição futura real pede futuro do conjuntivo: 'tiverem'.",
      "en": "A real future condition requires the future subjunctive: 'tiverem'.",
      "uk": "Реальна майбутня умова вимагає майбутнього кон'юнктива: 'tiverem'."
    },
    "hint": "(3ª pl.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "67620478-bfcb-4b95-b145-f68eba2966a5",
    "sentence": "Se ele _____ a tempo, abrimos a loja mais cedo.",
    "correctAnswer": "chegar",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegar",
      "chega",
      "chegue",
      "chegará"
    ],
    "explanations": {
      "pt": "Com 'se' futuro, muitas formas coincidem com o infinitivo: 'se ele chegar'.",
      "en": "With future 'se', many forms coincide with the infinitive: 'se ele chegar'.",
      "uk": "Зі 'se' у майбутньому багато форм збігаються з інфінітивом: 'chegar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "cd051085-79b5-4a32-9c3e-cd9373c9bb25",
    "sentence": "Se tu _____ dúvidas, liga-me sem hesitar.",
    "correctAnswer": "tiveres",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiveres",
      "tens",
      "terás",
      "tenhas"
    ],
    "explanations": {
      "pt": "Para 'tu', usa-se 'tiveres' no futuro do conjuntivo.",
      "en": "For 'tu', use 'tiveres' in the future subjunctive.",
      "uk": "Для 'ти' потрібне 'tiveres' у майбутньому кон'юнктиві."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "7c5e494e-5e85-4b6a-a05a-0c52da3b11ae",
    "sentence": "Se a encomenda _____ amanhã, montamos tudo à tarde.",
    "correctAnswer": "chegar",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegará",
      "chega",
      "chegar",
      "chegue"
    ],
    "explanations": {
      "pt": "Condição real futura: 'se a encomenda chegar'.",
      "en": "Real future condition: 'se a encomenda chegar'.",
      "uk": "Реальна майбутня умова: 'se a encomenda chegar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "af655ad1-af54-4deb-bb73-3681a06d7586",
    "sentence": "Se nós _____ tempo, passamos pelo museu.",
    "correctAnswer": "tivermos",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenhamos",
      "temos",
      "tivermos",
      "teremos"
    ],
    "explanations": {
      "pt": "Com 'nós', no futuro do conjuntivo: 'tivermos'.",
      "en": "With 'nós', in the future subjunctive: 'tivermos'.",
      "uk": "З 'ми' у майбутньому кон'юнктиві: 'tivermos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "b4f908d6-514e-43b1-a809-489b8b1b1223",
    "sentence": "Se a diretora _____, anuncio as mudanças.",
    "correctAnswer": "aprovar",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "aprova",
      "aprovará",
      "aprove",
      "aprovar"
    ],
    "explanations": {
      "pt": "Muitos verbos regulares têm forma igual ao infinitivo: 'se a diretora aprovar'.",
      "en": "Many regular verbs match the infinitive: 'se a diretora aprovar'.",
      "uk": "У багатьох правильних дієслів форма збігається з інфінітивом: 'aprovar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "0c8bb151-fba2-4370-a7cb-ae0379ebff42",
    "sentence": "Se eles _____ a proposta, iniciamos o projeto.",
    "correctAnswer": "aceitarem",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "aceitam",
      "aceitarão",
      "aceitem",
      "aceitarem"
    ],
    "explanations": {
      "pt": "Para 'eles', futuro do conjuntivo termina em '-em': 'aceitarem'.",
      "en": "For 'eles', the future subjunctive ends in '-em': 'aceitarem'.",
      "uk": "Для 'вони' майбутній кон'юнктив має закінчення '-em': 'aceitarem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "3ee5c6ce-9b65-456e-8102-fcb156040dfd",
    "sentence": "Se houver atrasos, _____ o plano.",
    "correctAnswer": "revemos",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "revemos",
      "reveremos",
      "reveemos",
      "revíssemos"
    ],
    "explanations": {
      "pt": "Ordem natural: principal no presente indicativo após condição futura é aceitável em PT europeu: 'revemos o plano'.",
      "en": "In EP, main clause in the present indicative is acceptable after a future condition: 'revemos o plano'.",
      "uk": "У європейській португальській допустима головна в індикативі після майбутньої умови: 'revemos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "6d00ca9a-e94d-405f-9d0c-adbb73ea9d0e",
    "sentence": "Se tu me _____ amanhã, levo-te os documentos.",
    "correctAnswer": "telefonares",
    "topic": "se-futuro-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "telefonaras",
      "telefonarás",
      "telefonaste",
      "telefonares"
    ],
    "explanations": {
      "pt": "Com 'se' de valor futuro, usa-se o futuro do conjuntivo: 'telefonares'. Evita-se o indicativo futuro 'telefonarás' e o pretérito 'telefonaste'.",
      "en": "With future 'if', use the future subjunctive: 'telefonares'. Avoid the future indicative 'telefonarás' and the preterite 'telefonaste'.",
      "uk": "Зі значенням майбутньої умови вживається майбутній кон'юнктив: 'telefonares'. Уникаємо майбутнього індикатива 'telefonarás' і минулого 'telefonaste'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "408ee5d2-7a0c-42c7-9c98-963ec4e3e1a3",
    "sentence": "Duvido que a equipa _____ bem nos últimos jogos.",
    "correctAnswer": "tenha jogado",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha jogar",
      "tenha jogado",
      "teve jogado",
      "tem jogado"
    ],
    "explanations": {
      "pt": "Após 'duvido que', usa-se o PPC do conjuntivo para ações recentes: 'tenha jogado'.",
      "en": "After 'duvido que', use the compound perfect subjunctive for recent actions: 'tenha jogado'.",
      "uk": "Після 'duvido que' вживають складений перфект кон'юнктива: 'tenha jogado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "9c6bc672-9d22-4ac3-9ee9-54e70bc323c5",
    "sentence": "Embora _____ muito, não chegaram ao objetivo.",
    "correctAnswer": "tenham trabalhado",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenham trabalhado",
      "tenham trabalho",
      "tiveram trabalhado",
      "trabalham"
    ],
    "explanations": {
      "pt": "Concessiva com ação repetida recente usa PPC do conjuntivo: 'tenham trabalhado'.",
      "en": "A concessive with recent repeated action takes the compound perfect subjunctive: 'tenham trabalhado'.",
      "uk": "У поступковому реченні для нещодавніх повторюваних дій — складений перфект кон'юнктива."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "b80dc7f8-a881-406b-ba55-8b6def4da570",
    "sentence": "É provável que tu _____ melhor ultimamente.",
    "correctAnswer": "tenhas dormido",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tens dormido",
      "tenhas dormido",
      "tiveste dormido",
      "tenhas dormir"
    ],
    "explanations": {
      "pt": "Com 'é provável que', usa-se 'tenhas dormido' para hábitos recentes.",
      "en": "With 'é provável que', use 'tenhas dormido' for recent habits.",
      "uk": "З 'é provável que' вживається 'tenhas dormido' для нещодавніх звичок."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "f60a1cb6-7f62-4eff-9683-3da59adf1abf",
    "sentence": "Pode ser que nós _____ erros nos últimos relatórios.",
    "correctAnswer": "tenhamos cometido",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenhamos cometido",
      "tivemos cometido",
      "temos cometido",
      "tenhamos cometer"
    ],
    "explanations": {
      "pt": "O PPC do conjuntivo expressa possibilidade de ações recentes repetidas: 'tenhamos cometido'.",
      "en": "The compound perfect subjunctive expresses possible recent repeated actions: 'tenhamos cometido'.",
      "uk": "Складений перфект кон'юнктива виражає можливість нещодавніх повторюваних дій: 'tenhamos cometido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "a96ce2d0-3040-4d42-b201-949c997b29e8",
    "sentence": "Não creio que eles _____ muito tempo para praticar.",
    "correctAnswer": "tenham tido",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiveram tido",
      "tenham ter",
      "tenham tido",
      "têm tido"
    ],
    "explanations": {
      "pt": "Negação de crença + PPC do conjuntivo: 'tenham tido'.",
      "en": "Negative belief + compound perfect subjunctive: 'tenham tido'.",
      "uk": "Заперечення віри + складений перфект кон'юнктива: 'tenham tido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "3c9e6bd4-a28a-43e4-985d-036bf6746cf2",
    "sentence": "É bom que os alunos _____ as leituras semanais.",
    "correctAnswer": "tenham feito",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenham fazer",
      "tenham feito",
      "tiveram feito",
      "têm feito"
    ],
    "explanations": {
      "pt": "Avaliação presente de hábito recente: PPC do conjuntivo 'tenham feito'.",
      "en": "Present evaluation of recent habit: compound perfect subjunctive 'tenham feito'.",
      "uk": "Оцінка теперішнього щодо нещодавньої звички: 'tenham feito'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "e2b677c1-0645-4018-9b25-32ed86bd8e45",
    "sentence": "Embora eu não _____ muito, avancei no projeto.",
    "correctAnswer": "tenha dormido",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha dormido",
      "tenha dormir",
      "tive dormido",
      "tenho dormido"
    ],
    "explanations": {
      "pt": "Concessiva + PPC do conjuntivo: 'tenha dormido'.",
      "en": "Concessive + compound perfect subjunctive: 'tenha dormido'.",
      "uk": "Поступкове + складений перфект кон'юнктива: 'tenha dormido'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "340c911f-2012-4f6d-bb51-61049bc9ad9c",
    "sentence": "É improvável que a empresa _____ lucros altos estes meses.",
    "correctAnswer": "tenha registado",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha registar",
      "tem registado",
      "teve registado",
      "tenha registado"
    ],
    "explanations": {
      "pt": "Com 'é improvável que', PPC do conjuntivo exprime repetição recente: 'tenha registado'.",
      "en": "With 'é improvável que', the compound perfect subjunctive expresses recent repetition: 'tenha registado'.",
      "uk": "Зі зворотом 'é improvável que' складений перфект кон'юнктива виражає нещодавні повторення: 'tenha registado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "a563d12e-4ff5-4f7c-b196-f1e9cd0ee465",
    "sentence": "Duvido que vocês _____ as metas todas este trimestre.",
    "correctAnswer": "tenham alcançado",
    "topic": "preterito-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenham alcançar",
      "tenham alcançado",
      "têm alcançado",
      "tiveram alcançado"
    ],
    "explanations": {
      "pt": "Após 'duvido que', PPC do conjuntivo: 'tenham alcançado'.",
      "en": "After 'duvido que', use the compound perfect subjunctive: 'tenham alcançado'.",
      "uk": "Після 'duvido que' — складений перфект кон'юнктива: 'tenham alcançado'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.071Z",
    "updatedAt": "2025-08-10T19:28:53.071Z"
  },
  {
    "id": "27d0bdfc-fe91-45d6-9692-121b93d220ff",
    "sentence": "Os candidatos que _____ a prova prática serão chamados.",
    "correctAnswer": "passarem",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "passarem",
      "passem",
      "passarão",
      "passam"
    ],
    "explanations": {
      "pt": "Relativa com valor futuro/condicional pede futuro do conjuntivo: 'que passarem'.",
      "en": "A future-like relative requires the future subjunctive: 'que passarem'.",
      "uk": "Відносне речення з майбутнім значенням потребує майбутнього кон'юнктива: 'passarem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "8f68fe76-7177-43fd-8ca1-221ca7d9b27a",
    "sentence": "A primeira equipa que _____ cem pontos vence o jogo.",
    "correctAnswer": "atingir",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "atingir",
      "atingir",
      "atingirá",
      "atinge"
    ],
    "explanations": {
      "pt": "Com valor de regra futura, usa-se futuro do conjuntivo; em algumas pessoas coincide com o infinitivo: 'atingir'.",
      "en": "For future-rule meaning, use the future subjunctive; some forms equal the infinitive: 'atingir'.",
      "uk": "Для майбутнього правила вживають майбутній кон'юнктив; інколи збігається з інфінітивом: 'atingir'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "9121fd99-b565-4797-bde2-6cf19a7f5410",
    "sentence": "Quem _____ dúvidas poderá enviá-las por email.",
    "correctAnswer": "tiver",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiver",
      "terá",
      "tem",
      "tenha"
    ],
    "explanations": {
      "pt": "Com 'quem' e condição futura, usa-se 'tiver' (futuro do conjuntivo de 'ter').",
      "en": "With 'quem' and a future condition, use 'tiver' (future subjunctive of 'ter').",
      "uk": "З 'quem' і майбутньою умовою вживається 'tiver' — майбутній кон'юнктив 'ter'."
    },
    "hint": "ter",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "8bc81b7c-a001-4e85-9376-9f764650bf3d",
    "sentence": "Os alunos que _____ atraso deverão esperar fora.",
    "correctAnswer": "chegarem com",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegam com",
      "cheguem com",
      "chegarem com",
      "chegarão com"
    ],
    "explanations": {
      "pt": "Relativa condicional futura pede futuro do conjuntivo: 'que chegarem com atraso'.",
      "en": "A future conditional relative needs the future subjunctive: 'que chegarem com atraso'.",
      "uk": "Відносне умовне майбутнє вимагає майбутній кон'юнктив: 'que chegarem com atraso'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "bb3ef3a6-938d-451b-89ac-e88f777446d9",
    "sentence": "Quem _____ melhor proposta ficará com o contrato.",
    "correctAnswer": "apresentar",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "apresentar",
      "apresentar",
      "apresentar",
      "apresentar"
    ],
    "explanations": {
      "pt": "Com 'quem' e futuro, o verbo vai ao futuro do conjuntivo; aqui coincide com o infinitivo: 'apresentar'.",
      "en": "With 'quem' and future meaning, use the future subjunctive; here it equals the infinitive: 'apresentar'.",
      "uk": "З 'quem' у майбутньому вживається майбутній кон'юнктив; тут збігається з інфінітивом: 'apresentar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "4ce9fd58-ca4e-4e53-afe1-dfea8e865522",
    "sentence": "O colaborador que _____ esta meta receberá um bónus.",
    "correctAnswer": "alcançar",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "alcança",
      "alcançar",
      "alcance",
      "alcançará"
    ],
    "explanations": {
      "pt": "Regra para o futuro: relativa com futuro do conjuntivo; neste caso coincide com o infinitivo: 'alcançar'.",
      "en": "Rule about the future: relative clause with future subjunctive; here it matches the infinitive: 'alcançar'.",
      "uk": "Правило на майбутнє: відносне речення з майбутнім кон'юнктивом; тут збігається з інфінітивом: 'alcançar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "47a773f1-2634-4f7f-a900-c95de8622878",
    "sentence": "As pessoas que _____ a inscrição receberão confirmação.",
    "correctAnswer": "submeterem",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "submeterem",
      "submeterão",
      "submetem",
      "submetam"
    ],
    "explanations": {
      "pt": "Relativa projetada no futuro usa futuro do conjuntivo: 'submeterem'.",
      "en": "A relative projected into the future uses the future subjunctive: 'submeterem'.",
      "uk": "Відносне речення з проєкцією в майбутнє вимагає майбутнього кон'юнктива: 'submeterem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "7ce80bfd-e578-48c4-b9e9-d3117c0a3095",
    "sentence": "Quem _____ problemas técnicos deve contactar o suporte.",
    "correctAnswer": "tiver",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "tem",
      "tenha",
      "terá",
      "tiver"
    ],
    "explanations": {
      "pt": "Estrutura de regra condicional: 'quem tiver' no futuro do conjuntivo.",
      "en": "Conditional rule structure: 'quem tiver' in the future subjunctive.",
      "uk": "Структура умовного правила: 'quem tiver' у майбутньому кон'юнктиві."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "b5f05345-c66d-45ec-b31e-cdc2a25503a6",
    "sentence": "Os clientes que _____ o formulário serão atendidos primeiro.",
    "correctAnswer": "preencherem",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "preencherão",
      "preenchem",
      "preencham",
      "preencherem"
    ],
    "explanations": {
      "pt": "Relativa com condição futura pede 'preencherem' (futuro do conjuntivo).",
      "en": "A relative with a future condition takes 'preencherem' (future subjunctive).",
      "uk": "Відносне речення з майбутньою умовою вимагає 'preencherem' (майбутній кон'юнктив)."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "bcc3b327-f352-4e83-beb1-89753f3261d0",
    "sentence": "Embora _____ caro, o concerto vale a pena.",
    "correctAnswer": "seja",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "será",
      "seja",
      "fosse",
      "é"
    ],
    "explanations": {
      "pt": "Conjunção concessiva 'embora' pede conjuntivo presente: 'seja'.",
      "en": "Concessive conjunction 'embora' requires the present subjunctive: 'seja'.",
      "uk": "Сполучник поступки 'embora' вимагає презент кон'юнктива: 'seja'."
    },
    "hint": "ser (3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "73e14574-5800-4609-bcfd-9d170553ef18",
    "sentence": "Mesmo que _____ chuva, vamos continuar o evento.",
    "correctAnswer": "haja",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "há",
      "houverá",
      "haja",
      "houve"
    ],
    "explanations": {
      "pt": "Com 'mesmo que', usa-se conjuntivo para concessão: 'haja'.",
      "en": "With 'mesmo que', use the subjunctive for concession: 'haja'.",
      "uk": "Зі 'mesmo que' вживають кон'юнктив для поступки: 'haja'."
    },
    "hint": "haver",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "50771e54-a661-4d7f-882e-15155ce82a2d",
    "sentence": "Ainda que _____ pouco, ajudaremos como pudermos.",
    "correctAnswer": "ganhemos",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "ganhemos",
      "ganharemos",
      "ganhássemos",
      "ganhamos"
    ],
    "explanations": {
      "pt": "Concessiva 'ainda que' exige presente do conjuntivo: 'ganhemos'.",
      "en": "Concessive 'ainda que' requires the present subjunctive: 'ganhemos'.",
      "uk": "Поступкова 'ainda que' вимагає презент кон'юнктива: 'ganhemos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "dc38332a-2b87-41f3-806e-7142b435b0c6",
    "sentence": "Por mais que tu _____, não mudará a decisão.",
    "correctAnswer": "insistas",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "insistisses",
      "insistes",
      "insistirás",
      "insistas"
    ],
    "explanations": {
      "pt": "Estrutura 'por mais que' requer conjuntivo: 'insistas'.",
      "en": "The structure 'por mais que' requires the subjunctive: 'insistas'.",
      "uk": "Конструкція 'por mais que' вимагає кон'юнктива: 'insistas'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "518da1c5-692a-4b1d-8756-c26aa5f2cf9b",
    "sentence": "Ainda que nos _____, manteremos a proposta.",
    "correctAnswer": "critiquem",
    "topic": "presente-futuro-conjuntivo-concessivas",
    "level": "B2",
    "multipleChoiceOptions": [
      "critiquem",
      "criticassem",
      "criticarão",
      "criticam"
    ],
    "explanations": {
      "pt": "Concessiva pede conjuntivo: 'ainda que nos critiquem'.",
      "en": "A concessive clause takes the subjunctive: 'ainda que nos critiquem'.",
      "uk": "Поступкове речення вимагає кон'юнктива: 'critiquem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "b49e0709-db3a-4d56-997a-3cd68acd4dc6",
    "sentence": "Mal _____ a luz, vamos sair com cuidado.",
    "correctAnswer": "apagar",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "apagar",
      "apagar",
      "apagar",
      "apagar"
    ],
    "explanations": {
      "pt": "Estrutura fixa: 'mal' + futuro do conjuntivo. 1.ª pessoa plural tem forma idêntica ao infinitivo: 'mal apagar'.",
      "en": "Fixed structure: 'mal' + future subjunctive. Some forms equal the infinitive: 'mal apagar'.",
      "uk": "Фіксована конструкція: 'mal' + майбутній кон'юнктив. Форма може збігатися з інфінітивом: 'apagar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "2be13d77-63e7-4518-be37-88a8254149d3",
    "sentence": "Sempre que _____ oportunidade, vamos visitar os avós.",
    "correctAnswer": "houver",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "haverá",
      "há",
      "houver",
      "haja"
    ],
    "explanations": {
      "pt": "Com 'sempre que' e sentido de futuro, usa-se futuro do conjuntivo 'houver'.",
      "en": "With 'sempre que' and future meaning, use future subjunctive 'houver'.",
      "uk": "Зі 'sempre que' у значенні майбутнього — майбутній кон'юнктив 'houver'."
    },
    "hint": "haver",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "d24e6b02-c65d-4970-bff9-02c081a8dceb",
    "sentence": "Quando _____ a confirmação, avisem a equipa.",
    "correctAnswer": "receberem",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "receberem",
      "receberão",
      "recebam",
      "recebem"
    ],
    "explanations": {
      "pt": "Futuro temporal com 'quando' pede futuro do conjuntivo: 'receberem'.",
      "en": "Future time with 'quando' takes the future subjunctive: 'receberem'.",
      "uk": "Майбутній час із 'quando' — майбутній кон'юнктив: 'receberem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "47be55ae-356b-490b-9837-bce088c9573c",
    "sentence": "Assim que tu _____ disponível, marcamos a reunião.",
    "correctAnswer": "estiveres",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "estiveres",
      "estarás",
      "estejas",
      "estás"
    ],
    "explanations": {
      "pt": "Com 'assim que' futuro e sujeito 'tu', usa-se futuro do conjuntivo: 'estiveres'.",
      "en": "With 'assim que' future and subject 'tu', use the future subjunctive: 'estiveres'.",
      "uk": "Зі 'assim que' і підметом 'ти' — майбутній кон'юнктив: 'estiveres'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "59a0b864-7e85-402c-baaa-e6cd1ba3ff4f",
    "sentence": "Depois que _____ as autorizações, iniciamos as obras.",
    "correctAnswer": "chegarem",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegarão",
      "cheguem",
      "chegarem",
      "chegam"
    ],
    "explanations": {
      "pt": "Em português europeu também ocorre 'depois que' com valor futuro, pedindo futuro do conjuntivo: 'chegarem'.",
      "en": "European Portuguese also uses 'depois que' with future value, requiring the future subjunctive: 'chegarem'.",
      "uk": "У європейській португальській 'depois que' з майбутнім значенням уживає майбутній кон'юнктив: 'chegarem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "8c8bd69b-f005-4135-9610-94e5a1e033b1",
    "sentence": "Quem _____ primeiro ao local deve esperar pelos outros.",
    "correctAnswer": "chegar",
    "topic": "futuro-conjuntivo-relativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegar",
      "chegar",
      "chegar",
      "chegar"
    ],
    "explanations": {
      "pt": "Em relativas condicionais de futuro com 'quem', usa-se futuro do conjuntivo. Aqui coincide com o infinitivo: 'chegar'.",
      "en": "In conditional relative clauses with 'quem' referring to the future, use the future subjunctive. Here it matches the infinitive: 'chegar'.",
      "uk": "У відносних умовних реченнях із 'quem' про майбутнє — майбутній кон'юнктив, тут збігається з інфінітивом: 'chegar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "9cf82fd5-9f28-45bc-a615-b3ab78d31e12",
    "sentence": "Quando eu _____ ao aeroporto, mando-te mensagem.",
    "correctAnswer": "chegar",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegar",
      "chegar",
      "chegar",
      "chegar"
    ],
    "explanations": {
      "pt": "Com 'quando' referindo-se ao futuro, usa-se o futuro do conjuntivo: 'quando eu chegar'.",
      "en": "With 'quando' referring to the future, use the future subjunctive: 'quando eu chegar'.",
      "uk": "Зі сполучником 'quando' про майбутнє вживається майбутній кон'юнктив: 'quando eu chegar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "4c7814b3-c5e6-4baa-acdd-acb7f0b24405",
    "sentence": "Assim que _____ os resultados, marcamos a apresentação.",
    "correctAnswer": "tiverem",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "tiverão",
      "tenham",
      "tiverem",
      "têm"
    ],
    "explanations": {
      "pt": "Com 'assim que' no valor futuro, usa-se o futuro do conjuntivo: 'tiverem'.",
      "en": "With 'assim que' in a future sense, use the future subjunctive: 'tiverem'.",
      "uk": "Зі сполучником 'assim que' щодо майбутнього потрібен майбутній кон'юнктив: 'tiverem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "78947264-d126-4895-bb05-506cf5ad5bd3",
    "sentence": "Logo que _____ o pagamento, enviamos a fatura final.",
    "correctAnswer": "recebermos",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "receberemos",
      "recebemos",
      "recebamos",
      "recebermos"
    ],
    "explanations": {
      "pt": "Com 'logo que' projetado no futuro, usa-se futuro do conjuntivo: 'recebermos'.",
      "en": "With 'logo que' projected to the future, use the future subjunctive: 'recebermos'.",
      "uk": "Із 'logo que' щодо майбутнього вживається майбутній кон'юнктив: 'recebermos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "f6a373c5-c1de-4d2a-9fff-a4db4506ae20",
    "sentence": "Sempre que _____ dúvidas, fala comigo.",
    "correctAnswer": "tiveres",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "tens",
      "tenhas",
      "tiveres",
      "terás"
    ],
    "explanations": {
      "pt": "Rotina futura/condição com 'sempre que' pede futuro do conjuntivo: 'tiveres'.",
      "en": "Future-leaning routine with 'sempre que' takes the future subjunctive: 'tiveres'.",
      "uk": "У значенні майбутньої умови з 'sempre que' — майбутній кон'юнктив: 'tiveres'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "53f71d65-28cb-4bfd-8f9a-c2bae632b20e",
    "sentence": "Enquanto _____ luz natural, aproveitem para fotografar.",
    "correctAnswer": "houver",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "há",
      "houver",
      "houve",
      "houverá"
    ],
    "explanations": {
      "pt": "Com 'enquanto' futuro, usa-se 'houver' no futuro do conjuntivo.",
      "en": "With 'enquanto' about the future, use 'houver' in the future subjunctive.",
      "uk": "Зі 'enquanto' про майбутнє вживають 'houver' у майбутньому кон'юнктиві."
    },
    "hint": "haver",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.067Z",
    "updatedAt": "2025-08-10T19:28:53.067Z"
  },
  {
    "id": "2d79cec4-fe0d-4715-8d1a-97abdaa2d8ef",
    "sentence": "Era importante que ele nos _____ a verdade.",
    "correctAnswer": "dissesse",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "dirá",
      "diga",
      "dissesse",
      "disse"
    ],
    "explanations": {
      "pt": "No passado ('era importante que'), pede-se imperfeito do conjuntivo: 'dissesse'.",
      "en": "In the past ('era importante que'), use the imperfect subjunctive: 'dissesse'.",
      "uk": "У минулому ('era importante que') потрібен імперфект кон'юнктива: 'dissesse'."
    },
    "hint": "dizer",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "14bc8351-1cd2-4eb0-a8c4-7884a655253e",
    "sentence": "Quem dera que eles _____ a nossa proposta!",
    "correctAnswer": "aceitassem",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "aceitam",
      "aceitariam",
      "aceitassem",
      "aceitaram"
    ],
    "explanations": {
      "pt": "'Desejo' em exclamativa requer imperfeito do conjuntivo: 'aceitassem'.",
      "en": "Wish in exclamation requires the imperfect subjunctive: 'aceitassem'.",
      "uk": "Побажання у вигуковій формі вимагає імперфекта кон'юнктива: 'aceitassem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "c69f4a71-baf2-46f8-aab5-3dd91b4b2c7b",
    "sentence": "Ah, se eu _____ coragem para mudar agora!",
    "correctAnswer": "tivesse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenho",
      "tive",
      "tivesse",
      "teria"
    ],
    "explanations": {
      "pt": "A exclamação condicional irreal usa o imperfeito do conjuntivo: 'se eu tivesse'.",
      "en": "The unreal conditional exclamation uses the imperfect subjunctive: 'se eu tivesse'.",
      "uk": "У нереальній умовній вигук-формі вживається імперфект кон'юнктива: 'tivesse'."
    },
    "hint": "ter",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "369cab9e-273a-40f6-b07f-ca791373065e",
    "sentence": "Ah, se tu _____ mais paciente comigo!",
    "correctAnswer": "fosses",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "és",
      "serias",
      "fosses",
      "foste"
    ],
    "explanations": {
      "pt": "Exclamação irreal dirigida a 'tu' pede imperfeito do conjuntivo: 'fosses'.",
      "en": "Unreal exclamation addressed to 'tu' uses the imperfect subjunctive: 'fosses'.",
      "uk": "Нереальний вигук до 'ти' вимагає імперфекта кон'юнктива: 'fosses'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "61ada97c-fc3c-4d2e-8b7c-3184ced4641e",
    "sentence": "Se eu _____ mais tempo, viajaria pelo interior.",
    "correctAnswer": "tivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tive",
      "tivesse",
      "terei",
      "tenho"
    ],
    "explanations": {
      "pt": "Em períodos condicionais irreais, usa-se 'se' + imperfeito do conjuntivo ('tivesse') e a principal no condicional.",
      "en": "In unreal conditionals, use 'se' + imperfect subjunctive ('tivesse') and the main clause in the conditional.",
      "uk": "В ірреальних умовних періодах: 'se' + імперфект кон'юнктива ('tivesse') й головна в умовному способі."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "d58cc391-1d0d-49a9-a203-b5bba6551456",
    "sentence": "Quem me dera que o trânsito _____ leve hoje!",
    "correctAnswer": "estivesse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "estaria",
      "esteve",
      "está",
      "estivesse"
    ],
    "explanations": {
      "pt": "Desejo presente irreal usa imperfeito do conjuntivo: 'estivesse'.",
      "en": "Unreal present wish uses the imperfect subjunctive: 'estivesse'.",
      "uk": "Нереальне теперішнє бажання вживає імперфект кон'юнктива: 'estivesse'."
    },
    "hint": "estar",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "2bd797cc-b0d4-4c71-a2f4-e78ff0cab1d9",
    "sentence": "Se ao menos _____ uma solução rápida!",
    "correctAnswer": "houvesse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "houve",
      "houvesse",
      "há",
      "haveria"
    ],
    "explanations": {
      "pt": "A construção exclamativa hipotética pede imperfeito do conjuntivo: 'houvesse'.",
      "en": "Hypothetical exclamative construction takes the imperfect subjunctive: 'houvesse'.",
      "uk": "Гіпотетична вигукова конструкція вимагає імперфекта кон'юнктива: 'houvesse'."
    },
    "hint": "haver (3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "f26d65c0-c18d-496d-828f-a61a8f22f3e5",
    "sentence": "Se ele _____ a verdade, tudo seria diferente.",
    "correctAnswer": "soubesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "soube",
      "saberá",
      "soubesse",
      "sabe"
    ],
    "explanations": {
      "pt": "Irrealidade presente: 'se' + imperfeito do conjuntivo ('soubesse') com condicional na principal.",
      "en": "Unreal present: 'se' + imperfect subjunctive ('soubesse') with conditional in the main clause.",
      "uk": "Нереальність теперішнього: 'se' + імперфект кон'юнктива ('soubesse') та умовний у головній."
    },
    "hint": "saber",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "d7f6b0be-b523-4782-a059-98f3bfd6fdad",
    "sentence": "Se nós _____ mais cedo, evitávamos o trânsito.",
    "correctAnswer": "saíssemos",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "sairíamos",
      "sairemos",
      "saíssemos",
      "saímos"
    ],
    "explanations": {
      "pt": "Condição hipotética não realizada: imperfeito do conjuntivo 'saíssemos'.",
      "en": "Unreal hypothetical condition: imperfect subjunctive 'saíssemos'.",
      "uk": "Нереальна гіпотетична умова: імперфект кон'юнктива 'saíssemos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "48fa1d34-c99f-4f41-8632-c063bd9dcc32",
    "sentence": "Se tu _____ menos, descansarias melhor.",
    "correctAnswer": "trabalhasses",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "trabalharás",
      "trabalhasses",
      "trabalhaste",
      "trabalhas"
    ],
    "explanations": {
      "pt": "Com 'tu', o imperfeito do conjuntivo de 'trabalhar' é 'trabalhasses' para condições irreais.",
      "en": "With 'tu', the imperfect subjunctive of 'trabalhar' is 'trabalhasses' for unreal conditions.",
      "uk": "Для 'ти' імперфект кон'юнктива дієслова 'trabalhar' — 'trabalhasses'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "e4c23937-9b93-4efa-bfb6-cb476bdde2ce",
    "sentence": "Se eles _____ ajuda, chamavam-nos imediatamente.",
    "correctAnswer": "precisassem de",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "precisassem de",
      "precisaram de",
      "precisam de",
      "precisariam de"
    ],
    "explanations": {
      "pt": "Em condição hipotética presente, usa-se imperfeito do conjuntivo: 'se eles precisassem de'.",
      "en": "In a present hypothetical condition, use imperfect subjunctive: 'se eles precisassem de'.",
      "uk": "В умовній гіпотетичній конструкції теперішнього вживається імперфект кон'юнктива."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "4e60c73c-1ccf-41ab-974e-25e3514145e8",
    "sentence": "Se ela _____ mais cedo, teria visto o diretor.",
    "correctAnswer": "tivesse chegado",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse chegado",
      "chegasse",
      "chegou",
      "chegara"
    ],
    "explanations": {
      "pt": "Para passado contrafactual, o composto do conjuntivo ('tivesse chegado') é o mais natural.",
      "en": "For counterfactual past, the compound subjunctive ('tivesse chegado') is most natural.",
      "uk": "Для контрфактичного минулого природною є складена форма кон'юнктива ('tivesse chegado')."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "a21950b3-6c6c-4fab-b581-0610340b0795",
    "sentence": "Se eu _____ melhor o orçamento, não aceitava o risco.",
    "correctAnswer": "conhecesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "conheci",
      "conheceria",
      "conheço",
      "conhecesse"
    ],
    "explanations": {
      "pt": "A condição irreal requer o imperfeito do conjuntivo: 'conhecesse'.",
      "en": "The unreal condition requires the imperfect subjunctive: 'conhecesse'.",
      "uk": "Ірреальна умова потребує імперфекта кон'юнктива: 'conhecesse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "04d82d2c-2e0f-4f40-a692-1eac1e9810d9",
    "sentence": "Se a equipa _____ unida, venceríamos mais jogos.",
    "correctAnswer": "estivesse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "estaria",
      "esteve",
      "estivesse",
      "está"
    ],
    "explanations": {
      "pt": "Condição presente irreal com 'estar' pede 'estivesse'.",
      "en": "Unreal present condition with 'estar' takes 'estivesse'.",
      "uk": "Ірреальна теперішня умова з 'estar' — 'estivesse'."
    },
    "hint": "estar",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "c725af9a-63f2-4ec9-b177-871d3a44ec30",
    "sentence": "Se eu te _____ antes, explicava tudo com calma.",
    "correctAnswer": "visse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "veria",
      "vi",
      "vejo",
      "visse"
    ],
    "explanations": {
      "pt": "O imperfeito do conjuntivo de 'ver' é 'visse' para condições irreais.",
      "en": "The imperfect subjunctive of 'ver' is 'visse' for unreal conditions.",
      "uk": "Імперфект кон'юнктива 'ver' — 'visse' у нереальних умовах."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "3ff1c6fe-f1fc-4c82-be26-7c2c353373cf",
    "sentence": "Se vocês _____ o aviso, não teria havido confusão.",
    "correctAnswer": "tivessem lido",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivessem lido",
      "tinham lido",
      "leriam",
      "leram"
    ],
    "explanations": {
      "pt": "Para condição contrafactual no passado: 'se' + mais-que-perfeito composto do conjuntivo ('tivessem lido').",
      "en": "For counterfactual past condition: 'se' + pluperfect subjunctive compound ('tivessem lido').",
      "uk": "Для контрфактичного минулого: 'se' + складений плюсквамперфект кон'юнктива ('tivessem lido')."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "de2363b2-3396-4724-988c-b6d78eb5cfd6",
    "sentence": "Queria que tu _____ comigo hoje à tarde.",
    "correctAnswer": "viesses",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "venhas",
      "vens",
      "viesses",
      "virás"
    ],
    "explanations": {
      "pt": "Pedido atenuado no passado (queria) costuma pedir imperfeito do conjuntivo: 'viesses'.",
      "en": "A softened request in the past (queria) typically takes the imperfect subjunctive: 'viesses'.",
      "uk": "Пом'якшене прохання в минулому ('queria') зазвичай вимагає імперфекта кон'юнктива: 'viesses'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "862d43fc-2e4c-4b45-ae89-131ba62228d4",
    "sentence": "Quero que tu _____ comigo amanhã.",
    "correctAnswer": "venhas",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "viesses",
      "virás",
      "venhas",
      "vens"
    ],
    "explanations": {
      "pt": "Com 'quero que' no presente, usa-se presente do conjuntivo: 'venhas'.",
      "en": "With 'quero que' in the present, use the present subjunctive: 'venhas'.",
      "uk": "З 'quero que' в теперішньому потрібен презент кон'юнктива: 'venhas'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "bd25f461-5907-4a2d-9db7-d92e50170641",
    "sentence": "Preferia que vocês não _____ tão tarde.",
    "correctAnswer": "chegassem",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegarão",
      "chegam",
      "chegassem",
      "cheguem"
    ],
    "explanations": {
      "pt": "Com 'preferia que', o pedido hipotético usa imperfeito do conjuntivo: 'chegassem'.",
      "en": "With 'preferia que', the hypothetical request uses the imperfect subjunctive: 'chegassem'.",
      "uk": "З 'preferia que' вживається імперфект кон'юнктива: 'chegassem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "43ec136a-8d03-4e84-8e17-b8c102f490e2",
    "sentence": "É bom que ele _____ os prazos combinados.",
    "correctAnswer": "cumpra",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "cumpra",
      "cumprisse",
      "cumpre",
      "cumprirá"
    ],
    "explanations": {
      "pt": "Expressão avaliativa presente pede presente do conjuntivo: 'cumpra'.",
      "en": "Present evaluative expression requires the present subjunctive: 'cumpra'.",
      "uk": "Оціночний вираз у теперішньому вимагає презент кон'юнктива: 'cumpra'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "f954ce98-cf42-47ab-a2a5-b25971ca9b71",
    "sentence": "Seria melhor que ela _____ com antecedência.",
    "correctAnswer": "avisasse",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "avisasse",
      "avisará",
      "avise",
      "avisa"
    ],
    "explanations": {
      "pt": "Condição hipotética/aconselhamento no condicional pede imperfeito do conjuntivo: 'avisasse'.",
      "en": "Hypothetical advice with the conditional calls for the imperfect subjunctive: 'avisasse'.",
      "uk": "Гіпотетична порада з умовним потребує імперфекта кон'юнктива: 'avisasse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "ad9a475e-15f0-4d3c-ab7e-4e8c17333166",
    "sentence": "É necessário que nós _____ o relatório hoje.",
    "correctAnswer": "entreguemos",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "entregássemos",
      "entregaremos",
      "entregamos",
      "entreguemos"
    ],
    "explanations": {
      "pt": "Com 'é necessário que', usa-se presente do conjuntivo: 'entreguemos'.",
      "en": "With 'é necessário que', use the present subjunctive: 'entreguemos'.",
      "uk": "З 'é necessário que' потрібен презент кон'юнктива: 'entreguemos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "c53f6bdb-66b3-4bec-b3f3-683fac0b18d9",
    "sentence": "Gostava que vocês _____ mais o vosso tempo.",
    "correctAnswer": "organizassem",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "organizassem",
      "organizariam",
      "organizam",
      "organizem"
    ],
    "explanations": {
      "pt": "Desejo no passado/condicional usa imperfeito do conjuntivo: 'organizassem'.",
      "en": "A wish in past/conditional uses the imperfect subjunctive: 'organizassem'.",
      "uk": "Бажання в минулому/умовному використовує імперфект кон'юнктива: 'organizassem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "90dcf6cb-0c83-4b31-9b3b-6f02227489a8",
    "sentence": "É provável que a reunião _____ adiada.",
    "correctAnswer": "seja",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "seja",
      "é",
      "será",
      "fosse"
    ],
    "explanations": {
      "pt": "Com 'é provável que' no presente, pede-se presente do conjuntivo: 'seja'.",
      "en": "With 'é provável que' in the present, use the present subjunctive: 'seja'.",
      "uk": "Зі зворотом 'é provável que' у теперішньому потрібен презент кон'юнктива: 'seja'."
    },
    "hint": "ser",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "320d7528-1508-480e-9d53-d18e5ec81b96",
    "sentence": "É bom que tu _____ os dados antes de decidir.",
    "correctAnswer": "verifiques",
    "topic": "imperfeito-vs-presente-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "verificasses",
      "verificarás",
      "verificas",
      "verifiques"
    ],
    "explanations": {
      "pt": "Avaliação no presente pede presente do conjuntivo: 'verifiques'.",
      "en": "Present evaluation requires the present subjunctive: 'verifiques'.",
      "uk": "Оцінка в теперішньому потребує презенту кон'юнктива: 'verifiques'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.061Z",
    "updatedAt": "2025-08-10T19:28:53.061Z"
  },
  {
    "id": "cc180665-9fef-44b4-b129-cc180eeb530e",
    "sentence": "Apesar de ele não _____, decidimos avançar.",
    "correctAnswer": "concordar",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "concorda",
      "concordar",
      "concorde",
      "concordasse"
    ],
    "explanations": {
      "pt": "Com 'apesar de' + infinitivo, o sujeito explícito 'ele' permite o infinitivo simples: 'ele não concordar'.",
      "en": "With 'apesar de' + infinitive, an explicit subject allows the bare infinitive: 'ele não concordar'.",
      "uk": "Зі зворотом 'apesar de' можна вживати інфінітив із явним підметом: 'ele não concordar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "13ecec82-46c3-4045-8832-3e8b2fdc8ad2",
    "sentence": "É importante que todos _____ a ata antes da reunião.",
    "correctAnswer": "leiam",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "leem",
      "leiam",
      "leram",
      "ler"
    ],
    "explanations": {
      "pt": "Usa-se o conjuntivo presente depois de expressões de necessidade/valoração como 'é importante que'. O verbo 'ler' no conjuntivo presente, 3.ª pessoa plural, é 'leiam'.",
      "en": "Use the present subjunctive after expressions of necessity like 'é importante que'. The verb 'ler' in present subjunctive, 3rd person plural, is 'leiam'.",
      "uk": "Після виразів потреби на кшталт 'é importante que' вживається презент конжунктива. Дієслово 'ler' у цій формі множини — 'leiam'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "015e72d4-35a8-46ba-8c55-e51f043eb701",
    "sentence": "Duvido que ele _____ tempo para terminar hoje.",
    "correctAnswer": "tenha",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "terá",
      "tenha",
      "teve",
      "tem"
    ],
    "explanations": {
      "pt": "Após verbos de dúvida como 'duvidar', usa-se o conjuntivo. A forma correta do verbo 'ter' no conjuntivo presente, 3.ª singular, é 'tenha'.",
      "en": "After verbs of doubt like 'duvidar', Portuguese takes the subjunctive. The correct present subjunctive of 'ter' (3rd sg) is 'tenha'.",
      "uk": "Після дієслів сумніву, як-от 'duvidar', вживають кон'юнктива. Правильна форма 'ter' — 'tenha'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "1a2d9f52-2e19-4a75-ac66-620bf3847c2a",
    "sentence": "Embora _____ tarde, continuámos a conversar.",
    "correctAnswer": "fosse",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "seria",
      "fosse",
      "era",
      "é"
    ],
    "explanations": {
      "pt": "Com 'embora' usa-se o conjuntivo, exprimindo concessão. No passado/descritivo, usa-se o imperfeito do conjuntivo: 'fosse'.",
      "en": "With 'embora' the subjunctive is required to express concession. In past narrative, the imperfect subjunctive 'fosse' fits.",
      "uk": "Після 'embora' потрібен кон'юнктив для поступки. У минулому вживається імперфект кон'юнктива: 'fosse'."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "345ea809-d18f-45f4-ad8b-c95346851ddd",
    "sentence": "Procuro alguém que _____ experiência em auditoria.",
    "correctAnswer": "tenha",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "tenha",
      "tinha",
      "ter",
      "tem"
    ],
    "explanations": {
      "pt": "Em orações relativas com valor indefinido/necessidade, usa-se o conjuntivo. 'Alguém que tenha' indica requisito não garantido.",
      "en": "In relative clauses expressing requirement/uncertainty, use the subjunctive. 'Alguém que tenha' signals a non-guaranteed trait.",
      "uk": "У відносних реченнях з невизначеністю вживається кон'юнктив. 'Alguém que tenha' — ознака, якої може й не бути."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "0a19a87c-7713-412e-abb0-ce944047c66a",
    "sentence": "Tomara que tudo _____ como planeámos.",
    "correctAnswer": "corra",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "corra",
      "correrá",
      "correu",
      "corre"
    ],
    "explanations": {
      "pt": "Com 'tomara que' exprimimos desejo e pedimos o conjuntivo presente: 'corra'.",
      "en": "With 'tomara que' (may/hopefully), we use the present subjunctive: 'corra'.",
      "uk": "З 'tomara que' виражаємо побажання, тому потрібен презент кон'юнктива: 'corra'."
    },
    "hint": "correr",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "9b644485-d095-4661-a3e0-30400dbcab44",
    "sentence": "Não acredito que eles nos _____ sem avisar.",
    "correctAnswer": "deixem",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "deixarão",
      "deixaram",
      "deixam",
      "deixem"
    ],
    "explanations": {
      "pt": "Após negação de crença/opinião ('não acredito que'), usa-se conjuntivo. 3.ª plural do presente do conjuntivo de 'deixar' é 'deixem'.",
      "en": "After negative belief ('não acredito que'), Portuguese uses the subjunctive. Present subjunctive 3rd pl of 'deixar' is 'deixem'.",
      "uk": "Після заперечення віри/думки вживається кон'юнктив. Форма 3-ї множини — 'deixem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "d4909f9c-4eca-4077-a42f-bccf3d0b9bde",
    "sentence": "É possível que a entrega não _____ amanhã.",
    "correctAnswer": "chegue",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "chega",
      "chegou",
      "chegará",
      "chegue"
    ],
    "explanations": {
      "pt": "Expressões de possibilidade ('é possível que') pedem o conjuntivo. 'Chegar' no presente do conjuntivo, 3.ª singular: 'chegue'.",
      "en": "Expressions of possibility ('é possível que') require the subjunctive. 'Chegar' in present subjunctive 3rd sg is 'chegue'.",
      "uk": "Вирази можливості потребують кон'юнктива. 'Chegar' у презенті кон'юнктива — 'chegue'."
    },
    "hint": "chegar",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "d44f5258-ec02-427f-ae68-7fd256140ebb",
    "sentence": "Esperamos que o projeto _____ até ao verão.",
    "correctAnswer": "avance",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "avançará",
      "avança",
      "avance",
      "avançou"
    ],
    "explanations": {
      "pt": "Com verbos de esperança no plural com 'que', o uso do conjuntivo é frequente em português europeu: 'que avance'.",
      "en": "With verbs of hope plus 'que', European Portuguese often uses the subjunctive: 'que avance'.",
      "uk": "З дієсловами надії та 'que' у європейській португальській часто вживають кон'юнктив: 'avance'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "5b2332eb-9e56-4cda-bf3e-43042d5c360e",
    "sentence": "Antes que _____, precisamos de alinhar expectativas.",
    "correctAnswer": "surjam",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "surjam",
      "surgirão",
      "surgiram",
      "surgem"
    ],
    "explanations": {
      "pt": "Locuções temporais como 'antes que' exigem conjuntivo. 'Surgir' no presente do conjuntivo plural é 'surjam'.",
      "en": "Temporal phrase 'antes que' takes the subjunctive. Present subjunctive plural of 'surgir' is 'surjam'.",
      "uk": "Зі зворотом 'antes que' потрібен кон'юнктив. Форма множини — 'surjam'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "643112ca-6dc2-4cb8-ac32-c4bdab61ac98",
    "sentence": "Que ele _____ a verdade, custe o que custar!",
    "correctAnswer": "diga",
    "topic": "conjuntivo-geral",
    "level": "B2",
    "multipleChoiceOptions": [
      "dizia",
      "diga",
      "diz",
      "dirá"
    ],
    "explanations": {
      "pt": "Exortações com 'que' usam conjuntivo presente: 'que diga a verdade'.",
      "en": "Exhortations with 'que' take the present subjunctive: 'que diga a verdade'.",
      "uk": "Спонукання з 'que' вимагають презенту кон'юнктива: 'diga'."
    },
    "hint": "dizer",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "62f37498-e2d6-4b61-8987-5d3e48c1adde",
    "sentence": "Acho que ele _____ amanhã, mas é provável que não _____.",
    "correctAnswer": "vem",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "venha",
      "viesse",
      "vem",
      "virá"
    ],
    "explanations": {
      "pt": "Após 'achar que' usa-se o indicativo por exprimir opinião provável: 'ele vem'. Já 'é provável que' pede conjuntivo, mas essa parte não tem lacuna aqui.",
      "en": "After 'achar que', Portuguese uses the indicative for likely opinions: 'ele vem'. 'É provável que' would require subjunctive, but that part isn't gapped here.",
      "uk": "Після 'achar que' вживається індикатив: 'ele vem'. 'É provável que' потребує кон'юнктива, але тут пропуск не там."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "c32506ac-3eaf-45c4-8622-129befa14d93",
    "sentence": "É provável que eles _____ mais cedo do que pensas.",
    "correctAnswer": "cheguem",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegar",
      "chegam",
      "cheguem",
      "chegarão"
    ],
    "explanations": {
      "pt": "Com 'é provável que', exige-se conjuntivo. A forma correta é 'cheguem'.",
      "en": "With 'é provável que', the subjunctive is required. The correct form is 'cheguem'.",
      "uk": "Зі зворотом 'é provável que' слід уживати кон'юнктив: 'cheguem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "e32c5c57-982b-4a03-b5ce-b92c4688042b",
    "sentence": "Antes de _____, confirma se tens o passaporte.",
    "correctAnswer": "viajares",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "viajar",
      "viajarias",
      "viajares",
      "viajaste"
    ],
    "explanations": {
      "pt": "Depois de 'antes de', quando o sujeito é 'tu', usa-se o infinitivo pessoal: 'viajares'.",
      "en": "After 'antes de', when the subject is 'tu', use the personal infinitive: 'viajares'.",
      "uk": "Після 'antes de' із підметом 'ти' вживають особовий інфінітив: 'viajares'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "c66406bc-efc5-474e-9efc-407281a93753",
    "sentence": "Duvido que tu _____ a tempo, mas talvez sim.",
    "correctAnswer": "chegues",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "chegarás",
      "chegas",
      "chegues",
      "chegasses"
    ],
    "explanations": {
      "pt": "Após 'duvido que', requer-se conjuntivo presente: 'chegues'.",
      "en": "After 'duvido que', the present subjunctive is required: 'chegues'.",
      "uk": "Після 'duvido que' потрібен презент кон'юнктива: 'chegues'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "00c9dad0-9d69-4098-a875-b828aa5c31e3",
    "sentence": "Para _____ melhor, precisamos de mais dados.",
    "correctAnswer": "decidir",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "decidíamos",
      "decidirmos",
      "decidamos",
      "decidir"
    ],
    "explanations": {
      "pt": "Depois de 'para' indicando finalidade sem sujeito explícito, usa-se o infinitivo impessoal: 'decidir'.",
      "en": "After 'para' indicating purpose with no explicit subject, use the impersonal infinitive: 'decidir'.",
      "uk": "Після 'para' мети без явного підмета вживають неособовий інфінітив: 'decidir'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "d1f99c99-b523-40d7-850d-2824a513880b",
    "sentence": "É bom _____ feedback claro aos estagiários.",
    "correctAnswer": "dar",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "dávamos",
      "darmos",
      "dar",
      "dê"
    ],
    "explanations": {
      "pt": "Com expressões impessoais de apreciação, é comum o infinitivo impessoal: 'é bom dar'.",
      "en": "With impersonal evaluative expressions, the impersonal infinitive is common: 'é bom dar'.",
      "uk": "З безособовими оцінними виразами часто вживають неособовий інфінітив: 'dar'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "65667bc9-856c-4c02-805d-99eccdf806fe",
    "sentence": "Convém que vocês _____ as instruções até ao fim.",
    "correctAnswer": "leiam",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "leiam",
      "leem",
      "lerão",
      "ler"
    ],
    "explanations": {
      "pt": "Com 'convém que', pede-se conjuntivo. A forma correta é 'leiam'.",
      "en": "With 'convém que', the subjunctive is required. The correct form is 'leiam'.",
      "uk": "Зі зворотом 'convém que' використовується кон'юнктив: 'leiam'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "f82e7083-e455-48d6-9709-bcac52e0094f",
    "sentence": "Sei que ela _____ bem francês desde criança.",
    "correctAnswer": "fala",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "falasse",
      "fale",
      "falaria",
      "fala"
    ],
    "explanations": {
      "pt": "Com 'sei que', usa-se indicativo para factos: 'ela fala'.",
      "en": "With 'sei que', use the indicative to state facts: 'ela fala'.",
      "uk": "Після 'sei que' індикатив для фактів: 'ela fala'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "855f851d-3f69-4f6c-a0f9-2f89bfad7263",
    "sentence": "Depois de _____ o relatório, envia-mo, por favor.",
    "correctAnswer": "terminares",
    "topic": "indicativo-conjuntivo-infinitivo-avancado",
    "level": "B2",
    "multipleChoiceOptions": [
      "terminar",
      "terminaste",
      "terminares",
      "terminarias"
    ],
    "explanations": {
      "pt": "Após 'depois de', com sujeito 'tu', usa-se o infinitivo pessoal: 'terminares'.",
      "en": "After 'depois de', with subject 'tu', use the personal infinitive: 'terminares'.",
      "uk": "Після 'depois de' із підметом 'ти' вживається особовий інфінітив: 'terminares'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "4a81859d-fb6a-4eeb-ba51-528785bbd0bb",
    "sentence": "Quem me dera que ela _____ comigo nesta viagem!",
    "correctAnswer": "fosse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "iria",
      "fosse",
      "é",
      "será"
    ],
    "explanations": {
      "pt": "Expressões exclamativas de desejo como 'quem me dera que' exigem o imperfeito do conjuntivo: 'fosse'.",
      "en": "Exclamations of wish like 'quem me dera que' require the imperfect subjunctive: 'fosse'.",
      "uk": "У вигуках бажання на кшталт 'quem me dera que' вживається імперфект кон'юнктива: 'fosse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "04b62f57-d896-46e0-b53e-ad98e5f1974c",
    "sentence": "Oxalá _____ mais tempo para a família!",
    "correctAnswer": "tivéssemos",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "teremos",
      "tivéssemos",
      "temos",
      "tínhamos"
    ],
    "explanations": {
      "pt": "Com 'oxalá' que exprime desejo irreal no presente, usa-se imperfeito do conjuntivo: 'tivéssemos'.",
      "en": "With 'oxalá' expressing an unreal present wish, use the imperfect subjunctive: 'tivéssemos'.",
      "uk": "З 'oxalá' та нереальним бажанням теперішнього часу вживають імперфект кон'юнктива: 'tivéssemos'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "4494331c-9e67-481e-bbf8-d90108c6f813",
    "sentence": "Quem dera que os prazos _____ mais folgados!",
    "correctAnswer": "fossem",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "seriam",
      "são",
      "fossem",
      "serão"
    ],
    "explanations": {
      "pt": "A construção exclamativa 'quem dera que' pede imperfeito do conjuntivo: 'fossem'.",
      "en": "The exclamative 'quem dera que' takes the imperfect subjunctive: 'fossem'.",
      "uk": "У конструкції 'quem dera que' потрібен імперфект кон'юнктива: 'fossem'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "5f53d0f7-cc0c-4b62-b3ab-cf3c58defda0",
    "sentence": "Antes _____ ouvido o teu conselho!",
    "correctAnswer": "tivesse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "teve",
      "tivesse",
      "teria",
      "tinha"
    ],
    "explanations": {
      "pt": "Exclamação hipotética de arrependimento costuma usar imperfeito do conjuntivo composto implícito; aqui reduzido a 'tivesse' é aceitável no idioma falado.",
      "en": "An exclamation of regret often uses an implied compound imperfect subjunctive; the reduced 'tivesse' is acceptable in speech.",
      "uk": "У вигуках жалю часто вживають складені форми імперфекта кон'юнктива; скорочене 'tivesse' прийнятне в розмові."
    },
    "hint": "(3ª sing.)",
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "b4718544-78a4-4807-b491-cc75a70a294e",
    "sentence": "Quem me dera que tudo _____ mais simples!",
    "correctAnswer": "fosse",
    "topic": "preterito-imperfeito-conjuntivo-exclamativas",
    "level": "B2",
    "multipleChoiceOptions": [
      "seria",
      "é",
      "fosse",
      "será"
    ],
    "explanations": {
      "pt": "Desejo exclamativo irreal pede imperfeito do conjuntivo: 'fosse'.",
      "en": "Unreal wish in exclamation uses the imperfect subjunctive: 'fosse'.",
      "uk": "Нереальне побажання вимагає імперфекта кон'юнктива: 'fosse'."
    },
    "hint": null,
    "difficultyScore": 0.6,
    "usageCount": 0,
    "createdAt": "2025-08-10T19:28:53.053Z",
    "updatedAt": "2025-08-10T19:28:53.053Z"
  },
  {
    "id": "663d9120-457e-4fbe-bb0d-02cd595277d9",
    "sentence": "Quem quer que ___ este documento deve assiná-lo imediatamente.",
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
    "hint": "\"receber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:17.826Z",
    "updatedAt": "2025-08-10T11:19:39.243Z"
  },
  {
    "id": "8b759cb4-519d-4f2e-b3cb-a4779daa1e93",
    "sentence": "Por mais que eu ___ estudar português, ainda cometo erros.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T15:16:11.013Z",
    "updatedAt": "2025-08-10T11:19:39.245Z"
  },
  {
    "id": "783acb00-28b9-42cf-9ea4-5e24e6bff4a7",
    "sentence": "O relatório ___ entregue ao diretor ontem.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.292Z",
    "updatedAt": "2025-08-10T15:21:54.472Z"
  },
  {
    "id": "efb26096-44bd-4aa9-9d8a-484a5b8aea1e",
    "sentence": "Embora ___ chover, vamos fazer o piquenique.",
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
    "hint": "\"poder\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.291Z",
    "updatedAt": "2025-08-10T15:21:41.538Z"
  },
  {
    "id": "2909fbbc-6aa7-4823-8d1c-8ac542606731",
    "sentence": "Não ___ falar com ela por causa do barulho.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.290Z",
    "updatedAt": "2025-08-10T15:21:54.443Z"
  },
  {
    "id": "4b5b4572-1b7e-4fb7-ae08-6b75838476e0",
    "sentence": "Se eu ___ mais tempo, teria ido à festa.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:03.289Z",
    "updatedAt": "2025-08-10T15:21:41.540Z"
  },
  {
    "id": "9a0ef98f-8bc8-453c-9193-4a42cb64f43a",
    "sentence": "A pessoa ___ livro estou a ler é portuguesa.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.977Z",
    "updatedAt": "2025-08-10T11:19:39.241Z"
  },
  {
    "id": "6e5d5247-6065-4f64-958f-9750a56f6310",
    "sentence": "É possível que ela já ___ chegado a casa.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.976Z",
    "updatedAt": "2025-08-10T11:19:39.244Z"
  },
  {
    "id": "68d1f846-39ab-4bf1-b1f3-66ed7caa1b8d",
    "sentence": "Quando ___ a Lisboa, visitarei o Mosteiro dos Jerónimos.",
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
    "hint": "\"vir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.976Z",
    "updatedAt": "2025-08-10T15:21:41.537Z"
  },
  {
    "id": "a852177a-0100-4e92-b72b-905fb8e9ddd5",
    "sentence": "O documento ___ entregue ao diretor esta manhã.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.975Z",
    "updatedAt": "2025-08-10T15:21:54.447Z"
  },
  {
    "id": "2110e36b-92d5-406c-84d0-ace8b6951cfa",
    "sentence": "Espero que ___ resolver este problema sozinho.",
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
    "hint": "\"conseguir\" (\"tu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.975Z",
    "updatedAt": "2025-08-10T15:21:41.539Z"
  },
  {
    "id": "4cee74cf-a3fb-4c85-9173-4253270d91dc",
    "sentence": "Se ___ que ele estava doente, teria levado medicamentos.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.974Z",
    "updatedAt": "2025-08-10T15:21:41.539Z"
  },
  {
    "id": "ef8802e6-e6f7-4440-9d68-fe7c42b8a023",
    "sentence": "Não ___ ir à festa porque estou doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:07:02.971Z",
    "updatedAt": "2025-08-10T15:21:54.458Z"
  },
  {
    "id": "ce158a34-ca32-449e-8648-ca9d1ed2faed",
    "sentence": "Tomara que ___ tudo bem no exame!",
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
    "hint": "\"correr\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.427Z",
    "updatedAt": "2025-08-10T15:21:41.541Z"
  },
  {
    "id": "95c2834b-8d69-4308-adc2-7cc6a64e8797",
    "sentence": "O documento ___ enviado pelo correio na semana passada.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.427Z",
    "updatedAt": "2025-08-10T15:21:54.450Z"
  },
  {
    "id": "2b7a8cfe-a3bf-4fc2-8d84-9940d8de51c8",
    "sentence": "Assim que ___ o trabalho, envio-te uma mensagem.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.426Z",
    "updatedAt": "2025-08-10T15:21:54.498Z"
  },
  {
    "id": "3f3a2f0c-e3bb-4da7-9c17-0b0b7a75597f",
    "sentence": "Se ___ que ela estivesse doente, teria ligado antes.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.425Z",
    "updatedAt": "2025-08-10T11:19:39.238Z"
  },
  {
    "id": "1fe74c96-8b13-4ad6-bd31-63451908ff14",
    "sentence": "Quando ___ a verdade, fiquei muito surpreendido.",
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
    "hint": "saber / conhecer",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.425Z",
    "updatedAt": "2025-08-10T15:21:54.445Z"
  },
  {
    "id": "901277e6-386f-4587-9f05-e14ba72da9b8",
    "sentence": "Não ___ fazer o trabalho porque estava doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:35.424Z",
    "updatedAt": "2025-08-10T15:21:54.462Z"
  },
  {
    "id": "983d501e-676f-488c-ab4a-7a4487f8bf79",
    "sentence": "___ pessoas ainda não entregaram os documentos.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.553Z",
    "updatedAt": "2025-08-10T11:19:39.245Z"
  },
  {
    "id": "154d3645-cf1d-4be5-ba85-495e1c12b8ac",
    "sentence": "A carta ___ escrita pelo diretor ontem.",
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
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.552Z",
    "updatedAt": "2025-08-10T15:21:54.459Z"
  },
  {
    "id": "e07c4acb-1c4a-4e54-81d3-967b1d809890",
    "sentence": "Quando ___ o trabalho, avisa-me.",
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
    "hint": "\"acabar\" (\"tu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.551Z",
    "updatedAt": "2025-08-10T15:21:54.496Z"
  },
  {
    "id": "1670cb87-578e-43dd-8b5c-03f35f8b0586",
    "sentence": "O relatório ___ ser entregue até amanhã.",
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
    "hint": "dever / ter de",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.547Z",
    "updatedAt": "2025-08-10T15:21:54.453Z"
  },
  {
    "id": "abe5d7ad-a6dc-4654-b46e-398701132c83",
    "sentence": "Embora ele ___ que está errado, continua a insistir.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.544Z",
    "updatedAt": "2025-08-10T15:21:54.499Z"
  },
  {
    "id": "1fb5a19b-f3a1-42d1-a1d4-e1ca1fa3abe5",
    "sentence": "Não ___ dormir por causa do barulho.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:34.542Z",
    "updatedAt": "2025-08-10T15:21:54.466Z"
  },
  {
    "id": "17313336-39a0-4daf-a701-2df11cda51a9",
    "sentence": "Procuro uma casa ___ tenha vista para o mar.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.785Z",
    "updatedAt": "2025-08-10T11:19:39.239Z"
  },
  {
    "id": "d1eb907e-c653-4561-be5c-277dacf2de50",
    "sentence": "___ quer que seja, não pode entrar sem identificação.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.785Z",
    "updatedAt": "2025-08-10T11:19:39.240Z"
  },
  {
    "id": "23ee0ec5-fc8a-4011-9263-35d44c1e4467",
    "sentence": "Duvido que ele ___ conseguido terminar o projeto a tempo.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.784Z",
    "updatedAt": "2025-08-10T11:19:39.246Z"
  },
  {
    "id": "5d71b742-357d-42e1-89d6-d7eef9cd3d46",
    "sentence": "Quando ___ o relatório, enviarei por email.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.784Z",
    "updatedAt": "2025-08-10T15:21:54.495Z"
  },
  {
    "id": "31d98f1a-66f1-42a0-a3d1-7a9b6c7c5de6",
    "sentence": "Esta carta ___ escrita pelo diretor ontem.",
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
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.783Z",
    "updatedAt": "2025-08-10T15:21:54.483Z"
  },
  {
    "id": "e31a3167-87f8-4ad2-a739-ac5c9359bafe",
    "sentence": "Não ___ trabalhar hoje porque estou doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.781Z",
    "updatedAt": "2025-08-10T15:21:54.481Z"
  },
  {
    "id": "0092846f-f2d7-400e-a980-550d9fc49cf1",
    "sentence": "Se eu ___ mais tempo, teria acabado o trabalho.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-10T15:21:54.497Z"
  },
  {
    "id": "de9e7f82-cf7d-4094-9da5-bfa5949380ae",
    "sentence": "___ me disseram que o restaurante fechou.",
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
    "hint": "\"dizer\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-10T11:19:39.242Z"
  },
  {
    "id": "d369d7a5-bc7d-45d1-b048-13eaef30517a",
    "sentence": "Quando ___ promover um evento, avise-nos com antecedência.",
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
    "hint": "\"querer\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.230Z",
    "updatedAt": "2025-08-10T15:21:54.496Z"
  },
  {
    "id": "faf83bb9-9658-4e4c-9044-43040a6d5f00",
    "sentence": "A declaração ___ ser entregue até amanhã.",
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
    "hint": "dever / ter de",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.229Z",
    "updatedAt": "2025-08-10T15:21:54.447Z"
  },
  {
    "id": "66376e9c-475a-40a3-91dd-02185ec327ed",
    "sentence": "Duvido que ela ___ a verdade sobre o acontecimento.",
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
    "hint": "saber / conhecer",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.229Z",
    "updatedAt": "2025-08-10T15:21:54.455Z"
  },
  {
    "id": "f3b68d0e-b1d6-43a1-9084-3b8d5b7625c6",
    "sentence": "Não ___ abrir a porta porque estava trancada.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.228Z",
    "updatedAt": "2025-08-10T15:21:54.485Z"
  },
  {
    "id": "0f6a9ae9-b478-48f2-be76-4821b942720d",
    "sentence": "Espero que ___ resolver o problema sozinha.",
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
    "hint": "\"conseguir\" (\"tu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.143Z",
    "updatedAt": "2025-08-10T11:19:43.605Z"
  },
  {
    "id": "fd4b9622-f115-40a0-be34-d442a81fdbfa",
    "sentence": "Se ___ mais cedo, teríamos apanhado o comboio.",
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
    "hint": "\"ter + saído\" (\"nós\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.143Z",
    "updatedAt": "2025-08-10T15:21:54.500Z"
  },
  {
    "id": "71b691b3-7f71-4ef2-a5f7-e43e3240ccb6",
    "sentence": "O relatório ___ enviado ao diretor amanhã.",
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
    "hint": "\"ser\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.142Z",
    "updatedAt": "2025-08-10T15:21:54.451Z"
  },
  {
    "id": "8254dd59-1e3b-4942-a1e8-1a2258a08165",
    "sentence": "Embora ___ muito trabalho, vou ajudar-te.",
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
    "hint": "\"ter\" (\"eu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.141Z",
    "updatedAt": "2025-08-10T15:21:54.494Z"
  },
  {
    "id": "2839ae11-a032-4c6f-ac13-7ae08bce21da",
    "sentence": "Quando ___ a verdade, fiquei muito desiludido.",
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
    "hint": "saber / conhecer",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.140Z",
    "updatedAt": "2025-08-10T15:21:54.486Z"
  },
  {
    "id": "c2ae8aff-2dab-465f-86f5-09cdf1a6f5bc",
    "sentence": "Não ___ ir à reunião hoje porque estou doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-26T08:05:31.137Z",
    "updatedAt": "2025-08-10T15:21:54.454Z"
  },
  {
    "id": "0933d63b-e8f4-4e70-967f-89dfa2eef09a",
    "sentence": "Espero que vocês ___ um bom fim de semana.",
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
    "hint": "\"ter\" (\"eles/elas\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.223Z",
    "updatedAt": "2025-08-10T15:21:54.500Z"
  },
  {
    "id": "ccccfa12-58e0-4299-889c-116da40b7669",
    "sentence": "___ alunos fizeram o exame hoje.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.223Z",
    "updatedAt": "2025-08-10T11:19:43.605Z"
  },
  {
    "id": "a8e48b10-fe9a-4505-85af-b81b5c5f38a2",
    "sentence": "O relatório ___ entregue ao diretor amanhã.",
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
    "hint": "\"ser\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.222Z",
    "updatedAt": "2025-08-10T15:21:54.480Z"
  },
  {
    "id": "b498e7f9-4dbc-42d2-af26-24f1e7cbaa84",
    "sentence": "Quem quer que ___ essa decisão terá de assumir a responsabilidade.",
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
    "hint": "\"tomar\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.221Z",
    "updatedAt": "2025-08-10T15:21:54.493Z"
  },
  {
    "id": "a5fa8e5f-2edd-4564-9b2b-6cdd0955f8f2",
    "sentence": "Assim que ___ o trabalho, envio-te uma mensagem.",
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
    "hint": "\"acabar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.221Z",
    "updatedAt": "2025-08-10T15:01:03.826Z"
  },
  {
    "id": "f6f632bd-a260-4958-8279-3b8a325e176e",
    "sentence": "Se eu ___ que ia chover, teria trazido um guarda-chuva.",
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
    "hint": "\"saber\" (\"eu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.220Z",
    "updatedAt": "2025-08-10T15:01:03.951Z"
  },
  {
    "id": "38072d26-5603-4b0c-b116-3715caff6632",
    "sentence": "Ela não ___ sair ontem porque estava doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:25.218Z",
    "updatedAt": "2025-08-10T15:21:54.468Z"
  },
  {
    "id": "dd98e2c5-cd70-43b7-b54e-5907507ba3cc",
    "sentence": "Tenho certeza de que ela ___ resolver o problema sozinha.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.773Z",
    "updatedAt": "2025-08-10T15:21:54.461Z"
  },
  {
    "id": "d45a2d5b-ed67-48be-8d57-0347c9cadf68",
    "sentence": "Quem quer que ___ à festa deve trazer uma sobremesa.",
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
    "hint": "\"vir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.772Z",
    "updatedAt": "2025-08-10T15:01:03.819Z"
  },
  {
    "id": "0f1c0764-ffec-491f-beb2-5f7fc6351695",
    "sentence": "O livro ___ na semana passada já está esgotado.",
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
    "hint": "\"publicar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.772Z",
    "updatedAt": "2025-08-10T15:21:54.473Z"
  },
  {
    "id": "0a824625-0ca6-496b-a512-f7005f46a903",
    "sentence": "Assim que ___ o trabalho, posso ir ter contigo.",
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
    "hint": "\"conseguir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.771Z",
    "updatedAt": "2025-08-10T14:58:47.784Z"
  },
  {
    "id": "63b8cd3c-e682-48da-9314-2a7f103288e0",
    "sentence": "Se ___ que ia chover, tinha trazido um guarda-chuva.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.770Z",
    "updatedAt": "2025-08-10T14:58:47.789Z"
  },
  {
    "id": "a785d5b6-0649-4ce4-9483-ff1205e2e38c",
    "sentence": "Embora ___ falar cinco línguas, ela ainda quer aprender mais.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:59:24.765Z",
    "updatedAt": "2025-08-10T14:58:47.801Z"
  },
  {
    "id": "05ac45ec-d200-4394-ae3a-b56f5dc4de3b",
    "sentence": "___ horas são?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.624Z",
    "updatedAt": "2025-08-10T13:54:50.907Z"
  },
  {
    "id": "157c920e-3bfb-44e0-8192-e2d819e1890a",
    "sentence": "O meu carro é ___ pequeno.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.623Z",
    "updatedAt": "2025-08-10T13:54:50.905Z"
  },
  {
    "id": "565020ce-5650-4f7f-9753-714577cecde5",
    "sentence": "___ menina é minha prima.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.620Z",
    "updatedAt": "2025-08-10T13:54:50.905Z"
  },
  {
    "id": "e28e261f-854d-42d4-b8a6-91af2045eeee",
    "sentence": "Ele ___ a estudar português.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.618Z",
    "updatedAt": "2025-08-10T13:54:50.902Z"
  },
  {
    "id": "03900fb6-5918-46cc-a796-965a2cabe088",
    "sentence": "Tu ___ o livro na mochila.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:31.615Z",
    "updatedAt": "2025-08-10T15:21:54.420Z"
  },
  {
    "id": "b62182dd-5dd1-43b6-8d25-35d2cc3b3560",
    "sentence": "A Maria está ___ supermercado.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.601Z",
    "updatedAt": "2025-08-10T13:54:50.907Z"
  },
  {
    "id": "201a5382-a1f3-46c4-95e9-6443772bb8de",
    "sentence": "O João ___ as mãos antes de comer.",
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
    "hint": "\"lavar-se\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.595Z",
    "updatedAt": "2025-08-10T13:54:50.904Z"
  },
  {
    "id": "68112b2f-61e7-4caa-bc37-f75328cd560e",
    "sentence": "___ carro é vermelho.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.595Z",
    "updatedAt": "2025-08-10T13:54:50.906Z"
  },
  {
    "id": "ca1dccd6-42ab-4c97-9d13-9b0a49f572fe",
    "sentence": "Nós ___ fazer os trabalhos de casa.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.594Z",
    "updatedAt": "2025-08-10T15:21:54.408Z"
  },
  {
    "id": "bb6d34f1-167d-475e-838f-0c8c68f706cd",
    "sentence": "Tu ___ muito bem português.",
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
    "hint": "\"falar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.593Z",
    "updatedAt": "2025-08-10T15:21:54.407Z"
  },
  {
    "id": "40af3567-0d15-488d-8e15-19f5c46e8c0b",
    "sentence": "Ela ___ em casa agora.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:30.592Z",
    "updatedAt": "2025-08-10T15:21:54.414Z"
  },
  {
    "id": "e0efee74-a16a-4e49-9dc8-10f90c12c560",
    "sentence": "Ontem ___ muito no parque.",
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
    "hint": "\"brincar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.288Z",
    "updatedAt": "2025-08-10T13:54:51.913Z"
  },
  {
    "id": "e8933edb-b530-49da-a51e-d94dd9a491c5",
    "sentence": "___ livro está na mesa?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.288Z",
    "updatedAt": "2025-08-10T13:54:51.916Z"
  },
  {
    "id": "d16da99d-bafb-48c1-b9f5-7f5976164c07",
    "sentence": "O Pedro ___ os dentes todas as manhãs.",
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
    "hint": "\"lavar-se\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.287Z",
    "updatedAt": "2025-08-10T13:54:51.912Z"
  },
  {
    "id": "8a7a37a2-5e69-46e1-9736-b91b09c5cdd6",
    "sentence": "___ caneta é vermelha.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.287Z",
    "updatedAt": "2025-08-10T13:54:51.912Z"
  },
  {
    "id": "8eaf1e89-8000-4d3c-b8ca-1f9865ac725e",
    "sentence": "Tu ___ dois irmãos.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.286Z",
    "updatedAt": "2025-08-10T15:21:54.421Z"
  },
  {
    "id": "bdd00f3f-20af-4763-b55c-1071d711b458",
    "sentence": "Eu ___ a estudar português agora.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.286Z",
    "updatedAt": "2025-08-10T13:54:51.918Z"
  },
  {
    "id": "3c4039c3-0f34-4e58-87c2-81a00eded8b0",
    "sentence": "A Maria ___ muito feliz hoje.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.285Z",
    "updatedAt": "2025-08-10T15:21:54.411Z"
  },
  {
    "id": "124691b1-7d4f-429b-813a-d60bed95f958",
    "sentence": "___ mesa é grande.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.244Z",
    "updatedAt": "2025-08-10T13:54:51.917Z"
  },
  {
    "id": "b6864e3f-0e11-49ed-aa0a-40cc800ca690",
    "sentence": "Ela ___ na praia todos os dias.",
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
    "hint": "\"correr\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.243Z",
    "updatedAt": "2025-08-10T15:21:54.418Z"
  },
  {
    "id": "226a5e42-8738-4246-a0e2-1c6524305fde",
    "sentence": "___ é o teu nome?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.243Z",
    "updatedAt": "2025-08-10T11:45:45.205Z"
  },
  {
    "id": "01433749-3489-48dd-ab64-0db2d6fb2ef2",
    "sentence": "Tu ___ muito café.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.242Z",
    "updatedAt": "2025-08-10T15:21:54.409Z"
  },
  {
    "id": "77dd2e83-c46e-48cd-b2c4-437210e0d990",
    "sentence": "___ livros são interessantes.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.241Z",
    "updatedAt": "2025-08-10T11:45:45.203Z"
  },
  {
    "id": "9a683cc0-8770-4558-830b-dad89bb7b10b",
    "sentence": "Ele ___ a trabalhar agora.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.241Z",
    "updatedAt": "2025-08-10T11:45:45.201Z"
  },
  {
    "id": "7cd80516-bfd6-45f3-b9cc-400ad2399c5e",
    "sentence": "Eu ___ em Lisboa.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:29.240Z",
    "updatedAt": "2025-08-10T15:21:54.417Z"
  },
  {
    "id": "a7fffa77-9be3-4540-81b7-998005f9411b",
    "sentence": "Ontem eu ___ muito cedo.",
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
    "hint": "\"acordar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.216Z",
    "updatedAt": "2025-08-10T11:45:45.202Z"
  },
  {
    "id": "9fad1431-6fa9-46de-99e2-f1668df35994",
    "sentence": "Ela ___ as mãos antes de comer.",
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
    "hint": "\"lavar-se\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.213Z",
    "updatedAt": "2025-08-10T11:45:45.204Z"
  },
  {
    "id": "8a0a9205-69c3-434f-b1aa-eac54a0bdb13",
    "sentence": "___ é a tua caneta?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.213Z",
    "updatedAt": "2025-08-10T11:45:45.200Z"
  },
  {
    "id": "e5321016-4e78-424b-8b5c-847d16c4c573",
    "sentence": "___ livro é interessante.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.212Z",
    "updatedAt": "2025-08-10T11:44:06.486Z"
  },
  {
    "id": "98b20f1f-4f01-4faf-bc1d-1125b97a40fb",
    "sentence": "Nós ___ a estudar português.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T14:50:27.210Z",
    "updatedAt": "2025-08-10T11:44:06.492Z"
  },
  {
    "id": "b72ba086-76d3-4975-9178-fe8c2a2ade86",
    "sentence": "Por mais que ___ estudar, não consigo concentrar-me.",
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
    "hint": "\"tentar\" (\"eu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.442Z",
    "updatedAt": "2025-08-10T14:58:47.806Z"
  },
  {
    "id": "9536c3f0-037d-4256-abbc-27b67b06a5a5",
    "sentence": "Quem quer que ___ na reunião deve avisar com antecedência.",
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
    "hint": "\"estar\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.440Z",
    "updatedAt": "2025-08-10T15:01:04.445Z"
  },
  {
    "id": "237827f5-f107-4678-8690-7f7d9215fdbc",
    "sentence": "Não ___ tocar piano sem praticar regularmente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.438Z",
    "updatedAt": "2025-08-10T15:21:54.455Z"
  },
  {
    "id": "156349ee-7777-4ed1-818e-966f4d529463",
    "sentence": "A carta ___ enviada ontem pelo correio.",
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
    "hint": "\"ser\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.437Z",
    "updatedAt": "2025-08-10T15:21:54.469Z"
  },
  {
    "id": "68855ba8-dca8-4693-8538-affe56463929",
    "sentence": "O João disse que ___ ao Porto na próxima semana.",
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
    "hint": "\"ir\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.436Z",
    "updatedAt": "2025-08-10T11:19:31.342Z"
  },
  {
    "id": "23afac66-1f1b-4fe3-9480-55ba5d52daad",
    "sentence": "Assim que ___ os documentos, enviarei por email.",
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
    "hint": "\"receber\" (\"eu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.434Z",
    "updatedAt": "2025-08-10T15:01:04.452Z"
  },
  {
    "id": "1dbcf519-e5ba-44d3-ab9d-49751ba22d60",
    "sentence": "Se eu ___ mais tempo, teria estudado melhor para o exame.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:51:24.430Z",
    "updatedAt": "2025-08-10T15:01:04.333Z"
  },
  {
    "id": "ed50a75f-fbe7-456f-b0d5-71ea2496f13c",
    "sentence": "Quando ___ o trabalho, poderemos ir de férias.",
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
    "hint": "\"acabar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.388Z",
    "updatedAt": "2025-08-10T15:01:04.464Z"
  },
  {
    "id": "468c7407-d2e4-42d6-9386-8a66065209a3",
    "sentence": "Quem quer que ___ este documento deve assiná-lo.",
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
    "hint": "\"receber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.387Z",
    "updatedAt": "2025-08-10T11:25:39.423Z"
  },
  {
    "id": "79659b3f-eb96-4dad-bb09-726ecd924490",
    "sentence": "Se eu ___ mais tempo, teria ido visitar-te.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.386Z",
    "updatedAt": "2025-08-10T15:01:04.460Z"
  },
  {
    "id": "fc3902a5-85ee-4141-9682-54c75e772c6f",
    "sentence": "A notícia ___ divulgada pelos meios de comunicação ontem.",
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
    "hint": "\"ser\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.384Z",
    "updatedAt": "2025-08-10T15:21:54.477Z"
  },
  {
    "id": "3833c501-5f9f-40ee-9243-13e955b5635f",
    "sentence": "Caso ele ___ à festa, avisa-me.",
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
    "hint": "\"vir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.382Z",
    "updatedAt": "2025-08-10T15:01:04.438Z"
  },
  {
    "id": "44ac898d-236c-4e90-a035-7f8725916d31",
    "sentence": "Não ___ atender o telefone porque estava ocupado.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:26:00.378Z",
    "updatedAt": "2025-08-10T15:21:54.474Z"
  },
  {
    "id": "21d211ac-9c57-4466-88d0-40b70b08ccde",
    "sentence": "___ que precisares, podes contar comigo.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.487Z",
    "updatedAt": "2025-08-10T14:58:47.804Z"
  },
  {
    "id": "046ef050-ebe2-4f41-a50f-3e8c628c213c",
    "sentence": "Se eu ___ mais dinheiro, compraria uma casa.",
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
    "hint": "\"ter\" (\"eu\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.486Z",
    "updatedAt": "2025-08-10T14:58:47.796Z"
  },
  {
    "id": "3a4c4848-7d4a-4bc3-866c-5ba572104144",
    "sentence": "A carta ___ ontem pelo carteiro.",
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
    "hint": "\"ser + entregar\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.485Z",
    "updatedAt": "2025-08-10T15:21:54.470Z"
  },
  {
    "id": "daff0680-2188-4fdb-8cea-676231304c82",
    "sentence": "Embora ele ___ que está errado, não quer admitir.",
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
    "hint": "\"saber\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.483Z",
    "updatedAt": "2025-08-10T14:58:47.790Z"
  },
  {
    "id": "7768e5e4-24af-4788-a162-6c66020d8d12",
    "sentence": "Não ___ fazer isso agora porque estou ocupado.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:45.480Z",
    "updatedAt": "2025-08-10T15:21:54.469Z"
  },
  {
    "id": "ca8ac0d4-64ed-4800-9935-468b773c16a9",
    "sentence": "Os documentos ___ ao diretor esta manhã.",
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
    "hint": "\"entregar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.084Z",
    "updatedAt": "2025-08-10T15:21:54.449Z"
  },
  {
    "id": "62a64724-9e43-4c27-8ad1-62a6ea1eb7c7",
    "sentence": "Quando ___ o trabalho, poderemos ir de férias.",
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
    "hint": "\"terminar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.083Z",
    "updatedAt": "2025-08-10T11:25:53.979Z"
  },
  {
    "id": "7aeee8e6-0c6e-4f37-8b0e-089cd4089ac5",
    "sentence": "O livro ___ foi escrito por José Saramago ganhou o Prémio Nobel.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.082Z",
    "updatedAt": "2025-07-26T15:16:11.022Z"
  },
  {
    "id": "c7619c07-e077-4ac7-84b3-2c49a8e7c6d4",
    "sentence": "Embora ele ___ muito dinheiro, vive de forma simples.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.080Z",
    "updatedAt": "2025-08-10T15:01:04.785Z"
  },
  {
    "id": "9fc901d7-00b7-40e0-aa23-1ca0b3ff2a4c",
    "sentence": "Não ___ sair hoje porque estou doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.078Z",
    "updatedAt": "2025-08-10T15:21:54.468Z"
  },
  {
    "id": "1d2017b1-c275-4496-9cdb-e8afe726ec9f",
    "sentence": "Se eu ___ mais tempo, teria feito um trabalho melhor.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:25:43.074Z",
    "updatedAt": "2025-08-10T15:01:04.675Z"
  },
  {
    "id": "acb002ce-6597-49fb-9229-5194fb6a1875",
    "sentence": "Ela está ___ trabalhar no computador.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.090Z",
    "updatedAt": "2025-08-10T11:44:06.490Z"
  },
  {
    "id": "15423f90-6242-4c4d-9345-1074aecb4298",
    "sentence": "___ moras em Lisboa?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.089Z",
    "updatedAt": "2025-08-10T11:44:06.489Z"
  },
  {
    "id": "ebb712fc-7c4b-40d8-8ab1-109bc1187378",
    "sentence": "___ livros são interessantes?",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.089Z",
    "updatedAt": "2025-08-10T11:44:06.491Z"
  },
  {
    "id": "cbc0c196-b8f8-45ff-8d0f-caf2ee8023b9",
    "sentence": "Eles ___ as mãos antes de comer.",
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
    "hint": "\"lavar-se\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.088Z",
    "updatedAt": "2025-08-10T11:44:28.298Z"
  },
  {
    "id": "c3c3ee8b-5e63-4cc1-af9e-624e2e5af7a6",
    "sentence": "___ menino está a brincar.",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.088Z",
    "updatedAt": "2025-08-10T11:44:28.297Z"
  },
  {
    "id": "b88ae551-515d-4ede-8663-69e40c579a3c",
    "sentence": "Tu ___ uma casa bonita.",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.087Z",
    "updatedAt": "2025-08-10T15:21:54.419Z"
  },
  {
    "id": "41ac3ee9-6282-415a-8b68-6e140bca1ae1",
    "sentence": "Eu ___ muito feliz hoje.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T12:22:48.079Z",
    "updatedAt": "2025-08-10T15:21:54.418Z"
  },
  {
    "id": "e81801e7-e8f0-4ffe-bef7-e49b3b70a063",
    "sentence": "Eu ___ café todas as manhãs.",
    "correctAnswer": "bebo",
    "topic": "presente-indicativo-regulares",
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
    "hint": "\"beber\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T08:55:24.717Z",
    "updatedAt": "2025-08-10T15:21:54.416Z"
  },
  {
    "id": "ab200b18-57ff-4381-a99f-060835ec86f9",
    "sentence": "___ dia! Como está?",
    "correctAnswer": "Bom",
    "topic": "presente-indicativo-regulares",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T08:21:12.586Z",
    "updatedAt": "2025-08-10T15:21:54.404Z"
  },
  {
    "id": "adcd71dc-cf54-4da5-b64c-56c5ebc54624",
    "sentence": "Embora ___ muito dinheiro, ele vive modestamente.",
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
    "hint": "\"ter\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.130Z",
    "updatedAt": "2025-08-10T15:01:04.770Z"
  },
  {
    "id": "63d45d02-d86a-4117-8024-385266bc1b12",
    "sentence": "A decisão ___ tomada pelo conselho administrativo.",
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
    "hint": "\"ser\" (\"ele/ela\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.129Z",
    "updatedAt": "2025-08-10T15:21:54.444Z"
  },
  {
    "id": "6e85f8ab-f3c6-4453-a86c-ef4154a33e0f",
    "sentence": "O relatório ___ ser entregue até amanhã.",
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
    "hint": "dever / ter de",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.128Z",
    "updatedAt": "2025-08-10T15:21:54.441Z"
  },
  {
    "id": "f905e893-58a4-4ddd-a720-e7d963354989",
    "sentence": "Quando ___ que vais mudar de emprego?",
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
    "hint": "saber / conhecer",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.127Z",
    "updatedAt": "2025-08-10T15:21:54.472Z"
  },
  {
    "id": "49febe5a-7858-458e-a6e9-3a6315e6d3f0",
    "sentence": "Não ___ ajudá-lo por estar doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-25T07:56:04.122Z",
    "updatedAt": "2025-08-10T15:21:54.457Z"
  },
  {
    "id": "1e8a8fd1-de33-4c10-b1ba-3c451c2e9890",
    "sentence": "Tu ___ sempre às oito horas?",
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
    "hint": "\"trabalhar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.236Z",
    "updatedAt": "2025-08-10T15:21:54.405Z"
  },
  {
    "id": "8e105f82-3d82-4570-93cf-297b3a0c8b25",
    "sentence": "Nós ___ na universidade todos os dias.",
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
    "hint": "\"estudar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.235Z",
    "updatedAt": "2025-08-10T15:21:54.410Z"
  },
  {
    "id": "2e5763cf-3c05-4803-adbe-11345bfe7bae",
    "sentence": "Ela ___ muito bem português.",
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
    "hint": "\"falar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-21T14:46:17.229Z",
    "updatedAt": "2025-08-10T15:21:54.413Z"
  },
  {
    "id": "57578c2d-d864-4fa8-8175-83d42757e586",
    "sentence": "Caso você ___ interessado, contacte-nos.",
    "correctAnswer": "esteja",
    "topic": "presente-conjuntivo-regulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "esteja",
      "um",
      "de",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"esteja\" (present subjunctive).",
      "en": "We use \"esteja\" (present subjunctive).",
      "uk": "Ми використовуємо \"esteja\" (present subjunctive)."
    },
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.067Z",
    "updatedAt": "2025-08-10T15:01:04.783Z"
  },
  {
    "id": "dfe211aa-d7ac-48e3-8e40-ac26300c4ffd",
    "sentence": "Espero que ___ tempo para nos encontrarmos.",
    "correctAnswer": "haja",
    "topic": "presente-conjuntivo-regulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "haja",
      "com",
      "de",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"haja\" (present subjunctive).",
      "en": "We use \"haja\" (present subjunctive).",
      "uk": "Ми використовуємо \"haja\" (present subjunctive)."
    },
    "hint": "\"haver\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.067Z",
    "updatedAt": "2025-08-10T15:06:35.903Z"
  },
  {
    "id": "4064e7b6-7a9d-42c1-b2ac-894ee1028100",
    "sentence": "Se ele ___ estudado, teria passado no exame.",
    "correctAnswer": "tivesse",
    "topic": "mais-que-perfeito-composto-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "tivesse",
      "em",
      "para",
      "de"
    ],
    "explanations": {
      "pt": "Usamos \"tivesse\" (pluperfect subjunctive).",
      "en": "We use \"tivesse\" (pluperfect subjunctive).",
      "uk": "Ми використовуємо \"tivesse\" (pluperfect subjunctive)."
    },
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-08-10T09:58:29.198Z"
  },
  {
    "id": "87003fdf-0adf-4915-aeb0-19a738cb269e",
    "sentence": "Embora ___ difícil, conseguiu acabar o trabalho.",
    "correctAnswer": "fosse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "fosse",
      "com",
      "de",
      "o"
    ],
    "explanations": {
      "pt": "Usamos \"fosse\" (imperfect subjunctive).",
      "en": "We use \"fosse\" (imperfect subjunctive).",
      "uk": "Ми використовуємо \"fosse\" (imperfect subjunctive)."
    },
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-08-10T15:06:35.901Z"
  },
  {
    "id": "a4781bd1-f6d6-49ee-a3af-0994884483b9",
    "sentence": "É importante que ele ___ a verdade.",
    "correctAnswer": "diga",
    "topic": "presente-conjuntivo-regulares",
    "level": "B2",
    "multipleChoiceOptions": [
      "diga",
      "com",
      "o",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"diga\" (present subjunctive).",
      "en": "We use \"diga\" (present subjunctive).",
      "uk": "Ми використовуємо \"diga\" (present subjunctive)."
    },
    "hint": "\"dizer\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.066Z",
    "updatedAt": "2025-08-10T15:06:35.899Z"
  },
  {
    "id": "3a315e0a-fce8-4d5e-9452-c13dc98e05a2",
    "sentence": "A casa ___ construída pelos operários.",
    "correctAnswer": "foi",
    "topic": "voz-passiva",
    "level": "B2",
    "multipleChoiceOptions": [
      "foi",
      "um",
      "de",
      "o"
    ],
    "explanations": {
      "pt": "Usamos \"foi\" (passive voice (simple past)).",
      "en": "We use \"foi\" (passive voice (simple past)).",
      "uk": "Ми використовуємо \"foi\" (passive voice (simple past))."
    },
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.065Z",
    "updatedAt": "2025-08-10T15:21:54.446Z"
  },
  {
    "id": "d532b406-b978-4605-9acc-a0e7f78d6b45",
    "sentence": "Quando ___ tempo, falaremos.",
    "correctAnswer": "houver",
    "topic": "futuro-conjuntivo-conjuncoes",
    "level": "B2",
    "multipleChoiceOptions": [
      "houver",
      "de",
      "um",
      "em"
    ],
    "explanations": {
      "pt": "Usamos \"houver\" (future subjunctive (impersonal)).",
      "en": "We use \"houver\" (future subjunctive (impersonal)).",
      "uk": "Ми використовуємо \"houver\" (future subjunctive (impersonal))."
    },
    "hint": "\"haver\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.065Z",
    "updatedAt": "2025-08-10T15:06:35.900Z"
  },
  {
    "id": "2d897e50-3583-4d9e-b6e2-bb1e126755fd",
    "sentence": "Se eu ___ rico, compraria uma casa.",
    "correctAnswer": "fosse",
    "topic": "se-preterito-imperfeito-conjuntivo",
    "level": "B2",
    "multipleChoiceOptions": [
      "fosse",
      "de",
      "um",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"fosse\" (imperfect subjunctive).",
      "en": "We use \"fosse\" (imperfect subjunctive).",
      "uk": "Ми використовуємо \"fosse\" (imperfect subjunctive)."
    },
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.064Z",
    "updatedAt": "2025-08-10T15:06:35.902Z"
  },
  {
    "id": "7fe9ec4d-d6e5-4c17-bc23-a003046b83aa",
    "sentence": "___ aqui!",
    "correctAnswer": "Vem",
    "topic": "imperativo-positivo-negativo",
    "level": "B1",
    "multipleChoiceOptions": [
      "Vem",
      "de",
      "o",
      "para"
    ],
    "explanations": {
      "pt": "Usamos \"Vem\" (imperative (informal command)).",
      "en": "We use \"Vem\" (imperative (informal command)).",
      "uk": "Ми використовуємо \"Vem\" (imperative (informal command))."
    },
    "hint": "\"vir\" (\"2ª pessoa singular\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.064Z",
    "updatedAt": "2025-08-10T09:58:29.196Z"
  },
  {
    "id": "9aa73fa1-314c-4e8a-a8fc-c3ddc8913c2c",
    "sentence": "Se eu tivesse tempo, ___ contigo.",
    "correctAnswer": "iria",
    "topic": "condicional-presente",
    "level": "B1",
    "multipleChoiceOptions": [
      "iria",
      "em",
      "de",
      "com"
    ],
    "explanations": {
      "pt": "Usamos \"iria\" (conditional simple).",
      "en": "We use \"iria\" (conditional simple).",
      "uk": "Ми використовуємо \"iria\" (conditional simple)."
    },
    "hint": "\"ir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-08-10T11:19:31.341Z"
  },
  {
    "id": "25c1f692-f42b-4018-99f7-850972ada2b7",
    "sentence": "É importante que tu ___ cedo.",
    "correctAnswer": "chegues",
    "topic": "presente-conjuntivo-regulares",
    "level": "B1",
    "multipleChoiceOptions": [
      "chegues",
      "em",
      "o",
      "um"
    ],
    "explanations": {
      "pt": "Usamos \"chegues\" (present subjunctive).",
      "en": "We use \"chegues\" (present subjunctive).",
      "uk": "Ми використовуємо \"chegues\" (present subjunctive)."
    },
    "hint": "\"chegar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-08-10T15:06:35.904Z"
  },
  {
    "id": "4b6a52b1-7cdd-419e-be2f-ab773962f6c5",
    "sentence": "Eu ___ vi ontem.",
    "correctAnswer": "te",
    "topic": "pronomes-pessoais",
    "level": "A2",
    "multipleChoiceOptions": [
      "te",
      "um",
      "o",
      "em"
    ],
    "explanations": {
      "pt": "A resposta correta é \"te\".",
      "en": "The correct answer is \"te\".",
      "uk": "Правильна відповідь: \"te\"."
    },
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.063Z",
    "updatedAt": "2025-08-10T11:45:45.206Z"
  },
  {
    "id": "66ea881b-e13a-47b8-b22a-50dad0e6c740",
    "sentence": "Amanhã nós ___ viajar.",
    "correctAnswer": "vamos",
    "topic": "futuro-imperfeito",
    "level": "A2",
    "multipleChoiceOptions": [
      "vamos",
      "o",
      "em",
      "de"
    ],
    "explanations": {
      "pt": "Usamos \"vamos\" (future with ir + infinitive).",
      "en": "We use \"vamos\" (future with ir + infinitive).",
      "uk": "Ми використовуємо \"vamos\" (future with ir + infinitive)."
    },
    "hint": "\"ir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.062Z",
    "updatedAt": "2025-08-10T11:45:45.203Z"
  },
  {
    "id": "78f87ae1-cc62-4fb5-9dbd-e18665741b3e",
    "sentence": "Quando era criança, ___ muito feliz.",
    "correctAnswer": "era",
    "topic": "imperfeito-idade-tempo",
    "level": "A2",
    "multipleChoiceOptions": [
      "era",
      "o",
      "com",
      "um"
    ],
    "explanations": {
      "pt": "Usamos \"era\" (pretérito imperfeito (imperfect)).",
      "en": "We use \"era\" (pretérito imperfeito (imperfect)).",
      "uk": "Ми використовуємо \"era\" (pretérito imperfeito (imperfect))."
    },
    "hint": "\"ser\" (\"1ª pessoa\")",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.062Z",
    "updatedAt": "2025-08-10T11:45:45.197Z"
  },
  {
    "id": "1665dffd-c253-46f0-b8a9-604f5a8aae01",
    "sentence": "Ontem eu ___ ao cinema.",
    "correctAnswer": "fui",
    "topic": "preterito-perfeito-simples",
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
    "hint": "\"ir\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.061Z",
    "updatedAt": "2025-08-10T11:45:45.195Z"
  },
  {
    "id": "759d1b6b-36a9-46f6-9b33-7992c5f51208",
    "sentence": "O menino ___ alto.",
    "correctAnswer": "está",
    "topic": "verbo-estar",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.061Z",
    "updatedAt": "2025-08-10T15:21:54.406Z"
  },
  {
    "id": "819255cb-9a36-442e-b511-a9ac127b370e",
    "sentence": "___ casa é muito bonita.",
    "correctAnswer": "A",
    "topic": "artigos-definidos-indefinidos",
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
    "hint": null,
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.060Z",
    "updatedAt": "2025-08-10T11:26:20.707Z"
  },
  {
    "id": "c29faa7d-1143-4fed-8394-b1536d7836e3",
    "sentence": "Nós ___ uma casa grande.",
    "correctAnswer": "temos",
    "topic": "presente-indicativo-regulares",
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
    "hint": "\"ter\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.059Z",
    "updatedAt": "2025-08-10T15:21:54.412Z"
  },
  {
    "id": "e3e581bc-d5ca-4e22-9dff-bedb74e2e7b3",
    "sentence": "Ela ___ professora.",
    "correctAnswer": "é",
    "topic": "verbo-estar",
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
    "hint": "\"ser\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.059Z",
    "updatedAt": "2025-08-10T15:21:54.413Z"
  },
  {
    "id": "fc3469bc-6c25-4a4e-b22b-3449e9adc945",
    "sentence": "Eu ___ português.",
    "correctAnswer": "falo",
    "topic": "presente-indicativo-regulares",
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
    "hint": "\"falar\"",
    "difficultyScore": 0.5,
    "usageCount": 0,
    "createdAt": "2025-07-19T13:59:16.056Z",
    "updatedAt": "2025-08-10T15:21:54.415Z"
  },
  {
    "id": "b8ed3db1-cc9c-4e83-9b89-a564a064b9a5",
    "sentence": "Não ___ dormir ontem por causa do barulho dos vizinhos.",
    "correctAnswer": "consegui",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consigo",
      "podia",
      "consegui",
      "pude"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' quando nos referimos à capacidade física ou mental de realizar algo, especialmente quando há um obstáculo ou dificuldade específica (neste caso, o barulho). 'Poder' seria mais apropriado para uma permissão ou possibilidade geral.",
      "en": "We use 'conseguir' when referring to the physical or mental ability to accomplish something, especially when there's a specific obstacle or difficulty (in this case, the noise). 'Poder' would be more appropriate for general permission or possibility.",
      "uk": "Ми використовуємо 'conseguir', коли йдеться про фізичну чи розумову здатність щось зробити, особливо коли є конкретна перешкода чи труднощі (у цьому випадку шум). 'Poder' більше підходить для загального дозволу чи можливості."
    },
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:25:37.922Z",
    "updatedAt": "2025-08-10T18:53:41.547Z"
  },
  {
    "id": "40693705-be47-4818-888c-a8e353160b9a",
    "sentence": "Não ___ abrir a porta porque perdi as chaves.",
    "correctAnswer": "consigo",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "consego",
      "posso",
      "podo",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' quando se trata de uma impossibilidade física ou prática específica (neste caso, a impossibilidade física de abrir a porta por falta das chaves), enquanto 'poder' seria mais adequado para permissão ou possibilidade geral.",
      "en": "We use 'conseguir' when referring to a specific physical inability or practical impossibility (in this case, the physical impossibility of opening the door due to lost keys), while 'poder' would be more suitable for permission or general possibility.",
      "uk": "Ми використовуємо 'conseguir', коли йдеться про конкретну фізичну неможливість або практичну нездатність (у цьому випадку, фізична неможливість відчинити двері через втрату ключів), тоді як 'poder' більше підходить для дозволу чи загальної можливості."
    },
    "hint": "{\"infinitive\":\"conseguir\",\"person\":\"(1ª pessoa)\",\"form\":\"presente do indicativo\",\"grammarRule\":\"Usamos 'conseguir' para expressar capacidade física ou habilidade específica\"}",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:20:36.012Z",
    "updatedAt": "2025-08-10T15:21:54.950Z"
  },
  {
    "id": "fdfbd045-158f-4c42-926a-29d4465fe17e",
    "sentence": "Não ___ abrir a janela porque está emperrada.",
    "correctAnswer": "consigo",
    "topic": "poder-conseguir",
    "level": "B1",
    "multipleChoiceOptions": [
      "podo",
      "consego",
      "posso",
      "consigo"
    ],
    "explanations": {
      "pt": "Usamos 'conseguir' quando se trata de uma incapacidade física específica (a janela está emperrada, impedindo fisicamente a ação), em vez de 'poder' que seria mais para permissão ou possibilidade geral.",
      "en": "We use 'conseguir' when referring to a specific physical inability (the window is stuck, physically preventing the action), rather than 'poder' which would be more about permission or general possibility.",
      "uk": "Ми використовуємо 'conseguir', коли йдеться про конкретну фізичну неможливість (вікно застрягло, фізично перешкоджаючи дії), а не 'poder', який більше стосується дозволу чи загальної можливості."
    },
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:08:03.204Z",
    "updatedAt": "2025-08-10T15:21:54.951Z"
  },
  {
    "id": "97982067-2ae2-45b2-a7c2-3ade88919b7e",
    "sentence": "Se você estudar mais, _____ passar no exame.",
    "correctAnswer": "poderá",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.893Z",
    "updatedAt": "2025-08-10T15:21:54.954Z"
  },
  {
    "id": "6279c0f4-c4ef-40ce-959b-3adfb4e8d5c2",
    "sentence": "Mesmo cansado, ele _____ terminar a maratona.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.893Z",
    "updatedAt": "2025-08-10T15:21:54.953Z"
  },
  {
    "id": "e27b25af-724c-41b5-9f16-3b6f4faa77fa",
    "sentence": "Com este cartão, você _____ sacar dinheiro em qualquer caixa eletrônico.",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.892Z",
    "updatedAt": "2025-08-10T15:21:54.953Z"
  },
  {
    "id": "b553d754-129c-4bf9-8cac-646138d468b6",
    "sentence": "Você não _____ estacionar aqui, é proibido.",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.892Z",
    "updatedAt": "2025-08-10T15:21:54.953Z"
  },
  {
    "id": "b9c87261-534f-4149-9364-0d8528e72e3f",
    "sentence": "Depois de meses de treino, ela finalmente _____ correr 10 km sem parar.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.891Z",
    "updatedAt": "2025-08-10T15:21:54.954Z"
  },
  {
    "id": "61c3ffa8-0133-44b9-9ac8-1230132b4428",
    "sentence": "Eles só _____ entrar depois que o segurança verificou os documentos.",
    "correctAnswer": "puderam",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.890Z",
    "updatedAt": "2025-08-10T15:21:54.952Z"
  },
  {
    "id": "6bf3b619-f9ae-4d93-b867-819b28d4b945",
    "sentence": "Você _____ me ajudar com as malas amanhã de manhã?",
    "correctAnswer": "pode",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.890Z",
    "updatedAt": "2025-08-10T15:21:54.949Z"
  },
  {
    "id": "3ebaa93e-0bbe-4c59-bf7c-840099b654a8",
    "sentence": "Não sei como ele _____ resolver aquele problema tão rápido.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.889Z",
    "updatedAt": "2025-08-10T15:21:54.950Z"
  },
  {
    "id": "908f9605-ebd3-4625-9a9a-b3cb064ac493",
    "sentence": "Quando éramos crianças, não _____ sair sozinhos à noite.",
    "correctAnswer": "podíamos",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.889Z",
    "updatedAt": "2025-08-10T18:53:41.549Z"
  },
  {
    "id": "cbbb2350-5e84-4434-aa76-d32fb214d7b3",
    "sentence": "Ele _____ terminar o projeto antes do prazo, apesar das dificuldades.",
    "correctAnswer": "conseguiu",
    "topic": "poder-conseguir",
    "level": "B1",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.6,
    "usageCount": 1,
    "createdAt": "2025-08-10T15:07:41.885Z",
    "updatedAt": "2025-08-10T18:53:41.551Z"
  },
  {
    "id": "8fccc998-6de6-4c88-9b20-1a950905484d",
    "sentence": "Espero que ___ um bom fim de semana em Lisboa.",
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
    "hint": "\"ter\" (\"tu\")",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T15:16:17.824Z",
    "updatedAt": "2025-08-10T18:53:41.554Z"
  },
  {
    "id": "4ea81fc1-d216-438b-bf09-41df8a8b2111",
    "sentence": "O relatório ___ ser entregue até amanhã ao meio-dia.",
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
    "hint": "dever / ter de",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T15:16:17.822Z",
    "updatedAt": "2025-08-10T18:53:41.548Z"
  },
  {
    "id": "045dc384-d4f2-461e-a428-ed27ad9571cc",
    "sentence": "Quando ___ a Lisboa, vou visitar o Mosteiro dos Jerónimos.",
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
    "hint": "\"ir\"",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T15:16:11.024Z",
    "updatedAt": "2025-08-10T18:53:41.541Z"
  },
  {
    "id": "957b3f7c-020a-4c0f-a6d8-c0e24e6649de",
    "sentence": "É fundamental que ___ as regras do jogo antes de começar.",
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
    "hint": "\"saber\"",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T15:16:11.023Z",
    "updatedAt": "2025-08-10T18:53:41.552Z"
  },
  {
    "id": "355f980a-00c3-4b9c-9ddd-287880488dfb",
    "sentence": "Não ___ terminar o trabalho ontem porque estava doente.",
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
    "hint": "poder / conseguir",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T15:16:11.020Z",
    "updatedAt": "2025-08-10T18:53:41.553Z"
  },
  {
    "id": "7ffbb794-2356-41b3-8a97-b69f493965bf",
    "sentence": "___ alguém que fale chinês nesta empresa?",
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
    "hint": "saber / conhecer",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T08:07:03.293Z",
    "updatedAt": "2025-08-10T18:53:41.551Z"
  },
  {
    "id": "6161e80d-7616-46be-ae60-01f4c9fde0bb",
    "sentence": "Quero que tu ___ cá amanhã cedo.",
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
    "hint": "\"estar\"",
    "difficultyScore": 0.5,
    "usageCount": 1,
    "createdAt": "2025-07-26T08:07:03.292Z",
    "updatedAt": "2025-08-10T18:53:41.550Z"
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
        // Convert string dates to Date objects and ensure proper typing
        const exerciseWithDates = {
          ...exercise,
          level: exercise.level as any, // Cast to proper LanguageLevel type
          hint: exercise.hint || undefined, // Convert null to undefined
          createdAt: new Date(exercise.createdAt),
          updatedAt: new Date(exercise.updatedAt)
        };
        await LocalDatabase.addExercise(exerciseWithDates);
        inserted++;
        if (inserted % 50 === 0) {
          console.log(`   Progress: ${inserted}/${EXERCISES_DATA.length} exercises inserted`);
        }
      } catch (error) {
        // Skip duplicates, log other errors
        if (error instanceof Error && !error.message.includes('duplicate')) {
          console.warn(`   ⚠️ Skipped exercise: ${error.message}`);
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
