import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (req, res) => {
  try {
    const { name, email, mobileNo, password, role } = req.body

    if (!mobileNo) {
      return res.status(400).json({ message: 'Mobile number is required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already exists' })


    const existingmobile = await prisma.user.findUnique({ where: { mobileNo } })
    if (existingmobile) return res.status(400).json({ message: 'Mobile number already exists' })

    // password encrypt করা
    const hashedPassword = await bcrypt.hash(password, 10)

    // user বানানো
    const user = await prisma.user.create({
      data: { name, email: email || null, mobileNo, password: hashedPassword, role }
    })

    res.status(201).json({ message: 'Registration successful', userId: user.id })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier) {
      return res.status(400).json({ message: 'Email or mobile is required' })
    }

    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobileNo: identifier }
        ]
      }
    })

    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    )

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}