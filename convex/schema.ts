import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { paymentAttemptSchemaValidator } from './paymentAttemptTypes'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index('byExternalId', ['externalId']),

  paymentAttempts: defineTable(paymentAttemptSchemaValidator)
    .index('byPaymentId', ['payment_id'])
    .index('byUserId', ['userId'])
    .index('byPayerUserId', ['payer.user_id']),

  // Credits table
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
  }).index('byUserId', ['userId']),

  // credits history table
  creditTransactions: defineTable({
    userId: v.id('users'),
    type: v.union(v.literal('purchase'), v.literal('expiry'), v.literal('usage')),
    amount: v.number(),
    description: v.string(),
    timestamp: v.number(),
  }).index('byUserId', ['userId']),
})
