import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function PendingEnrollments() {
  const { token } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchPending() }, [])

  const fetchPending = async () => {
    try {
      const res = await axios.get('/api/enrollments/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEnrollments(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleApprove = async (id) => {
    try {
      const res = await axios.get(`/api/enrollments/${id}/approve`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(`✅ ${res.data.message}`)
      fetchPending()
    } catch (err) { setMessage('Error approving') }
  }

  const handleReject = async (id) => {
    try {
      const res = await axios.get(`/api/enrollments/${id}/reject`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(`❌ ${res.data.message}`)
      fetchPending()
    } catch (err) { setMessage('Error rejecting') }
  }

  const filtered = enrollments.filter((en) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      en.user.name?.toLowerCase().includes(q) ||
      en.user.email?.toLowerCase().includes(q) ||
      en.user.mobileNo?.includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="teacher" />

      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-2">Teacher Portal</p>
          <h2 className="text-3xl font-bold text-white">Pending Enrollments ⏳</h2>
          <p className="text-gray-400 mt-2">Review payment confirmations and approve students.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name, email or mobile..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {message && (
          <div className="bg-purple-900/30 border border-purple-500/30 text-purple-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">
              {enrollments.length === 0 ? 'No pending requests!' : 'No matches found'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((en) => (
              <div key={en.id} className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {en.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{en.user.name}</p>
                        <p className="text-gray-400 text-xs">wants to enroll in</p>
                      </div>
                    </div>
                    <p className="text-purple-400 font-medium mb-2">📚 {en.course.title}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {en.user.mobileNo && <span>📱 {en.user.mobileNo}</span>}
                      {en.user.email && <span>📧 {en.user.email}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(en.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(en.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                    >
                      ❌ Reject
                    </button>
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