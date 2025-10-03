'use client'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'

export function SectionCards() {
  const credits = useQuery(api.userCredit.getUserCredits, {})
  const deductCredits = useMutation(api.userCredit.deductCredits)

  const creditsDisplay = credits === undefined ? '…' : new Intl.NumberFormat().format(credits ?? 0)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Credits Left</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {creditsDisplay}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
            <Button variant="outline" size="sm" onClick={() => deductCredits({ amount: 1 })}>
              Deduct 1
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
