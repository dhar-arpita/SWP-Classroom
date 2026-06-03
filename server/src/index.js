import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config()

import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server চলছে!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})