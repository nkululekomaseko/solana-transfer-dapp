import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const BalanceDisplay = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    console.log('....', publicKey);
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(publicKey, (updatedAccountInfo) => {
      console.log(
        `Updated account info: ${JSON.stringify(updatedAccountInfo)}`,
      );
      setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    });

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance((info?.lamports || 0) / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);

  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight my-4">
      Balance: {balance}
    </h4>
  );
};

export default BalanceDisplay;
