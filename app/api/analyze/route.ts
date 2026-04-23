import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Quick facts prompt - get 3 fast facts first
const QUICK_PROMPT = `You are MusicNerd. Identify what's in this image and find music connections.

IDENTIFICATION RULES:
- Use SHORT, SIMPLE names (1-4 words max)
- Examples: "Pokeball", "Batman Shirt", "Fender Stratocaster", "Abbey Road Album"
- NEVER write descriptions. Just the name.
- If you see a person, identify what they're wearing/holding, not guess who they are
- Focus on the MAIN subject, not every detail

NAME EXAMPLES:
- Red/white ball toy → name: "Pokeball"
- Person in Batman shirt → name: "Batman Shirt"  
- Lego figure of Batman → name: "Lego Batman"
- Purple bunny figure → name: "Labubu Figure"
- Guitar → name: "Fender Stratocaster" (or brand if visible)

Then find 3 REAL music connections:
- Pokemon → Game soundtrack by Junichi Masuda, Pokemon theme song, etc.
- Batman → Hans Zimmer score, Danny Elfman theme, Prince soundtrack
- Any product → Related soundtracks, ad music, musician endorsements

JSON format:
{
  "identified": {
    "type": "album" | "artist" | "poster" | "gear" | "toy" | "product" | "other",
    "name": "Short name (1-4 words)",
    "artist": "If applicable",
    "year": "If known"
  },
  "facts": [
    {
      "category": "artist" | "album" | "gear" | "production" | "history" | "connection" | "soundtrack" | "cultural",
      "headline": "Short headline (max 8 words)",
      "details": "1-2 sentences of real facts",
      "source": "Wikipedia, IMDb, etc.",
      "sourceUrl": "https://source-url.com"
    }
  ]
}

3 facts only.`

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
