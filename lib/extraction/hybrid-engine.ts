import { extractionEngine, ExtractionResult } from './playwright-engine'
import { JinaExtractionEngine } from './jina-engine'

export interface ExtractionStrategy {
  primary: 'playwright' | 'jina'
  fallback?: 'playwright' | 'jina'
  reasoning: string
}

export interface HybridExtractionResult extends ExtractionResult {
  extractionMethod: 'playwright' | 'jina' | 'hybrid'
  primaryAttempts: number
  fallbackUsed: boolean
  processingDetails: {
    playwrightError?: string
    jinaError?: string
    strategy: ExtractionStrategy
  }
}

export class HybridExtractionEngine {
  private maxRetries = 2
  private fallbackTimeout = 15000

  constructor(
    private playwrightEngine = extractionEngine,
    private jinaEngine = new JinaExtractionEngine()
  ) {}

  /**
   * Intelligently extract content using the best method for the given URL
   */
  async extract(url: string): Promise<HybridExtractionResult> {
    const strategy = this.determineStrategy(url)
    const startTime = Date.now()

    let playwrightError: Error | undefined
    let jinaError: Error | undefined
    let result: ExtractionResult | undefined
    let extractionMethod: 'playwright' | 'jina' | 'hybrid' = strategy.primary
    let primaryAttempts = 0
    let fallbackUsed = false

    // Try primary method first
    if (strategy.primary === 'playwright') {
      try {
        primaryAttempts++
        result = await this.playwrightEngine.extract(url)

        // Validate quality of Playwright result
        if (!this.isQualityResult(result)) {
          throw new Error('Low quality extraction - insufficient content')
        }
      } catch (error) {
        playwrightError = error instanceof Error ? error : new Error(String(error))
        console.warn(`Playwright extraction failed for ${url}:`, playwrightError.message)
      }
    } else {
      try {
        primaryAttempts++
        const jinaConfig = JinaExtractionEngine.getOptimalConfig(url)
        result = await this.jinaEngine.extract(url, jinaConfig)

        if (!this.isQualityResult(result)) {
          throw new Error('Low quality extraction - insufficient content')
        }
      } catch (error) {
        jinaError = error instanceof Error ? error : new Error(String(error))
        console.warn(`Jina extraction failed for ${url}:`, jinaError.message)
      }
    }

    // Try fallback method if primary failed and fallback is available
    if (!result && strategy.fallback) {
      fallbackUsed = true
      extractionMethod = 'hybrid'

      console.log(`Using fallback method (${strategy.fallback}) for ${url}`)

      if (strategy.fallback === 'jina') {
        try {
          const jinaConfig = JinaExtractionEngine.getOptimalConfig(url)
          result = await this.jinaEngine.extract(url, jinaConfig)
        } catch (error) {
          jinaError = error instanceof Error ? error : new Error(String(error))
        }
      } else {
        try {
          result = await this.playwrightEngine.extract(url)
        } catch (error) {
          playwrightError = error instanceof Error ? error : new Error(String(error))
        }
      }
    }

    // If both methods failed, throw a comprehensive error
    if (!result) {
      const errors = []
      if (playwrightError) errors.push(`Playwright: ${playwrightError.message}`)
      if (jinaError) errors.push(`Jina: ${jinaError.message}`)

      throw new Error(`All extraction methods failed for ${url}. ${errors.join('; ')}`)
    }

    // Build hybrid result with detailed metadata
    const hybridResult: HybridExtractionResult = {
      ...result,
      extractionMethod,
      primaryAttempts,
      fallbackUsed,
      processingDetails: {
        playwrightError: playwrightError?.message,
        jinaError: jinaError?.message,
        strategy,
      },
    }

    const processingTime = Date.now() - startTime
    console.log(`✅ Extracted ${url} using ${extractionMethod} in ${processingTime}ms`)

    return hybridResult
  }

  /**
   * Determine the optimal extraction strategy for a given URL
   */
  private determineStrategy(url: string): ExtractionStrategy {
    const urlLower = url.toLowerCase()

    // Sites where Playwright is typically better (simple, static content)
    const staticPatterns = [
      'wikipedia.org',
      'stackoverflow.com',
      'github.io',
      'blog.',
      '.edu',
      '.gov',
      '.org',
      'example.com',
      'httpbin.org',
    ]

    // Use Playwright for known static sites only
    if (staticPatterns.some((pattern) => urlLower.includes(pattern))) {
      return {
        primary: 'playwright',
        fallback: 'jina',
        reasoning: 'Static content site, Playwright should handle efficiently',
      }
    }

    // Social media sites - Jina only (no Playwright fallback as they rarely work)
    if (
      urlLower.includes('twitter.com') ||
      urlLower.includes('x.com') ||
      urlLower.includes('linkedin.com') ||
      urlLower.includes('facebook.com') ||
      urlLower.includes('instagram.com')
    ) {
      return {
        primary: 'jina',
        fallback: undefined, // No fallback - these sites need Jina
        reasoning: 'Social media platform with heavy bot detection, requires Jina',
      }
    }

    // Default strategy: Use Jina for everything else (better coverage)
    // This handles: docs, dynamic sites, SPA apps, complex sites, unknown sites, etc.
    return {
      primary: 'jina',
      fallback: 'playwright',
      reasoning: 'Default to robust Jina extraction for comprehensive coverage',
    }
  }

  /**
   * Check if extraction result has sufficient quality
   */
  private isQualityResult(result: ExtractionResult): boolean {
    // Minimum content length threshold
    if (!result.content || result.content.trim().length < 50) {
      return false
    }

    // Check for common extraction failures
    const content = result.content.toLowerCase()
    const failureIndicators = [
      'access denied',
      'page not found',
      '404 not found',
      'please enable javascript',
      'this page requires javascript',
      'blocked by cloudflare',
      'just a moment',
      'checking your browser',
      'rate limit exceeded',
      'too many requests',
    ]

    if (failureIndicators.some((indicator) => content.includes(indicator))) {
      return false
    }

    // Check metadata quality
    if (!result.metadata.title || result.metadata.title.trim().length < 3) {
      return false
    }

    // Consider word count (very short content might indicate failure)
    if (result.metadata.wordCount < 10) {
      return false
    }

    return true
  }

  /**
   * Get extraction complexity based on URL and content characteristics
   */
  getComplexity(url: string, result?: ExtractionResult): 'normal' | 'advanced' {
    const urlLower = url.toLowerCase()

    // Simple static sites are normal complexity
    const staticPatterns = [
      'wikipedia.org',
      'stackoverflow.com',
      'github.io',
      'blog.',
      '.edu',
      '.gov',
      '.org',
      'example.com',
      'httpbin.org',
    ]

    if (staticPatterns.some((pattern) => urlLower.includes(pattern))) {
      return 'normal'
    }

    // Check content characteristics if available
    if (result) {
      // Very long content suggests complexity
      if (result.metadata.wordCount > 2000) {
        return 'advanced'
      }

      // Short content from non-static sites might indicate extraction difficulty
      if (result.metadata.wordCount < 100) {
        return 'advanced'
      }
    }

    // Default to advanced for everything else (since we're using Jina primary)
    // This includes: social media, docs, dynamic sites, SPAs, unknown sites
    return 'advanced'
  }

  /**
   * Test both engines and return diagnostics
   */
  async runDiagnostics(): Promise<{
    playwright: { available: boolean; error?: string }
    jina: { available: boolean; error?: string }
  }> {
    const diagnostics = {
      playwright: { available: false, error: undefined as string | undefined },
      jina: { available: false, error: undefined as string | undefined },
    }

    // Test Playwright
    try {
      await this.playwrightEngine.initialize()
      diagnostics.playwright.available = true
    } catch (error) {
      diagnostics.playwright.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Test Jina
    try {
      const jinaAvailable = await this.jinaEngine.testConnection()
      diagnostics.jina.available = jinaAvailable
      if (!jinaAvailable) {
        diagnostics.jina.error = 'API connection failed'
      }
    } catch (error) {
      diagnostics.jina.error = error instanceof Error ? error.message : 'Unknown error'
    }

    return diagnostics
  }
}

// Singleton instance
export const hybridEngine = new HybridExtractionEngine()
