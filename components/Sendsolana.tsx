import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const SendSolana = () => {
  const [receiverpublicKey, setReceiverpublicKey] = React.useState("");
  const [sol, setSol] = React.useState(0);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendToken = async () => {
    if (!publicKey) {
      toast({ variant: "destructive", title: "Wallet not connected" });
      return;
    }

    if (!receiverpublicKey) {
      toast({ variant: "destructive", title: "Receiver address is required" });
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receiverpublicKey),
          lamports: sol * LAMPORTS_PER_SOL,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      toast({ variant: "default", title: "Transaction sent" });
    } catch {
      toast({ variant: "destructive", title: "Transaction failed" });
    }
  };

  return (
    <div className="space-y-10 border w-[400px] mx-auto text-center px-4 py-10 rounded-lg">
      <h1 className="text-4xl font-bold text-green-500">Send Sol</h1>
      <div className="space-y-3">
        <Input
          placeholder="Enter address to send"
          type="text"
          value={receiverpublicKey}
          onChange={(e) => setReceiverpublicKey(e.target.value)}
        />
        <Input placeholder="Enter sol" type="number" value={sol} onChange={(e) => setSol(parseInt(e.target.value))} />
        <Button variant={"outline"} disabled={!receiverpublicKey || !sol} onClick={sendToken}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default SendSolana;
