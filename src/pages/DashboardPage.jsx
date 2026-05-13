import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatBytes, timeAgo } from '../utils/helpers'

export default function DashboardPage() {
  const { user, documents, flashcards, quizzes, setCurrentView, setSelectedDocId } = useApp()
  const [hoveredDoc, setHoveredDoc] = useState(null)

  const completed = quizzes.filter((q) => q.score !== undefined)
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, q) => a + (q.score / q.total) * 100, 0) / completed.length)
    : 0
  const favCards = flashcards.filter((f) => f.favorited).length

  const stats = [
    { id: 's1', label: 'Documents', value: documents.length, sub: 'uploaded', icon: '📄', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/30', text: 'text-indigo-400' },
    { id: 's2', label: 'Flashcards', value: flashcards.length, sub: `${favCards} favorited`, icon: '🃏', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    { id: 's3', label: 'Quizzes', value: quizzes.length, sub: `${completed.length} completed`, icon: '🧠', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    { id: 's4', label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', sub: 'across quizzes', icon: '🎯', color: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/30', text: 'text-rose-400' },
  ]

  const actions = [
    { label: 'Upload Document', icon: '⬆', view: 'documents', color: 'bg-indigo-500 hover:bg-indigo-600', shadow: 'shadow-indigo-500/30' },
    { label: 'Generate Quiz', icon: '🧠', view: 'documents', color: 'bg-violet-500 hover:bg-violet-600', shadow: 'shadow-violet-500/30' },
    { label: 'My Flashcards', icon: '🃏', view: 'flashcards', color: 'bg-emerald-500 hover:bg-emerald-600', shadow: 'shadow-emerald-500/30' },
    { label: 'View Progress', icon: '📈', view: 'progress', color: 'bg-amber-500 hover:bg-amber-600', shadow: 'shadow-amber-500/30' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold font-sora">
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              {user?.name?.split(' ')[0]}
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {documents.length === 0
              ? 'Upload your first document to get started'
              : `You have ${documents.length} document${documents.length > 1 ? 's' : ''} ready to study`}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.id}
            className={`glass-card rounded-2xl p-5 border ${s.border} bg-gradient-to-br ${s.color} animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <div className={`text-xs font-mono ${s.text} bg-white/5 rounded-full px-2 py-0.5`}>
                {s.sub}
              </div>
            </div>
            <div className="text-3xl font-bold font-sora">{s.value}</div>
            <div className="text-slate-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((a, i) => (
            <button
              key={a.label}
              onClick={() => setCurrentView(a.view)}
              className={`${a.color} text-white rounded-xl p-4 text-left font-medium transition-all duration-200 shadow-lg ${a.shadow} hover:scale-105 animate-fade-in-up`}
              style={{ animationDelay: `${(i + 4) * 0.06}s` }}
            >
              <div className="text-xl mb-2">{a.icon}</div>
              <div className="text-sm">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent docs + quizzes */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Docs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Recent Documents
            </h2>
            <button
              onClick={() => setCurrentView('documents')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">📄</div>
                <div className="text-slate-400 text-sm">No documents yet</div>
                <button
                  onClick={() => setCurrentView('documents')}
                  className="text-indigo-400 text-xs mt-2 hover:underline"
                >
                  Upload your first →
                </button>
              </div>
            ) : (
              documents.slice(0, 4).map((doc, i) => (
                <button
                  key={doc.id}
                  onClick={() => { setSelectedDocId(doc.id); setCurrentView('document-detail') }}
                  onMouseEnter={() => setHoveredDoc(doc.id)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  className={`w-full glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 text-left animate-fade-in-up ${
                    hoveredDoc === doc.id ? 'border-indigo-500/40 bg-indigo-500/5' : ''
                  }`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                    doc.color === 'emerald' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'
                  }`}>
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{doc.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {doc.pages} pages · {formatBytes(doc.size)} · {timeAgo(doc.uploadedAt)}
                    </div>
                  </div>
                  <div className="text-slate-600 text-sm">→</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Recent Quizzes
            </h2>
            <button
              onClick={() => setCurrentView('quizzes')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {quizzes.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🧠</div>
                <div className="text-slate-400 text-sm">No quizzes yet</div>
                <div className="text-xs text-slate-600 mt-1">Open a document and generate a quiz</div>
              </div>
            ) : (
              quizzes.slice(0, 4).map((q, i) => {
                const pct = q.score === undefined ? null : Math.round((q.score / q.total) * 100)
                return (
                  <div
                    key={q.id}
                    className="glass-card rounded-xl p-4 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm truncate flex-1 mr-2">{q.docName}</div>
                      {pct === null ? (
                        <div className="text-xs text-slate-500 bg-white/5 rounded-full px-2 py-0.5">Pending</div>
                      ) : (
                        <div className={`text-sm font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {pct}%
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {q.questions.length} questions · {timeAgo(q.createdAt)}
                    </div>
                    {pct !== null && (
                      <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
