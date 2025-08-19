import * as XLSX from 'xlsx'
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

    // Prepare data for Excel export
    const excelData = orders.map(order => {
      // Combine address components
      const fullAddress = [
        order.shippingAddress,
        order.shippingCity,
        order.shippingState,
        order.shippingZipCode,
        order.shippingCountry
      ].filter(Boolean).join(', ')

      // Combine notes with order items if needed
      const itemsString = order.orderItems?.map(item => 
        `${item.product?.title || 'Unknown Product'} (Qty: ${item.quantity})`
      ).join(', ') || 'No items'
      
      const orderNotes = [
        order.notes,
        `Items: ${itemsString}`,
        `Payment: ${order.paymentMethod || 'Cash on Delivery'}`,
        `Status: ${order.status || 'Pending'}`
      ].filter(Boolean).join(' | ')

      const rowData = {
        'Invoice': order.orderNumber || '',
        'Name': order.customerName || '',
        'Address': fullAddress,
        'Phone': order.customerPhone || '',
        'Amount': order.total || 0,
        'Note': orderNotes
      }
      
      return rowData
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    
    // Ensure we have data
    if (excelData.length === 0) {
      excelData.push({
        'Invoice': 'No Orders Found',
        'Name': '',
        'Address': '',
        'Phone': '',
        'Amount': '',
        'Note': ''
      })
    }
    
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Invoice
      { wch: 25 }, // Name
      { wch: 50 }, // Address
      { wch: 15 }, // Phone
      { wch: 12 }, // Amount
      { wch: 60 }  // Note
    ]
    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    // Generate filename with date range
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-')
    let filename = `orders_export_${timestamp}.xlsx`
    
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString().slice(0, 10)
      const end = new Date(endDate).toISOString().slice(0, 10)
      filename = `orders_${start}_to_${end}_${timestamp}.xlsx`
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    // Write to buffer and send
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    res.send(buffer)

  } catch (error) {
    console.error('Error exporting orders:', error)
    res.status(500).json({ 
      error: 'Failed to export orders', 
      details: error.message
    })
  }
}
