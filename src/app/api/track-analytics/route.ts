import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, activityType, exerciseId, questionLevel, questionTopic, userAnswer, correctAnswer, isCorrect, responseTimeMs } = body;

    // Extract user information from request
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    
    // Parse user agent to get platform and browser info
    const platform = getPlatformFromUserAgent(userAgent);
    const browser = getBrowserFromUserAgent(userAgent);
    const deviceType = getDeviceTypeFromUserAgent(userAgent);
    
    // Get country from IP (simplified - in production you'd use a geolocation service)
    const country = getCountryFromIP(ipAddress);

    // Create or update session
    await AnalyticsDatabase.createOrUpdateSession({
      sessionId,
      userAgent,
      ipAddress,
      country,
      platform,
      browser,
      deviceType
    });

    // Track the activity
    await AnalyticsDatabase.trackActivity({
      sessionId,
      activityType,
      exerciseId,
      questionLevel,
      questionTopic,
      userAnswer,
      correctAnswer,
      isCorrect,
      responseTimeMs
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

function getPlatformFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function getBrowserFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getDeviceTypeFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Mobile') || userAgent.includes('Android')) return 'Mobile';
  if (userAgent.includes('iPad')) return 'Tablet';
  return 'Desktop';
}

function getCountryFromIP(ipAddress: string): string {
  // Simplified country detection - in production you'd use a proper geolocation service
  // For now, return a default value
  return 'Unknown';
}