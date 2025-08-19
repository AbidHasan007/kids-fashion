module.exports = {
  env: {
    siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE || 'Kids Fashion Store',
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Premium kids fashion with cash on delivery',
    siteKeywords: 'kids, fashion, clothing, children, bangladesh',
    siteUrl: process.env.NEXTAUTH_URL || 'https://kidsfashion.com',
    siteImagePreviewUrl: '/images/main.jpg',
    twitterHandle: '@kidsfashion'
  },
  images: {
    domains: ['localhost', 'vercel.app', 'vercel.com', 'wchpqyitbvjkpxrcfsag.supabase.co', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}
