import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, interest } = await request.json()

    if (!process.env.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY not configured")
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        include_answer: false,
        include_images: false,
        include_raw_content: false,
        max_results: 3,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Tavily API")
    }

    const data = await response.json()

    // Parse the results to extract researcher information
    const researchers =
      data.results?.slice(0, 2).map((result: any, index: number) => ({
        id: `${interest}-${index}`,
        name: extractResearcherName(result.title, result.content),
        field: interest,
        institution: extractInstitution(result.content),
        citations: extractCitations(result.content),
        image: `/professional-researcher-${index + 1}.png`,
        description: extractDescription(result.content),
        tags: [interest, ...extractTags(result.content)].slice(0, 3),
      })) || []

    return NextResponse.json({ researchers })
  } catch (error) {
    console.error("Error in search-researchers API:", error)
    return NextResponse.json({ researchers: [] }, { status: 500 })
  }
}

function extractResearcherName(title: string, content: string): string {
  // Try to extract researcher name from title or content
  const nameMatch =
    title.match(/Dr\.\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/) ||
    content.match(/Dr\.\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/) ||
    title.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/)

  return nameMatch ? `Dr. ${nameMatch[1]}` : "Researcher"
}

function extractInstitution(content: string): string {
  const institutionMatch =
    content.match(/(University|Institute|College|Lab)[^.]*/) ||
    content.match(/(MIT|Stanford|Harvard|Berkeley|CMU)[^.]*/)

  return institutionMatch ? institutionMatch[0].slice(0, 50) : "Research Institution"
}

function extractCitations(content: string): string {
  const citationMatch = content.match(/(\d+[KM]?\+?\s*citations?)/) || content.match(/h-index[:\s]*(\d+)/)

  return citationMatch ? citationMatch[1] : "10K+"
}

function extractDescription(content: string): string {
  // Extract first meaningful sentence
  const sentences = content.split(".").filter((s) => s.length > 50)
  return sentences[0] ? sentences[0].slice(0, 120) + "..." : "Leading researcher in the field"
}

function extractTags(content: string): string[] {
  const commonTerms = [
    "machine learning",
    "artificial intelligence",
    "deep learning",
    "neural networks",
    "computer vision",
    "natural language processing",
    "robotics",
    "data science",
  ]
  const foundTerms = commonTerms.filter((term) => content.toLowerCase().includes(term))

  return foundTerms.slice(0, 2)
}
