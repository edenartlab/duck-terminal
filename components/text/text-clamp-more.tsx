import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import React from 'react'

type Lines = 1 | 2 | 3 | 4 | 5 | 6

type Props = {
  text: string | React.ReactNode
  className?: string
  lines?: Lines
}

type LineClampClasses = {
  [index in Lines]: string
}

const lineClampClasses: LineClampClasses = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
}

const useButtonVisibility = (
  lines: number,
  textRef: RefObject<HTMLDivElement>,
) => {
  const [showButton, setShowButton] = useState(false)

  const checkButtonVisibility = useCallback(() => {
    const element = textRef.current

    if (element) {
      const maxHeight = parseFloat(getComputedStyle(element).lineHeight) * lines

      if (element.scrollHeight > maxHeight) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }
  }, [lines, textRef]) // Dependencies of checkButtonVisibility are lines and textRef

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      checkButtonVisibility()
    }
  }, [checkButtonVisibility]) // Dependency array for useLayoutEffect

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = checkButtonVisibility

      handleResize()

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [checkButtonVisibility]) // Dependency array for useEffect

  return showButton
}
const TextClampMore = ({ text, className, lines = 4 }: Props) => {
  // Clamping lines to a specific acceptable range to avoid improper usage
  const clampedLines = Math.max(1, Math.min(lines, 6)) as Lines

  const [showMore, setShowMore] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const showButton = useButtonVisibility(clampedLines, textRef)

  const buttonToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowMore(!showMore)
  }

  // Early return if no text is provided
  if (!text) return null

  return (
    <div className={className}>
      {' '}
      {/* Applying className to the outermost div */}
      <div
        ref={textRef}
        className={cn([
          !showMore ? lineClampClasses[clampedLines] : 'line-clamp-none',
        ])}
      >
        {text}
      </div>
      {showButton && (
        <div className="flex">
          <Button
            variant="link"
            size="sm"
            className="ml-auto text-xs text-muted-foreground flex items-center cursor-pointer hover:text-accent-foreground h-5"
            onClickCapture={buttonToggle}
          >
            {showMore ? (
              <>
                <MinusIcon className="mr-1 h-3 w-3" />
                Less
              </>
            ) : (
              <>
                <PlusIcon className="mr-1 h-3 w-3" />
                More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default TextClampMore
