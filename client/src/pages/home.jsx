import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }} className="sticky top-0 z-50">
                <div className="w-full px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-center">
                <img src="/logo.png" alt="SWP Classroom" className="w-15 h-15 rounded-full object-cover border-2 border-black/50" />
            </div>
                        <span className="text-white font-bold text-lg">SWP</span>
                        <span className="hidden lg:block text-gray-500 text-xs ml-1">Survive with Physics</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                            Login
                        </button>
                        <button onClick={() => navigate('/register')} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="bg-gradient-to-br from-purple-950 via-gray-950 to-gray-950 px-6 py-32 text-center">
                <div className="inline-block bg-purple-900/50 border border-purple-700/50 text-purple-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
                    ⚡ Physics এর ভয় শেষ!
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                    Survive with <span className="text-purple-400">Physics</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Physics কে ভয় পাও? আমরা আছি! Live classes, notes, slides — সব এক জায়গায়।
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button onClick={() => navigate('/register')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition">
                        এখনই শুরু করো →
                    </button>
                    <button onClick={() => navigate('/login')} className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-3.5 rounded-xl text-base transition">
                        Login করো
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-5xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">কেন SWP? 🤔</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: '📚', title: 'সব Materials এক জায়গায়', desc: 'Slides, notes, PDF — সব organized থাকবে। খুঁজতে হবে না।' },
                        { icon: '🎯', title: 'সহজ ভাষায় Physics', desc: 'কঠিন topic গুলো সহজ করে বোঝানো হবে। Guaranteed!' },
                        { icon: '⚡', title: 'Live Classes', desc: 'Teacher সরাসরি class নেবে। যেকোনো প্রশ্ন করতে পারবে।' },
                    ].map((f) => (
                        <div key={f.title} className="bg-gray-900 border border-gray-800 hover:border-purple-500 transition rounded-2xl p-6">
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                            <p className="text-gray-400 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">আমাদের Community তে যোগ দাও! 🚀</h2>
                    <p className="text-gray-400 mb-8">Facebook group আর YouTube channel এ সব updates পাবে।</p>
                    <div className="flex items-center justify-center gap-20 flex-wrap">
                        <a href="https://www.facebook.com/share/g/1AqyJ2NZqM/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                            📘 Facebook Group
                        </a>

                        <a href="https://www.facebook.com/share/14dUMPVvU4P/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            Facebook Page
                        </a>
                        <a href="https://www.youtube.com/@tanmaysphysicssolution7695" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                            ▶️ YouTube Channel
                        </a>
                    </div>
                </div>
            </div>


            {/* Contact Instructor */}

            {/* Contact Instructor */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {/* Instructor Photo */}
                        <div className="flex-shrink-0">
                            <img
                                src="/instructor.png"
                                alt="Instructor"
                                className="w-80 h-80 rounded-full object-cover border-4 border-purple-500/50"
                            />
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left">
                            <p className="text-purple-400 text-sm uppercase tracking-widest mb-1">Your Instructor</p>
                            <h2 className="text-2xl font-bold text-white mb-1">Tanmay Dhar</h2>
                            <p className="text-gray-400 mb-4">CEO, SWP CLASSROOM  </p>
                            <p className="text-gray-400 mb-4">11 Years+ teaching Experience </p>
                            <p className="text-gray-400 mb-4">Mentored 2.5M+ Student in Online and offline  </p>
                            <p className="text-gray-500 text-sm mb-6">কোনো প্রশ্ন আছে? সরাসরি Instructor এর সাথে কথা বলো।</p>
                            <a href="https://www.facebook.com/tanmay.dhar.39" target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                                Facebook এ Message করো
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Company Logo */}
           
            {/* Footer */}
            <footer className="border-t border-gray-800 mt-10 py-8 text-center text-gray-600 text-sm">
                <p>© 2025 SWP — Survive with Physics. All rights reserved.</p>
            </footer>

        </div>
    )
}