import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// In a real app, you'd store this in the database
// For now, we'll use a simple admin user
const ADMIN_USER = {
  id: 1,
  email: 'admin@kidsfashion.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
  role: 'ADMIN'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user exists
    if (email !== ADMIN_USER.email) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, ADMIN_USER.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: ADMIN_USER.id, 
        email: ADMIN_USER.email, 
        role: ADMIN_USER.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`)

    res.status(200).json({ 
      success: true, 
      user: { 
        id: ADMIN_USER.id, 
        email: ADMIN_USER.email, 
        role: ADMIN_USER.role 
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
