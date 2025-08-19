import { useState, useMemo, memo, useEffect } from 'react'
import BackToProductButton from '@/components/BackToProductButton'
import ProductInfo from '@/components/ProductInfo'
import ProductForm from '@/components/ProductForm'
import { MetaPixelEvents } from './MetaPixel'

const ProductDetails = memo(function ProductDetails({ productData }) {
  const defaultPrice = useMemo(() => 
    productData.variants?.[0]?.price || productData.price, 
    [productData.variants, productData.price]
  )
  const [variantPrice, setVariantPrice] = useState(defaultPrice)

  // Track ViewContent when product is viewed
  useEffect(() => {
    if (productData) {
      MetaPixelEvents.viewContent({
        id: productData.id,
        name: productData.title,
        category: productData.category || 'Kids Fashion',
        price: defaultPrice
      })
    }
  }, [productData, defaultPrice])

  return (
    <div className="flex flex-col justify-between h-full w-full md:w-1/2 max-w-xs mx-auto space-y-4 min-h-128">
      <BackToProductButton />
      <ProductInfo 
        title={productData.title}
        description={productData.description}
        price={variantPrice}
      />
      <ProductForm 
        title={productData.title}
        handle={productData.handle}
        product={productData}
        mainImg={productData.images?.[0] || '/images/placeholder.jpg'}
        setVariantPrice={setVariantPrice}
      />
    </div>
  )
})

export default ProductDetails
