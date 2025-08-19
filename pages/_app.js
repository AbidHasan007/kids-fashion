import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import MetaPixel from '@/components/MetaPixel'
import { CartProvider } from '@/context/Store'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin')

    return (
    <CartProvider>
      <PerformanceOptimizer />
      <MetaPixel />
      {isAdminPage ? (
        <>
          <SEO 
            title={process.env.siteTitle}
          />
          <Component {...pageProps} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
            },
          }}
        />
        </>
      ) : (
        <Layout>
          <SEO 
            title={process.env.siteTitle}
          />
          <Component {...pageProps} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Layout>
      )}
    </CartProvider>
  )
}

export default MyApp
