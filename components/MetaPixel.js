import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Meta Pixel Helper Functions
export const initializeMetaPixel = (pixelId) => {
  if (typeof window === 'undefined' || !pixelId) return
  
  window.fbq = window.fbq || function() {
    window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)
  }
  
  if (!window._fbq) {
    window._fbq = window.fbq
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []
    
    // Load the Meta Pixel script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }
  
  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`Meta Pixel tracking: ${eventName}`, parameters)
    window.fbq('track', eventName, parameters)
  }
}

export const trackCustomEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`Meta Pixel custom tracking: ${eventName}`, parameters)
    window.fbq('trackCustom', eventName, parameters)
  }
}

// Meta Pixel Component
export default function MetaPixel() {
  const router = useRouter()
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  useEffect(() => {
    if (!pixelId) {
      console.warn('Meta Pixel ID not found. Add NEXT_PUBLIC_META_PIXEL_ID to your environment variables.')
      return
    }

    // Initialize Meta Pixel
    initializeMetaPixel(pixelId)

    // Track route changes
    const handleRouteChange = (url) => {
      window.fbq('track', 'PageView')
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, pixelId])

  if (!pixelId) return null

  return (
    <>
      {/* Meta Pixel noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Predefined event functions for easy use
export const MetaPixelEvents = {
  // E-commerce events
  viewContent: (contentData) => trackEvent('ViewContent', {
    content_type: 'product',
    content_ids: [contentData.id],
    content_name: contentData.name,
    content_category: contentData.category,
    value: contentData.price,
    currency: 'BDT'
  }),

  addToCart: (productData) => trackEvent('AddToCart', {
    content_ids: [productData.id],
    content_name: productData.name,
    content_type: 'product',
    value: productData.price,
    currency: 'BDT'
  }),

  initiateCheckout: (cartData) => trackEvent('InitiateCheckout', {
    content_ids: cartData.items.map(item => item.id),
    contents: cartData.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    })),
    value: cartData.total,
    currency: 'BDT',
    num_items: cartData.items.length
  }),

  purchase: (orderData) => trackEvent('Purchase', {
    content_ids: orderData.items.map(item => item.id),
    contents: orderData.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    })),
    value: orderData.total,
    currency: 'BDT',
    transaction_id: orderData.orderNumber
  }),

  // Lead generation events
  lead: (leadData) => trackEvent('Lead', {
    content_name: 'Contact Form',
    content_category: 'Lead Generation',
    value: 0,
    currency: 'BDT',
    source: leadData.source || 'Contact Form'
  }),

  completeRegistration: (userData) => trackEvent('CompleteRegistration', {
    content_name: 'User Registration',
    value: 0,
    currency: 'BDT'
  }),

  // Custom events for your business
  contactFormSubmit: (formData) => trackCustomEvent('ContactFormSubmit', {
    content_name: 'Contact Form Submission',
    lead_type: 'inquiry',
    source: formData.source || 'website'
  }),

  productInquiry: (productData) => trackCustomEvent('ProductInquiry', {
    content_ids: [productData.id],
    content_name: productData.name,
    content_category: productData.category,
    inquiry_type: 'product_question'
  })
}
