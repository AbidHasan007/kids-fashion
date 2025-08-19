import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cookies = parse(req.headers.cookie || '')
    const adminToken = cookies.adminToken

    if (!adminToken) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify the token
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET || 'your-secret-key')
    
    res.status(200).json({ 
      authenticated: true, 
      user: { 
        id: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      } 
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
}
