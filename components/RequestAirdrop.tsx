"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "@/hooks/use-toast";

const RequestAirdrop = ({ inwalletAirdrop = false }: { inwalletAirdrop?: boolean }) => {
  const [sol, setSol] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const requestAirdrop = async () => {
    try {
      if (!publicKey) {
        toast({ variant: "destructive", title: "Wallet not connected" });
        return;
      }

      if (!inwalletAirdrop && !address) {
        toast({ variant: "destructive", title: "Please enter address" });
        return;
      }

      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(inwalletAirdrop ? publicKey : new PublicKey(address), sol * LAMPORTS_PER_SOL),
      ]);

      const sigResult = await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");

      if (sigResult) {
        toast({ variant: "default", title: "Airdrop successful" });
      }
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", title: "You are Rate limited for Airdrop" });
    }
  };

  return (
    <div className=" space-y-10 border w-[400px] mx-auto text-center px-4 py-10 rounded-lg">
      <h1 className="text-4xl font-bold text-green-500">Request Airdrop</h1>
      <div className="space-y-3">
        {!inwalletAirdrop && (
          <Input placeholder="Enter wallet address" value={address} onChange={(e) => setAddress(e.target.value)} />
        )}
        <Input placeholder="Enter sol" type="number" value={sol} onChange={(e) => setSol(parseInt(e.target.value))} />
        <Button className="w-full" onClick={requestAirdrop}>
          Request Airdrop
        </Button>
      </div>
    </div>
  );
};

export default RequestAirdrop;
