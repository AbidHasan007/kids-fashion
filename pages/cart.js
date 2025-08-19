import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import PageTitle from '@/components/PageTitle'
import CartTable from '@/components/CartTable'
import BackToProductButton from '@/components/BackToProductButton'
import { useCartContext } from '@/context/Store'
import { getCartSubTotal, getCartTotal, formatPrice } from '@/utils/helpers'

function CartPage() {
  const pageTitle = `Cart | ${process.env.siteTitle}`  
  const [cart, isLoading] = useCartContext()
  const router = useRouter()

  const shippingCost = 80 // Fixed shipping cost in BDT
  const subtotal = getCartSubTotal(cart)
  const total = getCartTotal(cart, shippingCost)

  const handleCheckout = () => {
    if (cart.length === 0) {
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="container mx-auto mb-20 min-h-screen">
      <SEO title={pageTitle} />
      <PageTitle text="Your Cart" />
      <CartTable 
        cart={cart}
      />
      
      {cart.length > 0 && (
        <>
          <div className="max-w-md mx-auto mt-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-palette-dark font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-sm mx-auto space-y-4 px-2 mt-6">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Proceed to Checkout'}
            </button>
            <BackToProductButton />
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage
