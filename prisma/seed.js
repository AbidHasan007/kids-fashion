const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample products with variants
  const products = [
    {
      title: 'Kids Summer Dress',
      description: 'Beautiful summer dress for kids, perfect for outdoor activities',
      handle: 'kids-summer-dress',
      price: 1200.00,
      compareAtPrice: 1500.00,
      images: ['/images/demo-store.gif'],
      category: 'Dresses',
      tags: ['summer', 'dress', 'girls'],
      inventory: 50,
      isActive: true,
      variants: [
        { title: '2-3 Years', price: 1100.00, inventory: 15, sku: 'SUMMER-DRESS-2-3' },
        { title: '4-5 Years', price: 1200.00, inventory: 20, sku: 'SUMMER-DRESS-4-5' },
        { title: '6-7 Years', price: 1300.00, inventory: 15, sku: 'SUMMER-DRESS-6-7' }
      ]
    },
    {
      title: 'Boys Casual Shirt',
      description: 'Comfortable casual shirt for boys, made from premium cotton',
      handle: 'boys-casual-shirt',
      price: 800.00,
      compareAtPrice: 1000.00,
      images: ['/images/demo-store.gif'],
      category: 'Shirts',
      tags: ['casual', 'shirt', 'boys'],
      inventory: 75,
      isActive: true,
      variants: [
        { title: 'Small (3-4 Years)', price: 750.00, inventory: 25, sku: 'CASUAL-SHIRT-S' },
        { title: 'Medium (5-6 Years)', price: 800.00, inventory: 30, sku: 'CASUAL-SHIRT-M' },
        { title: 'Large (7-8 Years)', price: 850.00, inventory: 20, sku: 'CASUAL-SHIRT-L' }
      ]
    },
    {
      title: 'Kids Winter Jacket',
      description: 'Warm and cozy winter jacket for kids',
      handle: 'kids-winter-jacket',
      price: 2000.00,
      compareAtPrice: 2500.00,
      images: ['/images/demo-store.gif'],
      category: 'Outerwear',
      tags: ['winter', 'jacket', 'warm'],
      inventory: 30,
      isActive: true,
      variants: [
        { title: 'Small (2-3 Years)', price: 1800.00, inventory: 10, sku: 'WINTER-JACKET-S' },
        { title: 'Medium (4-5 Years)', price: 2000.00, inventory: 12, sku: 'WINTER-JACKET-M' },
        { title: 'Large (6-7 Years)', price: 2200.00, inventory: 8, sku: 'WINTER-JACKET-L' }
      ]
    },
    {
      title: 'Girls Party Dress',
      description: 'Elegant party dress for special occasions',
      handle: 'girls-party-dress',
      price: 1800.00,
      compareAtPrice: 2200.00,
      images: ['/images/demo-store.gif'],
      category: 'Dresses',
      tags: ['party', 'dress', 'girls', 'formal'],
      inventory: 25,
      isActive: true,
      variants: [
        { title: '3-4 Years', price: 1700.00, inventory: 8, sku: 'PARTY-DRESS-3-4' },
        { title: '5-6 Years', price: 1800.00, inventory: 10, sku: 'PARTY-DRESS-5-6' },
        { title: '7-8 Years', price: 1900.00, inventory: 7, sku: 'PARTY-DRESS-7-8' }
      ]
    },
    {
      title: 'Boys Denim Jeans',
      description: 'Durable denim jeans for active boys',
      handle: 'boys-denim-jeans',
      price: 1200.00,
      compareAtPrice: 1500.00,
      images: ['/images/demo-store.gif'],
      category: 'Pants',
      tags: ['denim', 'jeans', 'boys'],
      inventory: 60,
      isActive: true,
      variants: [
        { title: 'Small (3-4 Years)', price: 1100.00, inventory: 20, sku: 'DENIM-JEANS-S' },
        { title: 'Medium (5-6 Years)', price: 1200.00, inventory: 25, sku: 'DENIM-JEANS-M' },
        { title: 'Large (7-8 Years)', price: 1300.00, inventory: 15, sku: 'DENIM-JEANS-L' }
      ]
    }
  ]

  for (const productData of products) {
    const { variants, ...product } = productData
    
    const createdProduct = await prisma.product.upsert({
      where: { handle: product.handle },
      update: product,
      create: product
    })

    // Create variants for the product
    for (const variantData of variants) {
      await prisma.productVariant.upsert({
        where: { 
          productId_title: {
            productId: createdProduct.id,
            title: variantData.title
          }
        },
        update: {
          price: variantData.price,
          inventory: variantData.inventory,
          sku: variantData.sku
        },
        create: {
          productId: createdProduct.id,
          title: variantData.title,
          price: variantData.price,
          inventory: variantData.inventory,
          sku: variantData.sku
        }
      })
    }
  }

  console.log('Sample products with variants created successfully!')

  // Create sample leads
  const leads = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+880 1234-567890',
      message: 'I would like to know about your return policy',
      source: 'Contact Form',
      status: 'NEW'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+880 9876-543210',
      message: 'Do you have size 6 for the summer dress?',
      source: 'Contact Form',
      status: 'CONTACTED'
    }
  ]

  for (const lead of leads) {
    await prisma.lead.create({
      data: lead
    })
  }

  console.log('Sample leads created successfully!')

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 