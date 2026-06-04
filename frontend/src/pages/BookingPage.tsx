import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import BookingSuccessModal from '../components/BookingSuccessModal'
import { getUser, isAuthenticated } from '../hooks/useAuth'
import type { Hotel } from '../types'
import MagneticButton from '../components/MagneticButton'
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  CreditCard,
  Crown,
  Car,
  Gift
} from 'lucide-react'
import { FaStar, FaCompass } from 'react-icons/fa6'

const getTomorrowString = (offset = 1) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

const steps = [
  { id: 1, name: 'Configuration' },
  { id: 2, name: 'Room & Upgrades' },
  { id: 3, name: 'Traveler Profile' },
  { id: 4, name: 'Secure Checkout' }
]

export const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Guard: Auth check
  if (!isAuthenticated()) {
    navigate('/login')
  }

  const user = getUser()

  // Fetch hotel details
  const { data: hotel, isLoading, error } = useQuery<Hotel>({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const response = await api.get(`/hotels/${id}`)
      return response.data
    },
    enabled: Boolean(id)
  })

  // State Management
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1: Configuration
  const [checkIn, setCheckIn] = useState(getTomorrowString(1))
  const [checkOut, setCheckOut] = useState(getTomorrowString(3))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  // Step 2: Room & Upgrades
  const [roomType, setRoomType] = useState<'single' | 'studio' | 'penthouse'>('single')
  const [upgrades, setUpgrades] = useState({
    chauffeur: false,
    spa: false,
    dinner: false
  })

  // Step 3: Traveler Details
  const [travelerName, setTravelerName] = useState(user?.name || '')
  const [travelerEmail, setTravelerEmail] = useState(user?.email || '')
  const [travelerPhone, setTravelerPhone] = useState('')
  const [passportNumber, setPassportNumber] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // Step 4: Checkout
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [successBookingDetails, setSuccessBookingDetails] = useState<any | null>(null)

  // Memoized Night Calculation
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diff = outDate.getTime() - inDate.getTime()
    const days = Math.round(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 1
  }, [checkIn, checkOut])

  // Custom Pricing Calculations
  const pricing = useMemo(() => {
    if (!hotel) return { base: 0, roomDelta: 0, upgradesTotal: 0, subtotal: 0, tax: 0, discount: 0, total: 0 }
    
    // Base Price
    const base = hotel.price * nights
    
    // Room category differential
    let roomDelta = 0
    if (roomType === 'studio') roomDelta = 3500 * nights
    if (roomType === 'penthouse') roomDelta = 8500 * nights

    // Upgrades
    let upgradesTotal = 0
    if (upgrades.chauffeur) upgradesTotal += 2000
    if (upgrades.spa) upgradesTotal += 4500
    if (upgrades.dinner) upgradesTotal += 6000

    const subtotal = base + roomDelta + upgradesTotal
    const tax = Math.round(subtotal * 0.08)
    
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
    const total = subtotal + tax - discount

    return { base, roomDelta, upgradesTotal, subtotal, tax, discount, total }
  }, [hotel, nights, roomType, upgrades, promoApplied])

  // Promo apply action
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'NOMADLUXURY') {
      setPromoApplied(true)
    } else {
      alert('Invalid promotional code.')
    }
  }

  // Booking submit mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!hotel) throw new Error('Hotel unavailable')
      
      const response = await api.post('/bookings', {
        bookingItems: [
          {
            hotel: hotel._id,
            name: `${hotel.name} (${roomType.toUpperCase()} SUITE)`,
            qty: nights,
            price: hotel.price + (roomType === 'studio' ? 3500 : roomType === 'penthouse' ? 8500 : 0),
            image: hotel.image_room || hotel.image_exterior
          }
        ],
        itemsPrice: pricing.subtotal,
        taxPrice: pricing.tax,
        totalPrice: pricing.total
      })
      return response.data
    },
    onSuccess: (data) => {
      setSuccessBookingDetails({
        hotelName: hotel!.name,
        nights,
        price: hotel!.price + (roomType === 'studio' ? 3500 : roomType === 'penthouse' ? 8500 : 0),
        tax: pricing.tax,
        total: pricing.total,
        checkIn,
        checkOut,
        guests: adults + children,
        bookingId: data._id || 'TRV-' + Math.floor(100000 + Math.random() * 900000)
      })
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    }
  })

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) {
      alert('You must accept the terms and conditions to complete reservation.')
      return
    }
    bookingMutation.mutate()
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Check Out date must be after Check In date.')
        return
      }
    }
    if (currentStep === 3) {
      if (!travelerName || !travelerEmail || !travelerPhone) {
        alert('Please fill out all mandatory traveler fields.')
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  if (isLoading) return <Loader />
  if (error || !hotel) return <ErrorMessage> Stay details could not be found. </ErrorMessage>

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/10 dark:border-slate-800/80">
        <div className="space-y-2">
          <Link to={`/hotels/${hotel._id}`} className="text-xs uppercase tracking-widest text-sunset-500 font-bold hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={12} /> Back to stay description
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white mt-1">
            VIP Reservation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hotel.name} • {hotel.address}
          </p>
        </div>

        {/* Stepper progress indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                currentStep >= s.id 
                  ? 'bg-sunset-500 text-white shadow-lg shadow-sunset-500/20' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {currentStep > s.id ? <Check size={14} /> : s.id}
              </div>
              {s.id < steps.length && (
                <div className={`h-0.5 w-6 sm:w-10 transition-all duration-300 ${
                  currentStep > s.id ? 'bg-sunset-500' : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
        
        {/* Left column: Step panels */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl relative min-h-[480px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CONFIGURATION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sunset-500">Step 01 / 04</span>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Stay & Guest Configurations</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Calendar size={13} className="text-sunset-500" />
                      <span>Check In</span>
                    </label>
                    <input
                      type="date"
                      min={getTomorrowString(0)}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-sunset-500 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Calendar size={13} className="text-sunset-500" />
                      <span>Check Out</span>
                    </label>
                    <input
                      type="date"
                      min={checkIn || getTomorrowString(1)}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-sunset-500 transition"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Users size={13} className="text-sunset-500" />
                      <span>Adults (12+ yrs)</span>
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-sunset-500 transition"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Users size={13} className="text-sunset-500" />
                      <span>Children (0-11 yrs)</span>
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-sunset-500 transition"
                    >
                      {[0, 1, 2, 3].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-5 border border-slate-200/40 dark:border-slate-800 space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  <p className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500 animate-pulse" />
                    Flexible Cancellation Policy
                  </p>
                  <p>Cancel up to 48 hours prior to check-in for a full cash-back refund. Rest easy coordinating your luxury schedule.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROOM SELECTION & UPGRADES */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sunset-500">Step 02 / 04</span>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Choose Room Style & VIP Extras</h2>
                </div>

                {/* Room Cards Row */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Select Suite Class</span>
                  <div className="grid gap-4 md:grid-cols-3">
                    
                    {/* Option 1: Single Stay */}
                    <button
                      type="button"
                      onClick={() => setRoomType('single')}
                      className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                        roomType === 'single'
                          ? 'border-sunset-500 bg-sunset-500/5 ring-1 ring-sunset-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Crown size={18} className="text-sunset-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider mt-3 text-slate-900 dark:text-white">Single Suite</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Included in base price</p>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-4">₹{hotel.price.toLocaleString()} / night</span>
                    </button>

                    {/* Option 2: Studio Suite */}
                    <button
                      type="button"
                      onClick={() => setRoomType('studio')}
                      className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                        roomType === 'studio'
                          ? 'border-sunset-500 bg-sunset-500/5 ring-1 ring-sunset-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Crown size={18} className="text-sunset-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider mt-3 text-slate-900 dark:text-white">Studio Suite</h3>
                      <p className="text-[10px] text-slate-400 mt-1">+₹3,500 premium addon</p>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-4">₹{(hotel.price + 3500).toLocaleString()} / night</span>
                    </button>

                    {/* Option 3: Penthouse Suite */}
                    <button
                      type="button"
                      onClick={() => setRoomType('penthouse')}
                      className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                        roomType === 'penthouse'
                          ? 'border-sunset-500 bg-sunset-500/5 ring-1 ring-sunset-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Crown size={18} className="text-sunset-500 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider mt-3 text-slate-900 dark:text-white">Luxury Penthouse</h3>
                      <p className="text-[10px] text-slate-400 mt-1">+₹8,500 elite upgrade</p>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-4">₹{(hotel.price + 8500).toLocaleString()} / night</span>
                    </button>

                  </div>
                </div>

                {/* Luxury Upgrades Checklist */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Exclusive Travel Extras (One-Time Addons)</span>
                  <div className="space-y-3">
                    
                    {/* Addon 1: Chauffeur */}
                    <div 
                      onClick={() => setUpgrades(u => ({ ...u, chauffeur: !u.chauffeur }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        upgrades.chauffeur
                          ? 'border-sunset-500 bg-sunset-500/5'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-sunset-500/10 flex items-center justify-center text-sunset-500">
                          <Car size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Airport Chauffeur Transfer</p>
                          <p className="text-[10px] text-slate-400">Door-to-door luxury Mercedes S-class pickup</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">₹2,000</span>
                    </div>

                    {/* Addon 2: Spa Access */}
                    <div 
                      onClick={() => setUpgrades(u => ({ ...u, spa: !u.spa }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        upgrades.spa
                          ? 'border-sunset-500 bg-sunset-500/5'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-sunset-500/10 flex items-center justify-center text-sunset-500">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Secluded Oasis Spa Access</p>
                          <p className="text-[10px] text-slate-400">All-day pass with standard body massage session</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">₹4,500</span>
                    </div>

                    {/* Addon 3: Dinner */}
                    <div 
                      onClick={() => setUpgrades(u => ({ ...u, dinner: !u.dinner }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        upgrades.dinner
                          ? 'border-sunset-500 bg-sunset-500/5'
                          : 'border-slate-200 dark:border-slate-800 bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-sunset-500/10 flex items-center justify-center text-sunset-500">
                          <Gift size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">Elite 5-Course Dinner Reservation</p>
                          <p className="text-[10px] text-slate-400">Chef curated menu with premium wine pairing</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">₹6,000</span>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TRAVELER DETAILS */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sunset-500">Step 03 / 04</span>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Primary Traveler Profiles</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      value={travelerEmail}
                      onChange={(e) => setTravelerEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Phone Number *</label>
                    <input
                      type="tel"
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Passport / Govt ID Number</label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="For airport shuttle coordination"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Special Instructions / Dietary Constraints</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    placeholder="Enter any allergy notifications, late check-in requests, or bedding preferences..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT SIMULATION */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sunset-500">Step 04 / 04</span>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Secured Payment Gateway</h2>
                </div>

                {/* Visual Credit Card */}
                <div className="relative mx-auto max-w-sm rounded-[1.5rem] bg-gradient-to-br from-ocean-800 to-ocean-950 p-6 text-white shadow-xl border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Luxury Pass card</span>
                    <CreditCard size={20} className="text-sunset-500" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[8px] uppercase tracking-widest opacity-50">Card number</p>
                    <p className="text-base tracking-widest font-mono">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest opacity-50">Holder name</p>
                      <p className="text-xs uppercase font-medium tracking-wider truncate max-w-[180px]">
                        {cardName || travelerName || 'TRAVEL GUEST'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest opacity-50">Expiry</p>
                      <p className="text-xs font-mono">{cardExpiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                {/* Credit Card Input Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. MARCUS VANCE"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Expiration Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">CVV Code</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                      required
                    />
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-sunset-500 focus:ring-sunset-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                    I agree to the terms, conditions, and flexible cancellation guidelines.
                  </label>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Wizard Stepper Buttons Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200/10 dark:border-slate-800/80 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-xl border border-slate-300 dark:border-slate-800 px-5 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30 inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={12} />
              <span>Back</span>
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-sunset-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-sunset-600 inline-flex items-center gap-1.5 shadow-lg shadow-sunset-500/10"
              >
                <span>Continue</span>
                <ArrowRight size={12} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={bookingMutation.status === 'pending'}
                className="rounded-xl bg-sunset-500 px-8 py-2.5 text-xs font-bold text-white transition hover:bg-sunset-600 inline-flex items-center gap-1.5 shadow-lg shadow-sunset-500/15"
              >
                {bookingMutation.status === 'pending' ? 'Authorizing Check...' : 'Authorize Booking'}
              </button>
            )}
          </div>
        </div>

        {/* Right column: Booking Summary Sidebar */}
        <aside className="sticky top-24 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-6 shadow-2xl space-y-6">
            
            {/* Stay Summary Info */}
            <div className="flex gap-4 items-center">
              <img
                src={hotel.image_exterior}
                alt={hotel.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div>
                <span className="rounded-full bg-sunset-500/10 border border-sunset-500/10 px-2.5 py-0.5 text-[8px] font-bold uppercase text-sunset-500">
                  {hotel.tag || 'Luxury Retreal'}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 font-display leading-tight">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                  <FaStar size={9} />
                  <span>{hotel.rating.toFixed(2)} Rating</span>
                </div>
              </div>
            </div>

            {/* Configured values summary */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/40 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span className="uppercase font-bold tracking-widest text-[9px]">Schedule</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {checkIn} to {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span className="uppercase font-bold tracking-widest text-[9px]">Travelers</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {adults} {adults === 1 ? 'Adult' : 'Adults'} {children > 0 ? `, ${children} Child` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span className="uppercase font-bold tracking-widest text-[9px]">Suite Tier</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {roomType} Suite
                </span>
              </div>
            </div>

            {/* Promo code apply field */}
            {currentStep === 4 && (
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Apply Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. NOMADLUXURY"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs uppercase text-slate-800 dark:text-white outline-none focus:border-sunset-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 text-xs font-bold transition hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <Check size={12} /> Promo Code Applied: 10% Discount
                  </p>
                )}
              </div>
            )}

            {/* Detailed Pricing Breakdown */}
            <div className="border-t border-slate-200/10 dark:border-slate-800/80 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Room Stay ({nights} nights)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{pricing.base.toLocaleString()}</span>
              </div>

              {pricing.roomDelta > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Suite Upgrade Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{pricing.roomDelta.toLocaleString()}</span>
                </div>
              )}

              {pricing.upgradesTotal > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Luxury Addons & Upgrades</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{pricing.upgradesTotal.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Estimated Taxes (8%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{pricing.tax.toLocaleString()}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Promotional Discount</span>
                  <span className="font-semibold">-₹{pricing.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between font-bold text-sm">
                <span className="text-slate-900 dark:text-white">Estimated Total</span>
                <span className="text-sunset-500">₹{pricing.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trusted checkout seal */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800">
              <ShieldCheck size={14} className="text-sunset-500" />
              <span>SSL Secure Checkout Encryption • Protected Data Privacy</span>
            </div>

          </div>
        </aside>
      </div>

      {/* Booking confirmation success modal */}
      <BookingSuccessModal
        isOpen={Boolean(successBookingDetails)}
        onClose={() => {
          setSuccessBookingDetails(null)
          navigate('/profile')
        }}
        bookingDetails={successBookingDetails}
      />
    </div>
  )
}

export default BookingPage
