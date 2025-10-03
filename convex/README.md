# Convex Extraction System

## Migration Summary

The extraction system has been successfully migrated from the `@extractor/` library to use Convex
actions with caching. This provides better performance, reliability, and caching capabilities.

## Architecture

### Core Components

1. **`fetcherLLM.ts`** - Enhanced internal action that handles Jina AI API calls
2. **`extract.ts`** - Public action that provides the extraction interface
3. **`cache.ts`** - Action cache configuration for performance optimization

### Extraction Types Supported

| User Format  | Jina API Format | Description                   |
| ------------ | --------------- | ----------------------------- |
| `ai_prompt`  | `content`       | AI-powered content extraction |
| `content`    | `content`       | Plain text content extraction |
| `metadata`   | `json`          | Page metadata as JSON object  |
| `screenshot` | `screenshot`    | Page screenshot generation    |

## Cache Configuration

- **Primary Cache**: 7-day TTL for general extraction results
- **Fast Cache**: 2-hour TTL for frequently changing content
- **Cache Key**: Based on URL and format parameters

## Usage

### From Frontend (React)

```typescript
import { useAction } from 'convex/react'
import { api } from '@/convex/_generated/api'

const extract = useAction(api.extract.extract)

const result = await extract({
  url: 'https://example.com',
  format: 'content',
})
```

### From API Route

```typescript
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const result = await convex.action(api.extract.extract, {
  url: 'https://example.com',
  format: 'content',
})
```

## Response Format

All extraction calls return:

```typescript
{
  success: boolean
  data?: string | object
  usage?: { tokens: number }
  processingTime: number
  error?: string
}
```

## Performance Features

- **Caching**: Results cached for 7 days by default
- **Timeout**: 30-second timeout for API calls
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Validation**: URL and parameter validation before processing

## Environment Variables

- `JINA_AI_KEY` - Required for Jina AI API access
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL

## Migration Benefits

1. **Caching**: Automatic result caching reduces API calls and costs
2. **Type Safety**: Full TypeScript support with Convex validators
3. **Reliability**: Built-in retry mechanisms and error handling
4. **Performance**: Convex's optimized action execution
5. **Monitoring**: Better logging and observability
6. **Scalability**: Convex handles scaling automatically
