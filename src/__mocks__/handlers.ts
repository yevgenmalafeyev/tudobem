import { http, HttpResponse } from 'msw'

export const handlers = [
  // Generate Exercise API
  http.post('/api/generate-exercise', async ({ request }) => {
    const body = await request.json()
    const { levels, selectedTopics } = body as { levels: string[], selectedTopics: string[] }
    
    return HttpResponse.json({
      id: 'test-exercise-1',
      sentence: 'Eu ___ português.',
      gapIndex: 1,
      correctAnswer: 'falo',
      topic: selectedTopics[0] || 'present-indicative',
      level: levels[0] || 'A1',
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    })
  }),

  // Check Answer API
  http.post('/api/check-answer', async ({ request }) => {
    const body = await request.json()
    const { userAnswer, correctAnswer } = body as { userAnswer: string, correctAnswer: string }
    
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    
    return HttpResponse.json({
      isCorrect,
      explanation: isCorrect 
        ? 'Correto! Você usou a forma correta do presente indicativo.'
        : 'Incorreto. A resposta correta é "falo" - primeira pessoa do singular do presente indicativo do verbo "falar".'
    })
  }),

  // Generate Multiple Choice API
  http.post('/api/generate-multiple-choice', async ({ request }) => {
    const body = await request.json()
    const { exercise } = body as { exercise: { correctAnswer: string } }
    
    return HttpResponse.json({
      options: [
        exercise.correctAnswer,
        'fala',
        'falamos',
        'falam'
      ]
    })
  }),

  // Error scenarios
  http.post('/api/generate-exercise-error', () => {
    return HttpResponse.json(
      { error: 'Failed to generate exercise' },
      { status: 500 }
    )
  }),

  http.post('/api/check-answer-error', () => {
    return HttpResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    )
  }),
]