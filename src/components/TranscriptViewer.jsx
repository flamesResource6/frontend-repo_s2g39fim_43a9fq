import { useEffect, useState } from 'react'

export default function TranscriptViewer({ callId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!callId) return
    const fetchData = async () => {
      try {
        const res = await fetch(`${backend}/api/transcripts/${callId}?limit=200`)
        if (!res.ok) throw new Error('Failed to load transcripts')
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        setError(e.message)
      }
    }
    fetchData()
  }, [callId])

  if (!callId) return null

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold mb-2">Transcript</h3>
      {error && <div className="text-red-300 text-sm mb-2">{error}</div>}
      <div className="bg-slate-900/60 border border-blue-500/30 rounded-lg p-4 max-h-64 overflow-auto space-y-2">
        {items.length === 0 ? (
          <p className="text-blue-200/70 text-sm">No entries yet.</p>
        ) : (
          items.map((it) => (
            <div key={it._id} className="text-blue-100/90 text-sm">
              <span className="font-semibold">[{it.role}]</span> {it.text}
              {it.timestamp && (
                <span className="text-xs text-blue-300/60"> • {new Date(it.timestamp).toLocaleString()}</span>
              )}
              {it.outcome && (
                <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-xs">{it.outcome}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
