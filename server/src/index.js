import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()

import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'

const app = express()


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://swp-classroom.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server চলছে!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server on ${PORT}`))