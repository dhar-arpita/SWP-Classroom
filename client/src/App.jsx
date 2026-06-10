import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/studentDashboard'
import TeacherDashboard from './pages/teacherDashboard'
import Home from './pages/home'
import CreateCourse from './pages/createCourses'
import CourseDetail from './pages/courseDetail'
import TeacherCourses from './pages/teacherCourses'
import StudentHome from './pages/studentHome'
import StudentCourseDetail from './pages/studentCourseDetail'
import About from './pages/About'
import PendingEnrollments from './pages/PendingEnrollments'
import PaymentInstruction from './pages/paymentInstruction'

import axios from 'axios'


axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/teacher/create-course" element={<CreateCourse />} />
      <Route path="/teacher/course/:id" element={<CourseDetail />} />
      <Route path="/teacher/courses" element={<TeacherCourses />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/course/:id" element={<StudentCourseDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/teacher/pending-enrollments" element={<PendingEnrollments />} />
      <Route path="/student/payment/:courseId" element={<PaymentInstruction />} />
    </Routes>
  )
}




