import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import UploadModal from '../components/UploadModal'
import { formatBytes, timeAgo } from '../utils/helpers'

const CARD_BG = {
  indigo: 'bg-indigo-500/15 border-indigo-500/30',
  emerald: 'bg-emerald-500/15 border-emerald-500/30',
  violet: 'bg-violet-500/15 border-violet-500/30',
  amber: 'bg-amber-500/15 border-amber-500/30',
  rose: 'bg-rose-500/15 border-rose-500/30',
}

const ICON_BG = {
  indigo: 'bg-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  violet: 'bg-violet-500/20 text-violet-400',
  amber: 'bg-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/20 text-rose-400',
}

export default function DocumentsPage() {
  const { documents, deleteDocument, setCurrentView, setSelectedDocId } = useApp()
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto animate-fade-in">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sora">My Documents</h1>
          <p className="text-slate-400 text-sm mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
          <span>⬆</span> Upload PDF
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents…"
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-4">
          <div className="text-6xl">📂</div>
          <h3 className="text-xl font-semibold font-sora">
            {search ? 'No results found' : 'No documents yet'}
          </h3>
          <p className="text-slate-400 text-sm">
            {search ? 'Try a different search term' : 'Upload your first PDF to start learning'}
          </p>
          {!search && (
            <Button onClick={() => setShowUpload(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white mt-4">
              Upload PDF
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div
              key={doc.id}
              className={`glass-card rounded-2xl border p-6 hover:scale-[1.02] transition-all duration-200 animate-fade-in-up group relative cursor-pointer ${
                CARD_BG[doc.color] || CARD_BG.indigo
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => { setSelectedDocId(doc.id); setCurrentView('document-detail') }}
            >
              {/* Delete confirm */}
              {confirmDelete === doc.id ? (
                <div
                  className="absolute top-3 right-3 flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { deleteDocument(doc.id); setConfirmDelete(null) }}
                    className="text-xs bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg px-2 py-1 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-xs bg-white/10 text-slate-400 hover:bg-white/15 rounded-lg px-2 py-1 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(doc.id) }}
                  className="absolute top-3 right-3 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all text-sm p-1"
                >
                  🗑
                </button>
              )}

              <div className={`w-12 h-12 rounded-xl ${ICON_BG[doc.color] || ICON_BG.indigo} flex items-center justify-center text-2xl mb-4`}>
                📄
              </div>

              <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">{doc.name}</h3>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{doc.pages} pages</span>
                <span>·</span>
                <span>{formatBytes(doc.size || doc.fileSize || 0)}</span>
                <span>·</span>
                <span>{timeAgo(doc.uploadedAt)}</span>
              </div>

              {doc.summary && (
                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {doc.summary.slice(0, 100)}…
                </p>
              )}

              <div className="mt-4 flex gap-2">
                {['Chat', 'Quiz', 'Cards'].map((tag) => (
                  <div key={tag} className="text-xs bg-white/5 rounded-lg px-2.5 py-1 text-slate-400">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
