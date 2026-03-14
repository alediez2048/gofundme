/**
 * FR-020: AI configuration — centralized environment detection and model settings.
 */

export interface AIConfig {
  provider: "openai";
  model: string;
  apiKey: string | undefined;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

export function getAIConfig(): AIConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  return {
    provider: "openai",
    model: process.env.AI_MODEL || "gpt-4o-mini",
    apiKey,
    maxTokens: Number(process.env.AI_MAX_TOKENS) || 400,
    temperature: Number(process.env.AI_TEMPERATURE) || 0.4,
    enabled: !!apiKey,
  };
}
