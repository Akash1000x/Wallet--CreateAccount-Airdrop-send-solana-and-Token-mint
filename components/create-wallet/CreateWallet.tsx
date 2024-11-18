"use client";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";
import { HDNodeWallet, Wallet } from "ethers";
import { Button, buttonVariants } from "../ui/button";
import { Copy } from "lucide-react";

const CreateWallet = () => {
  const [solanaPublickKey, setSolanaPublickKey] = useState<string[]>([]);
  const [solanaPrivateKey, setSolanaPrivateKey] = useState<string[]>([]);
  const [ethereumPrivateKey, setEthereumPrivateKey] = useState<string[]>([]);
  const [ethereumPublicKey, setEthereumPublicKey] = useState<string[]>([]);
  const [menemonic, setMenemonic] = useState("");

  const createMenemonic = () => {
    const menemonic = generateMnemonic();
    setMenemonic(menemonic);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menemonic);
  };

  const createSolWallet = () => {
    const seed = mnemonicToSeedSync(menemonic);
    const path = "m/44'/501'/0'/0'";
    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    const secret = Buffer.from(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);

    const keyPair = Keypair.fromSecretKey(secret);

    setSolanaPrivateKey((prev) => [...prev, Buffer.from(keyPair.secretKey).toString("hex")]);
    setSolanaPublickKey((prev) => [...prev, keyPair.publicKey.toBase58()]);
  };

  const createEthereumWallet = () => {
    const seed = mnemonicToSeedSync(menemonic);
    const path = "m/44'/60'/0'/0/0";
    const hdNod = HDNodeWallet.fromSeed(seed);
    const driveNode = hdNod.derivePath(path);
    const privateKey = driveNode.privateKey;

    const wallet = new Wallet(privateKey);

    setEthereumPublicKey((prev) => [...prev, wallet.address]);
    setEthereumPrivateKey((prev) => [...prev, wallet.privateKey]);
  };

  return (
    <div className="space-y-8 w-full">
      <Button className="font-bold" onClick={createMenemonic}>
        Generate Menemonic
      </Button>
      {menemonic && (
        <div className="space-y-4 relative">
          <h2 className="font-bold text-4xl text-center text-blue-500">Menemonic pharse</h2>
          <Copy className="w-6 h-6 absolute top-2 right-24 cursor-pointer" onClick={handleCopy} />
          <div className="grid grid-cols-4 gap-2">
            {menemonic.split(" ").map((s, i) => (
              <div key={i} className={buttonVariants({ variant: "outline" })}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-x-4">
        <Button onClick={createSolWallet} disabled={!menemonic}>
          + Solana Wallet
        </Button>
        <Button onClick={createEthereumWallet} disabled={!menemonic}>
          + Eth Wallet
        </Button>
      </div>
      <div className="border p-2 rounded-lg">
        <h1 className="text-center py-5 text-6xl">Solana</h1>
        <div className="space-y-2">
          {solanaPublickKey.map((key, i) => (
            <div key={key} className="border p-2">
              <div>
                <span className="text-green-500 capitalize">publicKey:</span> {key}
              </div>
              <div>
                <span className="text-green-500 capitalize">PrivateKey:</span>
                {solanaPrivateKey[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border p-2 rounded-lg">
        <h1 className="text-center py-5 text-6xl">Ethereum</h1>
        <div>
          {ethereumPublicKey.map((key, i) => (
            <div key={key}>
              <div>
                <span className="text-green-500 capitalize">publicKey:</span>
                {key}
              </div>
              <div>
                <span className="text-green-500 capitalize">PrivateKey:</span>
                {ethereumPrivateKey[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;
