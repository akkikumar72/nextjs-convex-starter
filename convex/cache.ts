import { ActionCache } from '@convex-dev/action-cache'
import { components } from './_generated/api'
import { internal } from './_generated/api'
export const fetchLLMActionCache: any = new ActionCache(components.actionCache, {
  action: internal.fetcherLLM.fetchJinaLLM,
  name: 'fetchJinaLLM',
  ttl: 1000 * 60 * 60 * 24 * 7, // 7 days
})
