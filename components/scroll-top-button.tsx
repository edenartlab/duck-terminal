'use client'

import { Button } from '@/components/ui/button'
import { useWindowScroll } from '@/hooks/use-window-scroll'
import { ArrowUpIcon } from 'lucide-react'

const ScrollTopButton = () => {
  const [scroll, scrollTo] = useWindowScroll()

  if (scroll.y < 700) {
    return null
  }

  return (
    <Button
      data-test-id="scroll-top-button"
      variant="outline"
      size="icon"
      className="rounded-full sticky left-4 bottom-4"
      onClick={() => scrollTo({ top: 0 })}
    >
      <ArrowUpIcon className="h-5 w-5" />
    </Button>
  )
}

export default ScrollTopButton
