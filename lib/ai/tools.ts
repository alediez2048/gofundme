/**
 * FR-020: Tool registry — typed tool definitions for AI tool calling.
 * Tools execute against the Zustand store and return structured data.
 */

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (params: unknown) => Promise<unknown>;
}

const tools = new Map<string, AITool>();

export function registerTool(tool: AITool): void {
  tools.set(tool.name, tool);
}

export function getTool(name: string): AITool | undefined {
  return tools.get(name);
}

export function getTools(): AITool[] {
  return Array.from(tools.values());
}

/** Convert registered tools to OpenAI function-calling format. */
export function getToolsForOpenAI() {
  return getTools().map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}
