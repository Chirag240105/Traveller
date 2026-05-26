import { useEffect, useState } from 'react'
import { RiServerLine } from 'react-icons/ri'

const Loader = () => {
  const [showSlowMsg, setShowSlowMsg] = useState(false)
  const [showVerySlowMsg, setShowVerySlowMsg] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowSlowMsg(true), 5000)
    const t2 = setTimeout(() => setShowVerySlowMsg(true), 15000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-100 shadow-xl shadow-slate-950/30">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500" />

        {!showSlowMsg && (
          <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Loading...</span>
        )}

        {showSlowMsg && !showVerySlowMsg && (
          <div className="space-y-2 animate-pulse">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <RiServerLine size={16} />
              <span className="text-sm font-semibold">Waking up server...</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The free server goes to sleep after inactivity.<br />
              It'll be ready in <span className="text-slate-300 font-medium">20–30 seconds</span>.
            </p>
          </div>
        )}

        {showVerySlowMsg && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-brand-400">
              <RiServerLine size={16} />
              <span className="text-sm font-semibold">Almost there...</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Server is starting up. This only happens on the first visit.<br />
              <span className="text-slate-400">Subsequent loads will be instant.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Loader
