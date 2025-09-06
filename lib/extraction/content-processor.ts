import TurndownService from 'turndown'

export class ContentProcessor {
  private turndownService: TurndownService

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      hr: '---',
      br: '  ',
    })

    // Add custom rules for better conversion
    this.turndownService.addRule('removeScripts', {
      filter: ['script', 'style'],
      replacement: () => '',
    })

    this.turndownService.addRule('cleanLinks', {
      filter: 'a',
      replacement: (content, node) => {
        const href = (node as HTMLAnchorElement).getAttribute('href')
        if (!href) return content
        return `[${content}](${href})`
      },
    })

    this.turndownService.addRule('cleanImages', {
      filter: 'img',
      replacement: (content, node) => {
        const src = (node as HTMLImageElement).getAttribute('src')
        const alt = (node as HTMLImageElement).getAttribute('alt') || ''
        if (!src) return ''
        return `![${alt}](${src})`
      },
    })
  }

  htmlToMarkdown(html: string): string {
    try {
      // Clean up the HTML first
      const cleanedHtml = this.cleanHtml(html)
      return this.turndownService.turndown(cleanedHtml)
    } catch (error) {
      console.error('Error converting HTML to Markdown:', error)
      return 'Error converting content to Markdown'
    }
  }

  private cleanHtml(html: string): string {
    // Remove script and style tags
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

    // Remove comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')

    // Remove unwanted elements
    const unwantedSelectors = [
      'nav',
      'header',
      'footer',
      '.advertisement',
      '.ads',
      '.sidebar',
      '.menu',
      '.navigation',
      '.navbar',
    ]

    // This is a simplified approach - in a real implementation,
    // you'd want to use a proper HTML parser
    unwantedSelectors.forEach((selector) => {
      const regex = new RegExp(
        `<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*>.*?</[^>]*>`,
        'gi'
      )
      cleaned = cleaned.replace(regex, '')
    })

    return cleaned
  }

  extractTextContent(html: string): string {
    try {
      // Simple text extraction - remove all HTML tags
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    } catch (error) {
      console.error('Error extracting text content:', error)
      return 'Error extracting text content'
    }
  }
}

export const contentProcessor = new ContentProcessor()
