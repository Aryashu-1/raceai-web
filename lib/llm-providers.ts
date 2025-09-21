export interface LLMProvider {
  id: string
  name: string
  models: LLMModel[]
  apiKeyRequired: boolean
}

export interface LLMModel {
  id: string
  name: string
  description?: string
  contextLength?: number
}

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    apiKeyRequired: true,
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Most capable model, great for complex reasoning",
        contextLength: 128000,
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Faster and more cost-effective",
        contextLength: 128000,
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        description: "Previous generation flagship model",
        contextLength: 8192,
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    apiKeyRequired: true,
    models: [
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        description: "Most intelligent model, great for complex tasks",
        contextLength: 200000,
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        description: "Fastest model for simple tasks",
        contextLength: 200000,
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    apiKeyRequired: true,
    models: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Advanced reasoning and long context",
        contextLength: 2000000,
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        description: "Fast and efficient for most tasks",
        contextLength: 1000000,
      },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    apiKeyRequired: true,
    models: [
      {
        id: "llama-3.1-70b-versatile",
        name: "Llama 3.1 70B",
        description: "High-performance open source model",
        contextLength: 32768,
      },
      {
        id: "mixtral-8x7b-32768",
        name: "Mixtral 8x7B",
        description: "Efficient mixture of experts model",
        contextLength: 32768,
      },
    ],
  },
]

export function getProviderById(providerId: string): LLMProvider | undefined {
  return LLM_PROVIDERS.find((provider) => provider.id === providerId)
}

export function getModelById(modelId: string): { provider: LLMProvider; model: LLMModel } | undefined {
  for (const provider of LLM_PROVIDERS) {
    const model = provider.models.find((m) => m.id === modelId)
    if (model) {
      return { provider, model }
    }
  }
  return undefined
}
