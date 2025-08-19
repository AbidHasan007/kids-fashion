import { getAdminStats } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const stats = await getAdminStats()
      res.status(200).json(stats)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 