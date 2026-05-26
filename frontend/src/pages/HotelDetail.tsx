import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import MapboxMap from '../components/MapboxMap'
import BookingSuccessModal from '../components/BookingSuccessModal'
import HotelCard from '../components/HotelCard'
import { getUser, isAuthenticated } from '../hooks/useAuth'
import { useWishlist } from '../context/WishlistContext'
import type { Hotel } from '../types'
import { FaStar, FaHeart, FaChevronRight, FaChevronLeft, FaPhone, FaCompass, FaCalendarDays, FaUsers, FaArrowLeft } from 'react-icons/fa6'
import { RiShieldCheckFill, RiWirelessChargingFill, RiParkingBoxFill } from 'react-icons/ri'

// Helper to get formatted dates
const getTomorrowString = (offset = 1) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

const HotelDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // Date and guest states
  const [checkIn, setCheckIn] = useState(getTomorrowString(1))
  const [checkOut, setCheckOut] = useState(getTomorrowString(3))
  const [guests, setGuests] = useState(2)
  const [activeImage, setActiveImage] = useState<'exterior' | 'room' | 'bar'>('exterior')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [successBookingDetails, setSuccessBookingDetails] = useState<any | null>(null)
  
  const { toggleWishlist, isInWishlist } = useWishlist()

  // Fetch hotel by id
  const { data: hotel, isLoading, error } = useQuery<Hotel>({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const response = await api.get(`/hotels/${id}`)
      return response.data
    },
    enabled: Boolean(id)
  })

  // Fetch similar hotels (same location, different id)
  const { data: allHotels } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await api.get('/hotels')
      return response.data
    },
    enabled: Boolean(hotel)
  })

  const similarStays = useMemo(() => {
    if (!hotel || !allHotels) return []
    return allHotels
      .filter((h) => h.location === hotel.location && h._id !== hotel._id)
      .slice(0, 3)
  }, [hotel, allHotels])

  // Track recently viewed hotel
  useEffect(() => {
    if (hotel) {
      try {
        const stored = localStorage.getItem('travellerRecentlyViewed')
        let recentlyViewed: Hotel[] = stored ? JSON.parse(stored) : []
        
        // Remove existing duplicate
        recentlyViewed = recentlyViewed.filter((item) => item._id !== hotel._id)
        
        // Add to front of list
        recentlyViewed.unshift(hotel)
        
        // Keep last 5 stays
        localStorage.setItem('travellerRecentlyViewed', JSON.stringify(recentlyViewed.slice(0, 5)))
      } catch (e) {
        console.error('Error saving recently viewed:', e)
      }
    }
  }, [hotel])

  // Date math
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diff = outDate.getTime() - inDate.getTime()
    const days = Math.round(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 1
  }, [checkIn, checkOut])

  // Mutation for creating bookings
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!hotel) throw new Error('Hotel unavailable')
      const itemsPrice = hotel.price * nights
      const taxPrice = Math.round(itemsPrice * 0.08)
      const totalPrice = itemsPrice + taxPrice
      
      const response = await api.post('/bookings', {
        bookingItems: [
          {
            hotel: hotel._id,
            name: hotel.name,
            qty: nights,
            price: hotel.price,
            image: hotel.image_exterior
          }
        ],
        itemsPrice,
        taxPrice,
        totalPrice
      })
      return response.data
    },
    onSuccess: (data) => {
      const itemsPrice = hotel!.price * nights
      const taxPrice = Math.round(itemsPrice * 0.08)
      
      // Set state to trigger confirmation modal
      setSuccessBookingDetails({
        hotelName: hotel!.name,
        nights,
        price: hotel!.price,
        tax: taxPrice,
        total: itemsPrice + taxPrice,
        checkIn,
        checkOut,
        guests,
        bookingId: data._id || 'TRV-' + Math.floor(100000 + Math.random() * 900000)
      })
      
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
    }
  })

  // Mutation for posting reviews
  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!hotel) throw new Error('Hotel unavailable')
      const response = await api.post(`/hotels/${hotel._id}/reviews`, { rating: reviewRating, comment: reviewComment })
      return response.data
    },
    onSuccess: () => {
      setReviewComment('')
      setReviewRating(5)
      queryClient.invalidateQueries({ queryKey: ['hotel', id] })
    }
  })

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    bookingMutation.mutate()
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    reviewMutation.mutate()
  }

  const isSaved = hotel ? isInWishlist(hotel._id) : false

  return (
    <div className="mx-auto max-w-7xl space-y-12 py-4">
      {/* Return to exploration toolbar */}
      <div className="flex items-center justify-between">
        <Link to="/hotels" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-white transition">
          <FaArrowLeft />
          <span>Back to stay listings</span>
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage>This hotel details could not be found or loaded.</ErrorMessage>
      ) : hotel ? (
        <>
          {/* Header block with title & heartbeat wishlist */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-500 dark:text-brand-300 border border-brand-500/10">
                  {hotel.tag || 'Exclusive retreat'}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <FaStar />
                  <span>{hotel.rating.toFixed(2)} Rating</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                {hotel.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex items-center gap-1.5">
                <FaCompass className="text-brand-500" />
                <span>{hotel.address}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleWishlist(hotel)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500 dark:hover:text-rose-500 transition shadow-sm"
              >
                <FaHeart className={isSaved ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Airbnb-Style Visual Gallery */}
          <div className="grid gap-4 md:grid-cols-3 h-[420px] md:h-[480px]">
            {/* Main active frame */}
            <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] border border-slate-200/10 dark:border-slate-800 bg-slate-900">
              <img
                src={
                  activeImage === 'exterior'
                    ? hotel.image_exterior
                    : activeImage === 'room'
                    ? hotel.image_room
                    : hotel.image_bar || hotel.image_exterior
                }
                alt={hotel.name}
                className="h-full w-full object-cover transition-transform duration-500"
              />
            </div>
            
            {/* Thumbnail selectors */}
            <div className="flex md:flex-col gap-4 justify-between">
              {[
                { type: 'exterior', img: hotel.image_exterior, label: 'Building Exterior' },
                { type: 'room', img: hotel.image_room, label: 'Luxury Suite Room' },
                { type: 'bar', img: hotel.image_bar || hotel.image_exterior, label: 'Social Bar Lounge' }
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setActiveImage(item.type as any)}
                  className={`flex-1 overflow-hidden rounded-2xl relative border-2 transition-all ${
                    activeImage === item.type 
                      ? 'border-brand-500 ring-2 ring-brand-500/20 scale-[0.98]' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  <img src={item.img} alt={item.label} className="h-full w-full object-cover max-h-[140px] md:max-h-none" />
                  <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent transition" />
                  <span className="absolute bottom-2 left-2 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Split: Details on left, Reservation Form Sticky Panel on right */}
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] items-start">
            
            {/* Left Column: Description, Amenities, Map, Reviews */}
            <div className="space-y-8">
              
              {/* Hotel Overview details */}
              <div className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Overview & Description</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {hotel.description}
                </p>

                <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Nightly Price</p>
                    <p className="text-xl font-extrabold text-brand-600 dark:text-brand-300">₹{hotel.price.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Available Rooms</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{hotel.qty} suites left</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Property Contact</p>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                      <FaPhone size={11} className="text-brand-400" />
                      <span>{hotel.phone}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities Grid cards */}
              <div className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Premium Amenities</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {hotel.amenities.split(',').map((amenity, idx) => {
                    const cleanName = amenity.trim().toLowerCase()
                    return (
                      <div key={idx} className="flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                          {cleanName.includes('wifi') ? (
                            <RiWirelessChargingFill size={20} />
                          ) : cleanName.includes('parking') ? (
                            <RiParkingBoxFill size={20} />
                          ) : (
                            <RiShieldCheckFill size={20} />
                          )}
                        </div>
                        <span className="text-xs font-semibold capitalize text-slate-700 dark:text-slate-200">
                          {amenity.trim()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mapbox Map Interactive panel */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Stay Neighborhood Location</h2>
                <MapboxMap
                  lat={hotel.lat}
                  long={hotel.long}
                  hotelName={hotel.name}
                  address={hotel.address}
                />
              </div>

              {/* Reviews Slider & list */}
              <div className="glass-card rounded-[2rem] p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Guest Reviews</h2>
                  <span className="rounded-full bg-brand-500/10 px-4 py-1 text-xs font-bold text-brand-400">
                    {hotel.numReviews || 0} reviews
                  </span>
                </div>

                {hotel.reviews && hotel.reviews.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {hotel.reviews.map((review) => (
                      <div key={review._id} className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-5 border border-slate-100 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 dark:text-white font-display">{review.name}</p>
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <FaStar />
                            <span className="font-bold">{review.rating} / 5</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">No user reviews yet. Book a stay and be the first to review!</p>
                )}

                {/* Add review form */}
                <form onSubmit={handleReviewSubmit} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">Leave Feedback</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rating Score</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Very Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                        <option value={2}>2 Stars (Below Par)</option>
                        <option value={1}>1 Star (Poor)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Review Message</label>
                      <input
                        type="text"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Detail your experiences during this stay..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewMutation.status === 'pending'}
                    className="w-full rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 text-xs font-semibold transition hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50"
                  >
                    {reviewMutation.status === 'pending' ? 'Posting Review...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar Reservation Card */}
            <aside className="sticky top-24 space-y-6">
              
              <div className="glass-card rounded-[2rem] p-6 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-brand-500 dark:text-brand-300 font-bold">Rates starting from</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">₹{hotel.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-bold">/ night</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Check-In Check-Out Date picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FaCalendarDays className="text-brand-400" />
                        <span>Check In</span>
                      </label>
                      <input
                        type="date"
                        min={getTomorrowString(0)}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FaCalendarDays className="text-brand-400" />
                        <span>Check Out</span>
                      </label>
                      <input
                        type="date"
                        min={checkIn || getTomorrowString(1)}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest count controls */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FaUsers className="text-brand-400" />
                      <span>Guest Limit</span>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500"
                    >
                      {[1, 2, 3, 4, 5].map((g) => (
                        <option key={g} value={g}>
                          {g} {g === 1 ? 'Guest' : 'Guests'} max
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>₹{hotel.price.toLocaleString()} x {nights} nights</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">₹{(hotel.price * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Taxes & fees (8%)</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">₹{Math.round(hotel.price * nights * 0.08).toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-bold text-sm">
                      <span className="text-slate-900 dark:text-white">Estimated Total</span>
                      <span className="text-brand-600 dark:text-brand-300">
                        ₹{(hotel.price * nights + Math.round(hotel.price * nights * 0.08)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingMutation.status === 'pending'}
                    className="w-full rounded-2xl bg-brand-500 py-4 text-xs font-bold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98 shadow-lg shadow-brand-500/15 cursor-pointer"
                  >
                    {bookingMutation.status === 'pending' ? 'Reserving Suite...' : 'Reserve This Stay Now'}
                  </button>
                </form>
              </div>
            </aside>
          </div>

          {/* Similar stay suggestions carousel/grid */}
          {similarStays.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-slate-200/10 dark:border-slate-800">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-brand-500 dark:text-brand-300 font-bold">More Options</p>
                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Similar Properties in {hotel.location}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {similarStays.map((stay) => (
                  <HotelCard key={stay._id} hotel={stay} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

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

export default HotelDetail
