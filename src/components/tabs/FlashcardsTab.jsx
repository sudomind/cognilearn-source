import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { Spinner, Skeleton } from '../ui/Loaders'
import { generateFlashcards } from '../../services/anthropic'
import { genId } from '../../utils/helpers'

export default function FlashcardsTab({ docId, content }) {
  const { flashcards, addFlashcards, toggleFavoriteFlashcard, deleteFlashcard } = useApp()
  const cards = flashcards.filter((f) => f.docId === docId)

  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(8)
  const [flipped, setFlipped] = useState(null)
  const [studyIndex, setStudyIndex] = useState(0)
  const [view, setView] = useState('grid') // 'grid' | 'study'

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const raw = await generateFlashcards(content, count)
      addFlashcards(
        raw.map((c, i) => ({
          id: genId('fc'),
          docId,
          front: c.front,
          back: c.back,
          favorited: false,
          reviewed: false,
        }))
      )
      setStudyIndex(0)
      setFlipped(null)
    } catch {
      alert('Failed to generate flashcards')
    } finally {
      setLoading(false)
    }
  }

  const currentCard = cards[studyIndex]

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold font-sora">Flashcards</h3>
          <p className="text-xs text-slate-500 mt-1">{cards.length} cards generated</p>
        </div>
        <div className="flex items-center gap-2">
          {cards.length > 0 && (
            <div className="flex rounded-lg bg-white/5 p-0.5">
              {['grid', 'study'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    view === v ? 'bg-indigo-500 text-white' : 'text-slate-400'
                  }`}
                >
                  {v === 'grid' ? '⊞ Grid' : '📖 Study'}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Cards:</span>
            {[6, 8, 10, 12].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  count === n ? 'bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs gap-1.5"
          >
            {loading ? (
              <>
                <Spinner className="w-3 h-3" /> Generating…
              </>
            ) : (
              '✨ Generate'
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl animate-float">🃏</div>
          <h3 className="font-semibold font-sora">No flashcards yet</h3>
          <p className="text-slate-400 text-sm">Generate AI-powered flashcards from this document</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flip-card h-40 group"
              onClick={() => setFlipped(flipped === card.id ? null : card.id)}
            >
              <div className={`flip-card-inner ${flipped === card.id ? 'flipped' : ''}`}>
                <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Question</div>
                    <div className="font-medium text-sm leading-snug">{card.front}</div>
                    <div className="text-xs text-slate-600">Click to flip</div>
                  </div>
                </div>
                <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                  <div className="text-center space-y-2 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Answer</div>
                    <div className="text-sm leading-snug text-emerald-300">{card.back}</div>
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavoriteFlashcard(card.id) }}
                  className={`text-xs p-1.5 rounded-lg transition-colors ${
                    card.favorited
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-slate-500 bg-white/5 hover:text-amber-400'
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFlashcard(card.id) }}
                  className="text-xs p-1.5 rounded-lg text-slate-500 bg-white/5 hover:text-rose-400 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Study mode
        <div className="space-y-6">
          <div
            className="flip-card h-64"
            onClick={() =>
              setFlipped(flipped === currentCard?.id ? null : currentCard?.id)
            }
          >
            <div className={`flip-card-inner ${flipped === currentCard?.id ? 'flipped' : ''}`}>
              <div className="flip-card-front glass-card border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 flex-col gap-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest">
                  Card {studyIndex + 1} of {cards.length}
                </div>
                <div className="font-semibold text-xl text-center leading-snug">
                  {currentCard?.front}
                </div>
                <div className="text-sm text-slate-500">Click to reveal answer</div>
              </div>
              <div className="flip-card-back glass-card border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 flex-col gap-4">
                <div className="text-xs text-emerald-500 uppercase tracking-widest">Answer</div>
                <div className="text-lg text-center text-emerald-300 leading-relaxed">
                  {currentCard?.back}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => { setStudyIndex(Math.max(0, studyIndex - 1)); setFlipped(null) }}
              disabled={studyIndex === 0}
              variant="ghost"
              className="border border-white/10"
            >
              ← Prev
            </Button>
            <div className="text-sm text-slate-400">
              {studyIndex + 1} / {cards.length}
            </div>
            <Button
              onClick={() => { setStudyIndex(Math.min(cards.length - 1, studyIndex + 1)); setFlipped(null) }}
              disabled={studyIndex === cards.length - 1}
              variant="ghost"
              className="border border-white/10"
            >
              Next →
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="flex gap-1">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStudyIndex(i); setFlipped(null) }}
                  className={`h-2 rounded-full transition-all ${
                    i === studyIndex ? 'w-4 bg-indigo-400' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
