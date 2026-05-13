import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Spinner } from '../components/ui/Loaders'

const FEATURES = [
  { icon: '📄', label: 'Smart Summaries', desc: 'One-click AI summaries' },
  { icon: '💬', label: 'Doc Chat', desc: 'Ask anything from PDFs' },
  { icon: '🃏', label: 'Flashcards', desc: 'Auto-generated cards' },
  { icon: '🧠', label: 'AI Quizzes', desc: 'Test your knowledge' },
]

export default function LoginPage() {
  const { login, register } = useApp()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') await login(email, password)
      else await register(name, email, password)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('demo@cognilearn.ai')
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="mesh-orb-1" />
      <div className="mesh-orb-2" />
      <div className="grid-overlay" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 h-screen p-16 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg font-sora">C</span>
          </div>
          <span className="text-xl font-semibold font-sora">CogniLearn</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-xs font-mono text-indigo-400 tracking-widest uppercase">
              AI-Powered Learning
            </div>
            <h1 className="text-5xl font-bold leading-tight font-sora">
              Study smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                not harder.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Upload your PDFs. Chat with your documents. Generate quizzes, flashcards, and
              summaries — all powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="glass-card rounded-xl p-4 space-y-1">
                <div className="text-2xl">{f.icon}</div>
                <div className="font-semibold text-sm">{f.label}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-slate-600">© 2025 CogniLearn — Built for ambitious learners</div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="glass-card rounded-2xl p-8 space-y-6">
            {/* Logo mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold font-sora">CogniLearn</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-sora">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-400 text-sm">
                {mode === 'login'
                  ? 'Sign in to continue your learning journey'
                  : 'Start your AI-powered study experience'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-white/5 p-1">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === m ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Full Name</label>
                  <Input
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-2 border border-red-400/20">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-5 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-center text-xs text-slate-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>

            {/* Demo shortcut */}
            <div className="border border-dashed border-white/10 rounded-xl p-4 text-center space-y-1">
              <div className="text-xs text-slate-500">Demo mode — try without a real account</div>
              <button
                onClick={fillDemo}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Fill demo credentials →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
