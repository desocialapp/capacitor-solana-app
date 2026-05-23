"use client";

import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Capacitor } from "@capacitor/core";
import { PhantomDeepLinkAdapter } from "@/lib/PhantomDeepLinkAdapter";

import "@solana/wallet-adapter-react-ui/styles.css";

export interface SolanaWalletProviderProps {
  children: ReactNode;
  appUrl?: string;
  scheme?: string;
  cluster?: WalletAdapterNetwork;
  endpoint?: string;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({
  children,
  appUrl = "https://myapp.com",
  scheme = "myapp",
  cluster = WalletAdapterNetwork.Mainnet,
  endpoint,
}) => {
  const rpcEndpoint = useMemo(
    () => endpoint ?? clusterApiUrl(cluster),
    [endpoint, cluster]
  );

  const wallets = useMemo(() => {
    if (Capacitor.isNativePlatform()) {
      return [
        new PhantomDeepLinkAdapter({
          appUrl,
          scheme,
          cluster: cluster as "mainnet-beta" | "devnet" | "testnet",
        }),
      ];
    }

    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];
  }, [appUrl, scheme, cluster]);

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
