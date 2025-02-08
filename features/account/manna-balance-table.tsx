import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import React from 'react'

type Props = {
  subscriptionBalance?: number
  foreverBalance?: number
  totalBalance?: number
}

const MannaBalanceTable = ({
  subscriptionBalance,
  foreverBalance,
  totalBalance,
}: Props) => {
  return (
    <Table className="p-0">
      <TableBody>
        <TableRow>
          <TableCell className="px-3 py-2 text-sm text-muted-foreground">
            Non-expiring
          </TableCell>
          <TableCell className="px-3 py-2 text-xs font-mono text-end">
            {(foreverBalance || 0).toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="px-3 py-2 text-sm text-muted-foreground">
            Subscription
          </TableCell>
          <TableCell className="px-3 py-2 text-xs font-mono text-end">
            {(subscriptionBalance || 0).toLocaleString()}
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="px-3 py-2 text-sm text-muted-foreground">
            Total
          </TableCell>
          <TableCell className="px-3 py-2 text-xs font-mono font-bold text-end">
            {(totalBalance || 0).toLocaleString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default MannaBalanceTable
