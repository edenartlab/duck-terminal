'use client'

import { Button } from '@/components/ui/button'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthState } from '@/hooks/use-auth-state'
import { MannaVoucherRedeemResponse } from '@edenlabs/eden-sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  code: z.string().min(3, { message: 'Code is required' }),
})

const RedeemVoucherForm = () => {
  const { refetchMe } = useAuthState()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('try onSubmit', values)
    setIsSubmitting(true)

    try {
      const response: MannaVoucherRedeemResponse = await axios.post(
        '/api/voucher/redeem',
        {
          code: values.code,
        },
      )

      console.log({ response })

      toast.success(`Code redeemed`, {
        description: (
          <code className=" text-xs text-foreground">
            {response.action || 'Voucher redeemed'}
          </code>
        ),
        dismissible: true,
        richColors: true,
      })

      await refetchMe()

      router.push('/create')
    } catch (err) {
      console.log(err)
      const errorMessage = axios.isAxiosError(err)
        ? JSON.parse((err as AxiosError).request.responseText)?.message
        : 'Unknown Error'

      toast.error(`Failed to redeem code!`, {
        description: JSON.stringify(errorMessage),
        dismissible: true,
        richColors: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogTitle>Redeem Voucher</DialogTitle>
      <DialogDescription>
        Here you can claim vouchers that grant free manna or allow access to
        special features or previews.
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className=" flex flex-col w-full">
                <FormLabel className="py-2">Voucher Code</FormLabel>
                <FormControl className="!mt-0">
                  <div className="flex gap-2 items-center">
                    <Input placeholder="Code" {...field} />
                    <Button
                      onClick={
                        !isSubmitting ? form.handleSubmit(onSubmit) : undefined
                      }
                      disabled={isSubmitting}
                      className="!mt-0"
                      type="submit"
                      variant="outline"
                    >
                      Submit
                    </Button>
                  </div>
                </FormControl>
                {/*<FormDescription>*/}
                {/*  Your Early Access Token*/}
                {/*</FormDescription>*/}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}

export default RedeemVoucherForm
