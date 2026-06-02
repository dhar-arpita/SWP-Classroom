import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
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
              <p className="text-3xl font-bold text-purple-400">0</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 transition rounded-2xl p-6 flex items-center gap-4">
            <div className="bg-blue-900 p-3 rounded-xl text-2xl">✅</div>
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-blue-400">0</p>
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
            <span className="text-xs text-gray-500">0 enrolled</span>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4 animate-bounce">⚡</div>
            <p className="text-gray-400 text-lg">No courses yet!</p>
            <p className="text-gray-600 text-sm mt-1">Your teacher will add courses soon.</p>
          </div>
        </div>
      </div>
    </div>
  )
}