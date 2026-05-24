"use client";

import { useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletName } from "@solana/wallet-adapter-base";
import { Capacitor } from "@capacitor/core";

function shorten(address: string, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function WalletButton() {
  const {
    connected,
    connecting,
    disconnecting,
    publicKey,
    connect,
    disconnect,
    select,
    wallet,
  } = useWallet();

  // After select() updates wallet, trigger connect() automatically
  const shouldConnect = useRef(false);
  useEffect(() => {
    if (shouldConnect.current && wallet && !connected && !connecting) {
      shouldConnect.current = false;
      connect().catch(console.error);
    }
  }, [wallet, connected, connecting, connect]);

  if (!Capacitor.isNativePlatform()) {
    return <WalletMultiButton />;
  }

  const isLoading = connecting || disconnecting;
  const label = connected
    ? shorten(publicKey!.toBase58())
    : isLoading
      ? connecting
        ? "Connecting..."
        : "Disconnecting..."
      : "Connect Wallet";

  function handlePress() {
    if (connected) {
      disconnect().catch(console.error);
    } else if (wallet) {
      connect().catch(console.error);
    } else {
      // select() is async — the useEffect above will call connect() once wallet is set
      shouldConnect.current = true;
      select("Phantom" as WalletName<"Phantom">);
    }
  }

  return (
    <button
      onClick={handlePress}
      disabled={isLoading}
      style={buttonStyle(connected, isLoading)}
    >
      {connected && <PhantomIcon />}
      <span>{label}</span>
      {connected && <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 12 }}>x</span>}
    </button>
  );
}

function PhantomIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 128 128"
      style={{ marginRight: 8, flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="64" cy="64" r="64" fill="#AB9FF2" />
      <path
        d="M108 64C98 39 79 26 64 26C49 26 30 39 20 64C30 89 49 102 64 102C79 102 98 89 108 64Z"
        fill="white"
      />
      <circle cx="50" cy="60" r="8" fill="#AB9FF2" />
      <circle cx="78" cy="60" r="8" fill="#AB9FF2" />
    </svg>
  );
}

function buttonStyle(connected: boolean, loading: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 22px",
    borderRadius: 8,
    border: connected ? "1.5px solid #AB9FF2" : "none",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 0,
    background: connected
      ? "rgba(171,159,242,0.12)"
      : "linear-gradient(135deg, #AB9FF2 0%, #9580FF 100%)",
    color: connected ? "#AB9FF2" : "#fff",
    opacity: loading ? 0.55 : 1,
    transition: "opacity 0.2s, transform 0.1s",
    minWidth: 160,
    boxShadow: connected ? "none" : "0 4px 14px rgba(171,159,242,0.35)",
  };
}
