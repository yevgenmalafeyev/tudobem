import { NextRequest, NextResponse } from 'next/server';

// Note: In production, use a proper job queue like Redis or database for progress tracking

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  if (!level) {
    return NextResponse.json({ error: 'Level parameter required' }, { status: 400 });
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Start the generation simulation
      simulateGeneration(level, controller, encoder);
      
      // Keep the connection alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      // Clean up when the client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        try {
          controller.close();
        } catch {
          // Connection already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}

async function simulateGeneration(level: string, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  try {
    // Simulate topics based on level
    const topicCounts = {
      'A1': 16, 'A2': 14, 'B1': 12, 'B2': 10, 'C1': 8, 'C2': 6
    };
    
    const totalTopics = topicCounts[level as keyof typeof topicCounts] || 10;
    
    // Send initial progress
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'progress',
      progress: 0,
      currentTopic: 'Starting generation...',
      totalTopics: totalTopics
    })}\n\n`));

    // Simulate progress for each topic
    for (let i = 0; i < totalTopics; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      const progress = Math.round(((i + 1) / totalTopics) * 100);
      const currentTopic = `Topic ${i + 1} of ${totalTopics}`;
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        progress: progress,
        currentTopic: currentTopic,
        totalTopics: totalTopics
      })}\n\n`));
    }

    // Send completion
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'complete',
      questionsAdded: totalTopics * 10, // 10 questions per topic
      message: `Successfully generated ${totalTopics * 10} questions for ${level} level`
    })}\n\n`));

    controller.close();

  } catch (error) {
    // Send error
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })}\n\n`));
    
    controller.close();
  }
}