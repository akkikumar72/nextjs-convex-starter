export interface WebsiteMetadata {
  title: string
  description: string
  ogImage?: string
  favicon?: string
  wordCount: number
  readingTime: number
  url: string
  author?: string
  publishedDate?: string
  modifiedDate?: string
  keywords?: string[]
  language?: string
  canonicalUrl?: string
  image?: string
  logo?: string
  date?: string
  datePublished?: string
  dateModified?: string
  feed?: string
  socialMedia?: {
    twitter?: {
      card?: string
      site?: string
      creator?: string
    }
    facebook?: {
      appId?: string
    }
  }
}

export class MetadataExtractor {
  extractMetadata(html: string, url: string): WebsiteMetadata {
    // Check if this is HTML or plain text content
    const isHtml = html.includes('<') && html.includes('>')

    if (!isHtml) {
      // Handle plain text content (from Jina AI)
      return this.extractFromPlainText(html, url)
    }

    // Handle HTML content (from Playwright)
    return this.extractFromHtml(html, url)
  }

  private extractFromPlainText(content: string, url: string): WebsiteMetadata {
    const lines = content.split('\n').filter((line) => line.trim().length > 0)

    // Extract title from first line or heading
    let title = ''
    if (lines.length > 0) {
      const firstLine = lines[0].trim()
      if (firstLine.length > 0 && firstLine.length < 200) {
        title = firstLine
      }
    }

    // Extract description from first paragraph
    let description = ''
    const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 0)
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0].trim()
      if (firstParagraph.length > 10 && firstParagraph.length < 500) {
        description = firstParagraph
      }
    }

    // Calculate word count and reading time
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
    const readingTime = Math.ceil(wordCount / 200)

    // Generate image URL (placeholder for now)
    const image = this.generateImageUrl(url)

    return {
      title,
      description,
      wordCount,
      readingTime,
      url,
      image,
      logo: image,
      socialMedia: {
        twitter: {},
        facebook: {},
      },
    }
  }

  private extractFromHtml(html: string, url: string): WebsiteMetadata {
    // Create a temporary DOM parser (simplified approach)
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    const descriptionMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
    )
    const description = descriptionMatch ? descriptionMatch[1].trim() : ''

    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i
    )
    const ogImage = ogImageMatch ? ogImageMatch[1].trim() : undefined

    const faviconMatch = html.match(
      /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']*)["']/i
    )
    const favicon = faviconMatch ? faviconMatch[1].trim() : undefined

    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']*)["']/i)
    const author = authorMatch ? authorMatch[1].trim() : undefined

    const publishedDateMatch = html.match(
      /<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']*)["']/i
    )
    const publishedDate = publishedDateMatch ? publishedDateMatch[1].trim() : undefined

    const modifiedDateMatch = html.match(
      /<meta[^>]*property=["']article:modified_time["'][^>]*content=["']([^"']*)["']/i
    )
    const modifiedDate = modifiedDateMatch ? modifiedDateMatch[1].trim() : undefined

    const keywordsMatch = html.match(
      /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i
    )
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map((k) => k.trim()) : undefined

    const languageMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i)
    const language = languageMatch ? languageMatch[1].trim() : undefined

    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : undefined

    // Twitter card data
    const twitterCardMatch = html.match(
      /<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i
    )
    const twitterSiteMatch = html.match(
      /<meta[^>]*name=["']twitter:site["'][^>]*content=["']([^"']*)["']/i
    )
    const twitterCreatorMatch = html.match(
      /<meta[^>]*name=["']twitter:creator["'][^>]*content=["']([^"']*)["']/i
    )

    // Facebook app ID
    const facebookAppIdMatch = html.match(
      /<meta[^>]*property=["']fb:app_id["'][^>]*content=["']([^"']*)["']/i
    )

    // Calculate word count and reading time
    const textContent = this.extractTextContent(html)
    const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length
    const readingTime = Math.ceil(wordCount / 200) // Assuming 200 words per minute

    // Generate image URL
    const image = ogImage || this.generateImageUrl(url)

    return {
      title,
      description,
      ogImage,
      favicon,
      wordCount,
      readingTime,
      url,
      author,
      publishedDate,
      modifiedDate,
      keywords,
      language,
      canonicalUrl,
      image,
      logo: image,
      date: publishedDate,
      datePublished: publishedDate,
      dateModified: modifiedDate,
      socialMedia: {
        twitter: {
          card: twitterCardMatch ? twitterCardMatch[1].trim() : undefined,
          site: twitterSiteMatch ? twitterSiteMatch[1].trim() : undefined,
          creator: twitterCreatorMatch ? twitterCreatorMatch[1].trim() : undefined,
        },
        facebook: {
          appId: facebookAppIdMatch ? facebookAppIdMatch[1].trim() : undefined,
        },
      },
    }
  }

  private generateImageUrl(url: string): string {
    // Generate a placeholder image URL similar to Handinger's format
    const encodedUrl = encodeURIComponent(url)
    return `https://images.handinger.com/fimg/${encodedUrl}.png`
  }

  private extractTextContent(html: string): string {
    // Remove script and style tags
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, ' ')

    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim()

    return cleaned
  }
}

export const metadataExtractor = new MetadataExtractor()
