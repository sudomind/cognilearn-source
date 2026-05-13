import { useState } from 'react'
import { Button } from '../ui/Button'
import { Skeleton } from '../ui/Loaders'
import { explainConcept } from '../../services/anthropic'

export default function ExplainTab({ content }) {
  const [concept, setConcept] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExplain = async () => {
    if (!concept.trim()) return
    setLoading(true)
    setExplanation('')
    try {
      const result = await explainConcept(concept, content)
      setExplanation(result)
    } catch {
      setExplanation('Failed to explain. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderMarkdown = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300">$1</strong>')
      .replace(/\n/g, '<br/>')

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h3 className="font-semibold font-sora">Concept Explainer</h3>
        <p className="text-xs text-slate-500 mt-1">
          Get a deep explanation of any concept from the document
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
          placeholder="Enter a concept to explain… (e.g. neural networks, recursion)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <Button
          onClick={handleExplain}
          disabled={!concept.trim() || loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 rounded-xl whitespace-nowrap"
        >
          {loading ? '…' : 'Explain'}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[100, 85, 92, 78, 88, 60].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : explanation ? (
        <div className="glass-card rounded-2xl p-6">
          <div
            className="text-slate-200 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation) }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl">💡</div>
          <p className="text-slate-400 text-sm">
            Enter a concept above and I'll explain it in detail
          </p>
        </div>
      )}
    </div>
  )
}
