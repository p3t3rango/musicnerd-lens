import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Quick facts prompt - get 3 fast facts first
const QUICK_PROMPT = `You are MusicNerd, a passionate music expert who finds fascinating REAL music connections in ANYTHING.

STEP 1: ACCURATELY identify what you see. Be specific and correct:
- If it's a toy/figurine, say what it actually is (e.g., "Lego Batman Minifigure", "Labubu Art Toy", "Funko Pop")
- If it's music-related, identify the album/artist/gear correctly
- Never hallucinate or make up what something is

STEP 2: Find 3 REAL, VERIFIED music connections. Examples:
- Lego Batman → The Lego Batman Movie has songs by Patrick Stump, the Batman franchise has iconic scores by Hans Zimmer, Danny Elfman
- A random toy → The company's ad jingles, music in related movies/shows, collaborations with musicians
- Food/drink → Songs written about it, musicians who love it, music in their commercials
- Any object → Find the REAL music connection, no matter how creative

RULES:
- NEVER make up fake facts or connections
- All facts must be verifiable and true
- Include real URLs to credible sources (Wikipedia, IMDb, Discogs, AllMusic)
- If something has no obvious music connection, dig deeper - there's always something!

Respond in this exact JSON format:
{
  "identified": {
    "type": "album" | "artist" | "poster" | "setlist" | "gear" | "toy" | "movie" | "product" | "other",
    "name": "What it actually is - be accurate!",
    "artist": "Artist/creator if applicable",
    "year": "Year if known"
  },
  "facts": [
    {
      "category": "artist" | "album" | "gear" | "production" | "history" | "connection" | "soundtrack" | "cultural",
      "headline": "Short punchy headline (max 8 words)",
      "details": "Quick explanation with REAL facts (1-2 sentences)",
      "source": "Source name (Wikipedia, IMDb, etc.)",
      "sourceUrl": "https://real-url-to-verify.com"
    }
  ]
}

3 facts only. Make them TRUE and interesting!`

// Deep dive prompt - get 4 more detailed facts
const DEEP_PROMPT = `You are MusicNerd, a passionate music encyclopedia with Nardwuar energy. 

You identified this as: {{ITEM_NAME}} ({{ITEM_TYPE}})
You already shared these facts: {{EXISTING_FACTS}}

Now dig DEEPER into the REAL music connections. Provide exactly 4 MORE fascinating facts.

For non-music items, find creative but TRUE connections:
- Soundtracks from related movies/shows/games
- Musicians who have referenced or used this thing
- Composers who scored related content
- Cultural music moments involving this
- Ad campaigns with notable music
- Music videos featuring similar items

RULES:
- All facts MUST be real and verifiable
- NEVER hallucinate or make up connections
- Include real URLs to credible sources
- Be creative in finding connections, but stay truthful

Respond in this exact JSON format:
{
  "facts": [
    {
      "category": "artist" | "album" | "gear" | "production" | "history" | "connection" | "soundtrack" | "cultural",
      "headline": "Short punchy headline (max 8 words)",
      "details": "Detailed explanation with REAL facts (2-3 sentences)",
      "source": "Source name",
      "sourceUrl": "https://real-url-to-verify.com"
    }
  ]
}

4 new facts only. Deep cuts that are TRUE!`

export async function POST(request: Request) {
  try {
    const { image, mode = 'quick', context } = await request.json()

    if (!image && mode === 'quick') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    if (mode === 'quick') {
      // Quick analysis - 3 facts fast
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

      const result = await model.generateContent([
        QUICK_PROMPT,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        }
      ])

      const response = await result.response
      const text = response.text()

      let jsonStr = text
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      const parsed = JSON.parse(jsonStr.trim())

      const facts = parsed.facts.map((fact: { category: string; headline: string; details: string; source?: string; sourceUrl?: string }, index: number) => ({
        ...fact,
        id: `fact-${Date.now()}-${index}`
      }))

      return NextResponse.json({
        identified: parsed.identified,
        facts,
        hasMore: true
      })

    } else if (mode === 'deep' && context) {
      // Deep dive - 4 more facts
      const prompt = DEEP_PROMPT
        .replace('{{ITEM_NAME}}', context.name)
        .replace('{{ITEM_TYPE}}', context.type)
        .replace('{{EXISTING_FACTS}}', context.existingFacts.map((f: { headline: string }) => f.headline).join(', '))

      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        }
      ])

      const response = await result.response
      const text = response.text()

      let jsonStr = text
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      const parsed = JSON.parse(jsonStr.trim())

      const facts = parsed.facts.map((fact: { category: string; headline: string; details: string; source?: string; sourceUrl?: string }, index: number) => ({
        ...fact,
        id: `fact-deep-${Date.now()}-${index}`
      }))

      return NextResponse.json({
        facts,
        hasMore: false
      })
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
