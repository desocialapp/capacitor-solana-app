"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { WalletButton } from "./WalletButton";

export function WalletDemo() {
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [sigResult, setSigResult] = useState<string | null>(null);
  const [txidResult, setTxidResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"sign" | "send" | null>(null);

  function reset() {
    setSigResult(null);
    setTxidResult(null);
    setError(null);
  }

  async function handleSignMessage() {
    if (!signMessage) return;

    reset();
    setLoading("sign");
    try {
      const msg = new TextEncoder().encode(
        "Hello from Solana + Capacitor! " + new Date().toISOString()
      );
      const sig = await signMessage(msg);
      const hex = Array.from(sig)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setSigResult(hex);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(null);
    }
  }

  async function handleSendSOL() {
    if (!publicKey) return;

    reset();
    setLoading("send");
    try {
      // Use commitment + timeout for mobile reliability
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");

      const tx = new Transaction({
        feePayer: publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 0.001 * LAMPORTS_PER_SOL,
        })
      );

      const txid = await sendTransaction(tx, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      await connection.confirmTransaction(
        { signature: txid, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      setTxidResult(txid);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Solana dApp</h1>
      <p style={styles.subtitle}>
        Next.js - Wallet Adapter - Capacitor - Phantom Deep Links
      </p>

      <div style={styles.section}>
        <WalletButton />
        {connected && publicKey && (
          <p style={styles.address}>
            <span style={styles.label}>Wallet: </span>
            <code style={styles.code}>{publicKey.toBase58()}</code>
          </p>
        )}
      </div>

      {connected && (
        <div style={styles.actions}>
          <ActionButton
            label="Sign Message"
            loading={loading === "sign"}
            onClick={handleSignMessage}
          />
          <ActionButton
            label="Send 0.001 SOL (to self)"
            loading={loading === "send"}
            onClick={handleSendSOL}
          />
        </div>
      )}

      {sigResult && (
        <ResultBox label="Message Signature (hex)" value={sigResult} href={null} />
      )}
      {txidResult && (
        <ResultBox
          label="Transaction ID"
          value={txidResult}
          href={`https://explorer.solana.com/tx/${txidResult}?cluster=devnet`}
        />
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

function ActionButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        ...styles.actionBtn,
        opacity: loading ? 0.5 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}

function ResultBox({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string | null;
}) {
  const displayValue =
    value.length > 60 ? `${value.slice(0, 40)}...${value.slice(-10)}` : value;

  return (
    <div style={styles.resultBox}>
      <p style={{ ...styles.label, marginBottom: 4 }}>{label}</p>
      <code style={styles.resultCode}>{displayValue}</code>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" style={styles.link}>
          View on Explorer
        </a>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    maxWidth: 480,
    width: "100%",
    margin: "0 auto",
    padding: 24,
    borderRadius: 8,
    background: "#1c1a27",
    border: "1px solid rgba(171,159,242,0.15)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: 13,
    color: "#aaa",
    margin: "0 0 28px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  address: {
    fontSize: 13,
    color: "#aaa",
    margin: 0,
    wordBreak: "break-all",
  },
  label: {
    fontWeight: 600,
    color: "#AB9FF2",
    margin: 0,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#ddd",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    padding: "12px 20px",
    borderRadius: 8,
    border: "1.5px solid rgba(171,159,242,0.25)",
    background: "transparent",
    color: "#AB9FF2",
    fontSize: 14,
    fontWeight: 500,
    textAlign: "left",
  } as React.CSSProperties,
  resultBox: {
    background: "rgba(171,159,242,0.07)",
    border: "1px solid rgba(171,159,242,0.18)",
    borderRadius: 8,
    padding: "14px 16px",
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  resultCode: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#ccc",
    wordBreak: "break-all",
  } as React.CSSProperties,
  link: {
    color: "#AB9FF2",
    fontSize: 13,
    marginTop: 4,
  },
  error: {
    color: "#ff6b6b",
    background: "rgba(255,107,107,0.08)",
    border: "1px solid rgba(255,107,107,0.2)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    margin: 0,
  },
};
