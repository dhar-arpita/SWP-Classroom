import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function CreateCourse() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState(0)
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('isPaid', isPaid)
      formData.append('price', price)
      if (thumbnail) formData.append('thumbnail', thumbnail)

      await axios.post('/api/courses', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      navigate('/teacher/dashboard', { state: { success: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="teacher" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-gray-400 mb-8">Fill in the details below to create a new course.</p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">

            {/* Thumbnail */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Thumbnail</label>
              <div
                onClick={() => document.getElementById('thumbnail-input').click()}
                className="w-full h-48 rounded-xl border-2 border-dashed border-gray-700 hover:border-purple-500 transition cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-gray-400 text-sm">Click to upload thumbnail</p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP</p>
                  </div>
                )}
              </div>
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                placeholder="e.g. Physics Chapter 1 — Motion"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition resize-none"
                placeholder="এই course এ কী কী পড়ানো হবে..."
                rows={4}
              />
            </div>

            {/* Course Type */}
            <div>
              <label className="text-gray-400 text-sm mb-3 block">Course Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={`py-3 rounded-lg border font-medium transition ${!isPaid ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-green-500'}`}
                >
                  🆓 Free
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={`py-3 rounded-lg border font-medium transition ${isPaid ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500'}`}
                >
                  💰 Paid
                </button>
              </div>
            </div>

            {/* Price - only if paid */}
            {isPaid && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Price (৳)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder="e.g. 299"
                  min="0"
                />
              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  )
}