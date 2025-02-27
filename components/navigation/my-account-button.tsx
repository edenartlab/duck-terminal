"use client";

import { useRouter } from "next/navigation";
import RedeemVoucherForm from "@/components/form/redeem-voucher-form";
import DiscordIcon from "@/components/icons/discord";
import TwitterIcon from "@/components/icons/twitter";
import DialogMenuItem from "@/components/modal/dialog-menu-item";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/loading-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user/user-avatar";
import { useMe } from "@/hooks/use-me";
import { useAuth } from "@/contexts/auth-context";
import { siteConfig } from "@/lib/config";
import { subscriptionTierNameMap } from "@/lib/strings";
import { client, wallets } from "@/lib/thirdweb/config";
import {
  handleConnectWallet,
  handleDisconnectWallet,
} from "@/lib/thirdweb/utils";
import { checkAuth } from "@/lib/actions/thirdweb";
import { useTheme } from "next-themes";
import { SubscriptionTier } from "@edenlabs/eden-sdk";
import { useDisconnect, useActiveWallet, ConnectButton } from "thirdweb/react";
import {
  BookmarkIcon,
  BotIcon,
  ComponentIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  TicketIcon,
  UserIcon,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { forwardRef, useRef, useState } from "react";
import { useWalletDetailsModal } from "thirdweb/react";
import { chain, duckTokenAddress } from "@/lib/thirdweb/config";

const ThemeToggleForwardWrap = forwardRef<HTMLDivElement>(
  ({ ...rest }, ref) => (
    <div ref={ref} className="w-full">
      <ThemeToggle {...rest} label={"Theme"} />
    </div>
  )
);
ThemeToggleForwardWrap.displayName = "ThemeToggleForwardWrap";

const AccountDropdown = () => {
  const router = useRouter();
  const { isSignedIn, updateAuthState } = useAuth();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  const detailsModal = useWalletDetailsModal();
  const { theme } = useTheme();
  const { user, balance } = useMe({
    isAuthenticated: !!isSignedIn,
  });
  const userId = user?.userId;

  const logout = async () => {
    if (wallet) disconnect(wallet);
    await handleDisconnectWallet();
    updateAuthState({ isSignedIn: false, userId: "", isLoaded: false });
    router.push("/sign-in");
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusRef = useRef<HTMLButtonElement | null>(null);

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current;
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open);
    if (!open) {
      setDropdownOpen(false);
    }
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={dropdownTriggerRef}
          className="rounded-full group relative z-10 focus:!ring-0"
          size="icon"
          variant="secondary"
        >
          <UserAvatar
            image={user?.userImage}
            name={user?.username}
            className="w-10 h-10"
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60"
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            (focusRef.current as HTMLButtonElement).focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DropdownMenuItem className="cursor-pointer group" asChild>
          <Link
            href={`/creators/${user?.username}`}
            className="group flex gap-2 items-center cursor-pointer "
          >
            <UserAvatar
              image={user?.userImage}
              name={user?.username}
              className="h-8 w-8"
            />
            <div className="flex flex-col justify-center min-w-0">
              <div className="group-hover:text-primary text-xs transition-colors">
                {user?.username
                  ? `${user.username.slice(0, 4)}...${user.username.slice(-4)}`
                  : ""}
              </div>
              {user?.email ? (
                <span className="text-xs text-muted-foreground/70 truncate">
                  {user?.email}
                </span>
              ) : null}
            </div>
          </Link>
          {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link
            href={"/settings/subscription"}
            className="flex items-center justify-between w-full"
          >
            <div className="capitalize text-xs">
              <span>
                {
                  subscriptionTierNameMap[
                    user?.subscriptionTier || SubscriptionTier.Free
                  ]
                }
              </span>
              <span className="ml-1 text-muted-foreground/70">plan</span>
            </div>
            <div className="text-xs">
              <span>{Number((balance || 0).toFixed(0)).toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground/70">manna</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (wallet) {
              detailsModal.open({
                client,
                theme: theme as "light" | "dark",
                connectedAccountAvatarUrl:
                  "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1736328514/eden_piplmq.png",
                hideDisconnect: true,
                hideSwitchWallet: true,
                chains: [chain],
                supportedTokens: {
                  8453: [
                    {
                      address: duckTokenAddress,
                      name: "DuckToken",
                      symbol: "DUCK",
                      icon: "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737522933/mechanical_duck_rqoik0.webp",
                    },
                  ],
                },
              });
            }
          }}
        >
          <div className="group flex gap-2 items-center cursor-pointer ">
            <Wallet className="h-4 w-4" />
            <span>
              {userId ? `${userId.slice(0, 4)}...${userId.slice(-4)}` : ""}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/creators/${user?.username}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
          {/*<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/creators/${user?.username}?tab=models`}>
            <ComponentIcon className="mr-2 h-4 w-4" />
            <span>Models</span>
          </Link>
          {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/creators/${user?.username}?tab=collections`}>
            <BookmarkIcon className="mr-2 h-4 w-4" />
            <span>Collections</span>
          </Link>
          {/*<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/creators/${user?.username}?tab=agents`}>
            <BotIcon className="mr-2 h-4 w-4" />
            <span>Agents</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/settings/subscription`}>
            <CreditCardIcon className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </Link>
        </DropdownMenuItem>
        <DialogMenuItem
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
          triggerChildren={
            <>
              <TicketIcon className="mr-2 h-4 w-4" />
              <span>Redeem Voucher</span>
            </>
          }
        >
          <RedeemVoucherForm />
        </DialogMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/settings/account`}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <ThemeToggleForwardWrap />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {/*<DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="pl-2">
          <div className="flex items-center w-full">
            <Link
              className="text-xs hover:underline text-muted-foreground"
              href={`https://docs.eden.art/docs/overview/tos`}
              prefetch={false}
            >
              <span>Terms</span>
            </Link>

            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size={"icon"} asChild>
                <Link
                  href={siteConfig.links.discord}
                  target="_blank"
                  className="filter grayscale hover:grayscale-0"
                >
                  <DiscordIcon size={20} />
                </Link>
              </Button>
              <Button variant="ghost" size={"icon"} asChild>
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  className="group grayscale hover:grayscale-0 hover:text-white"
                >
                  <TwitterIcon
                    size={18}
                    className="brightness-50 group-hover:!brightness-100"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LoginButton = () => {
  const router = useRouter();
  const { updateAuthState, isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();
  const thirdwebTheme =
    theme === "dark" || theme === "light" ? theme : undefined;
  return (
    <>
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={thirdwebTheme}
        /**
        accountAbstraction={{
          factoryAddress,
          sponsorGas: true,
          chain: chain,
        }}
        */
        chain={chain}
        connectModal={{
          size: "wide",
        }}
        connectButton={{
          style: {
            minWidth: "69px",
            height: "40px",
          },
          label: "Login",
        }}
        detailsButton={{
          render: () => <LoadingIndicator />,
        }}
        onConnect={async (wallet) => {
          const { isSignedIn } = await checkAuth();
          if (!isSignedIn) {
            const result = await handleConnectWallet(wallet);
            updateAuthState({ ...result, isLoaded: true });
            router.push("/duck");
          }
        }}
      />
    </>
  );
};
const MyAccountButton = () => {
  const { isSignedIn } = useAuth();
  return <>{isSignedIn ? <AccountDropdown /> : <LoginButton />}</>;
};

export default MyAccountButton;
