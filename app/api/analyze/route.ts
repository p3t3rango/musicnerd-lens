import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Quick facts prompt - get 3 fast facts first
const QUICK_PROMPT = `You are MusicNerd, a passionate music expert. Analyze this image and provide a QUICK response.

Identify what you see and give exactly 3 punchy facts. Be fast and exciting!

IMPORTANT: For each fact, include a real, working URL to a credible source where users can learn more. Use sources like Wikipedia, Discogs, AllMusic, official artist sites, or music publications.

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
      "headline": "Short punchy headline (max 8 words)",
      "details": "Quick explanation (1-2 sentences)",
      "source": "Source name (e.g. Wikipedia, Discogs)",
      "sourceUrl": "https://full-url-to-source.com"
    }
  ]
}

Only 3 facts. Make them count!`

// Deep dive prompt - get 4 more detailed facts
const DEEP_PROMPT = `You are MusicNerd, a passionate music encyclopedia with Nardwuar energy. 

You already identified this as: {{ITEM_NAME}} ({{ITEM_TYPE}})
You already shared these facts: {{EXISTING_FACTS}}

Now dig DEEPER. Provide exactly 4 MORE fascinating facts that are:
- More obscure and surprising
- Cover different categories than before
- Include specific details (names, dates, gear models)
- Connect to other artists or cultural moments

IMPORTANT: For each fact, include a real, working URL to a credible source. Use Wikipedia, Discogs, AllMusic, Pitchfork, official sites, or music publications.

Respond in this exact JSON format:
{
  "facts": [
    {
      "category": "artist" | "album" | "gear" | "production" | "history" | "connection",
      "headline": "Short punchy headline (max 8 words)",
      "details": "Detailed explanation (2-3 sentences)",
      "source": "Source name",
      "sourceUrl": "https://full-url-to-source.com"
    }
  ]
}

4 new facts only. Make them deep cuts!`

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
