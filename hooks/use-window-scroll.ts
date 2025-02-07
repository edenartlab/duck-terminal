'use client'

import throttle from 'lodash.throttle'
import { useCallback, useLayoutEffect, useState } from 'react'

type ScrollPosition = { x: number; y: number }

export function useWindowScroll(): [
  ScrollPosition,
  (options: ScrollToOptions) => void,
] {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  })

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo(options)
  }, [])

  useLayoutEffect(() => {
    const handleScroll = throttle(() => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY })
    }, 100) // Adjust debounce interval as needed

    handleScroll() // Set initial position on mount
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return [scrollPosition, scrollTo]
}
