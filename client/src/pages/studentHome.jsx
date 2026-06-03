import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function StudentHome() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [enrollMap, setEnrollMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const classes = ['All', 'HSC', 'SSC', 'JSC', 'Admission', 'Other']
  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Math', 'English', 'Other']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/courses')
        setCourses(res.data)
        setFiltered(res.data)

        if (token) {
          const enrRes = await axios.get('/api/enrollments/my-enrollments', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const map = {}
          enrRes.data.forEach((e) => { map[e.courseId] = e.status })
          setEnrollMap(map)
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchData()
  }, [token])

  useEffect(() => {
    let result = courses
    if (selectedClass !== 'All') result = result.filter(c => c.class === selectedClass)
    if (selectedSubject !== 'All') result = result.filter(c => c.subject === selectedSubject)
    setFiltered(result)
  }, [selectedClass, selectedSubject, courses])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="student" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-2">Student Portal</p>
          <h2 className="text-3xl font-bold text-white">Browse Courses 📚</h2>
          <p className="text-gray-400 mt-2">Filter by class and subject to find your course!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8 space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Class</p>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${selectedClass === cls ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'}`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Subject</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${selectedSubject === sub ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-white'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No courses found!</p>
            <p className="text-gray-600 text-sm mt-1">Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const status = enrollMap[course.id]
              return (
                <div
                  key={course.id}
                  onClick={() => navigate(`/student/course/${course.id}`)}
                  className="relative bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Enrollment badge */}
                  {status === 'approved' && (
                    <span className="absolute top-3 right-3 z-10 text-xs px-2.5 py-1 rounded-full bg-green-600 text-white font-semibold shadow-lg">✅ Enrolled</span>
                  )}
                  {status === 'pending' && (
                    <span className="absolute top-3 right-3 z-10 text-xs px-2.5 py-1 rounded-full bg-yellow-500 text-gray-900 font-semibold shadow-lg">⏳ Pending</span>
                  )}

                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="w-full h-44 bg-gray-800 flex items-center justify-center text-4xl">📚</div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.isPaid ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'}`}>
                        {course.isPaid ? `💰 ৳${course.price}` : '🆓 Free'}
                      </span>
                      {course.class && <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">{course.class}</span>}
                      {course.subject && <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300">{course.subject}</span>}
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
  )
}
