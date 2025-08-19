import { getAllCustomers } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const customers = await getAllCustomers()
    res.status(200).json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}
