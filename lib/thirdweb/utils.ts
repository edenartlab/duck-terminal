import { signLoginPayload } from "thirdweb/auth";
import { Wallet } from "thirdweb/wallets";
import { genPayload, login, logout } from "@/lib/actions/thirdweb";
import { base } from "thirdweb/chains";
import { getBalance } from "thirdweb/extensions/erc20";
import { duckTokenAddress } from "@/lib/thirdweb/config";
import { getContract } from "thirdweb";
import { client } from "@/lib/thirdweb/config";


export const handleConnectWallet = async (wallet: Wallet) => {
  const account = wallet.getAccount();
  const chain = base

  if (!account) {
    alert("Please connect your wallet");
    return;
  }

  const params: { address: string, chainId: number } = {
    address: account.address,
    chainId: chain.id,
  };

  try {
    const payload = await genPayload(params);
    if (!payload) throw new Error("Failed to generate payload");

    const signatureResult = await signLoginPayload({ account, payload });
    const result = await login(signatureResult);
    return result
  } catch (error) {
    console.error("Error during wallet connection:", error); // eslint-disable-line no-console
  }
};
export const handleDisconnectWallet = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Error during wallet disconnection:", error);
  }
};

export const convertBalance = (balanceBigInt: bigint, decimals: number): number => {
  // Convert BigInt to string
  const balanceStr = balanceBigInt.toString();

  // Pad the string with leading zeros if necessary
  const paddedStr = balanceStr.padStart(decimals + 1, '0');

  // Insert the decimal point
  const integerPart = paddedStr.slice(0, -decimals) || '0';
  const fractionalPart = paddedStr.slice(-decimals);

  // Combine integer and fractional parts
  const decimalStr = `${integerPart}.${fractionalPart}`;

  // Parse as a number and return to remove trailing zeros dynamically
  return Number(parseFloat(decimalStr).toPrecision(5));
}

export const getBalanceHandler = async (address: string) => {
  const duckTokenContract = getContract({
    client,
    address: duckTokenAddress,
    chain: base,
  })
  const balance = await getBalance({ contract: duckTokenContract, address: address })
  return convertBalance(balance.value, balance.decimals)
}
