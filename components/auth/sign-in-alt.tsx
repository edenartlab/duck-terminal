"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectEmbed } from "thirdweb/react";
import {
  client,
  socialWallets,
  externalWallets,
  factoryAddress,
  base,
} from "@/lib/thirdweb/alt-config";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { checkAuth } from "@/lib/actions/thirdweb";
import { handleConnectWallet } from "@/lib/thirdweb/utils";
// Import Shadcn UI Tabs components (adjust the import path as needed)
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingIndicator from "@/components/loading-indicator";

export default function SignInDual() {
  const router = useRouter();
  const { updateAuthState } = useAuth();
  const { theme } = useTheme();
  const [showTabs, setShowTabs] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const thirdwebTheme =
    theme === "dark" || theme === "light" ? theme : undefined;

  useEffect(() => {
    setShowTabs(true);
    setLoadingAuth(false);
  }, []);

  // Social login props: enable accountAbstraction so that the inApp wallet becomes a smart account.
  const socialProps = {
    accountAbstraction: {
      chain: base,
      sponsorGas: true,
      factoryAddress: factoryAddress,
    },
    wallets: socialWallets,
  };

  // External wallet props: leave them as normal EOAs.
  const externalProps = {
    wallets: externalWallets,
  };

  const onConnectHandler = async (wallet: any) => {
    const { isSignedIn } = await checkAuth();
    setShowTabs(false);
    setLoadingAuth(true);
    if (!isSignedIn) {
      const result = await handleConnectWallet(wallet);
      if (!result) return;
      const { isSignedIn: justSignedIn, userId } = result;
      updateAuthState({ isSignedIn: justSignedIn, userId, isLoaded: true });
      setLoadingAuth(false);
      router.push("/duck");
    }
  };

  return (
    <div className="pt-4">
      <Tabs defaultValue="social" className="w-full">
        <TabsList className={showTabs ? "flex space-x-4 border-b" : "hidden"}>
          <TabsTrigger value="social" className="px-4 py-2 w-full">
            Social Login
          </TabsTrigger>
          <TabsTrigger value="external" className="px-4 py-2 w-full">
            External Wallet
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="social"
          className="flex items-center justify-center mt-4"
        >
          <ConnectEmbed
            client={client}
            modalSize="compact"
            theme={thirdwebTheme}
            chain={base}
            {...socialProps}
            onConnect={onConnectHandler}
          />
        </TabsContent>
        <TabsContent
          value="external"
          className="flex items-center justify-center mt-4"
        >
          <ConnectEmbed
            client={client}
            modalSize="compact"
            theme={thirdwebTheme}
            chain={base}
            {...externalProps}
            onConnect={onConnectHandler}
          />
        </TabsContent>
      </Tabs>
      {loadingAuth && (
        <div className="flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
}
