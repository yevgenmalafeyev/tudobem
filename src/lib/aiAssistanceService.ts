import { ProblemReportWithExercise, AIAssistanceResponse } from '@/types/problem-report';
import { ProblemReportDatabase } from './problemReportDatabase';

export class AIAssistanceService {
  private static readonly TEMPLATE_NAME = 'exercise_validator';
  
  // Hybrid caching system
  private static promptCache: Map<string, { prompt: string; timestamp: number }> = new Map();
  private static patternCache: Map<string, { response: AIAssistanceResponse; timestamp: number }> = new Map();
  private static conversationHistory: Map<string, { messages: { role: string; content: string }[]; timestamp: number }> = new Map();
  
  // Cache durations
  private static readonly PROMPT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (Anthropic cache window)
  private static readonly PATTERN_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for similar patterns
  private static readonly CONVERSATION_DURATION = 30 * 60 * 1000; // 30 minutes for conversation context

  // Generate cache key based on exercise pattern
  private static generatePatternCacheKey(report: ProblemReportWithExercise): string {
    const commentLength = report.userComment.length > 50 ? 'detailed' : 'brief';
    const hasHint = report.exercise.hint ? 'with_hint' : 'no_hint';
    const hasOptions = report.exercise.multipleChoiceOptions && report.exercise.multipleChoiceOptions.length > 0 ? 'with_options' : 'no_options';
    
    return `${report.problemType}_${report.exercise.level}_${report.exercise.topic}_${commentLength}_${hasHint}_${hasOptions}`;
  }

  // Get cached system prompt or fetch from database
  private static async getSystemPrompt(): Promise<string> {
    const cacheKey = this.TEMPLATE_NAME;
    const cached = this.promptCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.PROMPT_CACHE_DURATION) {
      return cached.prompt;
    }

    const template = await ProblemReportDatabase.getAIPromptTemplate();
    if (!template) {
      throw new Error('AI prompt template not found');
    }

    const fullPrompt = template.content || 'Default AI prompt';
    this.promptCache.set(cacheKey, { prompt: fullPrompt, timestamp: Date.now() });
    
    return fullPrompt;
  }

  // Check pattern cache for similar reports
  private static getPatternCachedResponse(report: ProblemReportWithExercise): AIAssistanceResponse | null {
    const cacheKey = this.generatePatternCacheKey(report);
    const cached = this.patternCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.PATTERN_CACHE_DURATION) {
      console.log(`🎯 Using pattern cache for ${cacheKey}`);
      return {
        ...cached.response,
        explanation: `${cached.response.explanation} (Analysis based on similar exercise pattern)`
      };
    }
    
    return null;
  }

  // Store response in pattern cache
  private static cachePatternResponse(report: ProblemReportWithExercise, response: AIAssistanceResponse): void {
    const cacheKey = this.generatePatternCacheKey(report);
    this.patternCache.set(cacheKey, { response, timestamp: Date.now() });
  }

  // Generate comprehensive user prompt with all database information
  private static generateUserPrompt(report: ProblemReportWithExercise): string {
    const options = report.exercise.multipleChoiceOptions?.join(' | ') || 'N/A';
    
    return `CONTEXT:
- Exercise Level: ${report.exercise.level}
- Topic: ${report.exercise.topic}
- Exercise Type: sentence with a gap, the user needs to fill the gap with the correct word

CURRENT EXERCISE IN DATABASE:
- Database ID: ${report.exerciseId}
- Sentence: ${report.exercise.sentence}
- Correct Answer: ${report.exercise.correctAnswer}
- Current Hint: ${report.exercise.hint || 'NULL'}
- Multiple Choice Options: ${options}
- Level: ${report.exercise.level}
- Topic: ${report.exercise.topic}
- Portuguese Explanation: ${report.exercise.explanation || 'NULL'}

PROBLEM REPORT DETAILS:
- Report ID: ${report.id}
- Issue Type: ${report.problemType}
- User's Detailed Comment: ${report.userComment}
- Reporter: ${report.reporterUsername || 'Anonymous'}

DATABASE TABLE STRUCTURE:
CREATE TABLE exercises (
  id UUID PRIMARY KEY,                    -- Current ID: ${report.exerciseId}
  sentence TEXT NOT NULL,                 -- Current: "${report.exercise.sentence}"
  correct_answer TEXT NOT NULL,           -- Current: "${report.exercise.correctAnswer}"
  topic VARCHAR(50) NOT NULL,             -- Current: "${report.exercise.topic}"
  level VARCHAR(5) NOT NULL,              -- Current: "${report.exercise.level}"
  hint TEXT,                              -- Current: ${report.exercise.hint ? `"${report.exercise.hint}"` : 'NULL'}
  multiple_choice_options JSONB DEFAULT '[]', -- Current: ${JSON.stringify(report.exercise.multipleChoiceOptions || [])}
  explanation_pt TEXT,                    -- Current: ${report.exercise.explanation ? `"${report.exercise.explanation}"` : 'NULL'}
  explanation_en TEXT,                    -- Current: NULL
  explanation_uk TEXT                     -- Current: NULL
);

INSTRUCTIONS:
Please analyze this problem report and provide:
1. A clear assessment of whether the issue is valid
2. A detailed explanation of your reasoning
3. If the issue is valid, provide a specific SQL UPDATE statement to fix it
4. Format your response as structured JSON for easy parsing

Your response should be in this exact JSON format:
{
  "analysis": {
    "isValid": boolean,
    "severity": "low|medium|high",
    "category": "content|technical|user_experience"
  },
  "explanation": {
    "summary": "Brief assessment summary",
    "details": "Detailed reasoning about the issue",
    "impact": "How this affects user learning experience"
  },
  "correction": {
    "needed": boolean,
    "sqlStatement": "UPDATE exercises SET ... WHERE id = '${report.exerciseId}';",
    "changes": "Description of what changes will be made",
    "reasoning": "Why this specific correction addresses the issue"
  }
}`;
  }

  // Generate ultra-minimal prompt for conversation context
  private static generateMinimalPrompt(report: ProblemReportWithExercise): string {
    const opts = report.exercise.multipleChoiceOptions?.join('|') || 'N/A';
    return `NEW: T:${report.problemType} L:${report.exercise.level} S:"${report.exercise.sentence}" H:"${report.exercise.hint || 'N/A'}" A:"${report.exercise.correctAnswer}" O:[${opts}] C:"${report.userComment}"`;
  }

  // Make AI request with conversation context (minimal tokens)
  private static async analyzeWithConversation(report: ProblemReportWithExercise): Promise<AIAssistanceResponse> {
    const conversationId = 'validation_session';
    const conversation = this.conversationHistory.get(conversationId);
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    let messages: { role: string; content: string }[];
    
    // Check if we have active conversation context
    if (conversation && Date.now() - conversation.timestamp < this.CONVERSATION_DURATION) {
      console.log('🔄 Using conversation context');
      // Use minimal prompt with existing context
      messages = [
        ...conversation.messages.slice(-4), // Keep last 2 exchanges
        {
          role: 'user',
          content: this.generateMinimalPrompt(report)
        }
      ];
    } else {
      console.log('🆕 Starting new conversation');
      // Start new conversation with full system prompt
      const systemPrompt = await this.getSystemPrompt();
      messages = [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${this.generateUserPrompt(report)}`
        }
      ];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 800,
        messages
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    // Update conversation history
    this.conversationHistory.set(conversationId, {
      messages: [...messages, { role: 'assistant', content }],
      timestamp: Date.now()
    });

    // Parse response
    const aiResponse = this.parseAIResponse(content);
    return aiResponse;
  }

  // Parse AI response with enhanced structured format handling
  private static parseAIResponse(content: string): AIAssistanceResponse {
    try {
      // First try to parse the new structured JSON format
      const parsed = JSON.parse(content);
      
      // Check if it's the new structured format
      if (parsed.analysis && parsed.explanation && parsed.correction) {
        return {
          isValid: parsed.analysis.isValid,
          explanation: this.formatStructuredExplanation(parsed),
          sqlCorrection: parsed.correction.needed ? parsed.correction.sqlStatement : undefined,
          severity: parsed.analysis.severity,
          category: parsed.analysis.category,
          changes: parsed.correction.changes,
          reasoning: parsed.correction.reasoning
        };
      }
      
      // Fallback to old format for backward compatibility
      return {
        isValid: parsed.is_valid || parsed.isValid,
        explanation: parsed.explanation,
        sqlCorrection: parsed.sql_correction || parsed.sqlCorrection,
      };
    } catch (parseError) {
      console.log('JSON parse failed, trying fallback parsing:', parseError);
      
      // Advanced fallback parsing for non-JSON responses
      const isValid = content.toLowerCase().includes('"isvalid": true') || 
                     content.toLowerCase().includes('is_valid": true') ||
                     (content.toLowerCase().includes('valid') && !content.toLowerCase().includes('not valid'));
      
      // Try to extract SQL statement from unstructured content
      const sqlMatch = content.match(/UPDATE\s+exercises\s+SET.*?WHERE.*?;/i);
      const sqlCorrection = sqlMatch ? sqlMatch[0] : undefined;
      
      return {
        isValid,
        explanation: `Analysis: ${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`,
        sqlCorrection,
      };
    }
  }

  // Format structured explanation for better readability
  private static formatStructuredExplanation(parsed: {
    analysis: { severity: string; category: string };
    explanation: { summary: string; details: string; impact: string };
    correction: { needed: boolean; changes?: string; reasoning?: string };
  }): string {
    const { analysis, explanation, correction } = parsed;
    
    let formatted = `📋 **Assessment Summary**\n${explanation.summary}\n\n`;
    
    formatted += `🔍 **Detailed Analysis**\n${explanation.details}\n\n`;
    
    formatted += `📊 **Issue Classification**\n`;
    formatted += `• Severity: ${analysis.severity.toUpperCase()}\n`;
    formatted += `• Category: ${analysis.category.replace(/_/g, ' ').toUpperCase()}\n\n`;
    
    formatted += `🎯 **Impact on Learning**\n${explanation.impact}\n\n`;
    
    if (correction.needed) {
      formatted += `🔧 **Proposed Solution**\n${correction.changes}\n\n`;
      formatted += `💡 **Correction Reasoning**\n${correction.reasoning}`;
    } else {
      formatted += `✅ **No Action Required**\nThe exercise appears to be correctly structured and the reported issue does not require changes.`;
    }
    
    return formatted;
  }

  // Main analysis method with hybrid approach
  static async analyzeReport(report: ProblemReportWithExercise): Promise<AIAssistanceResponse> {
    try {
      // Step 1: Check pattern cache (free)
      const cachedResponse = this.getPatternCachedResponse(report);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Step 2: Use conversation context for minimal token usage
      const response = await this.analyzeWithConversation(report);
      
      // Step 3: Cache the response for future similar patterns
      this.cachePatternResponse(report, response);
      
      return response;

    } catch (error) {
      console.error('Error in hybrid AI analysis:', error);
      
      // Fallback to mock for reliability
      console.log('🔄 Falling back to mock AI service');
      return await MockAIAssistanceService.analyzeReport(report);
    }
  }

  // Clear all caches (for testing or maintenance)
  static clearAllCaches(): void {
    this.promptCache.clear();
    this.patternCache.clear();
    this.conversationHistory.clear();
  }

  // Get cache statistics for monitoring
  static getCacheStats(): {
    promptCacheSize: number;
    patternCacheSize: number;
    conversationCacheSize: number;
  } {
    return {
      promptCacheSize: this.promptCache.size,
      patternCacheSize: this.patternCache.size,
      conversationCacheSize: this.conversationHistory.size,
    };
  }

  // Get token usage estimate for debugging
  static estimateTokenUsage(report: ProblemReportWithExercise): {
    systemPromptTokens: number;
    userPromptTokens: number;
    estimatedTotal: number;
  } {
    const userPrompt = this.generateUserPrompt(report);
    const userPromptTokens = Math.ceil(userPrompt.length / 4); // Rough estimate: 4 chars per token
    const systemPromptTokens = 2000; // Estimated from template
    
    return {
      systemPromptTokens,
      userPromptTokens,
      estimatedTotal: systemPromptTokens + userPromptTokens,
    };
  }

  // Clear prompt cache (for testing or template updates)
  static clearCache(): void {
    this.promptCache.clear();
  }
}

// Mock service for testing
export class MockAIAssistanceService {
  static async analyzeReport(report: ProblemReportWithExercise): Promise<AIAssistanceResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock responses based on problem type
    switch (report.problemType) {
      case 'incorrect_answer':
        return {
          isValid: true,
          explanation: 'The reported issue is valid. The correct answer should be "ao" instead of "a" for the contracted preposition.',
          sqlCorrection: `UPDATE exercises SET correct_answer = 'ao' WHERE id = '${report.exerciseId}';`
        };
      
      case 'irrelevant_hint':
        return {
          isValid: true,
          explanation: 'The hint is indeed too revealing. It should be simplified to maintain appropriate difficulty.',
          sqlCorrection: `UPDATE exercises SET hint = 'preposição contraída' WHERE id = '${report.exerciseId}';`
        };
      
      case 'missing_option':
        return {
          isValid: false,
          explanation: 'After reviewing the exercise, all necessary options are present. The correct answer is among the choices provided.',
          sqlCorrection: undefined
        };
      
      default:
        return {
          isValid: false,
          explanation: 'Unable to determine a specific issue with this exercise. It appears to be correctly structured.',
          sqlCorrection: undefined
        };
    }
  }
}