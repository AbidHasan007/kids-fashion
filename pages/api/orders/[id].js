import { getOrderById, updateOrderStatus } from '@/lib/database'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const order = await getOrderById(id)
      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PATCH') {
    try {
      const { status } = req.body
      const order = await updateOrderStatus(id, status)
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 