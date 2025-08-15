// Cost calculation utilities for Claude API usage

// Claude 3.5 Sonnet pricing (as of current rates)
export const CLAUDE_PRICING = {
  inputTokensPerMillion: 3.00,   // $3.00 per 1M input tokens
  outputTokensPerMillion: 15.00, // $15.00 per 1M output tokens
} as const;

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface CostBreakdown {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
}

/**
 * Calculate costs based on token usage
 */
export function calculateCost(tokenUsage: TokenUsage): CostBreakdown {
  const inputCostUsd = (tokenUsage.inputTokens / 1_000_000) * CLAUDE_PRICING.inputTokensPerMillion;
  const outputCostUsd = (tokenUsage.outputTokens / 1_000_000) * CLAUDE_PRICING.outputTokensPerMillion;
  
  return {
    inputTokens: tokenUsage.inputTokens,
    outputTokens: tokenUsage.outputTokens,
    totalTokens: tokenUsage.inputTokens + tokenUsage.outputTokens,
    inputCostUsd: Number(inputCostUsd.toFixed(6)),
    outputCostUsd: Number(outputCostUsd.toFixed(6)),
    totalCostUsd: Number((inputCostUsd + outputCostUsd).toFixed(6)),
  };
}

/**
 * Estimate tokens in text (rough approximation: 1 token ≈ 0.75 words)
 */
export function estimateTokenCount(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 0.75);
}

/**
 * Format cost for display
 */
export function formatCost(costUsd: number): string {
  if (costUsd < 0.001) {
    return '<$0.001';
  }
  return `$${costUsd.toFixed(3)}`;
}

/**
 * Estimate cost for a generation based on prompt and expected output
 */
export function estimateGenerationCost(promptText: string, expectedQuestionsCount: number): CostBreakdown {
  const inputTokens = estimateTokenCount(promptText);
  const outputTokens = expectedQuestionsCount * 300; // ~300 tokens per exercise
  
  return calculateCost({ inputTokens, outputTokens });
}