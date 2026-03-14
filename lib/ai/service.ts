/**
 * FR-020: Unified AI service — all AI calls go through this module.
 * Handles OpenAI integration, tracing, and automatic fallback.
 */

import OpenAI from "openai";
import { getAIConfig } from "./config";
import { startTrace, type AITrace } from "./trace";
import { getFallback } from "./fallback";

export interface AIRequest {
  feature: string;
  systemPrompt: string;
  userContent: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  isAiGenerated: boolean;
  trace: AITrace;
}

/**
 * Call the AI service with automatic tracing and fallback.
 * If OPENAI_API_KEY is not set or the call fails, the registered
 * fallback for the feature is used instead.
 */
export async function callAI(
  request: AIRequest,
  fallbackInput?: unknown
): Promise<AIResponse> {
  const config = getAIConfig();
  const traceBuilder = startTrace(request.feature, request.userContent);

  // No API key — use fallback
  if (!config.enabled || !config.apiKey) {
    const fallback = getFallback(request.feature);
    const fallbackText = fallback
      ? String(fallback(fallbackInput))
      : "";
    const trace = traceBuilder.fail("no-api-key", fallbackText);
    return { text: fallbackText, isAiGenerated: false, trace };
  }

  try {
    const openai = new OpenAI({ apiKey: config.apiKey });
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userContent },
      ],
      max_tokens: request.maxTokens ?? config.maxTokens,
      temperature: request.temperature ?? config.temperature,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    const usage = completion.usage;

    const trace = traceBuilder.succeed(text, {
      inputTokens: usage?.prompt_tokens ?? 0,
      outputTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
    });

    return { text, isAiGenerated: true, trace };
  } catch (error) {
    const fallback = getFallback(request.feature);
    const fallbackText = fallback
      ? String(fallback(fallbackInput))
      : "";
    const errorMsg =
      error instanceof Error ? error.message : "Unknown AI error";
    const trace = traceBuilder.fail(errorMsg, fallbackText);
    return { text: fallbackText, isAiGenerated: false, trace };
  }
}
