# Handinger Clone - AI-Powered Web Content Extraction Platform

## Project Overview

This project is a complete clone of Handinger.com - an AI-powered web content extraction service
that converts any URL into structured data formats (AI prompts, content/markdown, metadata,
screenshots) through a simple API and web interface. The platform provides pay-as-you-go
credit-based access to web scraping and AI processing capabilities.

**Key Value Proposition**: Extract website content for AI without coding - making it easy for anyone
to fetch web data for AI agents, summarization, lead enrichment, and knowledge management.

## Current Implementation Status

### ✅ Already Implemented (Foundation)

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Backend**: Convex real-time database and functions
- **Authentication**: Clerk integration with user management
- **Landing Page**: Hero, features, testimonials, pricing, FAQs
- **Dashboard**: Sidebar navigation, charts, data tables, user profile
- **Basic Credit System**: User credits, transactions, balance tracking
- **Payment Integration**: Clerk pricing table integration
- **Theme System**: Dark/light mode with next-themes

### ✅ Recently Implemented (Major Update)

- **🚀 Hybrid Web Extraction Engine**: Intelligent Playwright + Jina AI fallback system
- **🧠 Smart Strategy Selection**: Automatically chooses optimal extraction method per URL
- **🔄 Robust Fallback System**: Jina AI handles complex sites when Playwright fails
- **📊 Enhanced Credit System**: Dynamic complexity detection with detailed extraction metadata
- **🛠️ Production-Ready API**: Comprehensive error handling and diagnostics

### 🔄 Still Missing (Core Handinger Features)

- **AI Processing**: OpenAI integration for content analysis
- **Handinger UI**: Tabbed interface matching Handinger's design
- **Rate Limiting**: Global and per-domain restrictions
- **Caching System**: Content caching for cost optimization
- **File Processing**: PDF, Excel, CSV upload functionality

## Target Architecture (Handinger Clone)

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, shadcn/ui, Tailwind CSS
- **Backend/Database**: Convex (Real-time TypeScript backend)
- **Web Scraping**: Playwright (headless browser automation)
- **AI Integration**: OpenAI GPT-4 for content analysis
- **Authentication**: Clerk (already integrated)
- **Payments**: Stripe + Clerk pricing (already setup)
- **File Storage**: Convex storage for screenshots and uploads
- **Deployment**: Vercel (frontend) + Convex Cloud (backend)

### System Flow

```
User Interface (Next.js + shadcn/ui)
    ↓
Extraction API (Next.js API Routes)
    ↓
Hybrid Extraction Engine (Smart routing)
    ↓ Primary Method    ↓ Fallback Method
Playwright Engine ←→ Jina AI Reader
(Fast, screenshots)   (Complex sites, JS-heavy)
    ↓
OpenAI Processing (AI prompts + Content analysis)
    ↓
Convex Database (Results + Caching)
    ↓
Response (JSON with extracted content + extraction metadata)
```

## 🚀 Hybrid Extraction Engine (Latest Implementation)

### Intelligent Method Selection

The hybrid engine uses a simplified, high-coverage strategy:

**Playwright Primary (Fast & Static)**

- Only for known static sites (Wikipedia, StackOverflow, .edu/.gov/.org domains)
- Speed-optimized for simple, reliable content extraction
- Always has Jina AI fallback

**Jina AI Primary (Comprehensive Coverage)**

- Default for everything else (better success rates)
- Handles all complex sites: docs, social media, SPAs, dynamic content
- Robust against bot detection and JavaScript-heavy sites
- Fallback to Playwright when needed

**Smart Fallback System**

- Playwright → Jina AI fallback for static sites
- Jina AI → Playwright fallback for most sites
- Social media → Jina AI only (no fallback needed)
- Quality validation ensures good results

### Extraction Strategy Examples

```typescript
// Static sites → Playwright primary, Jina fallback
wikipedia.org → {
  primary: 'playwright',
  fallback: 'jina',
  reasoning: 'Static content site, Playwright should handle efficiently'
}

// Social media → Jina only (no fallback)
twitter.com/vercel → {
  primary: 'jina',
  fallback: undefined,
  reasoning: 'Social media platform with heavy bot detection, requires Jina'
}

// Everything else → Jina primary, Playwright fallback (default)
docs.convex.dev → {
  primary: 'jina',
  fallback: 'playwright',
  reasoning: 'Default to robust Jina extraction for comprehensive coverage'
}
```

### Enhanced API Response

New extraction details in API response:

```json
{
  "success": true,
  "result": { "content": "...", "metadata": {...} },
  "extractionDetails": {
    "method": "jina",           // Which method succeeded
    "primaryAttempts": 1,       // How many attempts
    "fallbackUsed": false,      // Whether fallback was needed
    "strategy": "Dynamic content platform, Jina handles JS better"
  },
  "credits": {
    "complexity": "advanced",   // Smart complexity detection
    "cost": 4
  }
}
```

## Core Features to Implement (Based on Handinger)

### 1. AI Prompting (8 credits)

- **Purpose**: Use AI to ask questions or extract specific information from websites
- **Implementation**: Playwright scraping + OpenAI GPT-4 processing
- **UI**: Purple-themed tab with prompt input and {{content}} placeholder
- **Output**: AI-generated response based on website content

### 2. Content Extraction (1-4 credits)

- **Purpose**: Convert websites to clean markdown format
- **Cost**: 1 credit (simple sites), 4 credits (complex JS sites)
- **Implementation**: Playwright + custom markdown converter
- **UI**: Green-themed tab
- **Output**: Clean markdown text ideal for AI training

### 3. Metadata Extraction (1-4 credits)

- **Purpose**: Extract structured data (title, description, images, etc.)
- **Cost**: Same as content (1-4 credits based on complexity)
- **Implementation**: DOM parsing + structured data extraction
- **UI**: Orange-themed tab
- **Output**: JSON with comprehensive metadata

### 4. Screenshot Generation (4 credits)

- **Purpose**: Generate website screenshots for thumbnails/archiving
- **Cost**: Fixed 4 credits regardless of complexity
- **Implementation**: Playwright screenshot capture with optimization
- **UI**: Yellow-themed tab with format/size options
- **Output**: Optimized image files stored in Convex

## Updated Database Schema (Convex)

### Current Schema Extensions Needed

```typescript
// Add to existing convex/schema.ts
export default defineSchema({
  // Keep existing tables: users, paymentAttempts, credits, creditTransactions

  // New tables for Handinger functionality:

  extraction_requests: defineTable({
    userId: v.id('users'),
    url: v.string(),
    extractionType: v.union(
      v.literal('ai_prompt'),
      v.literal('content'),
      v.literal('metadata'),
      v.literal('screenshot')
    ),
    aiPrompt: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('cached')
    ),
    requestId: v.string(), // UUID
    creditsCost: v.number(),
    complexity: v.union(
      v.literal('failed'), // 0 credits
      v.literal('cached'), // 0 credits
      v.literal('normal'), // 1 credit
      v.literal('advanced') // 4 credits
    ),
    processingTime: v.optional(v.number()),
    result: v.optional(
      v.object({
        content: v.optional(v.string()),
        aiResponse: v.optional(v.string()),
        screenshotUrl: v.optional(v.string()),
        metadata: v.optional(
          v.object({
            title: v.string(),
            description: v.string(),
            ogImage: v.optional(v.string()),
            favicon: v.optional(v.string()),
            wordCount: v.optional(v.number()),
            readingTime: v.optional(v.number()),
          })
        ),
      })
    ),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_user_and_status', ['userId', 'status'])
    .index('by_request_id', ['requestId'])
    .index('by_created_at', ['createdAt']),

  content_cache: defineTable({
    urlHash: v.string(), // MD5 of URL
    contentType: v.union(v.literal('content'), v.literal('metadata'), v.literal('screenshot')),
    cachedResult: v.any(),
    expiresAt: v.number(),
    hitCount: v.number(),
    lastAccessed: v.number(),
  })
    .index('by_url_hash_and_type', ['urlHash', 'contentType'])
    .index('by_expires_at', ['expiresAt']),

  rate_limits: defineTable({
    identifier: v.string(), // userId or IP
    type: v.union(v.literal('global'), v.literal('per_domain')),
    domain: v.optional(v.string()),
    requestCount: v.number(),
    windowStart: v.number(),
    resetTime: v.number(),
  })
    .index('by_identifier_and_type', ['identifier', 'type'])
    .index('by_domain', ['domain']),
})
```

## API Endpoints to Implement

### 1. Main Extraction Endpoint

```typescript
// app/api/extract/route.ts
POST /api/extract
{
  url: string,
  type: "ai_prompt" | "content" | "metadata" | "screenshot",
  prompt?: string, // for AI prompting
  options?: {
    waitFor?: number,
    fullPage?: boolean, // screenshots
    format?: "png" | "jpeg", // screenshots
    useCache?: boolean
  }
}

Response:
{
  success: boolean,
  requestId: string,
  cached: boolean,
  credits: {
    cost: number,
    remaining: number,
    complexity: "failed" | "cached" | "normal" | "advanced"
  },
  result: {
    content?: string,      // markdown
    aiResponse?: string,   // AI analysis
    screenshotUrl?: string,
    metadata?: object,
    processingTime: number
  }
}
```

### 2. Web Interface Endpoint

```typescript
// app/api/web/extract/route.ts - For the Handinger-style web UI
POST / api / web / extract
// Same as above but returns web-friendly format with API call example
```

### 3. Status Check Endpoint

```typescript
// app/api/status/[requestId]/route.ts
GET / api / status / [requestId]
// Check processing status for async requests
```

## Updated Credit System (Handinger Model)

### Exact Handinger Pricing

- **Failed websites**: 0 credits (errors, invalid URLs)
- **Cached websites**: 0 credits (recently processed)
- **Normal websites**: 1 credit (static sites)
- **Advanced websites**: 4 credits (JavaScript-heavy sites)
- **Screenshots**: 4 credits (always)
- **AI prompts**: 8 credits (includes content extraction + AI)

### Rate Limiting (Handinger Rules)

- **Global**: 1,000 requests per 60 seconds (all users)
- **Per-domain**: 3 requests per 10 seconds per domain
- **429 errors**: Not charged, retry allowed

### Pay-as-you-go Model

- **No monthly plans**: Pure consumption-based pricing
- **Minimum purchase**: €10 for 20,000 credits (€0.0005 per credit)
- **Free tier**: First 1,000 credits free
- **Linear scaling**: €250 for 500,000 credits
- **No expiry**: Credits never expire

## Implementation Roadmap

### Phase 1: Core Extraction Engine (2-3 weeks)

#### Week 1: Foundation

- [ ] Set up Playwright extraction service
- [ ] Build basic content extraction (HTML to markdown)
- [ ] Implement metadata extraction
- [ ] Create screenshot capture functionality
- [ ] Build complexity detection system

#### Week 2: API Layer

- [ ] Create extraction API endpoints
- [ ] Implement credit deduction system
- [ ] Add rate limiting middleware
- [ ] Build caching layer with Convex
- [ ] Add proper error handling

### Phase 2: AI Integration & UI (2 weeks)

#### Week 3: AI Features

- [ ] Integrate OpenAI for AI prompting
- [ ] Build content analysis pipeline
- [ ] Implement prompt processing logic
- [ ] Add AI response formatting

#### Week 4: Handinger UI

- [ ] Build tabbed extraction interface
- [ ] Create URL input with validation
- [ ] Add result display with API call examples
- [ ] Implement credit balance display
- [ ] Add processing status indicators

### Phase 3: Advanced Features (1-2 weeks)

#### Week 5: Polish & Features

- [ ] Add file upload processing (PDF, Excel, CSV)
- [ ] Implement batch URL processing
- [ ] Add webhook notifications
- [ ] Build admin analytics dashboard
- [ ] Performance optimization

#### Week 6: Launch Prep

- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Documentation
- [ ] Monitoring setup
- [ ] Beta testing

## Key Implementation Files

### New Files to Create

```
/lib/extraction/
  ├── playwright-engine.ts        # Core browser automation
  ├── content-processor.ts        # HTML to markdown
  ├── metadata-extractor.ts       # Structured data extraction
  ├── screenshot-generator.ts     # Image capture
  ├── ai-processor.ts             # OpenAI integration
  ├── complexity-analyzer.ts      # Normal vs advanced detection
  └── cache-manager.ts            # Content caching

/app/api/
  ├── extract/route.ts            # Main extraction endpoint
  ├── web/extract/route.ts        # Web interface endpoint
  └── status/[id]/route.ts        # Status checking

/components/extraction/
  ├── ExtractionTabs.tsx          # Main Handinger-style interface
  ├── AIPromptTab.tsx             # Purple AI tab
  ├── ContentTab.tsx              # Green content tab
  ├── MetadataTab.tsx             # Orange metadata tab
  ├── ScreenshotTab.tsx           # Yellow screenshot tab
  └── ResultDisplay.tsx           # Results with API examples

/convex/
  ├── extractions.ts              # Extraction request functions
  ├── cache.ts                    # Content caching functions
  ├── rateLimits.ts               # Rate limiting logic
  └── analytics.ts                # Usage analytics
```

### Files to Update

```
convex/schema.ts                  # Add extraction tables
convex/userCredit.ts              # Update for Handinger pricing
app/(landing)/page.tsx            # Add extraction demo
components/custom-clerk-pricing.tsx # Update pricing model
middleware.ts                     # Add rate limiting
```

## Environment Variables Needed

```bash
# AI Services
OPENAI_API_KEY=sk-...

# Web Scraping
PLAYWRIGHT_BROWSER_PATH= # Optional custom browser path

# Rate Limiting
RATE_LIMIT_GLOBAL_WINDOW=60000    # 60 seconds
RATE_LIMIT_GLOBAL_MAX=1000        # 1000 requests
RATE_LIMIT_DOMAIN_WINDOW=10000    # 10 seconds
RATE_LIMIT_DOMAIN_MAX=3           # 3 requests

# Caching
CACHE_TTL_HOURS=24
MAX_CACHE_SIZE_MB=100

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
WEBHOOK_SECRET=your-webhook-secret
```

## Success Metrics

### Technical KPIs

- **Uptime**: >99.5% availability
- **Response Time**: <10s for 90% of requests
- **Success Rate**: >85% for valid URLs
- **Cache Hit Rate**: >50%
- **Error Rate**: <15%

### Business KPIs

- **User Growth**: Track signups and active users
- **Credit Consumption**: Monitor usage patterns
- **Revenue**: Track credit purchases
- **API Adoption**: Web vs API usage
- **Feature Usage**: Track most popular extraction types

## Next Steps

1. **Immediate**: Set up Playwright and create basic extraction engine
2. **Week 1**: Build core API endpoints and credit integration
3. **Week 2**: Create Handinger-style tabbed UI
4. **Week 3**: Add AI prompting and advanced features
5. **Week 4**: Polish, test, and launch

This updated roadmap focuses on implementing the core Handinger.com functionality on top of your
existing solid foundation. The main work involves building the web extraction engine, API layer, and
the signature tabbed interface that makes Handinger so user-friendly.
