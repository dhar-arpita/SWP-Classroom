import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

 
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    // password encrypt করা
    const hashedPassword = await bcrypt.hash(password, 10)

    // user বানানো
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    })

    res.status(201).json({ message: 'Registration successful', userId: user.id })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // user খোঁজা
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    // password check
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    // JWT token বানানো
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}