import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      // Preload critical CSS
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = '/_next/static/css/app.css'
      document.head.appendChild(link)

      // Preload critical fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.as = 'font'
      fontLink.crossOrigin = 'anonymous'
      fontLink.href = '/fonts/inter-var.woff2'
      document.head.appendChild(fontLink)
    }

    // Prefetch critical pages
    const prefetchPages = () => {
      const pages = ['/products', '/cart', '/checkout']
      pages.forEach(page => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = page
        document.head.appendChild(link)
      })
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach(img => imageObserver.observe(img))
    }

    preloadResources()
    prefetchPages()
    optimizeImages()

    return () => {
      // Cleanup
    }
  }, [])

  return null
}
