import { internalAction } from './_generated/server'
import { v } from 'convex/values'

// Response type definitions matching the original extractor
const JinaUsageValidator = v.object({
  tokens: v.number(),
})

const JinaExtractionDataValidator = v.object({
  text: v.optional(v.string()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  publishedTime: v.optional(v.string()),
  content: v.optional(v.string()),
  html: v.optional(v.string()),
  screenshotUrl: v.optional(v.string()),
  metadata: v.optional(v.any()),
  external: v.optional(v.any()),
  usage: v.optional(JinaUsageValidator),
})

const JinaWrapperValidator = v.object({
  code: v.number(),
  status: v.number(),
  data: JinaExtractionDataValidator,
  meta: v.optional(
    v.object({
      usage: v.optional(JinaUsageValidator),
    })
  ),
})

export const fetchJinaLLM = internalAction({
  args: {
    url: v.string(),
    format: v.union(v.literal('content'), v.literal('json'), v.literal('screenshot')),
  },
  returns: v.object({
    success: v.boolean(),
    data: v.optional(v.union(v.string(), JinaExtractionDataValidator)),
    usage: v.optional(JinaUsageValidator),
    processingTime: v.number(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const startTime = Date.now()

    try {
      // Validate URL format
      try {
        new URL(args.url)
      } catch {
        return {
          success: false,
          error: 'Invalid URL format',
          processingTime: Date.now() - startTime,
        }
      }

      // Get API key with validation
      const apiKey = process.env.JINA_AI_KEY
      if (!apiKey) {
        return {
          success: false,
          error: 'JINA_AI_KEY environment variable not configured',
          processingTime: Date.now() - startTime,
        }
      }

      const response = await fetch(`https://r.jina.ai/${encodeURIComponent(args.url)}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Engine': 'browser',
          'X-Return-Format': args.format,
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
        cache: 'no-store',
      })

      if (!response.ok) {
        return {
          success: false,
          error: `Request failed with status ${response.status}: ${response.statusText}`,
          processingTime: Date.now() - startTime,
        }
      }

      const json = await response.json()
      console.log(`✅ Jina extraction completed for ${args.url} with format ${args.format}`)

      // Type the response (Convex validators don't have parse method)
      const validatedResponse = json as {
        code: number
        status: number
        data: {
          text?: string
          title?: string
          description?: string
          url?: string
          publishedTime?: string
          content?: string
          html?: string
          screenshotUrl?: string
          metadata?: any
          external?: any
          usage?: { tokens: number }
        }
        meta?: {
          usage?: { tokens: number }
        }
      }

      // Extract the appropriate data based on format
      let extractedData: string | typeof validatedResponse.data
      const usage = validatedResponse.data.usage || validatedResponse.meta?.usage

      switch (args.format) {
        case 'content':
          extractedData = validatedResponse.data.content || validatedResponse.data.text || ''
          break
        case 'json':
          // For JSON format, return the structured data object
          extractedData = validatedResponse.data
          break
        case 'screenshot':
          extractedData = validatedResponse.data.screenshotUrl || ''
          break
        default:
          extractedData =
            validatedResponse.data.content ||
            validatedResponse.data.text ||
            JSON.stringify(validatedResponse.data)
      }

      return {
        success: true,
        data: extractedData,
        usage,
        processingTime: Date.now() - startTime,
      }
    } catch (error) {
      console.error('❌ Jina extraction error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown extraction error',
        processingTime: Date.now() - startTime,
      }
    }
  },
})
