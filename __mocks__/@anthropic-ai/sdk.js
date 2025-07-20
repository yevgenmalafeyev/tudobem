// Manual mock for @anthropic-ai/sdk
const mockImplementation = jest.fn().mockImplementation((config) => {
  // Check if API key indicates error case
  if (config && config.apiKey && config.apiKey.includes('invalid-key-triggers-error')) {
    return {
      messages: {
        create: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    };
  }
  
  return {
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
          // Smart detection of wrong answers based on the user message content
          const isWrongAnswer = userMessage.includes('"fala"') || 
                                userMessage.includes('"wrong"') || 
                                userMessage.includes('incorrect') ||
                                (userMessage.includes('student answer') && !userMessage.includes('"falo"'));
          
          return Promise.resolve({
            content: [{
              type: 'text',
              text: JSON.stringify({
                isCorrect: !isWrongAnswer,
                explanation: isWrongAnswer ? 
                  'Incorrect. The correct answer is "falo".' : 
                  'Correct! You used the right form of the verb.'
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
  };
});

module.exports = mockImplementation;