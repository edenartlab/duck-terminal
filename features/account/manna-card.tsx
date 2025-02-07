'use client'

import ProductCard from '@/components/card/product-card'
import LoadingIndicator from '@/components/loading-indicator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProductsQuery } from '@/hooks/query/use-products-query'
import { useAuthState } from '@/hooks/use-auth-state'
import sortBy from 'lodash/sortBy'
import React from 'react'

const MannaCard = () => {
  const { balance, subscriptionBalance, foreverBalance } = useAuthState()
  const { products } = useProductsQuery({})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manna</CardTitle>
        <CardDescription>Credits for creating on Eden</CardDescription>
      </CardHeader>
      <CardContent>
        {balance && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Non-expiring</TableCell>
                <TableCell>
                  {(foreverBalance || 0).toLocaleString()} Manna
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Subscription</TableCell>
                <TableCell>
                  {(subscriptionBalance || 0).toLocaleString()} Manna
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{(balance || 0).toLocaleString()} Manna</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
        <CardHeader className="!pl-0 mt-4">
          <CardTitle>Additional Manna</CardTitle>
          <CardDescription>
            You can buy additional manna refills to create more.
          </CardDescription>
        </CardHeader>
        {!products || !products.length ? (
          <LoadingIndicator />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {sortBy(products, 'displayPrice.unit_amount', 'asc').map(
              product => (
                <ProductCard key={product.id} product={product} />
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MannaCard
