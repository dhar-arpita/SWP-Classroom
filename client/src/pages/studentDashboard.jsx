import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <div className="flex items-center gap-4">
         <span className="text-gray-600">Welcome, {user?.name?.split(' ')[0]}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <p className="text-gray-500">No courses yet. Wait for your teacher to add courses!</p>
      </div>
    </div>
  )
}