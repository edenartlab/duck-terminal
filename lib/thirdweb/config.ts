import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet, Wallet } from "thirdweb/wallets";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!;

export const client = createThirdwebClient(
  { clientId }
);
export const chains = [
  {
    id: 8453,
    rpc: `https://8453.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`,
  },
  {
    id: 84532,
    rpc: `https://84532.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`,
  },
]

export const chainData = [
  {
    name: 'Base',
    chain: {
      id: 8453,
      rpc: `https://8453.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`,
    },
    tokenData: [
      {
        id: 3,
        name: 'Ethereum',
        symbol: 'ETH',
        address: '',
        image: 'https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737291908/eth_base_ltxyaf.svg'
      },
      {
        id: 4,
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        image: 'https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737291908/usdc_base_lsosir.svg'
      }
    ]
  }
]
export const wallets: Wallet[] = [
  inAppWallet({
    auth: {
      options:
        ['email', 'google', 'discord', 'apple', 'facebook', 'phone', 'telegram', 'passkey', 'x', 'coinbase', 'line', 'farcaster']
    },
    metadata: {
      image: {
        src: "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1736328514/eden_piplmq.png",
        width: 350,
        height: 100,
        alt: "Eden Logo",
      },
    }
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('io.zerion.wallet'),
];
export const duckTokenAddress ="0xE67451E0Cbcb1fC0ce4641214E71bFF7cB40F598" //"0x9dB6729394fdD35Ab78903dC59e2441D1f66583C";//
export const recipientAddress = "0x64BCeB1Ee3375CD52D3F608DfEbDE1e49424693c";
export const factoryAddress = "0x93D58E6FD93db03c911CA3a730ff9Cf4fdBD5948";