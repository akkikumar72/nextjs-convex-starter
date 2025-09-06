import { NextRequest, NextResponse } from 'next/server'
import { hybridEngine } from '@/lib/extraction/hybrid-engine'
import { contentProcessor } from '@/lib/extraction/content-processor'
import { metadataExtractor } from '@/lib/extraction/metadata-extractor'
import { aiProcessor } from '@/lib/extraction/ai-processor'

export interface ExtractionRequest {
  url: string
  type: 'ai_prompt' | 'content' | 'metadata' | 'screenshot'
  prompt?: string
}

export interface ExtractionResponse {
  success: boolean
  requestId: string
  cached: boolean
  credits: {
    cost: number
    remaining: number
    complexity: 'failed' | 'cached' | 'normal' | 'advanced'
  }
  result: {
    content?: string
    aiResponse?: string
    screenshotUrl?: string
    metadata?: Record<string, unknown>
    processingTime: number
  }
  extractionDetails?: {
    method: 'playwright' | 'jina' | 'hybrid'
    primaryAttempts: number
    fallbackUsed: boolean
    strategy: string
  }
  error?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body: ExtractionRequest = await request.json()
    const { url, type, prompt } = body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL provided',
        },
        { status: 400 }
      )
    }

    // Extract content using hybrid engine (Playwright + Jina fallback)
    const extractionResult = await hybridEngine.extract(url)

    const result: {
      content?: string
      aiResponse?: string
      screenshotUrl?: string
      metadata?: Record<string, unknown>
      processingTime: number
    } = {
      processingTime: Date.now() - startTime,
    }

    // Process based on extraction type
    switch (type) {
      case 'content':
        result.content = contentProcessor.htmlToMarkdown(extractionResult.html)
        break

      case 'metadata':
        result.metadata = metadataExtractor.extractMetadata(
          extractionResult.html,
          url
        ) as unknown as Record<string, unknown>
        break

      case 'screenshot':
        if (extractionResult.screenshot) {
          // In a real implementation, you'd save this to a file storage service
          // For now, we'll return a base64 data URL
          const base64 = extractionResult.screenshot.toString('base64')
          result.screenshotUrl = `data:image/png;base64,${base64}`
        }
        break

      case 'ai_prompt':
        const textContent = contentProcessor.extractTextContent(extractionResult.html)
        if (prompt) {
          result.aiResponse = await aiProcessor.processWithPrompt(textContent, prompt)
        } else {
          const analysis = await aiProcessor.analyzeContent(textContent)
          result.aiResponse = `Summary: ${analysis.summary}\n\nKey Points:\n${analysis.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nSentiment: ${analysis.sentiment}\nTopics: ${analysis.topics.join(', ')}`
        }
        break

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid extraction type',
          },
          { status: 400 }
        )
    }

    // Calculate credits based on complexity using hybrid engine assessment
    const complexity = hybridEngine.getComplexity(url, extractionResult)
    const creditCost =
      type === 'ai_prompt' ? 8 : type === 'screenshot' ? 4 : complexity === 'advanced' ? 4 : 1

    const response: ExtractionResponse = {
      success: true,
      requestId: generateRequestId(),
      cached: false,
      credits: {
        cost: creditCost,
        remaining: 1000, // Mock remaining credits
        complexity,
      },
      result,
      extractionDetails: {
        method: extractionResult.extractionMethod,
        primaryAttempts: extractionResult.primaryAttempts,
        fallbackUsed: extractionResult.fallbackUsed,
        strategy: extractionResult.processingDetails.strategy.reasoning,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Extraction error:', error)

    // Try to get diagnostics for better error reporting
    let errorDetails = ''
    try {
      const diagnostics = await hybridEngine.runDiagnostics()
      const issues = []
      if (!diagnostics.playwright.available) {
        issues.push(`Playwright: ${diagnostics.playwright.error || 'unavailable'}`)
      }
      if (!diagnostics.jina.available) {
        issues.push(`Jina: ${diagnostics.jina.error || 'unavailable'}`)
      }
      if (issues.length > 0) {
        errorDetails = ` (${issues.join(', ')})`
      }
    } catch {
      // Ignore diagnostics errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage + errorDetails,
        requestId: generateRequestId(),
        cached: false,
        credits: {
          cost: 0,
          remaining: 1000,
          complexity: 'failed' as const,
        },
        result: {
          processingTime: Date.now() - startTime,
        },
        extractionDetails: {
          method: 'hybrid' as const,
          primaryAttempts: 0,
          fallbackUsed: false,
          strategy: 'Extraction failed before strategy could be applied',
        },
      },
      { status: 500 }
    )
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
