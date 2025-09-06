import { ExtractionResult } from './playwright-engine'

export interface JinaExtractionOptions {
  apiKey?: string
  targetSelector?: string
  excludeSelector?: string
  returnFormat?: 'json' | 'markdown' | 'text' | 'html'
  enableImageCaptioning?: boolean
  timeout?: number
}

export interface JinaResponse {
  title?: string
  description?: string
  url?: string
  content?: string
  usage?: {
    tokens: number
  }
  screenshot?: string
}

export class JinaExtractionEngine {
  private apiKey: string
  private baseUrl = 'https://r.jina.ai'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.JINA_AI_KEY || process.env.JINA_API_KEY || ''

    if (!this.apiKey) {
      throw new Error('Jina AI API key is required. Set JINA_AI_KEY environment variable.')
    }
  }

  async extract(url: string, options: JinaExtractionOptions = {}): Promise<ExtractionResult> {
    const {
      targetSelector,
      excludeSelector,
      returnFormat = 'json',
      enableImageCaptioning = true,
      timeout = 30000,
    } = options

    try {
      // Use POST method for better control and complex configurations
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
          'X-Return-Format': returnFormat,
          ...(targetSelector && { 'X-Target-Selector': targetSelector }),
          ...(excludeSelector && { 'X-Remove-Selector': excludeSelector }),
          'X-With-Generated-Alt': enableImageCaptioning.toString(),
          'X-Timeout': Math.floor(timeout / 1000).toString(),
        },
        body: JSON.stringify({
          url,
          ...(targetSelector && { targetSelector }),
          ...(excludeSelector && { excludeSelector }),
        }),
        signal: AbortSignal.timeout(timeout),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Jina API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: JinaResponse = await response.json()

      // Extract metadata from Jina response
      const content = data.content || ''
      const title = data.title || ''
      const description = data.description || ''

      // Calculate basic metrics
      const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
      const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

      // Try to extract additional metadata from content if title/description are missing
      let extractedTitle = title
      let extractedDescription = description

      if (!extractedTitle && content) {
        // Try to find title in content (first line or heading)
        const lines = content.split('\n').filter((line) => line.trim().length > 0)
        if (lines.length > 0) {
          const firstLine = lines[0].trim()
          if (firstLine.length > 0 && firstLine.length < 200) {
            extractedTitle = firstLine
          }
        }
      }

      if (!extractedDescription && content) {
        // Try to find description (first paragraph or summary)
        const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0)
        if (paragraphs.length > 0) {
          const firstParagraph = paragraphs[0].trim()
          if (firstParagraph.length > 10 && firstParagraph.length < 500) {
            extractedDescription = firstParagraph
          }
        }
      }

      // Build extraction result compatible with existing interface
      const result: ExtractionResult = {
        content,
        metadata: {
          title: extractedTitle,
          description: extractedDescription,
          ogImage: '', // Jina doesn't provide OG images by default
          favicon: '',
          wordCount,
          readingTime,
          url: data.url || url,
        },
        html: content, // Jina returns processed content, not raw HTML
        // Note: Jina doesn't provide screenshots by default
        // screenshot: data.screenshot ? Buffer.from(data.screenshot, 'base64') : undefined,
      }

      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          throw new Error(`Jina extraction timeout after ${timeout}ms`)
        }
        if (error.message.includes('401')) {
          throw new Error('Invalid Jina AI API key')
        }
        if (error.message.includes('429')) {
          throw new Error('Jina AI rate limit exceeded')
        }
      }

      throw new Error(
        `Jina extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          url: 'https://example.com',
        }),
        signal: AbortSignal.timeout(10000),
      })

      return response.ok || response.status === 429 // 429 means API key works but rate limited
    } catch {
      return false
    }
  }

  /**
   * Check if a website might benefit from Jina extraction based on URL patterns
   */
  static shouldUseJina(url: string, playwrightError?: Error): boolean {
    const urlLower = url.toLowerCase()

    // Always use Jina if Playwright failed
    if (playwrightError) {
      return true
    }

    // Complex sites that often fail with Playwright
    const complexPatterns = [
      // Social media platforms
      'twitter.com',
      'x.com',
      'linkedin.com',
      'facebook.com',
      'instagram.com',
      // Dynamic content sites
      'medium.com',
      'substack.com',
      'notion.so',
      // SPA frameworks
      'vercel.app',
      'netlify.app',
      // News sites with heavy JS
      'cnn.com',
      'bbc.com',
      'nytimes.com',
      'washingtonpost.com',
      // E-commerce with dynamic content
      'amazon.com',
      'shopify.com',
      'etsy.com',
      // Documentation sites that load content dynamically
      'docs.',
      'gitbook.',
      'readme.',
      // Sites known for bot detection
      'cloudflare.com',
      'github.com',
    ]

    return complexPatterns.some((pattern) => urlLower.includes(pattern))
  }

  /**
   * Get optimal Jina configuration for different site types
   */
  static getOptimalConfig(url: string): JinaExtractionOptions {
    const urlLower = url.toLowerCase()

    // Documentation sites - focus on main content
    if (
      urlLower.includes('docs.') ||
      urlLower.includes('documentation') ||
      urlLower.includes('readme')
    ) {
      return {
        targetSelector: 'main, article, .content, [role="main"]',
        excludeSelector: 'nav, header, footer, .sidebar, .menu, .toc',
        returnFormat: 'json',
        timeout: 20000,
      }
    }

    // News/blog sites - extract article content
    if (
      urlLower.includes('medium.com') ||
      urlLower.includes('substack.com') ||
      urlLower.includes('blog') ||
      urlLower.includes('news')
    ) {
      return {
        targetSelector: 'article, [role="article"], .post-content, .entry-content',
        excludeSelector: 'nav, header, footer, .comments, .related, .sidebar, .ads',
        returnFormat: 'json',
        enableImageCaptioning: true,
        timeout: 25000,
      }
    }

    // Social media - get main text content
    if (
      urlLower.includes('twitter.com') ||
      urlLower.includes('x.com') ||
      urlLower.includes('linkedin.com')
    ) {
      return {
        targetSelector: '[data-testid="tweetText"], .tweet-text, .post-content',
        excludeSelector: '.ads, .promoted, .sidebar, nav, header',
        returnFormat: 'text',
        timeout: 15000,
      }
    }

    // E-commerce - focus on product info
    if (
      urlLower.includes('amazon.com') ||
      urlLower.includes('shop') ||
      urlLower.includes('store')
    ) {
      return {
        targetSelector: '.product-info, .product-details, [data-test="product"]',
        excludeSelector: '.reviews, .recommendations, .ads, .checkout',
        returnFormat: 'json',
        timeout: 20000,
      }
    }

    // Default configuration for unknown sites
    return {
      excludeSelector: 'nav, header, footer, .ads, .sidebar, .menu, .cookie, .popup',
      returnFormat: 'json',
      enableImageCaptioning: false, // Faster for general use
      timeout: 20000,
    }
  }
}

// Singleton instance
export const jinaEngine = new JinaExtractionEngine()
