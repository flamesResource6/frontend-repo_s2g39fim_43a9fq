import { useEffect, useRef, useState } from 'react'

export default function TranscriptViewer({ callId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [isLive, setIsLive] = useState(true)
  const timerRef = useRef(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async () => {
    try {
      const res = await fetch(`${backend}/api/transcripts/${callId}?limit=200`)
      if (!res.ok) throw new Error('Failed to load transcripts')
      const data = await res.json()
      const list = data.items || []
      setItems(list)
      // Stop polling if we detect a terminal outcome
      const hasOutcome = list.some((it) => it.outcome)
      if (hasOutcome && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        setIsLive(false)
      }
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (!callId) return

    // Initial load
    fetchData()

    // Start polling
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(fetchData, 1000)
    setIsLive(true)

    // Cleanup on unmount or callId change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId])

  if (!callId) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-white font-semibold">Transcript</h3>
        {isLive && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">live</span>
        )}
      </div>
      {error && <div className="text-red-300 text-sm mb-2">{error}</div>}
      <div className="bg-slate-900/60 border border-blue-500/30 rounded-lg p-4 max-h-64 overflow-auto space-y-2">
        {items.length === 0 ? (
          <p className="text-blue-200/70 text-sm">Waiting for entries...</p>
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
