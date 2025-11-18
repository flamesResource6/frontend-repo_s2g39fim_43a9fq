import { useState } from 'react'

export default function CallCreator({ onCreated }) {
  const [form, setForm] = useState({
    target_phone: '',
    intent: '',
    script: '',
    talking_points: '',
    fallback_conditions: 'If asked to speak to Manohar; Silence > 5s; Unclear response',
    voice_model_id: '',
    consent_required: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        target_phone: form.target_phone.trim(),
        intent: form.intent.trim(),
        script: form.script.trim() || undefined,
        talking_points: form.talking_points
          ? form.talking_points.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        fallback_conditions: form.fallback_conditions
          ? form.fallback_conditions.split(';').map((s) => s.trim()).filter(Boolean)
          : undefined,
        voice_model_id: form.voice_model_id.trim(),
        consent_required: !!form.consent_required,
        status: 'pending',
      }

      const res = await fetch(`${backend}/api/call-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || `Request failed with ${res.status}`)
      }

      const data = await res.json()
      onCreated?.(data.id)
    } catch (err) {
      setError(err.message || 'Failed to create call task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-blue-100 mb-1">Target phone (E.164)</label>
        <input
          name="target_phone"
          value={form.target_phone}
          onChange={handleChange}
          placeholder="+11234567890"
          className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-blue-100 mb-1">Caller intent</label>
        <input
          name="intent"
          value={form.intent}
          onChange={handleChange}
          placeholder="Follow up on job application at XYZ"
          className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-blue-100 mb-1">Script (optional)</label>
        <textarea
          name="script"
          value={form.script}
          onChange={handleChange}
          rows={4}
          placeholder="Full conversation script"
          className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-blue-100 mb-1">Talking points (comma-separated)</label>
        <input
          name="talking_points"
          value={form.talking_points}
          onChange={handleChange}
          placeholder="Introduce, ask availability, propose time"
          className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-blue-100 mb-1">Fallback triggers (semicolon-separated)</label>
        <input
          name="fallback_conditions"
          value={form.fallback_conditions}
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Voice model ID</label>
          <input
            name="voice_model_id"
            value={form.voice_model_id}
            onChange={handleChange}
            placeholder="manohar-voice-v1"
            className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            id="consent_required"
            type="checkbox"
            name="consent_required"
            checked={form.consent_required}
            onChange={handleChange}
            className="h-4 w-4 rounded border-blue-500/30 bg-slate-900/60"
          />
          <label htmlFor="consent_required" className="text-sm text-blue-100">Play recording disclaimer</label>
        </div>
      </div>

      {error && <div className="text-red-300 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Creating...' : 'Create Call Task'}
      </button>
    </form>
  )
}
