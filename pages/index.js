import StoreHeading from '@/components/StoreHeading'
import ProductListings from '@/components/ProductListings'
import { getAllProducts } from '@/lib/database'

function IndexPage({ products }) {
  return (
    <div className="mx-auto max-w-6xl">
      <StoreHeading />
      {(!products || products.length === 0) ? (
        <div className="py-16 text-center text-gray-500">No products available right now.</div>
      ) : (
        <ProductListings products={products} />
      )}
    </div>
  )
}

export async function getStaticProps() {
  try {
    const products = await getAllProducts()

    // Serialize Date objects to strings for JSON compatibility
    const serializedProducts = (products || []).map(product => ({
      ...product,
      createdAt: product?.createdAt ? new Date(product.createdAt).toISOString() : null,
      updatedAt: product?.updatedAt ? new Date(product.updatedAt).toISOString() : null,
      variants: (product?.variants || []).map(variant => ({
        ...variant,
        createdAt: variant?.createdAt ? new Date(variant.createdAt).toISOString() : null,
        updatedAt: variant?.updatedAt ? new Date(variant.updatedAt).toISOString() : null
      }))
    }))

    return {
      props: {
        products: serializedProducts || []
      },
      revalidate: 300 // Cache for 5 minutes
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        products: []
      },
      revalidate: 60
    }
  }
}

export default IndexPage
