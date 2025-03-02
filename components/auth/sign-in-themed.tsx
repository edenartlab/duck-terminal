"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { client, wallets, chain } from "@/lib/thirdweb/config";
import { handleConnectWallet } from "@/lib/thirdweb/utils";
import { ConnectEmbed } from "thirdweb/react";
import { useTheme } from "next-themes";
import { checkAuth } from "@/lib/actions/thirdweb";

const SignInThemed = () => {
  const router = useRouter();
  const { updateAuthState } = useAuth();
  const { theme } = useTheme();
  const thirdwebTheme =
    theme === "dark" || theme === "light" ? theme : undefined;

  return (
    <ConnectEmbed
      client={client}
      wallets={wallets}
      modalSize="wide"
      theme={thirdwebTheme}
      chain={chain}
      /**
       * We do NOT pass accountAbstraction here,
       * so external wallets (like Metamask) remain normal EOAs.
       */
      onConnect={async (wallet) => {
        // Check if user is already signed in
        const { isSignedIn } = await checkAuth();
        if (!isSignedIn) {
          // If not signed in, handle the sign-in flow
          const result = await handleConnectWallet(wallet);
          if (!result) return; // something went wrong

          const { isSignedIn: signed, userId } = result;
          updateAuthState({ isSignedIn: signed, userId, isLoaded: true });
          router.push("/duck");
        }
      }}
    />
  );
};

export default SignInThemed;
