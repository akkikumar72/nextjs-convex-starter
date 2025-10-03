import { internalMutation, QueryCtx, query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getCurrentUser } from './users'

// Get users basic credit info
export const getUserCredits = query({
  args: { userId: v.optional(v.id('users')) },
  returns: v.union(v.number(), v.null()),
  handler: async (ctx, args) => {
    let targetUserId = args.userId

    if (!targetUserId) {
      const me = await getCurrentUser(ctx)
      if (!me) return null
      targetUserId = me._id
    }

    const creditRecord = await ctx.db
      .query('credits')
      .withIndex('byUserId', (q) => q.eq('userId', targetUserId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    return creditRecord?.balance ?? null
  },
})

// Add credits (internal func for webhooks)
export const addCredits = internalMutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    planType: v.union(
      v.literal('starter'),
      v.literal('basic'),
      v.literal('pro'),
      v.literal('custom')
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if user has existing credit record
    const existingCreditRecord = await ctx.db
      .query('credits')
      .withIndex('byUserId', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    if (existingCreditRecord) {
      // update existing credit record
      await ctx.db.patch(existingCreditRecord._id, {
        balance: existingCreditRecord.balance + args.amount,
        planType: args.planType,
      })
    } else {
      // create a new credit record
      await ctx.db.insert('credits', {
        userId: args.userId,
        balance: args.amount,
        planType: args.planType,
        isActive: true,
      })
    }

    // Log the credit transaction
    await ctx.db.insert('creditTransactions', {
      userId: args.userId,
      type: 'purchase',
      amount: args.amount,
      description: `Purchase of ${args.amount} credits for ${args.planType} plan`,
      timestamp: Date.now(),
    })

    return null
  },
})

// Add credits by Clerk external user id (for webhooks)
export const addCreditsByExternalId = internalMutation({
  args: {
    externalUserId: v.string(),
    amount: v.number(),
    planType: v.union(
      v.literal('starter'),
      v.literal('basic'),
      v.literal('pro'),
      v.literal('custom')
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', args.externalUserId))
      .unique()

    if (!user) {
      console.warn('addCreditsByExternalId: No user for externalId', args.externalUserId)
      return null
    }

    // Reuse the existing logic to upsert credits and log transaction
    const existingCreditRecord = await ctx.db
      .query('credits')
      .withIndex('byUserId', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    if (existingCreditRecord) {
      await ctx.db.patch(existingCreditRecord._id, {
        balance: existingCreditRecord.balance + args.amount,
        planType: args.planType,
      })
    } else {
      await ctx.db.insert('credits', {
        userId: user._id,
        balance: args.amount,
        planType: args.planType,
        isActive: true,
      })
    }

    await ctx.db.insert('creditTransactions', {
      userId: user._id,
      type: 'purchase',
      amount: args.amount,
      description: `Purchase of ${args.amount} credits for ${args.planType} plan`,
      timestamp: Date.now(),
    })

    return null
  },
})

// Deduct credits (public mutation for testing/usage)
export const deductCredits = mutation({
  args: {
    amount: v.number(),
  },
  returns: v.union(v.number(), v.null()),
  handler: async (ctx, args) => {
    const me = await getCurrentUser(ctx)
    if (!me) return null

    const creditRecord = await ctx.db
      .query('credits')
      .withIndex('byUserId', (q) => q.eq('userId', me._id))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    if (!creditRecord) return null

    const deduction = Math.max(0, args.amount)
    const newBalance = Math.max(0, creditRecord.balance - deduction)

    await ctx.db.patch(creditRecord._id, { balance: newBalance })

    await ctx.db.insert('creditTransactions', {
      userId: me._id,
      type: 'usage',
      amount: deduction,
      description: `Manual deduction of ${deduction} credits`,
      timestamp: Date.now(),
    })

    return newBalance
  },
})
