import { getAllProducts, createProduct } from '@/lib/database'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await getAllProducts()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const product = await createProduct(req.body)
      res.status(201).json(product)
    } catch (error) {
      console.error('Error creating product:', error)
      res.status(500).json({ error: 'Failed to create product' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 