import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

async function fetchResources(query: string) {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: query,
        search_depth: "basic",
        include_answer: false,
        include_raw_content: false,
        max_results: 3,
        include_domains: ["arxiv.org", "scholar.google.com", "pubmed.ncbi.nlm.nih.gov", "nature.com", "science.org"],
      }),
    })

    if (!response.ok) {
      console.error("Tavily API error:", response.status)
      return []
    }

    const data = await response.json()
    return (
      data.results?.slice(0, 3).map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching resources:", error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "gpt-4o", includeResources = false } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.sender !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 })
    }

    // Convert messages to the format expected by the AI SDK
    const aiMessages = messages.map((msg: any) => ({
      role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    }))

    let resources = []
    if (includeResources && process.env.TAVILY_API_KEY) {
      resources = await fetchResources(lastMessage.content)
    }

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai(model),
      messages: aiMessages,
      system:
        "You are JARVIS, a highly intelligent research assistant for RACE AI. You help users with research questions, paper analysis, and academic inquiries. Be helpful, accurate, and professional. When relevant research resources are available, acknowledge them in your response.",
    })

    return NextResponse.json({
      message: {
        id: Date.now().toString(),
        content: text,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        resources: resources,
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
