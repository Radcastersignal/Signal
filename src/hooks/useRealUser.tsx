// src/hooks/useRealUser.tsx
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export type RealUser = {
  address: string;
  displayName?: string;
  pfpUrl?: string;
  balanceEth?: string;
  balanceUsd?: string;
};

export function useRealUser() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<RealUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      try {
        // ÇÌÚá ÇáÜ SDK ÌÇåÒÇð (íÎÝí splash screen ÏÇÎá Warpcast)
        await sdk.actions.ready();

        if (!isConnected || !address) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // ÇÍÕá Úáì EIP-1193 provider ãä Farcaster SDK
        const provider: any = await sdk.wallet.getEthereumProvider();

        // ÇÍÕá Úáì ÇáÑÕíÏ (hex) Ëã Íæøáå Åáì ETH
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        const balanceEth = ethers.formatEther(BigInt(balanceHex)).toString();

        // ÌáÈ ÓÚÑ ETH ÈÇáÏæáÇÑ (ÇÎÊíÇÑí¡ Coingecko)
        let balanceUsd;
        try {
          const res = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          );
          const j = await res.json();
          const ethUsd = j?.ethereum?.usd ?? null;
          if (ethUsd) balanceUsd = (parseFloat(balanceEth) * ethUsd).toFixed(2);
        } catch (err) {
          console.warn("Cannot fetch ETH price", err);
        }

        if (mounted) {
          setUser({
            address,
            balanceEth,
            balanceUsd,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("useRealUser init error:", err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [isConnected, address]);

  return { user, loading };
}
