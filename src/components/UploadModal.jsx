import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from './ui/Button'
import { genId, formatBytes, delay } from '../utils/helpers'

export default function UploadModal({ onClose }) {
  const { addDocument } = useApp()
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') setFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    for (let p = 0; p <= 100; p += 10) {
      await delay(80)
      setProgress(p)
    }
    addDocument({
      id: genId('doc'),
      name: file.name,
      size: file.size,
      pages: Math.floor(Math.random() * 50) + 10,
      uploadedAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-sora">Upload Document</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
        </div>

        {uploading ? (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="text-4xl animate-float">📄</div>
              <div className="font-medium">{file?.name}</div>
              <div className="text-sm text-slate-400">Processing your document…</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  {progress < 50 ? 'Uploading…' : progress < 80 ? 'Extracting text…' : 'Finalising…'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                dragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : file
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-white/15 hover:border-indigo-500/50'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="space-y-3">
                  <div className="text-4xl">📄</div>
                  <div className="font-medium text-emerald-400">{file.name}</div>
                  <div className="text-sm text-slate-400">{formatBytes(file.size)}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-5xl">⬆</div>
                  <div className="font-semibold text-lg">Drop your PDF here</div>
                  <div className="text-sm text-slate-500">or click to browse</div>
                  <div className="text-xs text-slate-600">PDF files only · Max 50 MB</div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
              <Button
                onClick={handleUpload}
                disabled={!file}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Upload PDF
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
