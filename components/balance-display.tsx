import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';

const BalanceDisplay = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(0);
      return;
    }

    connection.onAccountChange(publicKey, (updatedAccountInfo) => {
      console.log(
        `Updated account info: ${JSON.stringify(updatedAccountInfo)}`,
      );
      setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    });

    setLoading(true);
    connection.getAccountInfo(publicKey).then((info) => {
      setLoading(false);
      setBalance((info?.lamports || 0) / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);

  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight my-4 flex items-center">
      Balance:{' '}
      {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : balance}
    </h4>
  );
};

export default BalanceDisplay;
