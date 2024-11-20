import { toast } from "@/hooks/use-toast";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";

const GetAllTokens = () => {
  const [data, setData] = React.useState<string[]>([]);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  React.useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) {
        toast({ variant: "destructive", title: "Wallet not connected" });
        return;
      }
      const response = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      const publicKeys: string[] = [];
      response.value.forEach((accountInfo) => {
        publicKeys.push(accountInfo.pubkey.toBase58());
      });
      setData(publicKeys);
    };

    fetchData();
  }, [connection, publicKey]);

  return (
    <div className="flex gap-4">
      All ATA for this wallet mints:
      <div>
        {data.map((p, i) => (
          <div key={i} className="text-red-500">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllTokens;
