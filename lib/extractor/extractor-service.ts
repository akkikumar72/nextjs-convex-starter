import {
  extractContent,
  extractMetadata,
  extractScreenshot,
  extractWithAI,
  extractMarkdown,
  extractHtml,
} from './jina-client'
import { ExtractionRequest, ExtractionResponse, JinaUsage, JinaExtractionData } from './types'

const createExtractor = (apiKey?: string) => ({
  extractContent: (url: string) => extractContent(url, apiKey),
  extractMetadata: (url: string) => extractMetadata(url, apiKey),
  extractScreenshot: (url: string) => extractScreenshot(url, apiKey),
  extractMarkdown: (url: string) => extractMarkdown(url, apiKey),
  extractHtml: (url: string) => extractHtml(url, apiKey),
  extractWithAI: (url: string) => extractWithAI(url, apiKey),
})

export const extract = async (
  request: ExtractionRequest,
  startTime: number,
  apiKey?: string
): Promise<ExtractionResponse> => {
  const endTime = Date.now()
  const processingTime = endTime - startTime

  try {
    if (!request.url || !request.type) {
      return {
        success: false,
        error: 'Missing url or type',
        processingTime,
      }
    }

    const extractor = createExtractor(apiKey)
    let result: { data: string | JinaExtractionData; usage?: JinaUsage }

    switch (request.type) {
      case 'content':
        result = await extractor.extractContent(request.url)
        break

      case 'metadata':
        result = await extractor.extractMetadata(request.url)
        break

      case 'screenshot':
        result = await extractor.extractScreenshot(request.url)
        break

      case 'markdown':
        result = await extractor.extractMarkdown(request.url)
        break

      case 'html':
        result = await extractor.extractHtml(request.url)
        break

      case 'ai_prompt':
        result = await extractor.extractWithAI(request.url)
        break

      default:
        return {
          success: false,
          error: 'Invalid extraction type',
          processingTime,
        }
    }

    return {
      success: true,
      data: result.data,
      usage: result.usage,
      processingTime,
    }
  } catch (error) {
    console.error('Extraction error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime,
    }
  }
}
