// Manual mock for @anthropic-ai/sdk
const mockImplementation = jest.fn().mockImplementation(() => ({
  messages: {
    create: jest.fn().mockImplementation(({ messages }) => {
      const userMessage = messages[0].content;
      
      // Check if it's a multiple choice request
      if (userMessage.includes('multiple choice') || userMessage.includes('distractors')) {
        return Promise.resolve({
          content: [{
            type: 'text',
            text: JSON.stringify(['fala', 'falamos', 'falam'])
          }]
        });
      }
      
      // Check if it's answer checking
      if (userMessage.includes('check if') || userMessage.includes('student answer')) {
        return Promise.resolve({
          content: [{
            type: 'text',
            text: JSON.stringify({
              isCorrect: true,
              explanation: 'Correct! You used the right form of the verb.'
            })
          }]
        });
      }
      
      // Default: exercise generation
      return Promise.resolve({
        content: [{
          type: 'text',
          text: JSON.stringify({
            sentence: 'Eu ___ português.',
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            hint: {
              infinitive: 'falar',
              form: 'present indicative'
            }
          })
        }]
      });
    })
  }
}));

module.exports = mockImplementation;