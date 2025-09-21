import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { interests } = await request.json()

    if (!interests || interests.length === 0) {
      return NextResponse.json({ avatars: [] })
    }

    const searchQuery = `famous researchers scientists leaders in ${interests.join(" ")} field`

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: "basic",
        include_answer: false,
        include_images: true,
        include_raw_content: false,
        max_results: 8,
      }),
    })

    if (!response.ok) {
      console.error("Tavily API error:", response.statusText)
      return NextResponse.json({ avatars: [] })
    }

    const data = await response.json()

    // Parse results to extract researcher information
    const avatars =
      data.results?.slice(0, 6).map((result: any, index: number) => {
        // Extract name from title or URL
        const name = result.title?.split(" - ")[0]?.split(" | ")[0]?.trim() || `Researcher ${index + 1}`

        // Determine field based on interests and content
        const field = interests[0] || "Research"

        // Create description from snippet
        const description = result.content?.substring(0, 100) + "..." || `Leading researcher in ${field}`

        return {
          id: `dynamic-${index}`,
          name: name.length > 30 ? name.substring(0, 30) + "..." : name,
          field: field,
          avatar: null, // Will use default avatar
          description: description,
        }
      }) || []

    return NextResponse.json({ avatars })
  } catch (error) {
    console.error("Error searching for avatars:", error)
    return NextResponse.json({ avatars: [] })
  }
}
