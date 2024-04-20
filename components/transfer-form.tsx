'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  transferAmount: z.coerce.number(),
  transferToAddress: z.string().min(1, 'Must not be empty'),
});

type formSchemaType = z.infer<typeof formSchema>;

export function TransferForm() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferAmount: 0.0,
      transferToAddress: '',
    },
  });

  const onSubmit = (values: formSchemaType) => {
    console.log(`Form values: ${JSON.stringify(values, null, 2)}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-center flex flex-col"
      >
        <FormField
          control={form.control}
          name="transferAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (in SOL) to send:</FormLabel>
              <FormControl>
                <Input type="number" placeholder="amount in SOL" {...field} />
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
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
}
