# Extractor Module

This module handles website content extraction using the Jina API.

## Structure

- `types.ts` - TypeScript type definitions
- `jina-client.ts` - Jina API client implementation
- `extractor-service.ts` - Main extraction service
- `index.ts` - Module exports

## Usage

```typescript
import { extract } from '@/lib/extractor'

const result = await extract(
  {
    url: 'https://example.com',
    type: 'content',
  },
  Date.now()
)
```

### Direct extraction functions

```typescript
import {
  extractContent,
  extractMarkdown,
  extractHtml,
  extractMetadata,
  extractScreenshot,
  extractWithAI,
} from '@/lib/extractor'

// Extract different formats
const content = await extractContent('https://example.com')
const markdown = await extractMarkdown('https://example.com')
const html = await extractHtml('https://example.com')
const metadata = await extractMetadata('https://example.com', 'custom-api-key')
```

## Extraction Types

- `content` - Extract plain text content
- `markdown` - Extract content as markdown
- `html` - Extract HTML content
- `metadata` - Extract page metadata (JSON)
- `screenshot` - Generate page screenshot
- `ai_prompt` - AI-powered content extraction

## Response Format

All responses include:

- `success` - Operation success status
- `data` - Extracted content (string for content/screenshot, JinaExtractionData for
  metadata/ai_prompt)
- `usage` - Token usage information
- `processingTime` - Processing duration
- `error` - Error message (if failed)

### JinaExtractionData Type

```typescript
interface JinaExtractionData {
  text?: string
  title?: string
  description?: string
  url?: string
  publishedTime?: string
  content?: string
  metadata?: Record<string, unknown>
  external?: Record<string, unknown>
  usage?: JinaUsage
  [key: string]: unknown
}
```
