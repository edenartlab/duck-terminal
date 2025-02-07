import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'

const LoadingIndicator = ({ className }: { className?: string }) => {
  return (
    <Loader2Icon className={cn('h-8 w-8 text-primary/60 animate-spin', className)} />
  )
}

export default LoadingIndicator