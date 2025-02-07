'use client'

import { useAuthState } from '@/hooks/use-auth-state'
import useLocalStorage from '@/hooks/use-local-storage'
import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function DailyLoginProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [nextBonusAvailableQuery, setNextBonusAvailable] =
    useLocalStorage<string>('nextBonusAvailable', '')
  const hasRun = useRef(false)

  const { user, refetchMe, isSignedIn } = useAuthState()

  useEffect(() => {
    if (
      !isSignedIn ||
      !user ||
      nextBonusAvailableQuery.isLoading ||
      hasRun.current
    ) {
      return
    }

    const oneDayInMs = 24 * 60 * 60 * 1000

    if (nextBonusAvailableQuery.data) {
      const lastDailyLogin = parseInt(nextBonusAvailableQuery.data)
      const now = Date.now()

      if (now < lastDailyLogin + oneDayInMs) {
        hasRun.current = true
        return
      }
    }

    const claimDailyLoginBonus = async () => {
      hasRun.current = true
      const response = await axios.post('/api/auth/daily-login')
      const { claimed, lastDailyLogin } = response.data

      if (claimed) {
        const nextBonusAvailable = Date.now() + oneDayInMs
        setNextBonusAvailable(nextBonusAvailable.toString())
        toast.success('Daily login bonus claimed!', {
          description: `You earned ${claimed} Manna!`,
          dismissible: true,
          richColors: true,
        })
        await refetchMe()
      } else {
        const nextBonusAvailable =
          new Date(lastDailyLogin).getTime() + oneDayInMs
        setNextBonusAvailable(nextBonusAvailable.toString())
      }
    }

    claimDailyLoginBonus()
  }, [isSignedIn, user, nextBonusAvailableQuery])

  return <>{children}</>
}
