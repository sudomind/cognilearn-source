import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'

const PREFS = [
  { label: 'Email Notifications', sub: 'Get updates on your study progress', on: true },
  { label: 'AI Suggestions', sub: 'Let AI recommend study materials', on: true },
  { label: 'Dark Mode', sub: 'Always on for focused studying', on: true },
]

export default function ProfilePage() {
  const { user, documents, flashcards, quizzes, logout } = useApp()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.name || '')

  const completed = quizzes.filter((q) => q.score !== undefined)
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, q) => a + (q.score / q.total) * 100, 0) / completed.length)
    : 0

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold font-sora">Profile</h1>

      {/* Avatar + info */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/30 font-sora">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/5 border border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                  autoFocus
                />
                <Button
                  onClick={() => setEditing(false)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4"
                >
                  Save
                </Button>
                <Button
                  onClick={() => { setEditing(false); setDisplayName(user?.name || '') }}
                  variant="ghost"
                  className="text-sm px-4 border border-white/10"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold font-sora">{displayName}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                >
                  Edit name
                </button>
              </div>
            )}
            <div className="text-slate-400 text-sm mt-1">{user?.email}</div>
            <div className="text-xs text-slate-600 mt-1">
              Member since{' '}
              {new Date(user?.joinedAt || '').toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Documents', value: documents.length, icon: '📄' },
            { label: 'Flashcards', value: flashcards.length, icon: '🃏' },
            { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', icon: '🎯' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold font-sora">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-sm font-sora">Preferences</h3>
        {PREFS.map((p) => (
          <div key={p.label} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">{p.label}</div>
              <div className="text-xs text-slate-500">{p.sub}</div>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-all cursor-pointer ${
                p.on ? 'bg-indigo-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white m-1 transition-all ${
                  p.on ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div className="glass-card rounded-2xl p-6 border border-rose-500/20">
        <h3 className="font-semibold text-sm text-rose-400 mb-4 font-sora">Account</h3>
        <Button
          onClick={logout}
          variant="ghost"
          className="border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 w-full"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
