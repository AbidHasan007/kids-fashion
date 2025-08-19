import { createLead, getAllLeads } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const leadData = req.body
      const lead = await createLead(leadData)
      res.status(201).json(lead)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'GET') {
    try {
      const leads = await getAllLeads()
      res.status(200).json(leads)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 