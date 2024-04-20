import Image from 'next/image';
import { TransferForm } from '@/components/transfer-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Transfer SOL to an address
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4">
        Balance:
      </h4>
      <TransferForm />
    </main>
  );
}
