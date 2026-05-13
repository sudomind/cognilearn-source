import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { timeAgo } from '../utils/helpers'

export default function QuizzesPage() {
  const { quizzes, deleteQuiz, setCurrentView } = useApp()
  const completed = quizzes.filter((q) => q.score !== undefined)
  const pending = quizzes.filter((q) => q.score === undefined)
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, q) => a + (q.score / q.total) * 100, 0) / completed.length)
    : 0

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sora">My Quizzes</h1>
          <p className="text-slate-400 text-sm mt-1">
            {quizzes.length} quizzes · {completed.length} completed
          </p>
        </div>
        <Button
          onClick={() => setCurrentView('documents')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          + New Quiz
        </Button>
      </div>

      {/* Summary stats */}
      {completed.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Completed', value: completed.length, color: 'text-emerald-400' },
            {
              label: 'Avg Score',
              value: `${avgScore}%`,
              color: avgScore >= 70 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-rose-400',
            },
            { label: 'Pending', value: pending.length, color: 'text-indigo-400' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold font-sora ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {quizzes.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-4">
          <div className="text-6xl">🧠</div>
          <h3 className="text-xl font-semibold font-sora">No quizzes yet</h3>
          <p className="text-slate-400 text-sm">
            Open a document and generate your first AI quiz
          </p>
          <Button
            onClick={() => setCurrentView('documents')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Go to Documents
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((q, i) => {
            const pct = q.score === undefined ? null : Math.round((q.score / q.total) * 100)
            return (
              <div
                key={q.id}
                className="glass-card rounded-xl p-5 flex items-center gap-4 animate-fade-in-up hover:border-indigo-500/30 transition-all"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    pct === null
                      ? 'bg-indigo-500/15'
                      : pct >= 70
                      ? 'bg-emerald-500/15'
                      : 'bg-amber-500/15'
                  }`}
                >
                  {pct === null ? '🧠' : pct >= 70 ? '✅' : '📚'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{q.docName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {q.questions.length} questions · {timeAgo(q.createdAt)}
                  </div>
                  {pct !== null && (
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden max-w-xs">
                      <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>

                {/* Score / badge */}
                <div className="flex items-center gap-3">
                  {pct === null ? (
                    <div className="text-xs bg-indigo-500/20 text-indigo-400 rounded-full px-3 py-1">
                      Pending
                    </div>
                  ) : (
                    <div
                      className={`text-xl font-bold ${
                        pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {pct}%
                    </div>
                  )}
                  <button
                    onClick={() => deleteQuiz(q.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
