import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import type { WebhookEvent } from '@clerk/backend'
import { Webhook } from 'svix'
import { transformWebhookData } from './paymentAttemptTypes'

const http = httpRouter()

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request)
    if (!event) {
      return new Response('Error occured', { status: 400 })
    }
    switch ((event as any).type) {
      case 'user.created': // intentional fallthrough
      case 'user.updated':
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data as any,
        })
        break

      case 'user.deleted': {
        const clerkUserId = (event.data as any).id!
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId })
        break
      }

      case 'paymentAttempt.updated': {
        const paymentAttemptData = transformWebhookData((event as any).data)
        console.log('paymentAttempt.updated:', paymentAttemptData)
        await ctx.runMutation(internal.paymentAttempts.savePaymentAttempt, {
          paymentAttemptData,
        })
        // Award credits on successful payment attempt
        if (paymentAttemptData.paid_at) {
          const planSlug = paymentAttemptData.subscription_items?.[0]?.plan?.slug
          const creditAmounts: Record<string, number> = {
            starter: 500,
            basic: 1500,
            pro: 3500,
            custom: 1500,
          }
          const amount = creditAmounts[planSlug as keyof typeof creditAmounts]
          if (amount) {
            await ctx.runMutation(internal.userCredit.addCreditsByExternalId, {
              externalUserId: paymentAttemptData.payer.user_id,
              amount,
              planType: planSlug,
            } as any)
          }
        }
        break
      }

      case 'session.created': {
        const clerkUserId = (event.data as any).user_id!
        const subscription = (event as any).data.object
        console.log('checkout.session.completed:', event, clerkUserId)

        // Here we need to add credits for the user based on the subscription plan ie Map plan types to credit amounts
          const creditAmounts = {
            starter: 500,
            basic: 1500,
            pro: 3500,
            custom: 1500,
          }
          
          const planType = subscription.items.data[0].price.lookup_key
          const creditAmount = creditAmounts[planType as keyof typeof creditAmounts]
          await ctx.runMutation(internal.userCredit.addCredits, {
            userId: clerkUserId,
            amount: creditAmount,
            planType: planType,
          })
        break
      }
     

      default:
        console.log('Ignored webhook event', (event as any).type)
    }

    return new Response(null, { status: 200 })
  }),
})

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text()
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent
  } catch (error) {
    console.error('Error verifying webhook event', error)
    return null
  }
}

export default http
