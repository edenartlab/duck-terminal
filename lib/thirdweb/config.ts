import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet, Wallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!;

export const client = createThirdwebClient({ clientId });
export const chain = {
  id: 8453,
  rpc: `https://8453.rpc.thirdweb.com`,
};

export const chainData = [
  {
    name: "Base",
    chain: {
      id: 8453,
      rpc: `https://8453.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`,
    },
    tokenData: [
      {
        id: 3,
        name: "Ethereum",
        symbol: "ETH",
        address: "",
        image:
          "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737291908/eth_base_ltxyaf.svg",
      },
      {
        id: 4,
        name: "USD Coin",
        symbol: "USDC",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        image:
          "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737291908/usdc_base_lsosir.svg",
      },
    ],
  },
];

export const duckTokenAddress = "0xe70B3FC80e7f73918742971C6D0F2ed9a73dd11A";
export const recipientAddress = "0xEb8dC1922F92bfAB23b3136b7b10F757BE499D7C";
export const factoryAddress = "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";

export const wallets: Wallet[] = [
  inAppWallet({
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
    smartAccount: {
      factoryAddress,
      sponsorGas: true,
      chain: base,
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    walletConfig: {
      options: "eoaOnly",
    },
  }),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];