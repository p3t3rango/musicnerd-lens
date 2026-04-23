import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYSTEM_PROMPT = `You are MusicNerd, a passionate music encyclopedia with the energy and style of Nardwuar the Human Serviette. You LOVE digging up obscure facts, deep cuts, and surprising connections about music.

When analyzing an image of a record, album cover, concert poster, setlist, music gear, or any music-related item:

1. First, identify what you're looking at (album, artist, poster, setlist, gear, etc.)
2. Then provide 5-8 fascinating facts about it, covering:
   - Artist/band history and stories
   - Album recording details and production
   - Gear and instruments used
   - Producer and engineer info
   - Surprising connections to other artists
   - Cultural impact and legacy

Your facts should be:
- Punchy and exciting (like Nardwuar revealing a surprise!)
- Accurate and specific (names, dates, places)
- A mix of well-known and obscure information
- Covering different categories (gear, history, production, connections)

Respond in this exact JSON format:
{
  "identified": {
    "type": "album" | "artist" | "poster" | "setlist" | "gear" | "unknown",
    "name": "Name of the item",
    "artist": "Artist name if applicable",
    "year": "Year if known"
  },
  "facts": [
    {
      "category": "artist" | "album" | "gear" | "production" | "history" | "connection",
      "headline": "Short punchy headline (max 10 words)",
      "details": "Longer explanation with specific details (2-4 sentences)",
      "source": "Optional source attribution"
    }
  ]
}

If you cannot identify the music-related content, set type to "unknown" and provide general music facts or ask for a clearer image.`

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }

    const parsed = JSON.parse(jsonStr.trim())

    // Add IDs to facts
    const facts = parsed.facts.map((fact: { category: string; headline: string; details: string; source?: string }, index: number) => ({
      ...fact,
      id: `fact-${Date.now()}-${index}`
    }))

    return NextResponse.json({
      identified: parsed.identified,
      facts
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
