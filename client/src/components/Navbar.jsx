import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentLinks = [
    { label: 'Home', path: '/home' },
    { label: 'My Courses', path: '/student/courses' },
    { label: 'Progress', path: '/student/progress' },
    { label: 'Announcements', path: '/student/announcements' },
  ]

  const teacherLinks = [
    { label: 'Home', path: '/home' },
    { label: 'My Courses', path: '/teacher/courses' },
    { label: '+ Create Course', path: '/teacher/create-course' },
  ]

  const links = role === 'teacher' ? teacherLinks : studentLinks

  return (
    <nav style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="sticky top-0 z-50">
      <div className="w-full px-6 grid grid-cols-3 items-center h-16">

        {/* Logo - বামে */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-sm">⚛️</span>
          </div>
          <span className="text-white font-bold text-lg">SWP</span>
          <span className="hidden lg:block text-gray-500 text-xs ml-1">Survive with Physics</span>
        </div>

        {/* Links - মাঝে */}
        <div className="hidden md:flex items-center justify-center gap-20">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-8 py-2 rounded-lg text-sm font-medium transition-all border ${location.pathname === link.path
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500'
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* User + Logout - ডানে */}
        <div className="flex items-center gap-3 justify-end">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-gray-300 text-sm font-medium">{user?.name?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>

      </div>

      {/* Mobile links */}
      <div className="md:hidden flex overflow-x-auto border-t border-gray-800 px-4">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all ${location.pathname === link.path
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-white'
              }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  )
}