'use client'

import { useMe } from '@/hooks/use-me'
import { useAuth } from '@/contexts/auth-context'
import { useLoginModal } from '@/hooks/use-connect-modal'
import { useCookies } from 'react-cookie';

export function useAuthState() {
  const { isSignedIn } = useAuth()
  const { connectWallet } = useLoginModal();
  const [cookies] = useCookies(['jwt']);

  const {
    user,
    balance,
    foreverBalance,
    subscriptionBalance,
    hasMinimumSubscriptionTier,
    invalidate,
  } = useMe({ isAuthenticated: !!isSignedIn })

  const verifyAuth = async () => {
    if (isSignedIn) {
      return true
    }
    connectWallet()
    return false
  }
  const getToken = async () => {
    const token = cookies.jwt;
    return token
  }
  return {
    getToken,
    verifyAuth,
    user,
    balance,
    foreverBalance,
    subscriptionBalance,
    hasMinimumSubscriptionTier,
    isSignedIn,
    refetchMe: invalidate,
  }
}
