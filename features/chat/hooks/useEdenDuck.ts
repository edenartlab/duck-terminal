"use client";

import { useState } from "react";
import { getContract, sendAndConfirmTransaction } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import {
  chain, 
  client,
  duckTokenAddress,
  recipientAddress,
} from "@/lib/thirdweb/config";
import { useAuth } from "@/contexts/auth-context";
import { getBalanceHandler } from "@/lib/thirdweb/utils";
import { useActiveWallet } from "thirdweb/react";

export const useEdenDuck = () => {
  const wallet = useActiveWallet();
  const { userId } = useAuth();
  const account = wallet?.getAccount();
  const { updateAuthState } = useAuth();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const withdrawAmount = 1;

  const duckTokenContract = getContract({
    client,
    chain,
    address: duckTokenAddress,
  });
  const onWithdrawHandle = async () => {
    if (wallet) {
      setIsWithdrawing(true);
      try {
        const tx = transfer({
          contract: duckTokenContract,
          to: recipientAddress,
          amount: withdrawAmount,
        });
        const result = await sendAndConfirmTransaction({
          account: account!,
          transaction: tx,
        });
        if (result.status === "success") {
          getBalanceHandler(userId).then((balance: number) => {
            updateAuthState({ balance: balance });
          });
        }
        setIsWithdrawing(false);
      } catch (error) {
        console.error("Error withdrawing Duck:", error);
        setIsWithdrawing(false);
      }
    }
  };

  return {
    isWithdrawing,
    onWithdrawHandle,
  };
};
