import { getProductSlugs, getProductByHandle } from '@/lib/database'
import ProductSection from '@/components/ProductSection'
import LoadingSpinner from '@/components/LoadingSpinner'

function ProductPage({ productData }) {  
  if (!productData) {
    return (
      <div className="min-h-screen py-12 sm:pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 sm:pt-20">
      <ProductSection productData={productData} />
    </div>
  )
}

export async function getStaticPaths() {
  try {
    const productSlugs = await getProductSlugs()

    const paths = productSlugs.map((product) => {    
      return {
        params: { product: product.handle }
      }
    })

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error generating paths:', error)
    // Return sample paths when database is not available
    return {
      paths: [
        { params: { product: 'boys-denim-jeans' } },
        { params: { product: 'girls-summer-dress' } },
        { params: { product: 'kids-winter-jacket' } }
      ],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({ params }) {
  const startTime = Date.now()
  try {
    const productData = await getProductByHandle(params.product)  

    if (!productData) {
      return {
        notFound: true
      }
    }

    console.log(`Product page generation time: ${Date.now() - startTime}ms`)

    // Serialize Date objects to strings for JSON compatibility
    const serializedProductData = {
      ...productData,
      createdAt: productData?.createdAt ? new Date(productData.createdAt).toISOString() : null,
      updatedAt: productData?.updatedAt ? new Date(productData.updatedAt).toISOString() : null,
      variants: (productData?.variants || []).map(variant => ({
        ...variant,
        createdAt: variant?.createdAt ? new Date(variant.createdAt).toISOString() : null,
        updatedAt: variant?.updatedAt ? new Date(variant.updatedAt).toISOString() : null
      }))
    }

    return {
      props: {
        productData: serializedProductData,
      },
      revalidate: 300 // Cache for 5 minutes
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true
    }
  }
}

export default ProductPage
