import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

interface ExtractionRequest {
  url: string
  type: 'ai_prompt' | 'content' | 'metadata' | 'screenshot'
  prompt?: string
}

interface ExtractionResponse {
  success: boolean
  data?: string | Record<string, unknown>
  usage?: { tokens: number }
  processingTime?: number
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  try {
    const body: ExtractionRequest = await request.json()

    // Validate request body
    if (!body.url || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: url and type',
          processingTime: Date.now() - startTime,
        } as ExtractionResponse,
        { status: 400 }
      )
    }

    // Call the Convex extraction action
    const result = await convex.action(api.extract.extract, {
      url: body.url,
      format: body.type,
    })

    // Return the result from Convex (already includes success, data, usage, etc.)
    return NextResponse.json(result as ExtractionResponse)
  } catch (error) {
    console.error('API extraction error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime,
      } as ExtractionResponse,
      { status: 500 }
    )
  }
}
