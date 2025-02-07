import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthState } from '@/hooks/use-auth-state'
import { cn } from '@/lib/utils'
import { CoinsIcon } from 'lucide-react'
import React from 'react'

type Props = {
  cost: number
}

const CostIndicatorV2: React.FC<Props> = ({ cost }) => {
  const { balance } = useAuthState()

  return (
    <TooltipProvider delayDuration={125}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer flex items-center justify-center">
            <div
              className={cn([
                'flex items-center justify-center text-xs',
                balance < cost ? 'text-destructive' : '',
              ])}
            >
              <CoinsIcon className="mr-1.5 h-4 w-4" />
              <span className="font-mono">{Math.floor(cost) || 1}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Estimated Manna cost for this configuration
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CostIndicatorV2
