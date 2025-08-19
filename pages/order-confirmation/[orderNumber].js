import { useRouter } from 'next/router'
import { formatPrice } from '@/utils/helpers'

export default function OrderConfirmationPage({ order }) {
  const router = useRouter()

  if (!order) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
                <p className="text-green-700">Thank you for your order. We'll process it soon.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-BD')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="text-gray-600">Shipping Address:</span>
                  <p className="font-medium">{order.shippingAddress}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingCity}, {order.shippingState}
                    {order.shippingZipCode && `, ${order.shippingZipCode}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product?.title || 'Product'}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const { orderNumber } = params
    
    if (!orderNumber) {
      return {
        props: {
          order: null
        }
      }
    }

    // Fetch order data from the API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orders?orderNumber=${orderNumber}`)
    
    if (response.ok) {
      const order = await response.json()
      return {
        props: {
          order
        }
      }
    } else {
      return {
        props: {
          order: null
        }
      }
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      props: {
        order: null
      }
    }
  }
} 