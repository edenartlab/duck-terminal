'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React from 'react'
import { ChainProvider, ChainIcon } from 'thirdweb/react'
import { client, chain, duckTokenAddress } from '@/lib/thirdweb/config'
import { useWalletDetailsModal } from 'thirdweb/react'
import { useActiveWallet } from 'thirdweb/react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/auth-context'


const ActiveChainIcon = () => {
  const wallet = useActiveWallet()
  const { isSignedIn } = useAuth()
  const detailsModal = useWalletDetailsModal();
  const { theme } = useTheme()

  return (
    <>
      {isSignedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger title="View balances" asChild>
            <Button variant="ghost" className="text-xs flex focus:!ring-0"
              onClick={() => {
                if (wallet) {
                  detailsModal.open({
                    client,
                    theme: theme as "light" | "dark",
                    connectedAccountAvatarUrl: "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1736328514/eden_piplmq.png",
                    hideDisconnect: true,
                    hideBuyFunds: true,
                    // hideSwitchWallet: true,
                    chains: [chain],
                    supportedTokens: {
                      8453: [
                        {
                          address: duckTokenAddress,
                          name: "DuckToken",
                          symbol: "DUCK",
                          icon: 'https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737522933/mechanical_duck_rqoik0.webp',
                        },
                      ],
                    },
                    footer: () => <div>custom-footer</div>,
                  });
                }
              }}
            >
              < ChainProvider chain={chain} >
                <ChainIcon className="w-4 focus:!ring-0" client={client} />
              </ChainProvider>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      ) : (
        null
      )}
    </>
  )
}

export default ActiveChainIcon

