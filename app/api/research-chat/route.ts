import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "gpt-4o", selectedFile } = await request.json()

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

    // Create context-aware system prompt
    let systemPrompt =
      "You are a research assistant that helps analyze and explain research papers. Be detailed and academic in your responses."

    if (selectedFile) {
      systemPrompt += ` You are currently analyzing a research paper titled "${selectedFile.name}". The paper content: ${selectedFile.content || "No content available"}. Focus your responses on this paper when relevant.`
    }

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai(model),
      messages: aiMessages,
      system: systemPrompt,
    })

    return NextResponse.json({
      message: {
        id: Date.now().toString(),
        content: text,
        sender: "assistant",
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Research chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
