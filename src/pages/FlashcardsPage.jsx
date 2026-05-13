import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'

export default function FlashcardsPage() {
  const { flashcards, toggleFavoriteFlashcard, deleteFlashcard, setCurrentView } = useApp()
  const [filter, setFilter] = useState('all')
  const [flipped, setFlipped] = useState(null)
  const [studyMode, setStudyMode] = useState(false)
  const [studyIndex, setStudyIndex] = useState(0)

  const visible = filter === 'favorited' ? flashcards.filter((f) => f.favorited) : flashcards
  const current = visible[studyIndex]

  // ── Study mode ──────────────────────────────────────
  if (studyMode && visible.length > 0) {
    return (
      <div className="p-8 flex flex-col items-center max-w-2xl mx-auto animate-fade-in">
        <div className="w-full flex items-center justify-between mb-8">
          <Button
            onClick={() => setStudyMode(false)}
            variant="ghost"
            className="border border-white/10 text-sm"
          >
            ← Exit Study
          </Button>
          <div className="text-sm text-slate-400">
            {studyIndex + 1} / {visible.length}
          </div>
        </div>

        <div
          className="w-full flip-card h-72 mb-8"
          onClick={() => setFlipped(flipped === current?.id ? null : current?.id)}
        >
          <div className={`flip-card-inner ${flipped === current?.id ? 'flipped' : ''}`}>
            <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 flex-col gap-4">
              <div className="text-xs text-indigo-400 uppercase tracking-widest">Question</div>
              <div className="font-semibold text-xl text-center">{current?.front}</div>
              <div className="text-sm text-slate-500">Tap to reveal</div>
            </div>
            <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 flex-col gap-4">
              <div className="text-xs text-emerald-400 uppercase tracking-widest">Answer</div>
              <div className="text-lg text-center text-emerald-300 leading-relaxed">{current?.back}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            onClick={() => { setStudyIndex(Math.max(0, studyIndex - 1)); setFlipped(null) }}
            disabled={studyIndex === 0}
            variant="ghost"
            className="flex-1 border border-white/10"
          >
            ← Prev
          </Button>
          <button
            onClick={() => toggleFavoriteFlashcard(current?.id)}
            className={`px-4 rounded-xl transition-all ${
              current?.favorited ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-slate-500 hover:text-amber-400'
            }`}
          >
            ★
          </button>
          <Button
            onClick={() => { setStudyIndex(Math.min(visible.length - 1, studyIndex + 1)); setFlipped(null) }}
            disabled={studyIndex === visible.length - 1}
            variant="ghost"
            className="flex-1 border border-white/10"
          >
            Next →
          </Button>
        </div>

        <div className="flex gap-1.5 mt-6">
          {visible.map((_, i) => (
            <button
              key={i}
              onClick={() => { setStudyIndex(i); setFlipped(null) }}
              className={`h-1.5 rounded-full transition-all ${
                i === studyIndex ? 'w-6 bg-indigo-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Grid view ───────────────────────────────────────
  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sora">Flashcards</h1>
          <p className="text-slate-400 text-sm mt-1">
            {flashcards.length} cards across all documents
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-xl bg-white/5 p-1">
            {['all', 'favorited'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f ? 'bg-indigo-500 text-white' : 'text-slate-400'
                }`}
              >
                {f === 'all'
                  ? `All (${flashcards.length})`
                  : `★ Favorites (${flashcards.filter((c) => c.favorited).length})`}
              </button>
            ))}
          </div>
          {visible.length > 0 && (
            <Button
              onClick={() => { setStudyMode(true); setStudyIndex(0); setFlipped(null) }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              📖 Study Mode
            </Button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-4">
          <div className="text-6xl">🃏</div>
          <h3 className="text-xl font-semibold font-sora">
            {filter === 'favorited' ? 'No favorites yet' : 'No flashcards yet'}
          </h3>
          <p className="text-slate-400 text-sm">
            {filter === 'favorited'
              ? 'Star cards you want to remember'
              : 'Open a document and generate flashcards'}
          </p>
          <Button
            onClick={() => setCurrentView('documents')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Go to Documents
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((card, i) => (
            <div
              key={card.id}
              className="flip-card h-44 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => setFlipped(flipped === card.id ? null : card.id)}
            >
              <div className={`flip-card-inner ${flipped === card.id ? 'flipped' : ''}`}>
                <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/8 to-violet-500/4">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Q</div>
                    <div className="font-medium text-sm leading-snug">{card.front}</div>
                  </div>
                </div>
                <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-teal-500/4">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">A</div>
                    <div className="text-sm leading-snug text-emerald-300">{card.back}</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavoriteFlashcard(card.id) }}
                  className={`text-sm p-1.5 rounded-lg transition-colors ${
                    card.favorited ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFlashcard(card.id) }}
                  className="text-sm p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
