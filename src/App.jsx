import { useState } from 'react'
import CallCreator from './components/CallCreator'
import TranscriptViewer from './components/TranscriptViewer'

function App() {
  const [createdId, setCreatedId] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src="/flame-icon.svg"
                alt="Flames"
                className="w-20 h-20 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
              />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">NovaCall</h1>
            <p className="text-blue-200">Create and track outbound calls handled by an AI in Manohar's voice.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <CallCreator onCreated={setCreatedId} />
            {createdId && (
              <div className="mt-6 text-blue-200">
                <div className="text-sm">Call Task ID</div>
                <div className="font-mono bg-slate-900/60 border border-blue-500/30 rounded px-3 py-2 text-white break-all">{createdId}</div>
                <TranscriptViewer callId={createdId} />
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-blue-300/60">Your calls follow strict rules: natural greeting, on-script, clarify 1–2 times, then transfer and log everything.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
