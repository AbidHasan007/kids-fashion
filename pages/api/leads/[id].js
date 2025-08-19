import { updateLeadStatus } from '@/lib/database'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    try {
      const { status, assignedTo } = req.body
      const lead = await updateLeadStatus(id, status, assignedTo)
      res.status(200).json(lead)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 