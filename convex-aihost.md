# Convex Next.js Project Documentation

## Database Schema

### Users Table

```typescript
users: defineTable({
  name: v.string(),
  externalId: v.string(), // Clerk ID from JWT
}).index('byExternalId', ['externalId'])
```

### Payment Attempts Table

```typescript
paymentAttempts: defineTable(paymentAttemptSchemaValidator)
  .index('byPaymentId', ['payment_id'])
  .index('byUserId', ['userId'])
  .index('byPayerUserId', ['payer.user_id'])
```

### Credits Table

```typescript
credits: defineTable({
  userId: v.id('users'),
  balance: v.number(),
  planType: v.union(
    v.literal('starter'),
    v.literal('basic'),
    v.literal('pro'),
    v.literal('custom')
  ),
  expiresAt: v.optional(v.number()),
  isActive: v.boolean(),
}).index('byUserId', ['userId'])
```

### Credit Transactions Table

```typescript
creditTransactions: defineTable({
  userId: v.id('users'),
  type: v.union(v.literal('purchase'), v.literal('expiry'), v.literal('usage')),
  amount: v.number(),
  description: v.string(),
  timestamp: v.number(),
}).index('byUserId', ['userId'])
```

## Major Features

### ✅ Authentication System (Clerk)

- User authentication via Clerk
- External ID synchronization
- Protected routes in dashboard
- User context in Convex functions

### ✅ Credit Management System

- User credit balance tracking
- Multiple plan types (starter, basic, pro, custom)
- Credit transaction history
- Expiration handling for credits

### ✅ Payment Integration

- Payment attempt tracking
- Multiple payment providers support
- User-specific payment history

### ✅ Content Extraction System (Latest Migration)

- **Jina AI Integration**: Web content extraction via Jina AI API
- **Caching Layer**: Action cache with 7-day TTL for performance
- **Multiple Formats**: Support for ai_prompt, content, metadata, screenshot
- **Error Handling**: Comprehensive error handling with timeout protection
- **Type Safety**: Full TypeScript validation with Convex validators

#### Extraction Flow

1. Client calls `api.extract.extract` action
2. Action maps user format to Jina API format:
   - `ai_prompt` → `content`
   - `content` → `content`
   - `metadata` → `json` (returns structured metadata object)
   - `screenshot` → `screenshot`
3. Cache layer checks for existing results
4. If cache miss, calls `fetchJinaLLM` internal action
5. Results cached and returned to client

### 🏗️ Dashboard Interface

- Extract page with tabbed interface
- Real-time extraction results
- Usage tracking with token information
- Loading states and error handling

## Environment Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex Database
CONVEX_DEPLOY_KEY=
NEXT_PUBLIC_CONVEX_URL=

# Jina AI Extraction
JINA_AI_KEY=

# Payment Processing (if configured)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Recent Migrations

### 2024-12-19: Extraction System Migration

- **From**: `@extractor/` library with direct API calls
- **To**: Convex actions with integrated caching
- **Benefits**:
  - 7-day result caching reduces API costs
  - Better error handling and timeout protection
  - Type-safe validation with Convex
  - Integrated with user credit system
  - Production-grade logging and monitoring

### File Changes:

- `convex/fetcherLLM.ts` - Enhanced with all extraction types
- `convex/extract.ts` - Public extraction action
- `convex/cache.ts` - Action cache configuration
- `app/api/extract/route.ts` - Updated to use Convex
- `app/dashboard/extract/page.tsx` - Fixed response type handling

## Development Notes

- Always read this file before major code changes
- Document new features and schema changes here
- Update migration section for significant refactors
- Use `bun dev` for development (don't start dev server in AI assistance)
- Deploy with `npx convex deploy` for Convex functions

## Next Features Planned

- [ ] Usage analytics dashboard
- [ ] Credit usage optimization
- [ ] Extraction result history
- [ ] Bulk extraction capabilities
- [ ] Custom extraction templates
