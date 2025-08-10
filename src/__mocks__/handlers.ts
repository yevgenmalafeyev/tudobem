import { http, HttpResponse } from 'msw'

export const handlers = [
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

  // Error scenarios
  http.post('/api/check-answer-error', () => {
    return HttpResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    )
  }),
]