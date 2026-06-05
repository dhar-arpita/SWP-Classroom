import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom' 


export default function About() {
  const { user } = useAuth()
   const navigate = useNavigate()
  const role = user?.role === 'teacher' ? 'teacher' : 'student'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
    {user ? (
  <Navbar role={role} />
) : (
  <div className="sticky top-0 z-50 bg-black border-b border-gray-800 px-6 py-3 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="bg-black-600 w-15 h-15 rounded-lg flex items-center justify-center" onClick={()=> navigate('/home')}>
        <img src="/logo2.png" alt="SWP Classroom" className="w-15 h-15 rounded-fullobject-cover" />
      </div>
      <span className="text-white font-bold text-lg">SWP Classroom</span>
       <span className="hidden lg:block text-gray-500 text-xs ml-1">- Survive with Physics</span>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold"
      >
        Register
      </button>
    </div>
  </div>
)}

      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6 animate-bounce">🚧</div>
        <h1 className="text-4xl font-bold text-white mb-3">About SWP Classroom</h1>
        <p className="text-gray-400 text-lg mb-8">
          Coming soon — CEO bio, journey, photos and more!
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-xl mx-auto">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-2">Survive with Physics</p>
          <p className="text-gray-300">
            This page is under construction. We'll soon share the story behind
            SWP Classroom — who's teaching, where they studied, and how it all started.
          </p>
        </div>
      </div>
    </div>
  )
}