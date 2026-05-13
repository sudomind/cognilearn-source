import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Loaders'
import { generateQuiz } from '../../services/anthropic'
import { genId, timeAgo } from '../../utils/helpers'

export default function QuizTab({ docId, content, docName }) {
  const { addQuiz, updateQuizScore, quizzes } = useApp()
  const docQuizzes = quizzes.filter((q) => q.docId === docId)

  const [generating, setGenerating] = useState(false)
  const [count, setCount] = useState(5)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const questions = await generateQuiz(content, count)
      if (!questions.length) throw new Error('No questions generated')
      const quiz = {
        id: genId('quiz'),
        docId,
        docName,
        questions,
        createdAt: new Date().toISOString(),
      }
      addQuiz(quiz)
      startQuiz(quiz)
    } catch {
      alert('Failed to generate quiz. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz)
    setQuestionIndex(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    if (questionIndex < activeQuiz.questions.length - 1) {
      setAnswers(newAnswers)
      setQuestionIndex(questionIndex + 1)
      setSelected(null)
    } else {
      const score = newAnswers.filter(
        (ans, i) => ans === activeQuiz.questions[i].correct
      ).length
      setAnswers(newAnswers)
      updateQuizScore(activeQuiz.id, score)
      setActiveQuiz((q) => ({ ...q, score, total: q.questions.length }))
      setFinished(true)
    }
  }

  // ── Quiz in progress ────────────────────────────────
  if (activeQuiz && !finished) {
    const q = activeQuiz.questions[questionIndex]
    const pct = (questionIndex / activeQuiz.questions.length) * 100

    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Question {questionIndex + 1} of {activeQuiz.questions.length}
          </div>
          <button
            onClick={() => setActiveQuiz(null)}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Exit quiz
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full progress-bar transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg leading-relaxed mb-6 font-sora">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 text-sm ${
                  selected === i
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-indigo-500/50 hover:bg-white/8'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 transition-all ${
                      selected === i
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-white/20 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl"
        >
          {questionIndex < activeQuiz.questions.length - 1 ? 'Next Question →' : 'Submit Quiz'}
        </Button>
      </div>
    )
  }

  // ── Quiz results ────────────────────────────────────
  if (activeQuiz && finished) {
    const score = activeQuiz.score ?? 0
    const total = activeQuiz.questions.length
    const pct = Math.round((score / total) * 100)

    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <div>
            <div className="text-4xl font-bold font-sora">{pct}%</div>
            <div className="text-slate-400 text-sm mt-1">{score} of {total} correct</div>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden max-w-xs mx-auto">
            <div className="h-full progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-sm text-slate-400">
            {pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort!' : 'Keep studying!'}
          </div>
        </div>

        {/* Review */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm font-sora">Review Answers</h3>
          {activeQuiz.questions.map((q, i) => {
            const userAns = answers[i]
            const correct = q.correct
            const isRight = userAns === correct
            return (
              <div
                key={i}
                className={`glass-card rounded-xl p-4 border ${
                  isRight ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-lg">{isRight ? '✅' : '❌'}</span>
                  <div className="font-medium text-sm">{q.question}</div>
                </div>
                <div className="space-y-1.5 ml-7">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`text-xs px-3 py-1.5 rounded-lg ${
                        j === correct
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : j === userAns && !isRight
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 mt-2 italic">{q.explanation}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setActiveQuiz(null)} variant="ghost" className="flex-1 border border-white/10">
            Back to Quizzes
          </Button>
          <Button onClick={handleGenerate} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white">
            New Quiz
          </Button>
        </div>
      </div>
    )
  }

  // ── Quiz list / generate ────────────────────────────
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold font-sora">AI Quiz Generator</h3>
          <p className="text-xs text-slate-500 mt-1">Test your knowledge with MCQ quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Questions:</span>
            {[5, 8, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-8 h-7 rounded-lg text-xs font-medium transition-all ${
                  count === n ? 'bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm gap-1.5"
          >
            {generating ? (
              <>
                <Spinner className="w-3.5 h-3.5" /> Generating…
              </>
            ) : (
              '🧠 Generate Quiz'
            )}
          </Button>
        </div>
      </div>

      {docQuizzes.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs text-slate-500 uppercase tracking-widest">Previous Quizzes</h4>
          {docQuizzes.map((q) => {
            const pct = q.score === undefined ? null : Math.round((q.score / q.total) * 100)
            return (
              <div
                key={q.id}
                className="glass-card rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{q.questions.length} questions</div>
                  <div className="text-xs text-slate-500">{timeAgo(q.createdAt)}</div>
                </div>
                {pct === null ? (
                  <Button
                    onClick={() => startQuiz(q)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
                  >
                    Start
                  </Button>
                ) : (
                  <div
                    className={`text-lg font-bold ${
                      pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {pct}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl animate-float">🧠</div>
          <h3 className="font-semibold font-sora">Ready to test yourself?</h3>
          <p className="text-slate-400 text-sm">Generate an AI quiz from this document</p>
        </div>
      )}
    </div>
  )
}
