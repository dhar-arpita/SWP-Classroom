import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 40, height: 40, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%' }}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white" onClick={() => setActiveMenu(null)}>
      <Navbar role="teacher" />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6"
        >
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteModal(true)}
                className="flex-shrink-0 bg-red-900/30 hover:bg-red-900/60 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🗑️ Delete Course
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chapters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Course Content</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddChapterModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Add Chapter
            </motion.button>
          </div>

          {course?.chapters?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-400">No chapters yet!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {course?.chapters?.map((chapter, chapterIndex) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: chapterIndex * 0.05 }}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    border: expandedChapter === chapter.id ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    overflow: 'visible',
                    transition: 'border 0.3s, box-shadow 0.3s',
                    boxShadow: expandedChapter === chapter.id ? '0 0 25px rgba(139, 92, 246, 0.15)' : 'none'
                  }}
                >
                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer select-none"
                    onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          width: '44px', height: '44px',
                          borderRadius: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', fontWeight: 700, color: 'white',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
                        }}
                      >
                        {chapterIndex + 1}
                      </motion.div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>{chapter.title}</p>
                        <p style={{ color: '#a78bfa', fontSize: '12px', marginTop: '2px' }}>
                          {chapter.videos?.length || 0} videos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ color: '#6b7280', display: 'inline-block' }}
                      >▼</motion.span>
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveMenu(activeMenu === `c-${chapter.id}` ? null : `c-${chapter.id}`)}
                          className="text-gray-400 hover:text-white w-8 h-8 rounded-lg hover:bg-gray-700 flex items-center justify-center transition text-lg"
                        >⋮</motion.button>
                        <AnimatePresence>
                          {activeMenu === `c-${chapter.id}` && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-10 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-44"
                            >
                              <button onClick={() => { setAddVideoModal(chapter.id); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition">
                                🎥 Add Video
                              </button>
                              <button onClick={() => { setDeleteChapterModal(chapter); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                                🗑️ Delete Chapter
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Videos - animated expand */}
                  <AnimatePresence>
                    {expandedChapter === chapter.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
                      >
                        <div style={{ padding: '12px' }}>
                          {chapter.videos?.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-4">No videos yet — click ⋮ to add video</p>
                          ) : (
                            <div className="space-y-3">
                              {chapter.videos?.map((video, videoIndex) => (
                                <motion.div
                                  key={video.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: videoIndex * 0.05 }}
                                  style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    overflow: 'visible'
                                  }}
                                >
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
                                    <div className="relative flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setAddMaterialModal({ chapterId: chapter.id, videoId: video.id })}
                                        className="text-gray-400 hover:text-white text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg transition"
                                      >+ Material</motion.button>
                                      <div className="relative">
                                        <button onClick={() => setActiveMenu(activeMenu === `v-${video.id}` ? null : `v-${video.id}`)} className="text-gray-400 hover:text-white w-7 h-7 rounded-lg hover:bg-gray-600 flex items-center justify-center transition">⋮</button>
                                        <AnimatePresence>
                                          {activeMenu === `v-${video.id}` && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                              animate={{ opacity: 1, scale: 1, y: 0 }}
                                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                              transition={{ duration: 0.15 }}
                                              className="absolute right-8 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-36"
                                            >
                                              <button onClick={() => { setDeleteVideoModal({ ...video, chapterId: chapter.id }); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                                                🗑️ Delete
                                              </button>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </div>
                                  </div>

                                  {/* YouTube Embed */}
                                  <AnimatePresence>
                                    {activeVideo === video.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                      >
                                        <div className="px-3 pb-3">
                                          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                            <iframe src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`} className="absolute inset-0 w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* Materials */}
                                  {video.materials?.length > 0 && (
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {video.materials.map((material, mIndex) => (
                                        <motion.div
                                          key={material.id}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: mIndex * 0.05 }}
                                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '6px 10px' }}
                                        >
                                          <a href={material.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textDecoration: 'none' }}>
                                            <span>{material.fileType === 'pdf' ? '📄' : '📎'}</span>
                                            <span style={{ color: '#d1d5db', fontSize: '12px' }}>{material.title}</span>
                                          </a>
                                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => setActiveMenu(activeMenu === `m-${material.id}` ? null : `m-${material.id}`)} className="text-gray-400 hover:text-white w-6 h-6 rounded flex items-center justify-center transition text-xs">⋮</button>
                                            <AnimatePresence>
                                              {activeMenu === `m-${material.id}` && (
                                                <motion.div
                                                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                  transition={{ duration: 0.15 }}
                                                  className="absolute right-6 top-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden w-36"
                                                >
                                                  <a href={material.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition" onClick={() => setActiveMenu(null)}>👁️ View</a>
                                                  <button onClick={() => { setDeleteMaterialModal({ ...material, chapterId: chapter.id, videoId: video.id }); setActiveMenu(null) }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">🗑️ Delete</button>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Course">
        <p className="text-gray-400 mb-6">Are you sure? All chapters, videos and materials will be deleted too.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={handleDeleteCourse} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteChapterModal} onClose={() => setDeleteChapterModal(null)} title="Delete Chapter">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteChapterModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteChapterModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteChapter(deleteChapterModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteVideoModal} onClose={() => setDeleteVideoModal(null)} title="Delete Video">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteVideoModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteVideoModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteVideo(deleteVideoModal?.chapterId, deleteVideoModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteMaterialModal} onClose={() => setDeleteMaterialModal(null)} title="Delete Material">
        <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">"{deleteMaterialModal?.title}"</span>?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteMaterialModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition">Cancel</button>
          <button onClick={() => handleDeleteMaterial(deleteMaterialModal?.chapterId, deleteMaterialModal?.videoId, deleteMaterialModal?.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition">Delete</button>
        </div>
      </Modal>

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