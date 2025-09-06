import { chromium, type Browser } from 'playwright'

export interface ExtractionResult {
  content: string
  metadata: {
    title: string
    description: string
    ogImage?: string
    favicon?: string
    wordCount: number
    readingTime: number
    url: string
  }
  screenshot?: Buffer
  html: string
}

export class PlaywrightExtractionEngine {
  private browser: Browser | null = null

  async initialize() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }
  }

  async extract(url: string): Promise<ExtractionResult> {
    await this.initialize()

    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page = await this.browser.newPage()

    try {
      // Set user agent to avoid bot detection
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      })

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // Wait a bit for dynamic content to load
      await page.waitForTimeout(2000)

      // Extract content and metadata
      const result = await page.evaluate(() => {
        // Get basic metadata
        const title = document.title || ''
        const description =
          document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
        const ogImage =
          document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
        const favicon =
          document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
          document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
          ''

        // Get main content (try to find the main content area)
        const mainContent =
          document.querySelector('main') ||
          document.querySelector('article') ||
          document.querySelector('[role="main"]') ||
          document.querySelector('.content') ||
          document.querySelector('#content') ||
          document.body

        // Remove unwanted elements
        const unwantedSelectors = [
          'script',
          'style',
          'nav',
          'header',
          'footer',
          '.advertisement',
          '.ads',
          '.sidebar',
          '.menu',
          '.navigation',
          '.navbar',
          '.footer',
        ]

        unwantedSelectors.forEach((selector) => {
          const elements = mainContent.querySelectorAll(selector)
          elements.forEach((el) => el.remove())
        })

        const content = mainContent.innerText || mainContent.textContent || ''
        const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
        const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute

        return {
          content: content.trim(),
          metadata: {
            title,
            description,
            ogImage,
            favicon,
            wordCount,
            readingTime,
            url: window.location.href,
          },
          html: document.documentElement.outerHTML,
        }
      })

      // Take screenshot
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png',
      })

      return {
        ...result,
        screenshot: screenshot,
      }
    } finally {
      await page.close()
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

// Singleton instance
export const extractionEngine = new PlaywrightExtractionEngine()
