import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import axios from 'axios'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const [expandedChapter, setExpandedChapter] = useState(null)

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteChapterModal, setDeleteChapterModal] = useState(null)
  const [deleteVideoModal, setDeleteVideoModal] = useState(null)
  const [deleteMaterialModal, setDeleteMaterialModal] = useState(null)

  const [addChapterModal, setAddChapterModal] = useState(false)
  const [chapterTitle, setChapterTitle] = useState('')

  const [addVideoModal, setAddVideoModal] = useState(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const [addMaterialModal, setAddMaterialModal] = useState(null)
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialType, setMaterialType] = useState('pdf')
  const [materialUrl, setMaterialUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchCourse() }, [id])

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`)
      setCourse(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const getYouTubeId = (url) => {
    return url?.split('v=')[1]?.split('&')[0] || url?.split('youtu.be/')[1]?.split('?')[0]
  }

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      navigate('/teacher/dashboard', { state: { success: true } })
    } catch (err) { console.error(err) }
  }

  const handleAddChapter = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`/api/courses/${id}/chapters`, { title: chapterTitle }, { headers: { Authorization: `Bearer ${token}` } })
      setAddChapterModal(false)
      setChapterTitle('')
      fetchCourse()
    } catch (err) { console.error(err) }
    setSubmitting(false)
  }

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`/api/courses/${id}/chapters/${chapterId}`, { headers: { Authorization: `Bearer ${token}` } })
      setDeleteChapterModal(null)
      fetchCourse()
    } catch (err) { console.error(err) }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`/api/courses/${id}/chapters/${addVideoModal}/videos`, { title: videoTitle, url: videoUrl }, { headers: { Authorization: `Bearer ${token}` } })
      setAddVideoModal(null)
      setVideoTitle('')
      setVideoUrl('')
      fetchCourse()
    } catch (err) { console.error(err) }
    setSubmitting(false)
  }

  const handleDeleteVideo = async (chapterId, videoId) => {
    try {
      await axios.delete(`/api/courses/${id}/chapters/${chapterId}/videos/${videoId}`, { headers: { Authorization: `Bearer ${token}` } })
      setDeleteVideoModal(null)
      fetchCourse()
    } catch (err) { console.error(err) }
  }

  const handleAddMaterial = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`/api/courses/${id}/chapters/${addMaterialModal.chapterId}/videos/${addMaterialModal.videoId}/materials`,
        { title: materialTitle, fileUrl: materialUrl, fileType: materialType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAddMaterialModal(null)
      setMaterialTitle('')
      setMaterialUrl('')
      fetchCourse()
    } catch (err) { console.error(err) }
    setSubmitting(false)
  }

  const handleDeleteMaterial = async (chapterId, videoId, materialId) => {
    try {
      await axios.delete(`/api/courses/${id}/chapters/${chapterId}/videos/${videoId}/materials/${materialId}`, { headers: { Authorization: `Bearer ${token}` } })
      setDeleteMaterialModal(null)
      fetchCourse()
    } catch (err) { console.error(err) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="teacher" />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Course Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
          {course?.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full object-cover" />}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${course?.isPaid ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300'}`}>
                    {course?.isPaid ? `💰 ৳${course?.price}` : '🆓 Free'}
                  </span>
                  <span className="text-xs text-gray-500">{course?.enrollments?.length || 0} students</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{course?.title}</h1>
                <p className="text-gray-400">{course?.description}</p>
              </div>
              <button onClick={() => setDeleteModal(true)} className="flex-shrink-0 bg-red-900/30 hover:bg-red-900/60 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition">
                🗑️ Delete Course
              </button>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Course Content</h2>
            <button onClick={() => setAddChapterModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              + Add Chapter
            </button>
          </div>

          {course?.chapters?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-400">No chapters yet!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {course?.chapters?.map((chapter, chapterIndex) => (
                <div key={chapter.id} style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  border: expandedChapter === chapter.id ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  overflow: 'visible',
                  transition: 'all 0.3s ease',
                  boxShadow: expandedChapter === chapter.id ? '0 0 20px rgba(139, 92, 246, 0.1)' : 'none'
                }}>

                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between p-10 cursor-pointer select-none"
                    onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div style={{
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        width: '44px', height: '44px',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 700, color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
                      }}>
                        {chapterIndex + 1}
                      </div>
                      <div>
                        <p style={{color: 'white', fontWeight: 600, fontSize: '16px'}}>{chapter.title}</p>
                        <p style={{color: '#a78bfa', fontSize: '12px', marginTop: '2px'}}>
                          {chapter.videos?.length || 0} videos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{
                        color: '#6b7280',
                        transition: 'transform 0.3s',
                        transform: expandedChapter === chapter.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: 'inline-block'
                      }}>▼</span>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === `c-${chapter.id}` ? null : `c-${chapter.id}`) }}
                          className="text-gray-400 hover:text-white w-8 h-8 rounded-lg hover:bg-gray-700 flex items-center justify-center transition text-lg"
                        >⋮</button>
                        {activeMenu === `c-${chapter.id}` && (
                          <div className="absolute right-10 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-44">
                            <button onClick={(e) => { e.stopPropagation(); setAddVideoModal(chapter.id); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition">
                              🎥 Add Video
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteChapterModal(chapter); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                              🗑️ Delete Chapter
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Videos - animated */}
                  {expandedChapter === chapter.id && (
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      padding: '12px',
                      animation: 'slideDown 0.2s ease-out'
                    }}>
                      <style>{`
                        @keyframes slideDown {
                          from { opacity: 0; transform: translateY(-8px); }
                          to { opacity: 1; transform: translateY(0); }
                        }
                      `}</style>

                      {chapter.videos?.length === 0 ? (
                        <p className="text-gray-600 text-sm text-center py-4">No videos yet — click ⋮ to add video</p>
                      ) : (
                        <div className="space-y-10">
                          {chapter.videos?.map((video, videoIndex) => (
                            <div key={video.id} style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '12px',
                              overflow: 'visible'
                            }}>
                              {/* Video Row */}
                              <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div style={{
                                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                                    width: '30px', height: '30px',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 700, color: 'white',
                                    flexShrink: 0
                                  }}>
                                    {videoIndex + 1}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{video.title}</p>
                                    <button onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)} className="text-purple-400 text-xs hover:text-purple-300 transition">
                                      {activeVideo === video.id ? '▼ Hide' : '▶️ Watch'}
                                    </button>
                                  </div>
                                </div>
                                <div className="relative flex items-center gap-2 flex-shrink-0">
                                  <button onClick={() => setAddMaterialModal({ chapterId: chapter.id, videoId: video.id })} className="text-gray-400 hover:text-white text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg transition">
                                    + Material
                                  </button>
                                  <div className="relative">
                                    <button onClick={() => setActiveMenu(activeMenu === `v-${video.id}` ? null : `v-${video.id}`)} className="text-gray-400 hover:text-white w-7 h-7 rounded-lg hover:bg-gray-600 flex items-center justify-center transition">⋮</button>
                                    {activeMenu === `v-${video.id}` && (
                                      <div className="absolute right-8 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-36">
                                        <button onClick={() => { setDeleteVideoModal({ ...video, chapterId: chapter.id }); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                                          🗑️ Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* YouTube Embed */}
                              {activeVideo === video.id && (
                                <div className="px-3 pb-3">
                                  <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                    <iframe src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`} className="absolute inset-0 w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                                  </div>
                                </div>
                              )}

                              {/* Materials */}
                              {video.materials?.length > 0 && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {video.materials.map((material) => (
                                    <div key={material.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '6px 10px' }}>
                                      <a href={material.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textDecoration: 'none' }}>
                                        <span>{material.fileType === 'pdf' ? '📄' : '📎'}</span>
                                        <span style={{ color: '#d1d5db', fontSize: '12px' }}>{material.title}</span>
                                      </a>
                                      <div className="relative">
                                        <button onClick={() => setActiveMenu(activeMenu === `m-${material.id}` ? null : `m-${material.id}`)} className="text-gray-400 hover:text-white w-6 h-6 rounded flex items-center justify-center transition text-xs">⋮</button>
                                        {activeMenu === `m-${material.id}` && (
                                          <div className="absolute right-6 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-36">
                                            <a href={material.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition" onClick={() => setActiveMenu(null)}>👁️ View</a>
                                            <button onClick={() => { setDeleteMaterialModal({ ...material, chapterId: chapter.id, videoId: video.id }); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">🗑️ Delete</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Course Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Course">
        <p className="text-gray-400 mb-6">Are you sure? All chapters, videos and materials will be deleted too.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={handleDeleteCourse} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      {/* Delete Chapter Modal */}
      <Modal isOpen={!!deleteChapterModal} onClose={() => setDeleteChapterModal(null)} title="Delete Chapter">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteChapterModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteChapterModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteChapter(deleteChapterModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      {/* Delete Video Modal */}
      <Modal isOpen={!!deleteVideoModal} onClose={() => setDeleteVideoModal(null)} title="Delete Video">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteVideoModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteVideoModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteVideo(deleteVideoModal?.chapterId, deleteVideoModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      {/* Delete Material Modal */}
      <Modal isOpen={!!deleteMaterialModal} onClose={() => setDeleteMaterialModal(null)} title="Delete Material">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteMaterialModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteMaterialModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteMaterial(deleteMaterialModal?.chapterId, deleteMaterialModal?.videoId, deleteMaterialModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      {/* Add Chapter Modal */}
      <Modal isOpen={addChapterModal} onClose={() => setAddChapterModal(false)} title="Add Chapter">
        <form onSubmit={handleAddChapter} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Chapter Title</label>
            <input type="text" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Chapter 1 - Motion" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddChapterModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50">{submitting ? 'Adding...' : 'Add Chapter'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Video Modal */}
      <Modal isOpen={!!addVideoModal} onClose={() => setAddVideoModal(null)} title="Add Video">
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Video Title</label>
            <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Introduction to Motion" required />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">YouTube Link</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition" placeholder="https://youtube.com/watch?v=..." required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddVideoModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50">{submitting ? 'Adding...' : 'Add Video'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Material Modal */}
      <Modal isOpen={!!addMaterialModal} onClose={() => setAddMaterialModal(null)} title="Add Material">
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Title</label>
            <input type="text" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Chapter 1 Slides" required />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['pdf', 'other'].map((type) => (
                <button key={type} type="button" onClick={() => setMaterialType(type)} className={`py-2 rounded-lg border text-sm font-medium transition ${materialType === type ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-purple-500'}`}>
                  {type === 'pdf' ? '📄 PDF' : '📎 Other'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">File URL (Google Drive link)</label>
            <input type="url" value={materialUrl} onChange={(e) => setMaterialUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition" placeholder="https://drive.google.com/..." required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddMaterialModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50">{submitting ? 'Adding...' : 'Add Material'}</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}