"use client";
import GetAllTokens from "@/components/GetAllTokens";
import GetSolanabalance from "@/components/create-wallet/GetSolBalance";
import RequestAirdrop from "@/components/RequestAirdrop";
import SendSolana from "@/components/Sendsolana";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="p-10 space-y-10">
      <div className="flex gap-10">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <GetSolanabalance />
      <div className="flex gap-4">
        <SendSolana />
        <RequestAirdrop inwalletAirdrop={true} />
      </div>
      <GetAllTokens />
    </div>
  );
}
