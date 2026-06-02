import express from 'express'
import { createCourse, getCourses, getCourseById, deleteCourse, addChapter, deleteChapter, addVideo, deleteVideo, addMaterial, deleteMaterial } from '../controllers/courseController.js'
import { verifyToken } from '../middleware/auth.js'
import { uploadThumbnail } from '../config/cloudinary.js'

const router = express.Router()

router.get('/', getCourses)
router.get('/:id', getCourseById)
router.post('/', verifyToken, uploadThumbnail.single('thumbnail'), createCourse)
router.delete('/:id', verifyToken, deleteCourse)

router.post('/:id/chapters', verifyToken, addChapter)
router.delete('/:id/chapters/:chapterId', verifyToken, deleteChapter)

router.post('/:id/chapters/:chapterId/videos', verifyToken, addVideo)
router.delete('/:id/chapters/:chapterId/videos/:videoId', verifyToken, deleteVideo)

router.post('/:id/chapters/:chapterId/videos/:videoId/materials', verifyToken, addMaterial)
router.delete('/:id/chapters/:chapterId/videos/:videoId/materials/:materialId', verifyToken, deleteMaterial)

export default router