import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import type { Hotel } from '../types'
import { FaWandMagicSparkles, FaCompass, FaArrowRight, FaRotateLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const AIRecommendations = () => {
  const [vibe, setVibe] = useState('')
  const [budget, setBudget] = useState('')
  const [location, setLocation] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchedHotel, setMatchedHotel] = useState<Hotel | null>(null)

  const { data: hotels } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await api.get('/hotels')
      return response.data
    }
  })

  const handleGenerate = () => {
    if (!vibe || !budget || !location) return

    setIsAnalyzing(true)
    setMatchedHotel(null)

    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false)
      if (!hotels) return

      // Find matching hotels based on criteria
      const filtered = hotels.filter((h) => {
        // Location matching
        const locMatch = h.location.toLowerCase() === location.toLowerCase()
        
        // Price matching
        let priceMatch = true
        if (budget === 'budget') priceMatch = h.price < 12000
        else if (budget === 'mid') priceMatch = h.price >= 12000 && h.price <= 25000
        else if (budget === 'luxury') priceMatch = h.price > 25000

        return locMatch && priceMatch
      })

      // Fallback: pick any hotel in that location, or any hotel at all
      if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length)
        setMatchedHotel(filtered[randomIndex])
      } else {
        const locFiltered = hotels.filter(h => h.location.toLowerCase() === location.toLowerCase())
        if (locFiltered.length > 0) {
          setMatchedHotel(locFiltered[0])
        } else {
          setMatchedHotel(hotels[Math.floor(Math.random() * hotels.length)])
        }
      }
    }, 1800)
  }

  const resetQuiz = () => {
    setVibe('')
    setBudget('')
    setLocation('')
    setMatchedHotel(null)
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/10 bg-slate-950/80 p-8 dark:border-slate-800/80 dark:bg-slate-950/70 shadow-2xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.08),_transparent_45%)] animate-pulse" />
      
      <div className="relative flex flex-col md:flex-row gap-8 items-center">
        {/* Left Side Info */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-300 border border-brand-500/20">
            <FaWandMagicSparkles className="animate-spin-slow" />
            <span>AI Concierge Feature</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">
            Find Stays with <br />
            <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-orange-400 bg-clip-text text-transparent font-extrabold animated-gradient">
              AI Recommendation
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Tell us your travel style, budget, and destination. Our virtual advisor will instantly matches you with the ideal premium property.
          </p>
        </div>

        {/* Right Side Interaction Panel */}
        <div className="w-full md:w-[450px] shrink-0 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-inner shadow-slate-900/50 relative overflow-hidden min-h-[320px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. QUIZ FORM */}
            {!isAnalyzing && !matchedHotel && (
              <motion.div
                key="quiz-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">1. Vibe & Travel Style</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { key: 'romantic', label: 'Cozy' },
                      { key: 'adventure', label: 'Adventure' },
                      { key: 'luxury', label: 'Luxury' }
                    ].map(style => (
                      <button
                        key={style.key}
                        onClick={() => setVibe(style.key)}
                        className={`rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                          vibe === style.key 
                            ? 'border-brand-500 bg-brand-500/10 text-white' 
                            : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">2. Budget Range</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { key: 'budget', label: '₹ < 12k' },
                      { key: 'mid', label: '₹ 12k - 25k' },
                      { key: 'luxury', label: '₹ > 25k' }
                    ].map(b => (
                      <button
                        key={b.key}
                        onClick={() => setBudget(b.key)}
                        className={`rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                          budget === b.key 
                            ? 'border-brand-500 bg-brand-500/10 text-white' 
                            : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">3. Target Destination</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3.5 text-xs text-white outline-none focus:border-brand-400"
                  >
                    <option value="">Select Destination</option>
                    <option value="Amsterdam">Amsterdam (Netherlands)</option>
                    <option value="Buenos Aires">Buenos Aires (Argentina)</option>
                    <option value="New York City">New York (USA)</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!vibe || !budget || !location}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-xs font-semibold text-white transition hover:bg-brand-400 disabled:opacity-40 disabled:hover:scale-100 hover:scale-102 active:scale-98 shadow-lg shadow-brand-500/15"
                >
                  <span>Generate Match</span>
                  <FaCompass />
                </button>
              </motion.div>
            )}

            {/* 2. LOADING SCREEN */}
            {isAnalyzing && (
              <motion.div
                key="loading-ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-brand-500 animate-spin" />
                  <FaWandMagicSparkles className="text-brand-400 animate-pulse text-lg" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white font-display">AI Advisor analyzing stays...</p>
                  <p className="text-xs text-slate-500 animate-pulse">Filtering coordinates & guest reviews</p>
                </div>
                <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="h-full w-1/2 bg-gradient-to-r from-brand-500 to-sky-400"
                  />
                </div>
              </motion.div>
            )}

            {/* 3. MATCHED HOTEL */}
            {!isAnalyzing && matchedHotel && (
              <motion.div
                key="matched-hotel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">100% Match Found</p>
                  <h3 className="text-xl font-bold font-display text-white mt-1">{matchedHotel.name}</h3>
                  <p className="text-xs text-slate-400">{matchedHotel.location}</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 aspect-video relative group">
                  <img
                    src={matchedHotel.image_exterior}
                    alt={matchedHotel.name}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold text-brand-300">
                    ₹{matchedHotel.price.toLocaleString()} / night
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">
                  "{matchedHotel.description}"
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={resetQuiz}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                    title="Retry quiz"
                  >
                    <FaRotateLeft size={14} />
                  </button>
                  <Link
                    to={`/hotels/${matchedHotel._id}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98"
                  >
                    <span>View Property Details</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AIRecommendations
