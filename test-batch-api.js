// Quick test script to verify batch API works
const testBatchAPI = async () => {
  const response = await fetch('http://localhost:3000/api/generate-batch-exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      levels: ['A1', 'A2'],
      topics: ['present-indicative', 'ser-estar'],
      explanationLanguage: 'pt'
    }),
  });

  if (!response.ok) {
    console.error('API Error:', response.status);
    return;
  }

  const { exercises } = await response.json();
  console.log('Batch API Test Results:');
  console.log('- Number of exercises:', exercises.length);
  console.log('- Sample exercise:', exercises[0]);
  console.log('- Has multipleChoiceOptions:', !!exercises[0].multipleChoiceOptions);
  console.log('- Has detailedExplanation:', !!exercises[0].detailedExplanation);
};

console.log('Testing batch API...');
testBatchAPI().catch(console.error);