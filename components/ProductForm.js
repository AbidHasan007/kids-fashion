import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useCartContext, useAddToCartContext } from '@/context/Store'
import { MetaPixelEvents } from './MetaPixel'

function ProductForm({ title, handle, product, setVariantPrice, mainImg }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const isLoading = useCartContext()[2]
  const addToCart = useAddToCartContext()

  const atcBtnStyle = isLoading ?
    `pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
                      justify-center items-baseline  hover:bg-palette-dark opacity-25 cursor-none`
    :
    `pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex 
                      justify-center items-baseline  hover:bg-palette-dark`

  function handleVariantChange(variant) {
    setSelectedVariant(variant)
    setVariantPrice(variant.price)
  }

  async function handleAddToCart() {
    // update store context
    if (quantity !== '') {
      // Track AddToCart event
      MetaPixelEvents.addToCart({
        id: product.id,
        name: title,
        price: selectedVariant?.price || product.price
      })
      
      addToCart({
        productId: product.id,
        variantId: selectedVariant?.id,
        productTitle: title,
        productHandle: handle,
        productImage: mainImg,
        price: selectedVariant?.price || product.price,
        variantTitle: selectedVariant?.title,
        quantity: quantity
      })
    }
  }

  function updateQuantity(e) {
    if (e === '') {
      setQuantity('')
    } else {
      setQuantity(Math.floor(e))
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-start space-x-2 w-full">
        <div className="flex flex-col items-start space-y-1 flex-grow-0">
          <label className="text-gray-500 text-base">Qty.</label>
          <input
            type="number"
            inputMode="numeric"
            id="quantity"
            name="quantity"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => updateQuantity(e.target.value)}
            className="text-gray-900 form-input border border-gray-300 w-16 rounded-sm focus:border-palette-light focus:ring-palette-light"
          />
        </div>
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-col items-start space-y-1 flex-grow">
            <label className="text-gray-500 text-base">Size</label>
            <select
              id="variant-selector"
              name="variant-selector"
              onChange={(event) => {
                const variant = product.variants.find(v => v.id === event.target.value)
                handleVariantChange(variant)
              }}
              value={selectedVariant?.id || ''}
              className="form-select border border-gray-300 rounded-sm w-full text-gray-900 focus:border-palette-light focus:ring-palette-light"
            >
              {product.variants.map(variant => (
                <option
                  id={variant.id}
                  key={variant.id}
                  value={variant.id}
                >
                  {variant.title} - ৳{variant.price}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button
        className={atcBtnStyle}
        aria-label="cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
        <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
      </button>
    </div>
  )
}

export default ProductForm
