const Loader = () => (
  <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-100 shadow-xl shadow-slate-950/30">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500" />
      <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Loading...</span>
    </div>
  </div>
)

export default Loader
