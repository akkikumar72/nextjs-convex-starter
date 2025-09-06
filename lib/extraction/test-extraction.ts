/**
 * Test script to verify hybrid extraction engine functionality
 * This is for testing purposes and should not be included in production builds
 */

import { hybridEngine } from './hybrid-engine'

interface TestResult {
  url: string
  success: boolean
  method: string
  strategy: string
  error?: string
  contentLength?: number
  processingTime?: number
}

export class ExtractionTester {
  private testUrls = [
    // Simple static sites (should work with Playwright)
    'https://example.com',
    'https://httpbin.org/html',

    // Complex sites (should fallback to Jina)
    'https://docs.convex.dev/quickstart',
    'https://blog.vercel.com',

    // Social media (Jina primary)
    'https://twitter.com/vercel',

    // Documentation (Jina primary)
    'https://nextjs.org/docs',
  ]

  async runBasicTest(): Promise<TestResult[]> {
    console.log('🧪 Starting hybrid extraction engine tests...\n')

    const results: TestResult[] = []

    for (const url of this.testUrls.slice(0, 3)) {
      // Test first 3 URLs only
      console.log(`Testing: ${url}`)
      const startTime = Date.now()

      try {
        const result = await hybridEngine.extract(url)
        const processingTime = Date.now() - startTime

        results.push({
          url,
          success: true,
          method: result.extractionMethod,
          strategy: result.processingDetails.strategy.reasoning,
          contentLength: result.content.length,
          processingTime,
        })

        console.log(
          `✅ Success: ${result.extractionMethod} (${result.content.length} chars, ${processingTime}ms)`
        )
        if (result.fallbackUsed) {
          console.log(`   📋 Used fallback after ${result.primaryAttempts} attempts`)
        }
        console.log(`   💡 Strategy: ${result.processingDetails.strategy.reasoning}`)
      } catch (error) {
        const processingTime = Date.now() - startTime
        results.push({
          url,
          success: false,
          method: 'failed',
          strategy: 'N/A',
          error: error instanceof Error ? error.message : String(error),
          processingTime,
        })

        console.log(
          `❌ Failed: ${error instanceof Error ? error.message : error} (${processingTime}ms)`
        )
      }

      console.log('')
    }

    return results
  }

  async runDiagnostics(): Promise<void> {
    console.log('🔍 Running system diagnostics...\n')

    try {
      const diagnostics = await hybridEngine.runDiagnostics()

      console.log('Playwright Engine:')
      console.log(
        `  Status: ${diagnostics.playwright.available ? '✅ Available' : '❌ Unavailable'}`
      )
      if (diagnostics.playwright.error) {
        console.log(`  Error: ${diagnostics.playwright.error}`)
      }

      console.log('\nJina Engine:')
      console.log(`  Status: ${diagnostics.jina.available ? '✅ Available' : '❌ Unavailable'}`)
      if (diagnostics.jina.error) {
        console.log(`  Error: ${diagnostics.jina.error}`)
      }

      console.log('')
    } catch (error) {
      console.error('Diagnostics failed:', error)
    }
  }

  async runFullTest(): Promise<void> {
    await this.runDiagnostics()

    const results = await this.runBasicTest()

    console.log('📊 Test Summary:')
    console.log(`Total tests: ${results.length}`)
    console.log(`Successful: ${results.filter((r) => r.success).length}`)
    console.log(`Failed: ${results.filter((r) => !r.success).length}`)

    const methods = results.filter((r) => r.success).map((r) => r.method)
    const methodCounts = methods.reduce(
      (acc, method) => {
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    console.log('\nMethods used:')
    Object.entries(methodCounts).forEach(([method, count]) => {
      console.log(`  ${method}: ${count}`)
    })

    const avgTime =
      results
        .filter((r) => r.success && r.processingTime)
        .reduce((sum, r) => sum + (r.processingTime || 0), 0) /
      results.filter((r) => r.success).length

    console.log(`\nAverage processing time: ${Math.round(avgTime)}ms`)

    if (results.some((r) => !r.success)) {
      console.log('\nFailed extractions:')
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`  ${r.url}: ${r.error}`)
        })
    }
  }
}

// Export for testing
export const tester = new ExtractionTester()

// CLI usage
if (require.main === module) {
  tester.runFullTest().catch(console.error)
}
