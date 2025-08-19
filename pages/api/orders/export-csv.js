import { getAllOrders } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { startDate, endDate, status } = req.query
    
    // Get all orders
    let orders = await getAllOrders()
    
    // Apply date filter if provided
    if (startDate && endDate) {
      orders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        // Extract just the date part (YYYY-MM-DD) for comparison
        const orderDateStr = orderDate.toISOString().split('T')[0]
        
        // Compare date strings directly
        return orderDateStr >= startDate && orderDateStr <= endDate
      })
    }
    
    // Apply status filter if provided
    if (status && status !== 'ALL') {
      orders = orders.filter(order => order.status === status)
    }

    // Prepare CSV data
    const headers = [
      'Invoice',
      'Name',
      'Address',
      'Phone',
      'Amount',
      'Note'
    ]

    const csvRows = [headers.join(',')]

    orders.forEach(order => {
      // Combine address components
      const fullAddress = [
        order.shippingAddress,
        order.shippingCity,
        order.shippingState,
        order.shippingZipCode,
        order.shippingCountry
      ].filter(Boolean).join(', ')

      // Combine notes with order items
      const itemsString = order.orderItems?.map(item => 
        `${item.product?.title || 'Unknown Product'} (Qty: ${item.quantity})`
      ).join(', ') || 'No items'
      
      const orderNotes = [
        order.notes,
        `Items: ${itemsString}`,
        `Payment: ${order.paymentMethod || 'Cash on Delivery'}`,
        `Status: ${order.status || 'Pending'}`
      ].filter(Boolean).join(' | ')

      const row = [
        order.orderNumber || '',
        order.customerName || '',
        `"${fullAddress}"`,
        order.customerPhone || '',
        order.total || 0,
        `"${orderNotes}"`
      ]

      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')

    // Generate filename
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-')
    let filename = `orders_export_${timestamp}.csv`
    
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString().slice(0, 10)
      const end = new Date(endDate).toISOString().slice(0, 10)
      filename = `orders_${start}_to_${end}_${timestamp}.csv`
    }

    // Set response headers
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    res.send(csvContent)

  } catch (error) {
    console.error('Error exporting orders to CSV:', error)
    res.status(500).json({ 
      error: 'Failed to export orders to CSV', 
      details: error.message
    })
  }
}
