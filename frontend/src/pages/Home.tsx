import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import HotelCard from '../components/HotelCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import AIRecommendations from '../components/AIRecommendations'
import type { Hotel } from '../types'
import {
  FaMagnifyingGlass,
  FaStar,
  FaQuoteLeft,
  FaArrowRight
} from 'react-icons/fa6'

import {
  RiHotelFill,
  RiMapPin2Fill,
  RiTeamFill,
  RiCompass3Fill
} from 'react-icons/ri'

// Popular categories
const categories = [
  { name: 'Luxury Stays', icon: '💎', count: 12 },
  { name: 'City Breaks', icon: '🏙️', count: 15 },
  { name: 'Beach Escapes', icon: '🏖️', count: 8 },
  { name: 'Mountain Retreats', icon: '⛰️', count: 6 },
  { name: 'Wellness & Spas', icon: '🧘', count: 9 }
]

// Testimonials
const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Frequent Explorer',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    comment:
      'The booking flow on Traveller was exceptionally smooth, and the property matches were spot on.',
    rating: 5
  },
  {
    name: 'Marcus Vance',
    role: 'Luxury Traveler',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    comment:
      'I was blown away by the detail gallery and AI matching tool.',
    rating: 5
  },
  {
    name: 'Aiko Tanaka',
    role: 'Travel Journalist',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    comment:
      'Traveller curated selection represents the absolute best.',
    rating: 5
  }
]

// Counter card
const StatCounter = ({
  value,
  label,
  icon: Icon
}: {
  value: string
  label: string
  icon: any
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card flex items-center gap-4 rounded-3xl p-6 shadow-lg shadow-slate-950/20"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
        <Icon size={24} />
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          {value}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

const Home = () => {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Fetch hotels
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await api.get('/hotels')
      return response.data
    }
  })

  // Featured hotels
  const featured = hotels
    ? hotels.filter((h) => h.tag === 'bestseller').slice(0, 6)
    : []

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      navigate(`/hotels?search=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/hotels')
    }
  }

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(
        (prev) => (prev + 1) % testimonials.length
      )
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-24 py-4">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6 md:px-12 text-center text-white shadow-2xl">
        
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_40%)]" />

        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')"
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs tracking-wider uppercase text-brand-300"
          >
            <RiCompass3Fill
              size={14}
              className="animate-spin-slow"
            />

            <span>Redefining Premium Travel Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight font-display sm:text-6xl md:text-7xl leading-[1.1]"
          >
            Find Stays Built For{' '}

            <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Modern Explorers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed"
          >
            Discover handpicked luxury properties and
            unforgettable travel experiences.
          </motion.p>

          {/* SEARCH */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 rounded-3xl sm:rounded-full shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-3 w-full px-4 py-2">
              <FaMagnifyingGlass className="text-brand-300" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Where are you flying next?"
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 border-none outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-3xl sm:rounded-full bg-brand-500 px-8 py-3.5 text-xs font-semibold text-white transition hover:bg-brand-400"
            >
              Search Hotels
            </button>
          </motion.form>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatCounter
          value="80+"
          label="Bespoke Stays"
          icon={RiHotelFill}
        />

        <StatCounter
          value="12k+"
          label="Happy Explorers"
          icon={RiTeamFill}
        />

        <StatCounter
          value="4.92"
          label="Average Rating"
          icon={FaStar}
        />

        <StatCounter
          value="15+"
          label="Locations"
          icon={RiMapPin2Fill}
        />
      </section>

      {/* CATEGORIES */}
      <section className="space-y-6 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-xs uppercase tracking-widest text-brand-500 font-bold">
            Curated Ambiances
          </p>

          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Choose Your Travel Vibe
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {categories.map((cat, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(
                  `/hotels?category=${encodeURIComponent(
                    cat.name
                  )}`
                )
              }
              className="glass-card flex items-center gap-3 rounded-2xl px-5 py-4 shadow-md"
            >
              <span className="text-xl">{cat.icon}</span>

              <div>
                <p className="font-semibold">
                  {cat.name}
                </p>

                <p className="text-[10px] text-slate-400">
                  {cat.count} listings
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-brand-500 font-bold">
              Exclusive Deals
            </p>

            <h2 className="text-3xl font-bold font-display">
              Bestseller Properties
            </h2>
          </div>

          <Link
            to="/hotels"
            className="group flex items-center gap-1.5 text-sm font-semibold text-brand-600"
          >
            <span>Explore All Hotels</span>

            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage>
            Unable to load hotel listings.
          </ErrorMessage>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
              />
            ))}
          </div>
        )}
      </section>

      {/* AI SECTION */}
      <section>
        <AIRecommendations />
      </section>

      {/* TESTIMONIALS */}
      <section className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-6 left-6 text-brand-500/10">
          <FaQuoteLeft size={160} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Avatars */}
          <div className="relative shrink-0 flex md:flex-col items-center justify-center gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setActiveTestimonial(idx)
                }
                className={`relative rounded-full p-1 transition overflow-hidden ${
                  activeTestimonial === idx
                    ? 'border-2 border-brand-500 scale-110'
                    : 'border border-slate-800 scale-90 opacity-60'
                }`}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Quote */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-1">
              {Array.from({
                length:
                  testimonials[activeTestimonial]
                    .rating
              }).map((_, i) => (
                <FaStar
                  key={i}
                  className="text-amber-400 text-sm"
                />
              ))}
            </div>

            <p className="text-lg md:text-xl italic text-slate-800 dark:text-slate-200 leading-relaxed">
              "
              {
                testimonials[activeTestimonial]
                  .comment
              }
              "
            </p>

            <div>
              <p className="text-base font-bold">
                {
                  testimonials[activeTestimonial]
                    .name
                }
              </p>

              <p className="text-xs text-slate-500">
                {
                  testimonials[activeTestimonial]
                    .role
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home