import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function TeacherCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="teacher" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <button onClick={() => navigate('/teacher/create-course')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Create Course
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-400 text-lg">No courses yet!</p>
            <button onClick={() => navigate('/teacher/create-course')} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
              + Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/teacher/course/${course.id}`)}
                className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl overflow-hidden cursor-pointer"
              >
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gray-800 flex items-center justify-center text-4xl">📚</div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.isPaid ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'}`}>
                      {course.isPaid ? `💰 ৳${course.price}` : '🆓 Free'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>👥 {course.enrollments?.length || 0} students</span>
                    <span>📚 {course.chapters?.length || 0} chapters</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}