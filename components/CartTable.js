import { useState, useEffect } from 'react'
import { useUpdateCartQuantityContext } from '@/context/Store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Price from '@/components/Price'
import { getCartSubTotal } from '@/utils/helpers'

function CartTable({ cart }) {
  const updateCartQuantity = useUpdateCartQuantityContext()
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    setCartItems(cart)
    setSubtotal(getCartSubTotal(cart))
  }, [cart])

  function updateItem(id, quantity) {
    updateCartQuantity(id, quantity)
  }

  return (
    <div className="min-h-40 max-w-2xl my-2 sm:my-8 mx-auto w-full">
      {cartItems.length === 0 ? (
        // Empty cart message
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to discover amazing kids fashion!
          </p>
          <div className="space-y-3">
            <Link href="/" passHref>
              <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-palette-primary hover:bg-palette-dark transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping
              </a>
            </Link>
            <div className="text-sm text-gray-500">
              <p>✨ Free shipping on orders over ৳1000</p>
              <p>🎁 Get 10% off on your first order</p>
            </div>
          </div>
        </div>
      ) : (
        // Cart table
        <table className="mx-auto">
          <thead>
            <tr className="uppercase text-xs sm:text-sm text-palette-primary border-b border-palette-light">
              <th className="font-primary font-normal px-6 py-4">Product</th>
              <th className="font-primary font-normal px-6 py-4">Quantity</th>
              <th className="font-primary font-normal px-6 py-4 hidden sm:table-cell">Price</th>
              <th className="font-primary font-normal px-6 py-4">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-palette-lighter">
            {cartItems.map(item => (
              <tr key={`${item.productId}-${item.variantId || 'no-variant'}`} className="text-sm sm:text-base text-gray-600 text-center">
                <td className="font-primary font-medium px-4 sm:px-6 py-4 flex items-center">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    height={64}
                    width={64}
                    className={`hidden sm:inline-flex`}
                  />
                  <Link passHref href={`/products/${item.productHandle}`}>
                    <a className="pt-1 hover:text-palette-dark">
                      {item.productTitle}
                      {item.variantTitle && (
                        <span className="block text-xs text-gray-500">Size: {item.variantTitle}</span>
                      )}
                    </a>
                  </Link>
                </td>
                <td className="font-primary font-medium px-4 sm:px-6 py-4">
                  <input
                    type="number"
                    inputMode="numeric"
                    id="variant-quantity"
                    name="variant-quantity"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(`${item.productId}-${item.variantId || 'no-variant'}`, e.target.value)}
                    className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
                  />
                </td>
                <td className="font-primary text-base font-light px-4 sm:px-6 py-4 hidden sm:table-cell">
                  <Price
                    currency="৳"
                    num={item.price}
                    numSize="text-lg"
                  />
                </td>
                <td className="font-primary font-medium px-4 sm:px-6 py-4">
                  <button
                    aria-label="delete-item"
                    className=""
                    onClick={() => updateItem(`${item.productId}-${item.variantId || 'no-variant'}`, 0)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-8 h-8 text-palette-primary border border-palette-primary p-1 hover:bg-palette-lighter" />
                  </button>
                </td>
              </tr>
            ))}
            {
              subtotal === 0 ?
                null
                :
                <tr className="text-center">
                  <td></td>
                  <td className="font-primary text-base text-gray-600 font-semibold uppercase px-4 sm:px-6 py-4">Subtotal</td>
                  <td className="font-primary text-lg text-palette-primary font-medium px-4 sm:px-6 py-4">
                    <Price
                      currency="৳"
                      num={subtotal}
                      numSize="text-xl"
                    />
                  </td>
                  <td></td>
                </tr>
            }
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CartTable
