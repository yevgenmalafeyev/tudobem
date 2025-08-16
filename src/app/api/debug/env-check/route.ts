import { NextResponse } from 'next/server';

export async function GET() {
  // Simple environment check for debugging
  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    anthropicKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 8) || 'none',
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    postgresUrlPrefix: process.env.POSTGRES_URL?.substring(0, 20) || 'none',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envCheck);
}