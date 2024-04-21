'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  transferAmount: z.coerce.number(),
  transferToAddress: z.string().min(1, 'Must not be empty'),
});

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

  const onSubmit = (values: formSchemaType) => {
    const { transferAmount, transferToAddress } = values;

    setTxSignature('');

    if (!connection || !publicKey) {
      return;
    }

    const toPubkey = new PublicKey(transferToAddress);

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
        setTxSignature(txSig);
        setLoading(false);
      })
      .catch((error) => {
        console.log(`Error transferring SOL`, error);
        setLoading(false);
      });
  };

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
