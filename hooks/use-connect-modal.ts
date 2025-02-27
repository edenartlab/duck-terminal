import { useConnectModal } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb/config"
import { handleConnectWallet } from "@/lib/thirdweb/utils";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from 'next-themes'
import { chain, factoryAddress } from '@/lib/thirdweb/config'
import { redirect } from "next/navigation";

export function useLoginModal() {
  const { connect, isConnecting } = useConnectModal();
  const { updateAuthState } = useAuth();
  const { theme } = useTheme()
  const thirdwebTheme = theme === 'dark' || theme === 'light' ? theme : undefined
  async function connectWallet() {
    const wallet = await connect({
      wallets,
      client,
      // accountAbstraction: {
      //   factoryAddress,
      //   sponsorGas: true,
      //   chain: chain,
      // },
      chain: chain,
      size: "wide",
      theme: thirdwebTheme
    })
    const result = await handleConnectWallet(wallet)
    const { isSignedIn, userId } = result
    updateAuthState({ isSignedIn: isSignedIn, userId, isLoaded: true });
    redirect('/duck')
  }
  return { connectWallet, isConnecting };
}
