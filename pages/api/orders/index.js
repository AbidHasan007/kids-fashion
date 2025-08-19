import { createOrder, getAllOrders, getOrderByNumber, findOrCreateCustomer } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const orderData = req.body
      
      console.log('API received order data:', orderData)
      
      // Generate simple numeric order number
      const timestamp = Date.now()
      const orderNum = timestamp.toString().slice(-6)
      orderData.orderNumber = orderNum
      
      // Create or find customer record
      const customerData = {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        address: orderData.shippingAddress,
        city: orderData.shippingCity,
        state: orderData.shippingState,
        zipCode: orderData.shippingZipCode,
        country: orderData.shippingCountry || 'Bangladesh'
      }

      const customer = await findOrCreateCustomer(customerData)
      orderData.customerId = customer.id
      
      console.log('API processed order data:', orderData)
      
      const order = await createOrder(orderData)
      res.status(201).json(order)
    } catch (error) {
      console.error('Order creation error:', error)
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'GET') {
    try {
      const { orderNumber } = req.query
      
      if (orderNumber) {
        // Fetch specific order by order number
        const order = await getOrderByNumber(orderNumber)
        if (order) {
          res.status(200).json(order)
        } else {
          res.status(404).json({ error: 'Order not found' })
        }
      } else {
        // Fetch all orders
        const orders = await getAllOrders()
        res.status(200).json(orders)
      }
    } catch (error) {
      console.error('Error fetching order(s):', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 