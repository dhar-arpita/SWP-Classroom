import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function paymentInstructions() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [course, setCourse] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState('')

  const BKASH_NUMBER = '01732482504'
  const NAGAD_NUMBER = '01732482504'
  const FB_PAGE = 'https://www.facebook.com/share/14dUMPVvU4P/?mibextid=wwXIfr'
  const WHATSAPP_NUMBER = '8801732482504'

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${courseId}`)
        setCourse(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCourse()
  }, [courseId])

  const handlePaymentSent = async () => {
    setSubmitting(true)
    try {
      await axios.post(`/api/enrollments/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/student/dashboard', { state: { paymentPending: true } })
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Something went wrong')
    }
    setSubmitting(false)
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  if (!course) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar role="student" />

      <div className="max-w-3xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white text-sm mb-4"
        >
          ← Back
        </button>

        {/* Course + amount header */}
        <div className="bg-gradient-to-br from-purple-900/40 to-gray-900 border border-purple-500/30 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">💳 Complete Payment</h1>
          <p className="text-gray-400">{course.title}</p>
          <div className="mt-4 inline-block bg-purple-900/50 border border-purple-500/30 px-4 py-2 rounded-xl">
            <span className="text-gray-400 text-sm">Amount: </span>
            <span className="text-2xl font-bold text-purple-300">৳{course.price}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📋 কী করবেন</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>bKash/Nagad-এ <span className="text-purple-300 font-semibold">Send Money</span> করে ৳{course.price} পাঠান নিচের নাম্বারে</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Transaction-এর Screenshot তুলুন</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>Screenshot পাঠান আমাদের Facebook Page অথবা WhatsApp-এ</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>নিচের <span className="text-purple-300 font-semibold">"I've sent payment"</span> button click করুন — Teacher approve করলেই access পাবেন!</span>
            </li>
          </ol>
        </div>

        {/* Payment numbers */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📱 Send Money এই নাম্বারে</h2>

          <div className="space-y-3">
            {/* bKash */}
            <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-semibold mb-1">bKash (Personal)</p>
                <p className="text-2xl font-bold text-white tracking-wider">{BKASH_NUMBER}</p>
              </div>
              <button
                onClick={() => copyToClipboard(BKASH_NUMBER, 'bkash')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0"
              >
                {copied === 'bkash' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Nagad */}
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-semibold mb-1">Nagad (Personal)</p>
                <p className="text-2xl font-bold text-white tracking-wider">{NAGAD_NUMBER}</p>
              </div>
              <button
                onClick={() => copyToClipboard(NAGAD_NUMBER, 'nagad')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0"
              >
                {copied === 'nagad' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* QR placeholder */}
          <div className="mt-4 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
            <div className="text-5xl mb-2">📷</div>
            <p className="text-gray-500 text-sm">QR Code (coming soon)</p>
          </div>
        </div>

        {/* Send screenshot */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📤 Screenshot পাঠান</h2>
          <div className="space-y-3">
            <a
              href={FB_PAGE}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 transition"
            >
              <span className="text-3xl">📘</span>
              <div className="flex-1">
                <p className="text-blue-300 font-semibold">Facebook Page</p>
                <p className="text-gray-400 text-sm">Click to message</p>
              </div>
              <span className="text-gray-500">→</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-green-900/20 hover:bg-green-900/40 border border-green-500/30 rounded-xl p-4 transition"
            >
              <span className="text-3xl">💬</span>
              <div className="flex-1">
                <p className="text-green-300 font-semibold">WhatsApp</p>
                <p className="text-gray-400 text-sm">{WHATSAPP_NUMBER}</p>
              </div>
              <span className="text-gray-500">→</span>
            </a>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handlePaymentSent}
          disabled={submitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : "✓ I've sent the payment"}
        </button>

        <p className="text-center text-gray-500 text-xs mt-3">
          Teacher screenshot verify korar por enrollment approve korbe। You'll see "Pending" status on your dashboard.
        </p>

      </div>
    </div>
  )
}