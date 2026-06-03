import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const successMessage = location.state?.success

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses')
        setCourses(res.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  const totalMaterials = courses.reduce((acc, c) =>
    acc + (c.chapters?.reduce((a, ch) =>
      a + (ch.videos?.reduce((b, v) =>
        b + (v.materials?.length || 0), 0) || 0), 0) || 0), 0)

  const totalVideos = courses.reduce((acc, c) =>
    acc + (c.chapters?.reduce((a, ch) =>
      a + (ch.videos?.length || 0), 0) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="teacher" />

      {successMessage && (
        <div className="bg-green-900/30 border-b border-green-500/50 text-green-400 px-6 py-3 text-center text-sm font-medium">
          ✅ Course has been successfully created!
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-2">Teacher Portal</p>
          <h2 className="text-4xl font-bold text-white">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-400 mt-2 text-lg">Manage your courses and students.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-purple-900 p-3 rounded-xl text-2xl">📚</div>
            <div>
              <p className="text-gray-400 text-sm">Courses</p>
              <p className="text-3xl font-bold text-purple-400">{courses.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-xl text-2xl">👨‍🎓</div>
            <div>
              <p className="text-gray-400 text-sm">Students</p>
              <p className="text-3xl font-bold text-blue-400">
                {courses.reduce((acc, c) => acc + (c.enrollments?.length || 0), 0)}
              </p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-yellow-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-yellow-900 p-3 rounded-xl text-2xl">🎥</div>
            <div>
              <p className="text-gray-400 text-sm">Videos</p>
              <p className="text-3xl font-bold text-yellow-400">{totalVideos}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-green-900 p-3 rounded-xl text-2xl">📄</div>
            <div>
              <p className="text-gray-400 text-sm">Materials</p>
              <p className="text-3xl font-bold text-green-400">{totalMaterials}</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">My Courses</h3>
            <button
              onClick={() => navigate('/teacher/create-course')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Create Course
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 animate-bounce">⚡</div>
              <p className="text-gray-400 text-lg">No courses yet!</p>
              <button onClick={() => navigate('/teacher/create-course')} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                + Create Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/teacher/course/${course.id}`)}
                  className="bg-gray-800 border border-gray-700 hover:border-purple-500 transition rounded-xl overflow-hidden cursor-pointer"
                >
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-4xl">📚</div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.isPaid ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'}`}>
                        {course.isPaid ? `💰 ৳${course.price}` : '🆓 Free'}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{course.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      
                      <span>🎥 {course.chapters?.reduce((a, ch) => a + (ch.videos?.length || 0), 0) || 0} videos</span>
                      <span>📄 {course.chapters?.reduce((a, ch) => a + (ch.videos?.reduce((b, v) => b + (v.materials?.length || 0), 0) || 0), 0) || 0} materials</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}