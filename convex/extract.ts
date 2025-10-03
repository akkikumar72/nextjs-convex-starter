import { action } from './_generated/server'
import { v } from 'convex/values'
import { fetchLLMActionCache } from './cache'

export const extract = action({
  args: {
    url: v.string(),
    format: v.union(
      v.literal('ai_prompt'),
      v.literal('content'),
      v.literal('metadata'),
      v.literal('screenshot')
    ),
  },
  returns: v.object({
    success: v.boolean(),
    data: v.optional(v.any()),
    usage: v.optional(
      v.object({
        tokens: v.number(),
      })
    ),
    processingTime: v.number(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    console.log(`🚀 Starting extraction for URL: ${args.url} with format: ${args.format}`)
    const startTime = Date.now()

    try {
      // Map user-requested format to Jina API format:
      // - ai_prompt → content (AI-powered extraction)
      // - content → content (plain text)
      // - metadata → json (structured metadata object)
      // - screenshot → screenshot (page screenshot)
      let jinaFormat: 'content' | 'json' | 'screenshot'

      switch (args.format) {
        case 'ai_prompt':
        case 'content':
          jinaFormat = 'content'
          break
        case 'metadata':
          jinaFormat = 'json'
          break
        case 'screenshot':
          jinaFormat = 'screenshot'
          break
        default:
          jinaFormat = 'content'
      }

      console.log(`📡 Calling Jina API with format: ${jinaFormat}`)

      const result = await fetchLLMActionCache.fetch(ctx, {
        url: args.url,
        format: jinaFormat,
      })

      // Add processing time from cache fetch
      const totalProcessingTime = Date.now() - startTime

      if (!result.success) {
        console.error(`❌ Extraction failed: ${result.error}`)
        return {
          success: false,
          error: result.error || 'Unknown extraction error',
          processingTime: totalProcessingTime,
        }
      }

      console.log(`✅ Extraction completed successfully in ${totalProcessingTime}ms`)

      return {
        success: true,
        data: result.data,
        usage: result.usage,
        processingTime: totalProcessingTime,
      }
    } catch (error) {
      const totalProcessingTime = Date.now() - startTime
      console.error('💥 Extraction error:', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: totalProcessingTime,
      }
    }
  },
})
