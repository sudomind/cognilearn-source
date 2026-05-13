import { useApp } from '../context/AppContext'

export default function ProgressPage() {
  const { documents, flashcards, quizzes } = useApp()
  const completed = quizzes.filter((q) => q.score !== undefined)
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, q) => a + (q.score / q.total) * 100, 0) / completed.length)
    : 0

  const distribution = [
    { range: '90–100%', count: completed.filter((q) => q.score / q.total >= 0.9).length, color: 'bg-emerald-400' },
    { range: '70–89%',  count: completed.filter((q) => q.score / q.total >= 0.7 && q.score / q.total < 0.9).length, color: 'bg-indigo-400' },
    { range: '50–69%',  count: completed.filter((q) => q.score / q.total >= 0.5 && q.score / q.total < 0.7).length, color: 'bg-amber-400' },
    { range: 'Below 50%', count: completed.filter((q) => q.score / q.total < 0.5).length, color: 'bg-rose-400' },
  ]
  const maxCount = Math.max(...distribution.map((d) => d.count), 1)

  const topStats = [
    { label: 'Documents Uploaded', value: documents.length, icon: '📄', color: 'text-indigo-400', target: 10 },
    { label: 'Flashcards Created', value: flashcards.length, icon: '🃏', color: 'text-violet-400', target: 50 },
    { label: 'Quizzes Taken', value: completed.length, icon: '🧠', color: 'text-emerald-400', target: 20 },
    { label: 'Avg Quiz Score', value: avgScore ? `${avgScore}%` : '—', icon: '🎯', color: avgScore >= 70 ? 'text-emerald-400' : 'text-amber-400', target: null },
  ]

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-sora">Learning Progress</h1>
        <p className="text-slate-400 text-sm mt-1">Track your study journey and performance</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4">
        {topStats.map((s, i) => (
          <div
            key={s.label}
            className="glass-card rounded-2xl p-6 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{s.icon}</span>
              <div className={`text-3xl font-bold font-sora ${s.color}`}>{s.value}</div>
            </div>
            <div className="text-sm text-slate-300 font-medium">{s.label}</div>
            {s.target && typeof s.value === 'number' && (
              <div className="mt-3 space-y-1">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{ width: `${Math.min(100, (s.value / s.target) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600">{s.value} / {s.target} goal</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Score distribution */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h2 className="font-semibold font-sora">Quiz Score Distribution</h2>
        {completed.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-4xl">📊</div>
            <div className="text-slate-400 text-sm">
              Complete some quizzes to see your score distribution
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {distribution.map((d) => (
              <div key={d.range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{d.range}</span>
                  <span className="font-medium">
                    {d.count} quiz{d.count !== 1 ? 'zes' : ''}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-1000`}
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flashcard library */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold font-sora">Flashcard Library</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Total Cards', value: flashcards.length, color: 'text-indigo-400' },
            { label: 'Favorited', value: flashcards.filter((f) => f.favorited).length, color: 'text-amber-400' },
            { label: 'Reviewed', value: flashcards.filter((f) => f.reviewed).length, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-4">
              <div className={`text-2xl font-bold font-sora ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
