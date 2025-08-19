import { getProductByHandle, getProductById, updateProduct, deleteProduct } from '@/lib/database'

export default async function handler(req, res) {
  const { handle } = req.query

  if (req.method === 'GET') {
    try {
      console.log('API: Received request for handle/id:', handle)
      
      let product
      // Check if this looks like a CUID (starts with 'c' and is 25 characters long)
      const isId = handle.startsWith('c') && handle.length === 25
      console.log('API: Is ID?', isId, 'ID:', handle)
      
      if (isId) {
        console.log('API: Fetching by ID')
        product = await getProductById(handle)
      } else {
        console.log('API: Fetching by handle')
        product = await getProductByHandle(handle)
      }
      
      console.log('API: Product found:', !!product)
      
      if (!product) {
        console.log('API: Product not found, returning 404')
        return res.status(404).json({ error: 'Product not found' })
      }
      
      console.log('API: Returning product')
      res.status(200).json(product)
    } catch (error) {
      console.error('API: Error:', error)
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      console.log('API: PUT request for handle/id:', handle)
      console.log('API: Request body:', req.body)
      
      const isId = handle.startsWith('c') && handle.length === 25
      console.log('API: Is ID?', isId, 'ID:', handle)
      
      if (!isId) {
        console.log('API: Invalid product ID')
        return res.status(400).json({ error: 'Invalid product ID' })
      }

      console.log('API: Calling updateProduct')
      const product = await updateProduct(handle, req.body)
      console.log('API: Update successful:', product)
      res.status(200).json(product)
    } catch (error) {
      console.error('API: Error updating product:', error)
      res.status(500).json({ error: 'Failed to update product: ' + error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const isId = handle.startsWith('c') && handle.length === 25
      if (!isId) {
        return res.status(400).json({ error: 'Invalid product ID' })
      }

      await deleteProduct(handle)
      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting product:', error)
      res.status(500).json({ error: 'Failed to delete product' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 