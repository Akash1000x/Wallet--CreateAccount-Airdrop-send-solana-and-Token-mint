import { JsonRpcProvider, ethers } from "ethers";
import { useEffect, useState } from "react";

const GetEthBalance = () => {
  const [EthBalance, setEthBalance] = useState(0); // setting the initial balance to 0

  useEffect(() => {
    const main = async () => {
      const provider = new JsonRpcProvider("https://rpc.ankr.com/eth");
      const balance = await provider.getBalance("0x3773339Db8BdB0BDe75E66F27815DCAacBB84ac9");

      // Converting the balance from BigNumber to a more readable format
      const balanceInEth = parseFloat(ethers.formatEther(balance));

      setEthBalance(balanceInEth);
      console.log("ETH Balance:", balanceInEth);
    };

    main();
  }, []);

  return <div>ETH Balance: {EthBalance}</div>;
};

export default GetEthBalance;
