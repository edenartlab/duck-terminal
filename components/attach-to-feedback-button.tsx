'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageCircleWarningIcon } from 'lucide-react'
import { FC, useRef } from 'react'

type Props = {
  className?: string
}

const AttachToFeedbackButton: FC<Props> = ({ className }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <Button
      data-test-id="sentry-feedback-trigger-anchor"
      variant="outline"
      size={'sm'}
      type="button"
      ref={buttonRef}
      className={cn(['text-sm', className])}
    >
      <MessageCircleWarningIcon className="w-5 h-5 mr-2 md:mr-0 lg:mr-2" />
      <div className="block md:hidden lg:block">Feedback</div>
    </Button>
  )
}

export default AttachToFeedbackButton
