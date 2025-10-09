export interface LLMModel {
  id: string
  name: string
  description?: string
  isPro?: boolean
  contextLength?: number
}

export interface LLMProvider {
  id: string
  name: string
  models: LLMModel[]
  apiKeyRequired?: boolean
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
        description: "Best for complex reasoning and analysis",
        contextLength: 128000,
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Fast, efficient for simple tasks",
        contextLength: 128000,
      },
      {
        id: "o1-preview",
        name: "o1-preview",
        description: "Advanced reasoning with chain-of-thought",
        isPro: true,
        contextLength: 128000,
      },
      {
        id: "o1-mini",
        name: "o1-mini",
        description: "Lightweight reasoning model",
        isPro: true,
        contextLength: 65536,
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    apiKeyRequired: true,
    models: [
      {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        description: "Best for creative and nuanced content",
        contextLength: 200000,
      },
      {
        id: "claude-3-5-haiku",
        name: "Claude 3.5 Haiku",
        description: "Fast Claude model for quick tasks",
        contextLength: 200000,
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Most capable Claude for complex work",
        isPro: true,
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
        description: "Google's best for multimodal tasks",
        contextLength: 2000000,
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        description: "Fast Google model for quick responses",
        contextLength: 1000000,
      },
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash Experimental",
        description: "Experimental features and capabilities",
        isPro: true,
        contextLength: 1000000,
      },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    apiKeyRequired: true,
    models: [
      {
        id: "llama-3.1-sonar-large",
        name: "Llama 3.1 Sonar Large",
        description: "Open-source with web search",
        contextLength: 32768,
      },
      {
        id: "llama-3.1-sonar-small",
        name: "Llama 3.1 Sonar Small",
        description: "Lightweight with web search",
        contextLength: 32768,
      },
      {
        id: "llama-3.1-sonar-huge",
        name: "Llama 3.1 Sonar Huge",
        description: "Most powerful open-source option",
        isPro: true,
        contextLength: 32768,
      },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    apiKeyRequired: true,
    models: [
      {
        id: "grok-2-1212",
        name: "Grok-2 1212",
        description: "Latest Grok with real-time knowledge",
        isPro: true,
        contextLength: 128000,
      },
      {
        id: "grok-2-vision-1212",
        name: "Grok-2 Vision 1212",
        description: "Grok with image understanding",
        isPro: true,
        contextLength: 128000,
      },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    apiKeyRequired: true,
    models: [
      {
        id: "deepseek-r1",
        name: "DeepSeek R1",
        description: "Specialized for research tasks",
        contextLength: 64000,
      },
      {
        id: "deepseek-r1-distill-llama-70b",
        name: "DeepSeek R1 Distill Llama 70B",
        description: "Research-focused, large model",
        isPro: true,
        contextLength: 64000,
      },
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    apiKeyRequired: true,
    models: [
      {
        id: "mixtral-8x7b",
        name: "Mixtral 8x7B",
        description: "Efficient mixture of experts model",
        contextLength: 32768,
      },
      {
        id: "mixtral-8x22b",
        name: "Mixtral 8x22B",
        description: "Large MoE for complex tasks",
        isPro: true,
        contextLength: 32768,
      },
      {
        id: "mistral-large",
        name: "Mistral Large",
        description: "Mistral's flagship model",
        isPro: true,
        contextLength: 32768,
      },
      {
        id: "mistral-nemo",
        name: "Mistral Nemo",
        description: "Balanced performance model",
        contextLength: 32768,
      },
    ],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    apiKeyRequired: true,
    models: [
      {
        id: "nemotron-70b",
        name: "Nemotron 70B",
        description: "NVIDIA's large language model",
        isPro: true,
        contextLength: 32768,
      },
    ],
  },
]

export function getProviderById(providerId: string): LLMProvider | undefined {
  return LLM_PROVIDERS.find((provider) => provider.id === providerId)
}

export function getModelById(modelId: string) {
  for (const provider of LLM_PROVIDERS) {
    const model = provider.models.find((m) => m.id === modelId)
    if (model) {
      return {
        provider,
        model,
      }
    }
  }
  return null
}
