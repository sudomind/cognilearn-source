import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import ChatTab from '../components/tabs/ChatTab'
import SummaryTab from '../components/tabs/SummaryTab'
import ExplainTab from '../components/tabs/ExplainTab'
import FlashcardsTab from '../components/tabs/FlashcardsTab'
import QuizTab from '../components/tabs/QuizTab'

const TABS = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'summary', label: 'Summary', icon: '📝' },
  { id: 'explain', label: 'Explain', icon: '💡' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
  { id: 'quiz', label: 'Quiz', icon: '🧠' },
]

const FALLBACK_CONTENT =
  'This document contains educational content about the subject matter. It covers key concepts, definitions, theories, and practical applications. The material includes discussions of fundamental principles, advanced topics, case studies, and examples.'

export default function DocumentDetailPage() {
  const { documents, selectedDocId, setCurrentView } = useApp()
  const [activeTab, setActiveTab] = useState('chat')
  const doc = documents.find((d) => d.id === selectedDocId)

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-5xl">📄</div>
        <div className="text-slate-400">Document not found</div>
        <Button onClick={() => setCurrentView('documents')} className="bg-indigo-500 text-white">
          Back to Documents
        </Button>
      </div>
    )
  }

  const content = doc.content || FALLBACK_CONTENT

  return (
    <div className="flex flex-col h-screen relative z-10">
      {/* Top breadcrumb bar */}
      <div
        className="border-b px-6 py-4 flex items-center gap-4"
        style={{
          background: 'rgba(10,12,24,0.6)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <button
          onClick={() => setCurrentView('documents')}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg">📄</span>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{doc.name}</div>
            <div className="text-xs text-slate-500">{doc.pages} pages</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="border-b px-6"
        style={{
          background: 'rgba(10,12,24,0.4)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatTab docId={doc.id} content={content} docName={doc.name} />
        )}
        {activeTab === 'summary' && (
          <SummaryTab docId={doc.id} content={content} docName={doc.name} />
        )}
        {activeTab === 'explain' && <ExplainTab content={content} />}
        {activeTab === 'flashcards' && (
          <FlashcardsTab docId={doc.id} content={content} />
        )}
        {activeTab === 'quiz' && (
          <QuizTab docId={doc.id} content={content} docName={doc.name} />
        )}
      </div>
    </div>
  )
}
