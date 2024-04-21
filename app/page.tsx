'use client';

import { TransferForm } from '@/components/transfer-form';
import MainNav from '@/components/main-nav';
import WalletContextProvider from '@/components/wallet-context-provider';
import BalanceDisplay from '@/components/balance-display';

export default function Home() {
  return (
    <WalletContextProvider>
      <MainNav />
      <main className="flex flex-col items-center px-8 py-24">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          Transfer SOL to an address
        </h2>
        <BalanceDisplay />
        <TransferForm />
      </main>
    </WalletContextProvider>
  );
}
