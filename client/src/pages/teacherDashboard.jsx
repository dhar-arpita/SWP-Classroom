import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function TeacherDashboard() {
 const { user } = useAuth()
const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <Navbar role="teacher" />


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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-purple-900 p-3 rounded-xl text-2xl">📚</div>
            <div>
              <p className="text-gray-400 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-purple-400">0</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-xl text-2xl">👨‍🎓</div>
            <div>
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-blue-400">0</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-green-900 p-3 rounded-xl text-2xl">📄</div>
            <div>
              <p className="text-gray-400 text-sm">Total Materials</p>
              <p className="text-3xl font-bold text-green-400">0</p>
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4 animate-bounce">⚡</div>
            <p className="text-gray-400 text-lg">No courses yet!</p>
            <p className="text-gray-600 text-sm mt-1">Create your first course to get started.</p>
            <button
              onClick={() => navigate('/teacher/create-course')}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
            >
              + Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}