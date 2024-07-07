import { useState } from "react";
import {
  Abi,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseUnits,
} from "viem";
import { celoAlfajores } from "viem/chains";

const client = window.ethereum
  ? createWalletClient({
    chain: celoAlfajores,
    transport: custom(window.ethereum),
  })
  : null;

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

type AllowedTokens = "cUSD";

const tokenMap: {
  [k in AllowedTokens]: {
    address: `0x${string}`;
    decimals: number;
    abi: Abi;
  };
} = {
  "cUSD": {
    address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    decimals: 0,
    abi: [{
      type: "function",
      stateMutability: "nonpayable",
      payable: false,
      outputs: [
        { "type": "bool", "name": "", "internalType": "bool" },
      ],
      name: "transfer",
      inputs: [
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "value", internalType: "uint256" },
      ],
      constant: false,
    }],
  },
};

type Nullable<T> = T | null;

export default function useTransaction(
  token: AllowedTokens,
): [
  { error: Nullable<string>; success: Nullable<boolean> },
  (to: `0x${string}`, amount: number) => Promise<void>,
] {
  const [success, setSuccess] = useState<Nullable<boolean>>(null);
  const [error, setError] = useState<Nullable<string>>(null);

  const dispatch = async (to: `0x${string}`, amount: number) => {
    if (!client) {
      setError(
        `Could not find provider, are you using Opera MiniPay?`,
      );
      setSuccess(false);
      return;
    }

    const { address, abi, decimals } = tokenMap[token];

    try {
      const hash = await client.writeContract({
        address,
        abi,
        functionName: "transfer",
        account: (await client.getAddresses())[0],
        args: [
          to,
          parseUnits(`${amount}`, decimals),
        ],
      });

      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      setSuccess(transaction.status === "success");
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setSuccess(false);
    }
  };

  return [{ error, success }, dispatch];
}
