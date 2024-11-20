"use client";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { Button } from "./ui/button";
import { ed25519 } from "@noble/curves/ed25519";
import { Input } from "./ui/input";

const SignMessage = () => {
  const [inputSignMessage, setInputSignMessage] = React.useState("");
  const { publicKey, signMessage } = useWallet();

  const signAMessage = async () => {
    if (!publicKey) {
      toast({ variant: "destructive", title: "Wallet not connected" });
      return;
    }

    if (!signMessage) {
      toast({ variant: "destructive", title: "Wallet does not support message signing!" });
      return;
    }

    if (!inputSignMessage) {
      toast({ variant: "destructive", title: "Please enter message to sign" });
      return;
    }

    try {
      const message = new TextEncoder().encode(
        // `${
        //   window.location.host
        // } wants you to sign in with your Solana account:\n${publicKey.toBase58()}\n\nPlease sign in.`
        inputSignMessage
      );

      const signature = await signMessage(message);

      if (!ed25519.verify(signature, message, publicKey.toBytes())) {
        toast({ variant: "destructive", title: "Signature verification failed" });
        return;
      }
      toast({ variant: "default", title: "Message signed successfully" });
    } catch {
      toast({ variant: "destructive", title: "Message signing failed" });
    }
  };

  return (
    <div className="space-y-10 border w-[400px] mx-auto text-center px-4 py-10 rounded-lg">
      <Input
        placeholder="Enter message"
        value={inputSignMessage}
        onChange={(e) => setInputSignMessage(e.target.value)}
      />
      <Button onClick={signAMessage} disabled={!publicKey || !signAMessage} className="w-full">
        Sign Message
      </Button>
    </div>
  );
};

export default SignMessage;
