import { NextResponse } from 'next/server';

// Declare global type for debug logs
declare global {
  var debugLogs: string[] | undefined;
}

export async function GET() {
  // Return debug logs stored in memory
  global.debugLogs = global.debugLogs || [];
  
  return NextResponse.json({
    logs: global.debugLogs,
    totalLogs: global.debugLogs.length,
    timestamp: new Date().toISOString()
  });
}