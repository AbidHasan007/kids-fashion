import prisma from './prisma'
import { sampleProducts } from './sample-data'
// import cache from './cache'

// Product functions
export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        variants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    console.log('Using sample data due to database connection error')
    return sampleProducts
  }
}

export async function createProduct(productData) {
  try {
    const { variants, ...productInfo } = productData

    const product = await prisma.product.create({
      data: {
        ...productInfo,
        isActive: true,
        variants: {
          create: variants.map(variant => ({
            title: variant.title,
            price: variant.price,
            inventory: variant.inventory,
            sku: variant.sku
          }))
        }
      },
      include: {
        variants: true
      }
    })
    return product
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Could not create product!')
  }
}

export async function getProductById(id) {
  try {
    console.log('Database: Fetching product by ID:', id, 'Type:', typeof id)
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      include: {
        variants: true
      }
    })
    console.log('Database: Product found:', !!product, 'Product:', product)
    return product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw new Error('Could not fetch product!')
  }
}

export async function updateProduct(id, productData) {
  try {
    console.log('Database: Updating product with ID:', id)
    console.log('Database: Product data:', productData)
    
    const { variants, ...productInfo } = productData
    console.log('Database: Product info (without variants):', productInfo)
    console.log('Database: Variants to create:', variants)

    // First, delete existing variants
    console.log('Database: Deleting existing variants')
    await prisma.productVariant.deleteMany({
      where: { productId: String(id) }
    })
    console.log('Database: Existing variants deleted')

    // Then update the product and create new variants
    console.log('Database: Updating product and creating variants')
    const product = await prisma.product.update({
      where: { id: String(id) },
      data: {
        ...productInfo,
        variants: {
          create: variants.map(variant => ({
            title: variant.title,
            price: variant.price,
            inventory: variant.inventory,
            sku: variant.sku
          }))
        }
      },
      include: {
        variants: true
      }
    })
    console.log('Database: Product updated successfully:', product)
    return product
  } catch (error) {
    console.error('Database: Error updating product:', error)
    throw new Error('Could not update product: ' + error.message)
  }
}

export async function deleteProduct(id) {
  try {
    // Delete variants first (due to foreign key constraint)
    await prisma.productVariant.deleteMany({
      where: { productId: String(id) }
    })

    // Then delete the product
    await prisma.product.delete({
      where: { id: String(id) }
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Could not delete product!')
  }
}

export async function getProductByHandle(handle) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        handle: handle
      },
      include: {
        variants: true
      }
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    console.log('Using sample data due to database connection error')
    return sampleProducts.find(p => p.handle === handle) || null
  }
}

export async function getProductSlugs() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        handle: true
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching product slugs:', error)
    throw new Error('Could not fetch product slugs!')
  }
}

// Order functions
export async function createOrder(orderData) {
  try {
    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true
          }
        },
        customer: {
          include: {
            user: true
          }
        }
      }
    })
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Could not create order!')
  }
}

export async function getOrderById(id) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true
          }
        },
        customer: {
          include: {
            user: true
          }
        }
      }
    })
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Could not fetch order!')
  }
}

export async function getOrderByNumber(orderNumber) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true
          }
        },
        customer: {
          include: {
            user: true
          }
        }
      }
    })
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Could not fetch order!')
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })
    return order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw new Error('Could not update order status!')
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true
          }
        },
        customer: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    console.log('Using sample orders data due to database connection error')
    // Return sample orders data when database is unavailable
    return [
      {
        id: 'sample-order-1',
        orderNumber: 'ORD-001',
        customerId: null,
        status: 'CONFIRMED',
        total: 2500,
        subtotal: 2400,
        shippingCost: 100,
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PAID',
        customerName: 'John Doe',
        customerPhone: '+880 1234-567890',
        customerEmail: 'john@example.com',
        shippingAddress: '123 Main St',
        shippingCity: 'Dhaka',
        shippingState: 'Dhaka',
        shippingZipCode: '1200',
        shippingCountry: 'Bangladesh',
        notes: 'Sample order for testing',
        createdAt: new Date('2025-08-19T10:00:00Z'),
        updatedAt: new Date('2025-08-19T10:00:00Z'),
        orderItems: [
          {
            id: 'item-1',
            orderId: 'sample-order-1',
            productId: 'sample-1',
            variantId: 'variant-1',
            quantity: 2,
            price: 1200,
            createdAt: new Date('2025-08-19T10:00:00Z'),
            product: {
              id: 'sample-1',
              title: 'Boys Denim Jeans',
              handle: 'boys-denim-jeans'
            },
            variant: {
              id: 'variant-1',
              title: 'Size 6-7',
              price: 1200
            }
          }
        ],
        customer: null
      },
      {
        id: 'sample-order-2',
        orderNumber: 'ORD-002',
        customerId: null,
        status: 'PENDING',
        total: 1800,
        subtotal: 1700,
        shippingCost: 100,
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PENDING',
        customerName: 'Jane Smith',
        customerPhone: '+880 9876-543210',
        customerEmail: 'jane@example.com',
        shippingAddress: '456 Oak Ave',
        shippingCity: 'Chittagong',
        shippingState: 'Chittagong',
        shippingZipCode: '4000',
        shippingCountry: 'Bangladesh',
        notes: 'Another sample order',
        createdAt: new Date('2025-08-19T11:00:00Z'),
        updatedAt: new Date('2025-08-19T11:00:00Z'),
        orderItems: [
          {
            id: 'item-2',
            orderId: 'sample-order-2',
            productId: 'sample-2',
            variantId: 'variant-2',
            quantity: 1,
            price: 1800,
            createdAt: new Date('2025-08-19T11:00:00Z'),
            product: {
              id: 'sample-2',
              title: 'Girls Summer Dress',
              handle: 'girls-summer-dress'
            },
            variant: {
              id: 'variant-2',
              title: 'Size 8-9',
              price: 1800
            }
          }
        ],
        customer: null
      }
    ]
  }
}



// Customer functions
export async function createCustomer(customerData) {
  try {
    const customer = await prisma.customer.create({
      data: customerData,
      include: {
        user: true
      }
    })
    return customer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Could not create customer!')
  }
}

export async function findOrCreateCustomer(customerData) {
  try {
    // First try to find existing customer by email
    let customer = await prisma.customer.findUnique({
      where: { email: customerData.email }
    })

    if (!customer) {
      // Create new customer if not found
      customer = await prisma.customer.create({
        data: customerData
      })
    }

    return customer
  } catch (error) {
    console.error('Error finding or creating customer:', error)
    throw new Error('Could not find or create customer!')
  }
}

export async function getAllCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to include calculated fields
    const customersWithStats = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
      const sortedOrders = customer.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const lastOrderDate = sortedOrders.length > 0 
        ? sortedOrders[0].createdAt 
        : null

      return {
        ...customer,
        totalSpent,
        lastOrderDate,
        _count: {
          orders: customer.orders.length
        }
      }
    })

    return customersWithStats
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Could not fetch customers!')
  }
}

export async function getCustomerById(id) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
                variant: true
              }
            }
          }
        }
      }
    })
    return customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw new Error('Could not fetch customer!')
  }
}

// Lead functions
export async function createLead(leadData) {
  try {
    const lead = await prisma.lead.create({
      data: leadData
    })
    return lead
  } catch (error) {
    console.error('Error creating lead:', error)
    console.log('Database unavailable, returning mock lead data')
    // Return mock lead data when database is unavailable
    return {
      id: `mock-lead-${Date.now()}`,
      ...leadData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}

export async function getAllLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return leads
  } catch (error) {
    console.error('Error fetching leads:', error)
    console.log('Using sample leads data due to database connection error')
    // Return sample leads data when database is unavailable
    return [
      {
        id: 'sample-lead-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+880 1234-567890',
        message: 'I would like to know about your return policy',
        source: 'Contact Form',
        status: 'NEW',
        assignedTo: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: null,
        user: null
      },
      {
        id: 'sample-lead-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+880 9876-543210',
        message: 'Do you have size 6 for the summer dress?',
        source: 'Contact Form',
        status: 'CONTACTED',
        assignedTo: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: null,
        user: null
      }
    ]
  }
}

export async function updateLeadStatus(id, status, assignedTo = null) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        status,
        assignedTo,
        updatedAt: new Date()
      }
    })
    return lead
  } catch (error) {
    console.error('Error updating lead status:', error)
    throw new Error('Could not update lead status!')
  }
}

// User functions
export async function createUser(userData) {
  try {
    const user = await prisma.user.create({
      data: userData
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Could not create user!')
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Could not fetch user!')
  }
}

export async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        customer: true
      }
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Could not fetch user!')
  }
}

// Admin functions
export async function getAdminStats() {
  try {
    // Count each model individually (Promise.all seems to have issues in this setup)
    const totalOrders = await prisma.order.count()
    const totalProducts = await prisma.product.count()
    const totalLeads = await prisma.lead.count()
    const totalCustomers = await prisma.customer.count()

    const recentOrders = await prisma.order.findMany({
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const pendingLeads = await prisma.lead.count({
      where: {
        status: 'NEW'
      }
    })

    return {
      totalOrders,
      totalProducts,
      totalLeads,
      totalCustomers,
      recentOrders,
      pendingLeads
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    console.log('Using sample admin stats due to database connection error')
    // Return sample admin stats when database is unavailable
    return {
      totalOrders: 15,
      totalProducts: 8,
      totalLeads: 12,
      totalCustomers: 25,
      recentOrders: [
        {
          id: 'sample-order-1',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          total: 2500,
          status: 'CONFIRMED',
          createdAt: new Date()
        },
        {
          id: 'sample-order-2',
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          total: 1800,
          status: 'PENDING',
          createdAt: new Date()
        }
      ],
      pendingLeads: 5
    }
  }
} 