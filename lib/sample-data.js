export const sampleProducts = [
  {
    id: 'sample-1',
    title: 'Boys Denim Jeans',
    handle: 'boys-denim-jeans',
    description: 'Comfortable and stylish denim jeans for boys. Perfect for everyday wear.',
    category: 'boys',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 'variant-1',
        title: 'Size 6-7',
        price: 1200,
        inventory: 10,
        sku: 'BDJ-6-7',
        productId: 'sample-1'
      },
      {
        id: 'variant-2',
        title: 'Size 8-9',
        price: 1200,
        inventory: 15,
        sku: 'BDJ-8-9',
        productId: 'sample-1'
      }
    ]
  },
  {
    id: 'sample-2',
    title: 'Girls Summer Dress',
    handle: 'girls-summer-dress',
    description: 'Beautiful summer dress for girls. Light and comfortable fabric.',
    category: 'girls',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 'variant-3',
        title: 'Size 4-5',
        price: 1500,
        inventory: 8,
        sku: 'GSD-4-5',
        productId: 'sample-2'
      },
      {
        id: 'variant-4',
        title: 'Size 6-7',
        price: 1500,
        inventory: 12,
        sku: 'GSD-6-7',
        productId: 'sample-2'
      }
    ]
  },
  {
    id: 'sample-3',
    title: 'Kids Winter Jacket',
    handle: 'kids-winter-jacket',
    description: 'Warm and cozy winter jacket for kids. Perfect for cold weather.',
    category: 'kids',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [
      {
        id: 'variant-5',
        title: 'Size 3-4',
        price: 2500,
        inventory: 5,
        sku: 'KWJ-3-4',
        productId: 'sample-3'
      },
      {
        id: 'variant-6',
        title: 'Size 5-6',
        price: 2500,
        inventory: 7,
        sku: 'KWJ-5-6',
        productId: 'sample-3'
      }
    ]
  }
]
