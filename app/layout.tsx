import type { Metadata } from "next";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Solana App",
  description: "Solana dApp with Capacitor + Phantom Wallet Adapter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider
          appUrl="https://mysolanaapp.com"
          scheme="myapp"
          cluster={WalletAdapterNetwork.Mainnet}
          endpoint="https://api.devnet.solana.com"
        >
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
