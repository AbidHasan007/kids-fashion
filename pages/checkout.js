import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCartContext, useClearCartContext } from '@/context/Store'
import { getCartSubTotal, getCartTotal, formatPrice } from '@/utils/helpers'
import { MetaPixelEvents } from '@/components/MetaPixel'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [cart, isLoading] = useCartContext()
  const clearCart = useClearCartContext()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    notes: ''
  })

  const shippingCost = 80 // Fixed shipping cost in BDT
  const subtotal = getCartSubTotal(cart)
  const total = getCartTotal(cart, shippingCost)

  // Track InitiateCheckout when component loads with items in cart
  useEffect(() => {
    if (cart.length > 0) {
      MetaPixelEvents.initiateCheckout({
        items: cart.map(item => ({
          id: item.productId,
          quantity: item.quantity
        })),
        total: total
      })
    }
  }, [cart, total])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    // Basic validation
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || 
        !formData.shippingAddress || !formData.shippingCity || !formData.shippingState) {
      toast.error('Please fill in all required fields!')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        total,
        subtotal,
        shippingCost,
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingCountry: 'Bangladesh',
        notes: formData.notes,
        orderItems: {
          create: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }

      console.log('Cart data:', cart)
      console.log('Order data being sent:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        
        // Track purchase event with Meta Pixel
        MetaPixelEvents.purchase({
          orderNumber: order.orderNumber,
          total: total,
          items: cart.map(item => ({
            id: item.productId,
            quantity: item.quantity
          }))
        })
        
        toast.success('Order placed successfully!')
        // Clear cart and redirect to order confirmation
        await clearCart()
        router.push(`/order-confirmation/${order.orderNumber}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to place order!')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order!')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl text-palette-primary font-bold mb-8 text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl  text-palette-dark font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl text-palette-dark font-semibold mb-4">Customer Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Division *
                    </label>
                    <input
                      type="text"
                      name="shippingState"
                      value={formData.shippingState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Method</h3>
                  <p className="text-blue-700">Cash on Delivery</p>
                  <p className="text-sm text-blue-600 mt-1">Pay when you receive your order</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
} 