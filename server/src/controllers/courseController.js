import { PrismaClient } from '@prisma/client'
import cloudinary from '../config/cloudinary.js'

const prisma = new PrismaClient()

export const createCourse = async (req, res) => {
  try {
    const { title, description, isPaid, price } = req.body
    const teacherId = req.user.userId

    let thumbnail = null
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'swp-thumbnails' },
          (error, result) => { if (error) reject(error); else resolve(result) }
        ).end(req.file.buffer)
      })
      thumbnail = result.secure_url
    }

    const course = await prisma.course.create({
      data: { title, description, isPaid: isPaid === 'true', price: price ? parseInt(price) : 0, thumbnail, teacherId }
    })
    res.status(201).json({ message: 'Course created!', course })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: { select: { name: true } },
        enrollments: true,
        chapters: {
          include: {
            videos: { include: { materials: true } }
          }
        }
      }
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        teacher: { select: { name: true } },
        enrollments: true,
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            videos: {
              orderBy: { order: 'asc' },
              include: { materials: true }
            }
          }
        }
      }
    })
    if (!course) return res.status(404).json({ message: 'Course not found' })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id)
    const chapters = await prisma.chapter.findMany({ where: { courseId } })
    for (const chapter of chapters) {
      const videos = await prisma.video.findMany({ where: { chapterId: chapter.id } })
      for (const video of videos) {
        await prisma.material.deleteMany({ where: { videoId: video.id } })
      }
      await prisma.video.deleteMany({ where: { chapterId: chapter.id } })
    }
    await prisma.chapter.deleteMany({ where: { courseId } })
    await prisma.courseEnrollment.deleteMany({ where: { courseId } })
    await prisma.course.delete({ where: { id: courseId } })
    res.json({ message: 'Course deleted!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const addChapter = async (req, res) => {
  try {
    const { title } = req.body
    const courseId = parseInt(req.params.id)
    const count = await prisma.chapter.count({ where: { courseId } })
    const chapter = await prisma.chapter.create({
      data: { title, courseId, order: count + 1 }
    })
    res.status(201).json({ message: 'Chapter added!', chapter })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteChapter = async (req, res) => {
  try {
    const chapterId = parseInt(req.params.chapterId)
    const videos = await prisma.video.findMany({ where: { chapterId } })
    for (const video of videos) {
      await prisma.material.deleteMany({ where: { videoId: video.id } })
    }
    await prisma.video.deleteMany({ where: { chapterId } })
    await prisma.chapter.delete({ where: { id: chapterId } })
    res.json({ message: 'Chapter deleted!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const addVideo = async (req, res) => {
  try {
    const { title, url } = req.body
    const chapterId = parseInt(req.params.chapterId)
    const count = await prisma.video.count({ where: { chapterId } })
    const video = await prisma.video.create({
      data: { title, url, chapterId, order: count + 1 }
    })
    res.status(201).json({ message: 'Video added!', video })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteVideo = async (req, res) => {
  try {
    await prisma.material.deleteMany({ where: { videoId: parseInt(req.params.videoId) } })
    await prisma.video.delete({ where: { id: parseInt(req.params.videoId) } })
    res.json({ message: 'Video deleted!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const addMaterial = async (req, res) => {
  try {
    const { title, fileType, fileUrl } = req.body
    const videoId = parseInt(req.params.videoId)
    const material = await prisma.material.create({
      data: { title, fileUrl, fileType, videoId }
    })
    res.status(201).json({ message: 'Material added!', material })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const deleteMaterial = async (req, res) => {
  try {
    await prisma.material.delete({ where: { id: parseInt(req.params.materialId) } })
    res.json({ message: 'Material deleted!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}