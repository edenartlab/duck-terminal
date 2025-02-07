'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { client, wallets } from '@/lib/thirdweb/config'
import { handleConnectWallet } from '@/lib/thirdweb/utils'
import { ConnectEmbed } from 'thirdweb/react'
import { useTheme } from 'next-themes'
import { checkAuth } from '@/lib/actions/thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import { factoryAddress } from '@/lib/thirdweb/config'
const SignInThemed = () => {
  const router = useRouter()
  const { updateAuthState } = useAuth()
  const { theme } = useTheme()
  const chain = baseSepolia
  const thirdwebTheme = theme === 'dark' || theme === 'light' ? theme : undefined
  return (
    <ConnectEmbed
      client={client}
      wallets={wallets}
      modalSize="wide"
      theme={thirdwebTheme}
      accountAbstraction={{
        factoryAddress,
        sponsorGas: true,
        chain: chain,
      }}
      chain={chain}
      onConnect={async wallet => {
        const { isSignedIn } = await checkAuth()
        if (!isSignedIn) {
          const result = await handleConnectWallet(wallet)
          const { isSignedIn, userId } = result
          updateAuthState({ isSignedIn: isSignedIn, userId, isLoaded: true })
          router.push('/duck')
        }
      }}
    />
  )
}

export default SignInThemed
