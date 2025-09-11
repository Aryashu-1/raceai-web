// import { type NextRequest, NextResponse } from "next/server"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// export async function POST(request: NextRequest) {
//   try {
//     const { selectedFile, model = "gpt-4o" } = await request.json()

//     if (!selectedFile) {
//       return NextResponse.json({ error: "Selected file is required" }, { status: 400 })
//     }

//     // Generate podcast script using AI
//     const { text } = await generateText({
//       model: openai(model),
//       prompt: `Create a detailed podcast script explaining the research paper "${selectedFile.name}".

//       Paper content: ${selectedFile.content || "No content available"}

//       The script should:
//       1. Start with an engaging introduction
//       2. Explain the research problem and motivation
//       3. Describe the methodology used
//       4. Discuss key findings and results
//       5. Explain the implications and future work
//       6. End with a compelling conclusion

//       Make it conversational and accessible while maintaining scientific accuracy. Target length: 5-10 minutes when spoken.`,
//       system:
//         "You are an expert science communicator who creates engaging podcast scripts that make complex research accessible to a broad audience.",
//     })

//     // In a real implementation, you would use text-to-speech API here
//     // For now, we'll return the script and simulate audio generation

//     return NextResponse.json({
//       script: text,
//       audioUrl: "/placeholder-podcast.mp3", // This would be the actual generated audio URL
//       duration: "8:30", // Estimated duration
//     })
//   } catch (error) {
//     console.error("Podcast generation error:", error)
//     return NextResponse.json({ error: "Failed to generate podcast" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const { selectedFile, model = "gpt-4o" } = await request.json();

    if (!selectedFile) {
      return NextResponse.json(
        { error: "Selected file is required" },
        { status: 400 }
      );
    }

    // Generate podcast script using AI
    const { text } = await generateText({
      model: openai(model),
      prompt: `Create a detailed podcast script explaining the research paper "${
        selectedFile.name
      }". 
      
      Paper content: ${selectedFile.content || "No content available"}
      
      The script should:
      1. Start with an engaging introduction
      2. Explain the research problem and motivation
      3. Describe the methodology used
      4. Discuss key findings and results
      5. Explain the implications and future work
      6. End with a compelling conclusion
      
      Make it conversational and accessible while maintaining scientific accuracy. Target length: 5-10 minutes when spoken.`,
      system:
        "You are an expert science communicator who creates engaging podcast scripts that make complex research accessible to a broad audience.",
    });

    // In a real implementation, you would use text-to-speech API here
    // For now, we'll return the script and simulate audio generation

    return NextResponse.json({
      script: text,
      audioUrl: "/placeholder-podcast.mp3", // This would be the actual generated audio URL
      duration: "8:30", // Estimated duration
    });
  } catch (error) {
    console.error("Podcast generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast" },
      { status: 500 }
    );
  }
}
