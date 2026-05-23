import { WalletDemo } from "@/components/WalletDemo";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <WalletDemo />
    </main>
  );
}
