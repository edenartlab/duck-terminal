import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet, Wallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!;
export const client = createThirdwebClient({ clientId });

export const factoryAddress = "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";

export const socialWallet = inAppWallet({
  auth: {
    options: [
      "email",
      "google",
      "discord",
      "apple",
      "facebook",
      "phone",
      "telegram",
      "passkey",
      "x",
      "coinbase",
      "line",
      "farcaster",
    ],
  },
  metadata: {
    image: {
      src: "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1736328514/eden_piplmq.png",
      width: 350,
      height: 100,
      alt: "Eden Logo",
    },
  },
});

// External wallets: normal EOAs
export const metamask = createWallet("io.metamask");
export const coinbase = createWallet("com.coinbase.wallet");
export const rainbow = createWallet("me.rainbow");
export const rabby = createWallet("io.rabby");
export const zerion = createWallet("io.zerion.wallet");

export const socialWallets: Wallet[] = [socialWallet];

// For the external wallet flow, we list only external wallets.
export const externalWallets: Wallet[] = [
  metamask,
  coinbase,
  rainbow,
  rabby,
  zerion,
];

export const chains = [
  {
    id: 8453,
    rpc: `https://8453.rpc.thirdweb.com/${clientId}`,
  },
];

export { base };

export const duckTokenAddress = "0xe70B3FC80e7f73918742971C6D0F2ed9a73dd11A";
export const recipientAddress = "0xEb8dC1922F92bfAB23b3136b7b10F757BE499D7C";
