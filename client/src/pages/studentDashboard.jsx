import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get('/api/enrollments/my-enrollments', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEnrollments(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    if (token) fetchEnrollments()
    else setLoading(false)
  }, [token])

  const approved = enrollments.filter((e) => e.status === 'approved')
  const pending = enrollments.filter((e) => e.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="student" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-2">Student Portal</p>
          <h2 className="text-4xl font-bold text-white">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-400 mt-2 text-lg">Ready to survive physics today?</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-purple-900 p-3 rounded-xl text-2xl">📚</div>
            <div>
              <p className="text-gray-400 text-sm">Enrolled Courses</p>
              <p className="text-3xl font-bold text-purple-400">{approved.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-yellow-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-yellow-900 p-3 rounded-xl text-2xl">⏳</div>
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{pending.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-green-900 p-3 rounded-xl text-2xl">🏆</div>
            <div>
              <p className="text-gray-400 text-sm">Certificates</p>
              <p className="text-3xl font-bold text-green-400">0</p>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">My Courses</h3>
            <span className="text-xs text-gray-500">{enrollments.length} enrolled</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 animate-bounce">⚡</div>
              <p className="text-gray-400 text-lg">No courses yet!</p>
              <p className="text-gray-600 text-sm mt-1">Browse courses and enroll to get started.</p>
              <button
                onClick={() => navigate('/student/home')}
                className="mt-4 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((en) => {
                const course = en.course
                const isApproved = en.status === 'approved'
                return (
                  <div
                    key={en.id}
                    onClick={() => isApproved && navigate(`/student/course/${course.id}`)}
                    className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${isApproved ? 'border-gray-800 hover:border-purple-500 cursor-pointer' : 'border-gray-800 opacity-70'}`}
                  >
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-4xl">📚</div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isApproved ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-900 text-green-300 font-medium">✅ Approved</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300 font-medium">⏳ Pending Approval</span>
                        )}
                        {course.class && <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">{course.class}</span>}
                      </div>
                      <h3 className="text-white font-semibold mb-1">{course.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>📚 {course.chapters?.length || 0} chapters</span>
                        <span>🎥 {course.chapters?.reduce((a, ch) => a + (ch.videos?.length || 0), 0) || 0} videos</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
