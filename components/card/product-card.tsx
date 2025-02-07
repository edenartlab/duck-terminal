import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useAuthState } from '@/hooks/use-auth-state'
import { handleAxiosServerError } from '@/lib/fetcher'
import { Product, SubscriptionTier } from '@edenlabs/eden-sdk'
import axios from 'axios'
import currency from 'currency.js'
import Image from 'next/image'

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
    <div className="font-semibold text-sm">
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

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useAuthState()

  const handleCheckout = async (priceId: string) => {
    try {
      const response = await axios.post('/api/account/payment', {
        requestType: 'checkout',
        priceId,
        paymentMode: 'payment',
      })
      const { url } = response.data

      window.location.href = url
    } catch (error) {
      handleAxiosServerError(error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="!p-0">
        <div className="w-full h-48 relative">
          <Image
            layout="fill"
            objectFit="cover"
            alt={product.name || ''}
            src={
              product.images && product.images.length
                ? product.images[0]
                : '/eden-logo-512x512.png'
            }
            className="bg-gray-100 dark:bg-gray-800 rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="mt-4 px-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
      </CardContent>
      <CardFooter className="border-t py-4 px-4 flex justify-between">
        <Button
          onClick={() => handleCheckout(product.default_price)}
          variant="outline"
        >
          Buy
        </Button>
        {renderDisplayPrice(product, user?.subscriptionTier)}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
