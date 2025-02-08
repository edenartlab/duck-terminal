'use client'

import SubscriptionCard from '@/components/card/subscription-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProductsQuery } from '@/hooks/query/use-products-query'
import sortBy from 'lodash/sortBy'
import React from 'react'

const SubscriptionsCard = () => {
  const { subscriptions } = useProductsQuery({})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Your subscription tier.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {sortBy(subscriptions, 'displayPrice.unit_amount', 'asc').map(
            subscription => (
              <SubscriptionCard key={subscription.id} product={subscription} />
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SubscriptionsCard
