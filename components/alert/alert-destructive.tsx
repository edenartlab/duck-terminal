import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  title?: string
}

const AlertDestructive = ({ title, children }: Props) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold">{title || 'Error'}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export default AlertDestructive
