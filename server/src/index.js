import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import enrollmentRoutes from './routes/enrollments.js'

const app = express()


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin === 'https://swp-classroom.vercel.app') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
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
console.log('Listen call done, server should stay alive...')