import { toast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React from "react";

const GetSolanabalance = () => {
  const [solanaBalance, setSolanaBalance] = React.useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  React.useEffect(() => {
    if (!publicKey) {
      toast({ variant: "destructive", title: "Wallet not connected" });
      return;
    }
    (async function getBalance() {
      const balance = await connection.getBalance(publicKey);
      setSolanaBalance(balance / LAMPORTS_PER_SOL);
      console.log(balance);
    })();
  }, [connection, publicKey]);

  return (
    <div className="px-10">
      <span className="capitalize text-4xl text-green-500">sol balance: </span>
      <span className="text-4xl text-green-500">{solanaBalance}</span>
    </div>
  );
};

export default GetSolanabalance;

// import React, { useEffect } from "react";
// import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// const GetSolanabalance = () => {
//   const [solanaBalance, setSolanaBalance] = React.useState(0); // setting the initial balance to 0
//   useEffect(() => {
//     const main = async () => {
//       const rpc = "https://solana-devnet.g.alchemy.com/v2/1gFXTyhijXdaQXOJ7xjNFlpcnWyUJvWJ"; // RPC URL for connecting with a Solana node
//       const connection = new Connection(rpc, "confirmed"); // confirming the connection

//       const slot = await connection.getBalance(new PublicKey("EJWgeqUu18sE3dijmAYfASLeozWWBNLRStGvxFdaxwW2")); // getting the most recent slot number
//       setSolanaBalance(slot); // logging the most recent slot number
//     };

//     main();
//   }, []);
//   return <div>solana balance: {solanaBalance / LAMPORTS_PER_SOL}</div>;
// };

// export default GetSolanabalance;
