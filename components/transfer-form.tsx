'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const formSchema = z
  .object({
    transferAmount: z.coerce.number().min(1 / LAMPORTS_PER_SOL),
    transferToAddress: z.string().min(1, 'Must not be empty'),
  })
  .refine(
    async (data) => !!(await getValidSolanaAddress(data.transferToAddress)),
    {
      message: 'Invalid Solana Address',
      path: ['transferToAddress'],
    },
  );

type formSchemaType = z.infer<typeof formSchema>;

export function TransferForm() {
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferAmount: 0.0,
      transferToAddress: '',
    },
  });

  const onSubmit = async (values: formSchemaType) => {
    const { transferAmount, transferToAddress } = values;

    setTxSignature('');

    if (!connection || !publicKey) {
      return;
    }

    let toPubkey = await getValidSolanaAddress(transferToAddress);
    if (!toPubkey) {
      toast.warning('Invalid Solana Address');
      return;
    }

    console.log(`suppliedToPubkey: ${toPubkey}\nsenderPubKey: ${publicKey}`);

    const transaction = new Transaction();

    const LAMPORTS_TO_SEND = transferAmount * LAMPORTS_PER_SOL;

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey,
      lamports: LAMPORTS_TO_SEND,
    });

    transaction.add(sendSolInstruction);
    console.log(`Send sol transaction: ${JSON.stringify(sendSolInstruction)}`);

    setLoading(true);
    sendTransaction(transaction, connection)
      .then((txSig) => {
        setLoading(false);
        setTxSignature(txSig);
        toast.success('Transfer successful');
      })
      .catch((error: Error) => {
        setLoading(false);
        console.log(`Error transferring SOL`, error.message);
        toast.error(error.message);
      });
  };

  if (!publicKey) {
    return <p>Connect to a wallet</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-4/5 md:w-3/5 xl:1/5 space-y-4 text-center flex flex-col"
      >
        <FormField
          control={form.control}
          name="transferAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (in SOL) to send:</FormLabel>
              <FormControl>
                <Input
                  className="text-center"
                  type="number"
                  placeholder="amount in SOL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transferToAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send SOL to Address:</FormLabel>
              <FormControl>
                <Input
                  className="text-center"
                  placeholder="Address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center space-y-4">
          <Button className="w-1/2" disabled={loading} type="submit">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
          {!!txSignature && (
            <Button variant="link" asChild>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              >
                Transaction Link
              </a>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

const getValidSolanaAddress = async (
  addr: string,
): Promise<PublicKey | null> => {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(addr);
    if (PublicKey.isOnCurve(publicKey.toBytes())) {
      return publicKey;
    }
    return null;
  } catch (err) {
    return null;
  }
};
