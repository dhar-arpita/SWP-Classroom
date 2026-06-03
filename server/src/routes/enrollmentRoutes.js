import express from 'express'
import { enrollCourse, getMyEnrollments,getPendingEnrollments,approveEnrollment,rejectEnrollment} from '../controllers/enrollmentController.js'
import { verifyToken } from '../middleware/auth.js'


const Router = express.Router()

Router.post('/:courseId/enroll',verifyToken,enrollCourse)
Router.get('/my-enrollments',verifyToken,getMyEnrollments)
Router.get('/pending',verifyToken,getPendingEnrollments)
Router.get('/:id/approve',verifyToken,approveEnrollment)
Router.get('/:id/reject',verifyToken,rejectEnrollment)


export default Router