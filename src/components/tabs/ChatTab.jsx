import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../ui/Button'
import { TypingDots } from '../ui/Loaders'
import { sendChatMessage } from '../../services/anthropic'
import { genId } from '../../utils/helpers'

const SUGGESTIONS = [
  'Summarize the key concepts',
  'What are the main topics?',
  'Explain the most important idea',
  'Give me 3 key takeaways',
]

export default function ChatTab({ docId, content, docName }) {
  const { chatHistories, addChatMessage, clearChat } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const history = chatHistories[docId] || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const send = async (message) => {
    const text = (message || input).trim()
    if (!text || loading) return
    setInput('')

    addChatMessage(docId, {
      id: genId('msg'),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    })
    setLoading(true)

    try {
      const reply = await sendChatMessage(text, content, docName, history)
      addChatMessage(docId, {
        id: genId('msg'),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      })
    } catch {
      addChatMessage(docId, {
        id: genId('msg'),
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="text-sm text-slate-400">AI Chat with your document</div>
        {history.length > 0 && (
          <button
            onClick={() => clearChat(docId)}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="text-5xl animate-float">💬</div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg font-sora">Ask anything about this document</h3>
              <p className="text-slate-400 text-sm">
                I've read the entire document and can answer your questions
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs glass-card rounded-xl p-3 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {history.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'chat-user text-white rounded-br-sm'
                      : 'chat-ai text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                  🤖
                </div>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask a question about this document…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 rounded-xl"
          >
            {loading ? '…' : '→'}
          </Button>
        </div>
      </div>
    </div>
  )
}
