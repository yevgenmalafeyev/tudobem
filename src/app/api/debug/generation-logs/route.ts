import { NextRequest, NextResponse } from 'next/server';

declare global {
  var debugLogs: string[] | undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clear = searchParams.get('clear');
  
  // Initialize global debugLogs if it doesn't exist
  if (!global.debugLogs) {
    global.debugLogs = [];
  }
  
  if (clear === 'true') {
    global.debugLogs.length = 0;
    return NextResponse.json({ 
      message: 'Debug logs cleared',
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    logs: global.debugLogs,
    totalLogs: global.debugLogs.length,
    timestamp: new Date().toISOString(),
    lastEntry: global.debugLogs.length > 0 ? global.debugLogs[global.debugLogs.length - 1] : null
  });
}