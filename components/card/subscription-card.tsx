import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthState } from '@/hooks/use-auth-state'
import { handleAxiosServerError } from '@/lib/fetcher'
import { Product, SubscriptionTier } from '@edenlabs/eden-sdk'
import axios from 'axios'
import { cx } from 'class-variance-authority'
import currency from 'currency.js'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { TokenProvider, TokenIcon } from 'thirdweb/react'
import { client, chainData } from '@/lib/thirdweb/config'
import Image from 'next/image'
import {
  DelayedSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import { useWalletBalance } from 'thirdweb/react'
import { convertBalance } from '@/lib/thirdweb/utils'
import { useState, useEffect } from 'react'
import { Chain } from 'thirdweb'
import { useAuth } from '@/contexts/auth-context'

const discountFactorMap: { [key in SubscriptionTier]: number } = {
  0: 1,
  1: 0.9,
  2: 0.8,
  3: 0.7,
  4: 1,
}
export const renderDisplayPrice = (
  product: Product,
  subscriptionTier?: SubscriptionTier,
) => {
  const { displayPrice } = product
  const discountFactor = discountFactorMap[subscriptionTier || 0]
  const originalPrice = currency(displayPrice?.unit_amount || 0, {
    fromCents: true,
  }).format({
    symbol: '$',
  })
  const discountedPrice = currency(displayPrice?.unit_amount || 0, {
    fromCents: true,
  })
    .multiply(discountFactor)
    .format({
      symbol: '$',
    })

  return (
    <div className="font-semibold text-2xl">
      {discountFactor < 1 ? (
        <>
          <span className="line-through font-normal">{originalPrice}</span>
          {' ' + discountedPrice}
        </>
      ) : (
        discountedPrice
      )}
    </div>
  )
}

const dummyFeatures: { [key in SubscriptionTier]: string[] } = {
  0: [],
  1: [
    '1,000 Manna / month',
    '10% Discount on Manna-Refills',
    '3 concurrent creation jobs',
    // 'Private creations',
  ],
  2: [
    '5,000 Manna / month',
    '20% Discount on Manna-Refills',
    '6 concurrent creation jobs',
    // 'Private creations',
    'API access',
    'Premium generators',
    'Export Concepts for use in other apps',
  ],
  3: [
    '10,000 Manna / month',
    '30% Discount on Manna-Refills',
    '10 concurrent creation jobs',
    // 'Private creations',
    'API access',
    'Premium generators',
    'Export Concepts for use in other apps',
    'Early access to preview features',
    'Priority support',
  ],
  4: [],
}

const SubscriptionCard = ({ product }: { product: Product }) => {
  const { user } = useAuthState()
  const { userId } = useAuth()
  const isActive = user?.subscriptionTier === parseInt(product.metadata.subscriptionTier)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [ccbalance, setCcbalance] = useState(0)
  const [isDisplayBalance, setIsDisplayBalance] = useState(false)
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('')
  const [selectedChain, setSelectedChain] = useState<Chain>()

  const handleManageClick = async () => {
    const customerId = user?.stripeCustomerId
    if (!customerId) {
      toast.warning('Could not find customer. Please contact support.', {
        duration: 5000,
        richColors: true,
        closeButton: true,
      })
      return
    }
    try {
      const response = await axios.post('/api/account/payment', {
        requestType: 'manage',
        stripeCustomerId: customerId,
        returnUrl: window.location.href,
      })
      const { url } = response.data
      window.location.href = url
    } catch (error) {
      handleAxiosServerError(error)
    }
  }
  const handleCheckout = async (priceId: string) => {
    try {
      const response = await axios.post('/api/account/payment', {
        requestType: 'checkout',
        priceId,
        paymentMode: 'subscription',
      })
      const { url } = response.data

      window.location.href = url
    } catch (error) {
      handleAxiosServerError(error)
    }
  }

  const { data } = useWalletBalance({
    chain: selectedChain,
    address: userId,
    client,
    tokenAddress: selectedTokenAddress
  })

  const newBalance = convertBalance(data?.value ?? BigInt(0), data?.decimals ?? Number(0));

  useEffect(() => {
    setCcbalance(newBalance)
  }, [selectedTokenAddress, newBalance])

  return (
    <Card
      className={cx(
        'flex flex-col w-full relative',
        isActive ? '!border-success bg-success/10' : '',
      )}
    >
      {isActive && (
        <div className="absolute -top-3 bg-success rounded-md h-6 px-4 left-1/2 -translate-x-1/2 text-center text-xs font-semibold leading-6">
          Active
        </div>
      )}
      <CardHeader className="!p-4 space-y-2">
        <CardTitle>{product.name}</CardTitle>
        <div className="mt-4 flex items-center">
          <span className="text-4xl font-extrabold tracking-tight">
            {renderDisplayPrice(product)}
          </span>
          <span className="ml-1 text-md font-semibold text-muted-foreground">
            / month
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0 flex flex-col justify-between flex-1">
        <div className="space-y-2 px-4">
          {dummyFeatures[
            product.metadata.subscriptionTier as SubscriptionTier
          ].map(feature => (
            <div className="flex gap-x-2" key={feature}>
              <CheckIcon className="w-4 h-4 text-success" />
              <p className="text-sm -mt-0.5 w-full">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button
          className="w-full"
          variant={isActive ? 'default' : 'secondary'}
          onClick={() => {
            if (isActive) {
              handleManageClick()
            } else {
              setIsPaymentMethodDialogOpen(true)
            }
          }}
        >
          {isActive
            ? 'Manage Subscription'
            : user?.subscriptionTier === 0
              ? 'Subscribe'
              : 'Change to this plan'}
        </Button>
      </CardFooter>
      <Dialog
        open={isPaymentMethodDialogOpen}
        onOpenChange={setIsPaymentMethodDialogOpen}
      >
        <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Choose payment method</DialogTitle>
          </DialogHeader>
          <DelayedSelect
            onValueChange={
              newVal => {
                setPaymentMethod(newVal)
              }
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose payment method..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='card'>
                  <div className=' flex'>
                    <Image
                      src='https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737361340/cryptocurrency_wwotuv.png'
                      alt='card icon'
                      width={20}
                      height={16} />
                    <span className='ml-4'>Card payments</span>
                  </div>
                </SelectItem>
                <SelectItem value='crypto' className='flex'>
                  <div className='flex'>
                    <Image
                      src='https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737361349/credit-card-color-icon_mzfduw.png'
                      alt='crypto icon'
                      width={20}
                      height={16} />
                    <span className='ml-4'>Cryptocurrencies</span>
                  </div>

                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </DelayedSelect>
          <DialogFooter>
            <Button onClick={() => {
              if (paymentMethod == 'crypto') {
                setIsPaymentDialogOpen(true)
              } else {
                handleCheckout(product.default_price)
              }
            }}>
              checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(isOpen) => {
          setIsPaymentDialogOpen(isOpen)
          if (!isOpen) setIsDisplayBalance(false)
        }}
      >
        <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <DelayedSelect
            onValueChange={
              newVal => {
                const data = JSON.parse(newVal)
                setSelectedChain(data.chain)
                setSelectedTokenAddress(data.tokenAddress)
                if (!isDisplayBalance) setIsDisplayBalance(true)
              }
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency..." />
            </SelectTrigger>
            <SelectContent>
              {chainData.map((chain) => (
                <SelectGroup key={chain.chain.id}>
                  <SelectLabel>{chain.name}</SelectLabel>
                  {chain.tokenData.map((token) => (
                    <SelectItem key={token.id} value={JSON.stringify({
                      tokenAddress: token.address, chain: chain.chain
                    })} >
                      <div className="flex items-center gap-2">
                        {chain &&
                          <TokenProvider
                            chain={chain.chain}
                            client={client}
                            address={token.address}
                          >
                            <TokenIcon className="h-5 w-5" iconResolver={token.image} />
                            <span>{token.name}</span>
                            <span>({token.symbol})</span>
                          </TokenProvider>
                        }
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </DelayedSelect>
          <DialogFooter>
            <div className='flex w-full justify-between'>
              {isDisplayBalance ? `${ccbalance} available` : <span>&nbsp;</span>}
              <Button>
                pay now
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card >

  )
}

export default SubscriptionCard
