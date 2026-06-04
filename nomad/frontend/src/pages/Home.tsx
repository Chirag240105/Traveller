import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../api'
import HotelCard from '../components/HotelCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import AIRecommendations from '../components/AIRecommendations'
import type { Hotel } from '../types'
import MagneticButton from '../components/MagneticButton'
import MouseGradient from '../components/MouseGradient'
import {
  FaMagnifyingGlass,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaArrowLeft,
  FaGlobe,
  FaCompass,
  FaUserGroup,
  FaSliders,
  FaChevronRight,
  FaCalendarDays
} from 'react-icons/fa6'
import {
  RiCompass3Fill,
  RiHotelFill,
  RiMapPin2Fill,
  RiTeamFill,
  RiShieldCheckFill,
  RiCustomerService2Fill,
  RiSparklingFill
} from 'react-icons/ri'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// Popular categories with premium layout
const categories = [
  { name: 'Luxury Stays', icon: '💎', count: 12, description: '5-star exclusive properties' },
  { name: 'City Breaks', icon: '🏙️', count: 15, description: 'Metropolitan exploration' },
  { name: 'Beach Escapes', icon: '🏖️', count: 8, description: 'Pristine coastal retreats' },
  { name: 'Mountain Retreats', icon: '⛰️', count: 6, description: 'Secluded alpine lodges' },
  { name: 'Wellness & Spas', icon: '🧘', count: 9, description: 'Holistic healing sanctuaries' }
]

// Testimonials
const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Frequent Explorer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    comment: 'The booking flow on NomadLuxury was exceptionally smooth, and the property matches were spot on. Pure luxury.',
    rating: 5
  },
  {
    name: 'Marcus Vance',
    role: 'Luxury Traveler',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    comment: 'I was blown away by the detail gallery and AI matching tool. Truly a premium experience in every aspect.',
    rating: 5
  },
  {
    name: 'Aiko Tanaka',
    role: 'Travel Journalist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    comment: 'NomadLuxury curated selection represents the absolute best. Customer support feels like a 24/7 personal concierge.',
    rating: 5
  }
]

// Partners list (monochrome luxury design)
const partners = [
  { name: 'EMIRATES', logo: '✈️' },
  { name: 'RITZ-CARLTON', logo: '👑' },
  { name: 'QATAR AIRWAYS', logo: '🌟' },
  { name: 'FOUR SEASONS', logo: '⚜️' },
  { name: 'MARRIOTT BONVOY', logo: '🏨' },
  { name: 'SINGAPORE AIRLINES', logo: '✨' }
]

// Journey stops for Interactive Journey Section
const journeyStops = [
  {
    title: 'Curated Haven Matching',
    desc: 'Browse our elite portfolio of hotels, handpicked by experienced luxury travel designers.',
    num: '01'
  },
  {
    title: 'Custom Upgrades & Extras',
    desc: 'Seamlessly add airport chauffeur transfer, private dining reservations, and luxury spa access.',
    num: '02'
  },
  {
    title: '24/7 Elite Concierge Access',
    desc: 'Connect with a personal assistant ready to handle modifications, bookings, and VIP services.',
    num: '03'
  },
  {
    title: 'Seamless Arrival & Indulgence',
    desc: 'Enjoy priority early check-in, complimentary upgrades, and bespoke welcome gifts.',
    num: '04'
  }
]

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchGuests, setSearchGuests] = useState('2 Guests')
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const statsSectionRef = useRef<HTMLDivElement>(null)
  const journeySectionRef = useRef<HTMLDivElement>(null)

  // Fetch hotels
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await api.get('/hotels')
      return response.data
    }
  })

  // Featured bestseller hotels
  const featured = hotels
    ? hotels.filter((h) => h.tag === 'bestseller').slice(0, 6)
    : []

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    let url = '/hotels?'
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery)}&`
    if (searchLocation.trim()) url += `location=${encodeURIComponent(searchLocation)}`
    navigate(url)
  }

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // GSAP animations
  useEffect(() => {
    // 1. Hero Reveal Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(
        '.hero-reveal-subtitle',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo(
        '.hero-reveal-title',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
        '-=0.4'
      )
      .fromTo(
        '.hero-reveal-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.hero-reveal-form',
        { opacity: 0, scale: 0.96, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' },
        '-=0.3'
      )
      .fromTo(
        '.hero-reveal-badge',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      )

      // 2. Parallax Image Zoom Trigger on scroll
      gsap.to('.hero-bg-image', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // 3. Stats counter animation
      const statsElements = gsap.utils.toArray('.stat-number-counter')
      statsElements.forEach((el: any) => {
        const targetVal = parseFloat(el.getAttribute('data-target') || '0')
        const isDecimal = el.getAttribute('data-decimal') === 'true'
        const countObj = { val: 0 }
        
        gsap.to(countObj, {
          val: targetVal,
          scrollTrigger: {
            trigger: statsSectionRef.current,
            start: 'top 85%'
          },
          duration: 2.0,
          ease: 'power3.out',
          onUpdate: () => {
            el.innerText = isDecimal ? countObj.val.toFixed(2) : Math.floor(countObj.val).toLocaleString() + (el.innerText.includes('+') ? '+' : '')
          }
        })
      })

      // 4. Interactive Journey route scroll line fill
      gsap.fromTo(
        '.journey-route-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: journeySectionRef.current,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: true
          }
        }
      )

      // Journey stop points fade-in on scroll
      const stops = gsap.utils.toArray('.journey-stop-card')
      stops.forEach((stop: any) => {
        gsap.fromTo(
          stop,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: stop,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        )
      })

      // Featured properties fade-in
      gsap.fromTo(
        '.featured-hotel-row',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.featured-hotel-section',
            start: 'top 75%'
          }
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="space-y-32 pb-24">
      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden rounded-[3rem] bg-gradient-to-b from-ocean-950 via-ocean-800 to-ocean-950 px-6 py-20 text-white shadow-2xl"
      >
        {/* Parallax Background Cover Image */}
        <div
          className="hero-bg-image absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity transform scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=1600&auto=format&fit=crop')"
          }}
        />

        {/* Ambient Top Light Radial Mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,107,53,0.15),_transparent_45%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10 text-center">
          {/* Tag */}
          <div className="hero-reveal-subtitle inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] tracking-widest uppercase text-sunset-500 font-bold">
            <RiSparklingFill className="text-sunset-500 animate-pulse" />
            <span>Redefining Luxury Travel Curations</span>
          </div>

          {/* Heading */}
          <h1 className="hero-reveal-title text-5xl font-extrabold tracking-tight font-display sm:text-7xl lg:text-8xl leading-[1.05]">
            Find Havens Built For{' '}
            <span className="bg-gradient-to-r from-sunset-500 via-sunset-600 to-orange-400 bg-clip-text text-transparent">
              Elite Explorers.
            </span>
          </h1>

          {/* Description */}
          <p className="hero-reveal-desc max-w-2xl mx-auto text-slate-300 text-sm sm:text-lg leading-relaxed">
            Discover handpicked luxury properties, curated ambiances, and customized travel itineraries tailored for the discerning few.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="hero-reveal-form glass max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-3.5 rounded-3xl md:rounded-full shadow-2xl text-left border border-white/10"
          >
            {/* Input 1: Hotel Name / Keyword */}
            <div className="flex flex-col px-4 py-1.5 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Search Stay</span>
              <div className="flex items-center gap-2 mt-1">
                <RiHotelFill className="text-sunset-500 shrink-0" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hotel name or brand..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 border-none outline-none"
                />
              </div>
            </div>

            {/* Input 2: Location */}
            <div className="flex flex-col px-4 py-1.5 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Location</span>
              <div className="flex items-center gap-2 mt-1">
                <RiMapPin2Fill className="text-sunset-500 shrink-0" size={16} />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Amsterdam, Paris"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 border-none outline-none"
                />
              </div>
            </div>

            {/* Input 3: Guest limits */}
            <div className="flex flex-col px-4 py-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Travelers</span>
              <div className="flex items-center gap-2 mt-1">
                <RiTeamFill className="text-sunset-500 shrink-0" size={16} />
                <select
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full bg-transparent text-xs text-white border-none outline-none cursor-pointer [&>option]:text-slate-900"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="5+ Guests">5+ Guests</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pr-2">
              <MagneticButton type="submit" className="w-full md:w-auto">
                <span className="flex items-center justify-center gap-2 w-full md:w-auto rounded-full bg-sunset-500 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-sunset-600 shadow-lg shadow-sunset-500/20 uppercase tracking-widest cursor-pointer">
                  <FaMagnifyingGlass size={12} />
                  <span>Search</span>
                </span>
              </MagneticButton>
            </div>
          </form>

          {/* Floating Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="hero-reveal-badge flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <FaStar className="text-amber-400" />
              <span className="text-slate-300">4.92 Average Rating</span>
            </div>
            <div className="hero-reveal-badge flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <FaGlobe className="text-sunset-500" />
              <span className="text-slate-300">80+ Elite Destinations</span>
            </div>
            <div className="hero-reveal-badge flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <RiShieldCheckFill className="text-emerald-500" />
              <span className="text-slate-300">100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED BY SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-6">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-400">
          In Partnership with Elite Establishments
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {partners.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-slate-600 dark:text-slate-300 font-display">
              <span className="text-lg">{p.logo}</span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POPULAR DESTINATIONS GRID ─── */}
      <section className="featured-hotel-section max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">
              Signature Collection
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Bestseller Stays
            </h2>
          </div>
          <Link
            to="/hotels"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sunset-500 hover:text-sunset-600 transition"
          >
            <span>Explore All Hotels</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage>Unable to load stay catalog.</ErrorMessage>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((hotel) => (
              <div key={hotel._id} className="featured-hotel-row">
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Header Column */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
            <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Bespoke Travel</p>
            <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight leading-tight">
              Why Discerning Travelers Choose Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              We design travel memories, not templates. Our commitment to absolute quality, 24/7 personal care, and curated partnerships ensures premium quality stay.
            </p>
            <div>
              <Link to="/hotels" className="rounded-full bg-ocean-800 dark:bg-white text-white dark:text-ocean-800 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition inline-block">
                Start Plan Stays
              </Link>
            </div>
          </div>

          {/* Cards Column */}
          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            <MouseGradient className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset-500/10 text-sunset-500">
                <RiSparklingFill size={24} />
              </div>
              <h3 className="text-xl font-bold font-display">Bespoke Curation</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Every listed property undergoes rigorous personal vetting by our experts to ensure superior design, hospitality, and comfort.
              </p>
            </MouseGradient>

            <MouseGradient className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset-500/10 text-sunset-500">
                <RiCustomerService2Fill size={24} />
              </div>
              <h3 className="text-xl font-bold font-display">Elite Concierge Service</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Receive round-the-clock dedicated assistance from our concierge desks to handle flights, requests, table reservations, and modifications.
              </p>
            </MouseGradient>

            <MouseGradient className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset-500/10 text-sunset-500">
                <RiShieldCheckFill size={24} />
              </div>
              <h3 className="text-xl font-bold font-display">Secured Payments</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Our multi-step checkouts feature end-to-end encryption. Book luxury stays with complete transactional confidence.
              </p>
            </MouseGradient>

            <MouseGradient className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset-500/10 text-sunset-500">
                <FaSliders size={24} />
              </div>
              <h3 className="text-xl font-bold font-display">Personalized Journeys</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Customize room packages, dietary choices, check-in requirements, and local excursions seamlessly through our booking flow.
              </p>
            </MouseGradient>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10">
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Curated Ambiances</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display">Choose Your Travel Vibe</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 pt-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/hotels?category=${encodeURIComponent(cat.name)}`)}
              className="group glass-card flex flex-col items-center justify-center rounded-[2rem] p-6 shadow-lg hover:border-sunset-500/40 hover:-translate-y-1 transition duration-300 text-center"
            >
              <span className="text-4xl group-hover:scale-110 transition duration-300">{cat.icon}</span>
              <h3 className="mt-4 font-bold font-display text-sm text-slate-800 dark:text-white uppercase tracking-wider">{cat.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">{cat.description}</p>
              <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-sunset-500 group-hover:text-white transition duration-300">
                <FaChevronRight size={10} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── INTERACTIVE JOURNEY SECTION ─── */}
      <section ref={journeySectionRef} className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Elite Experiences</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display">How We Design Your Voyage</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
            A chronological visualization of your travel booking journey with NomadLuxury.
          </p>
        </div>

        {/* Storytelling Visual Route Track */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line drawing backdrop */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800/80 -translate-x-1/2" />
          
          {/* GSAP scroll-triggered filled path */}
          <div className="journey-route-line absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sunset-500 to-ocean-500 origin-top transform scale-y-0 -translate-x-1/2" />

          <div className="space-y-16">
            {journeyStops.map((stop, index) => {
              const isEven = index % 2 === 0
              return (
                <div key={index} className={`flex flex-col md:flex-row items-stretch gap-8 relative ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Journey Indicator Node dot */}
                  <div className="absolute left-4 md:left-1/2 top-6 h-8 w-8 rounded-full border-4 border-slate-900 bg-sunset-500 dark:bg-slate-950 flex items-center justify-center -translate-x-1/2 z-10 shadow-lg shadow-sunset-500/10">
                    <span className="text-[9px] font-bold text-white dark:text-sunset-500">{stop.num}</span>
                  </div>

                  {/* Spacer Column */}
                  <div className="w-full md:w-1/2 hidden md:block" />

                  {/* Stop Content Panel */}
                  <div className="journey-stop-card w-full md:w-1/2 pl-12 md:pl-0">
                    <div className="glass-card rounded-[2rem] p-8 shadow-xl relative border border-white/5">
                      <span className="text-5xl font-extrabold text-sunset-500/10 font-display absolute top-4 right-4">{stop.num}</span>
                      <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white uppercase tracking-wider">{stop.title}</h3>
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{stop.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── AI RECOMMENDATIONS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6">
        <AIRecommendations />
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl bg-gradient-to-br from-ocean-950/45 via-ocean-900/10 to-ocean-950/45 border border-white/5">
          <div className="absolute top-6 left-6 text-sunset-500/5">
            <FaQuoteLeft size={220} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Avatars */}
            <div className="relative shrink-0 flex md:flex-col items-center justify-center gap-4">
              {testimonials.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`relative rounded-full p-1.5 transition-all duration-300 overflow-hidden ${
                    activeTestimonial === idx
                      ? 'border-2 border-sunset-500 scale-110 shadow-lg shadow-sunset-500/20'
                      : 'border border-slate-800 scale-90 opacity-40 hover:opacity-80'
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

            {/* Quote info */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="flex justify-center md:justify-start gap-1">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>

              <p className="text-lg md:text-2xl font-editorial italic text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
                "{testimonials[activeTestimonial].comment}"
              </p>

              <div>
                <p className="text-base font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL STATISTICS SECTION ─── */}
      <section ref={statsSectionRef} className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-[2.5rem] p-8 text-center space-y-3 border border-white/5">
            <div className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Bespoke Properties</div>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight stat-number-counter" data-target="80">0+</div>
            <p className="text-[10px] text-slate-400">Strictly vetted 5-star properties</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 text-center space-y-3 border border-white/5">
            <div className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Happy Journeys</div>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight stat-number-counter" data-target="12000">0+</div>
            <p className="text-[10px] text-slate-400">Exclusive luxury travelers matching</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 text-center space-y-3 border border-white/5">
            <div className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Elite Rating</div>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight stat-number-counter" data-target="4.92" data-decimal="true">0.00</div>
            <p className="text-[10px] text-slate-400">Out of 5 guest satisfaction score</p>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 text-center space-y-3 border border-white/5">
            <div className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Destinations</div>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight stat-number-counter" data-target="15">0+</div>
            <p className="text-[10px] text-slate-400">Top-tier metropolitan & retreat areas</p>
          </div>
        </div>
      </section>

      {/* ─── TRAVEL GUIDES SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Travel Intelligence</p>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">Luxury Travel Journals</h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Guide Card 1 */}
          <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-ocean-950/20 border border-slate-100 dark:border-white/5 hover:border-sunset-500/20 transition-all duration-300">
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop"
                alt="Beach retreats"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute bottom-4 left-4 rounded-xl bg-sunset-500 px-3 py-1.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Beach Escapes
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase">
                <FaCalendarDays />
                <span>June 2026</span>
                <span>•</span>
                <span>5 Min Read</span>
              </div>
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-white group-hover:text-sunset-500 transition duration-200">
                Ultimate Guide to Private Islands in the South Pacific
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Discover the best secluded private islands, with personal beaches, yacht excursions, and customized villas.
              </p>
            </div>
          </div>

          {/* Guide Card 2 */}
          <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-ocean-950/20 border border-slate-100 dark:border-white/5 hover:border-sunset-500/20 transition-all duration-300">
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop"
                alt="City guides"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute bottom-4 left-4 rounded-xl bg-sunset-500 px-3 py-1.5 text-[9px] font-bold text-white uppercase tracking-wider">
                City Breaks
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase">
                <FaCalendarDays />
                <span>May 2026</span>
                <span>•</span>
                <span>4 Min Read</span>
              </div>
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-white group-hover:text-sunset-500 transition duration-200">
                Kyoto Reimagined: Secluded Temples and Tea Houses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Step off the beaten path in Kyoto. Explore centuries-old architecture, custom matcha blends, and hidden gardens.
              </p>
            </div>
          </div>

          {/* Guide Card 3 */}
          <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-ocean-950/20 border border-slate-100 dark:border-white/5 hover:border-sunset-500/20 transition-all duration-300">
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1486915307544-b1ca7056da44?q=80&w=600&auto=format&fit=crop"
                alt="Alpine lodges"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute bottom-4 left-4 rounded-xl bg-sunset-500 px-3 py-1.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Mountain Retreats
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase">
                <FaCalendarDays />
                <span>April 2026</span>
                <span>•</span>
                <span>6 Min Read</span>
              </div>
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-white group-hover:text-sunset-500 transition duration-200">
                Chamonix Chalets: Luxury at the Foot of Mont Blanc
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Our selection of elite chalets combining fireplace romance, alpine skiing, and spa services facing Mont Blanc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-ocean-950 via-ocean-900 to-sunset-600/35 p-12 md:p-20 text-center text-white border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,107,53,0.1),_transparent_55%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <p className="text-xs uppercase tracking-widest text-sunset-500 font-bold">Limitless Vistas</p>
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight">
              Ready to Design Your Next Escape?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
              Our travel curators are waiting to coordinate your bespoke stays and itinerary selections. Let us craft a journey worth dreaming of.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton onClick={() => navigate('/hotels')}>
                <span className="flex items-center gap-2 rounded-full bg-sunset-500 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-sunset-600 shadow-xl shadow-sunset-500/20">
                  <span>Browse Elite Stays</span>
                  <FaChevronRight size={10} />
                </span>
              </MagneticButton>
              <Link to="/register" className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-wider transition">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home