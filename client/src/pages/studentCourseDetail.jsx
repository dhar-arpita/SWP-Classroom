import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function StudentCourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')
  const [activeVideo, setActiveVideo] = useState(null)
  const [expandedChapter, setExpandedChapter] = useState(null)

  useEffect(() => { fetchAll() }, [id])

  const fetchAll = async () => {
    try {
      const courseRes = await axios.get(`/api/courses/${id}`)
      setCourse(courseRes.data)
      if (token) {
        const enrRes = await axios.get('/api/enrollments/my-enrollments', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const mine = enrRes.data.find((e) => e.courseId === parseInt(id))
        setEnrollment(mine || null)
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleEnroll = async () => {
  
    if (course.isPaid) {
      navigate(`/student/payment/${course.id}`)
      return
    }

    setEnrolling(true)
    setMessage('')

      try {
        const res = await axios.post(`/api/enrollments/${id}/enroll`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMessage(res.data.message)
        fetchAll()
      } catch (err) {
        setMessage(err.response?.data?.message || 'Something went wrong')
      }
      setEnrolling(false)
    
  }

  const getEmbedUrl = (url) => {
    if (!url) return ''

    if (url.includes('mediadelivery.net')) {
      return url.replace('player.mediadelivery.net/play/', 'iframe.mediadelivery.net/embed/')
    }


    const ytId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0`
  }

  const isApproved = enrollment?.status === 'approved'
  const isPending = enrollment?.status === 'pending'

  // total counts for preview before enroll
  const totalChapters = course?.chapters?.length || 0
  const totalVideos = course?.chapters?.reduce((a, ch) => a + (ch.videos?.length || 0), 0) || 0

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="student" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
          {course?.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full object-cover" />}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${course?.isPaid ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'}`}>
                {course?.isPaid ? `💰 ৳${course?.price}` : '🆓 Free'}
              </span>
              {course?.class && <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">{course.class}</span>}
              {course?.subject && <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300">{course.subject}</span>}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{course?.title}</h1>
            <p className="text-gray-400 mb-4">{course?.description}</p>

            {/* Enroll / Status */}
            {!enrollment ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : course?.isPaid ? `Enroll • ৳${course?.price} ` : 'Enroll for Free'}
              </button>
            ) : isApproved ? (
              <span className="inline-block bg-green-900 text-green-300 px-5 py-2.5 rounded-xl font-semibold">✅ Enrolled</span>
            ) : (
              <span className="inline-block bg-yellow-900 text-yellow-300 px-5 py-2.5 rounded-xl font-semibold">⏳ Pending Approval</span>
            )}

            {message && <p className="mt-3 text-sm text-purple-400">{message}</p>}
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Course Content</h2>

          {/* NOT ENROLLED → hide content, show locked preview */}
          {!enrollment ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3">🔒</div>
              <p className="text-gray-300 text-lg font-medium">Content is locked</p>
              <p className="text-gray-500 text-sm mt-1">
                {totalChapters} chapters • {totalVideos} videos
              </p>
              <p className="text-gray-500 text-sm mt-1">Enroll to unlock all videos and materials.</p>
            </div>
          ) : isPending ? (
            /* PENDING (paid) → still locked, waiting approval */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3">⏳</div>
              <p className="text-yellow-300 text-lg font-medium">Pending Approval</p>
              <p className="text-gray-500 text-sm mt-1">Videos will unlock once your enrollment is approved.</p>
            </div>
          ) : (
            /* APPROVED → full content */
            <div className="space-y-3">
              {course?.chapters?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No chapters yet.</p>
              ) : (
                course?.chapters?.map((chapter, ci) => (
                  <div key={chapter.id} className="bg-gray-800/40 border border-gray-700/40 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer select-none"
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm">{ci + 1}</div>
                        <div>
                          <p className="font-semibold">{chapter.title}</p>
                          <p className="text-purple-400 text-xs">{chapter.videos?.length || 0} videos</p>
                        </div>
                      </div>
                      <span className="text-gray-500">{expandedChapter === chapter.id ? '▲' : '▼'}</span>
                    </div>

                    {expandedChapter === chapter.id && (
                      <div className="p-3 border-t border-gray-700/40 space-y-3">
                        {chapter.videos?.length === 0 ? (
                          <p className="text-gray-600 text-sm text-center py-3">No videos yet.</p>
                        ) : (
                          chapter.videos?.map((video, vi) => (
                            <div key={video.id} className="bg-white/5 border border-white/5 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-xs font-bold">{vi + 1}</div>
                                  <p className="text-sm font-medium">{video.title}</p>
                                </div>
                                <button
                                  onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)}
                                  className="text-purple-400 text-xs hover:text-purple-300"
                                >
                                  {activeVideo === video.id ? '▼ Hide' : '▶️ Watch'}
                                </button>
                              </div>

                              {activeVideo === video.id && (
                                <div className="mt-3 relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                  <iframe
                                    src={getEmbedUrl(video.url)}
                                    title={video.title}
                                    className="absolute inset-0 w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  />
                                </div>
                              )}

                              {video.materials?.length > 0 && (
                                <div className="mt-2 flex flex-col gap-1">
                                  {video.materials.map((m) => (
                                    <a key={m.id} href={m.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-white/5 rounded px-2 py-1">
                                      <span>{m.fileType === 'pdf' ? '📄' : '📎'}</span>{m.title}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
