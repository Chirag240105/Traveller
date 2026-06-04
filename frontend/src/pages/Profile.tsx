import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../api'
import { getUser, setUser } from '../hooks/useAuth'
import { useWishlist } from '../context/WishlistContext'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import HotelCard from '../components/HotelCard'
import type { Booking, UserProfile, Hotel } from '../types'
import { FaUser, FaSuitcase, FaHeart, FaClock, FaCalendar, FaUsers, FaArrowRight } from 'react-icons/fa6'
import { RiDashboardFill, RiMoneyDollarCircleFill, RiUserSettingsFill } from 'react-icons/ri'

const Profile = () => {
  const currentUser = getUser()
  const { wishlist } = useWishlist()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Tab states
  const activeTab = searchParams.get('tab') || 'bookings'

  // Input states
  const [name, setName] = useState(currentUser?.name ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState<Hotel[]>([])

  // Fetch recently viewed stays on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('travellerRecentlyViewed')
      if (stored) {
        setRecentlyViewed(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error loading recently viewed list:', e)
    }
  }, [])

  // Fetch profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/profile')
      return response.data
    }
  })

  // Fetch my bookings list
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError
  } = useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const response = await api.get('/bookings/mybookings')
      return response.data
    }
  })

  // Update profile
  const profileMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put('/users/profile', { name, email, password: password || undefined })
      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      setSuccessMessage('Your profile settings have been updated successfully.')
      setPassword('')
      setTimeout(() => setSuccessMessage(''), 4000)
    }
  })

  // Calculations for stats
  const totalSpent = useMemo(() => {
    if (!bookings) return 0
    return bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  }, [bookings])

  const totalNights = useMemo(() => {
    if (!bookings) return 0
    return bookings.reduce((sum, b) => sum + (b.bookingItems[0]?.qty || 0), 0)
  }, [bookings])

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] border border-slate-200/10 dark:border-slate-800 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.06),_transparent_35%)]" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Welcome Back, {profile?.name ?? currentUser?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your hotel reservations, edit credentials, and check saved stays from your Traveller dashboard.
          </p>
        </div>
        <div className="relative z-10 shrink-0 text-xs text-slate-400 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl">
          Account Rank: <span className="text-brand-500 dark:text-brand-300 font-bold uppercase tracking-wider">Premium Member</span>
        </div>
      </div>

      {/* Account statistics Dashboard */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Stat 1: Total Bookings */}
        <div className="glass-card flex items-center gap-4 rounded-3xl p-6 shadow-lg border border-slate-200/10 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
            <FaSuitcase size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">{bookings?.length || 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trips Reserved</p>
          </div>
        </div>

        {/* Stat 2: Total Spent */}
        <div className="glass-card flex items-center gap-4 rounded-3xl p-6 shadow-lg border border-slate-200/10 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <RiMoneyDollarCircleFill size={26} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Travel Budget</p>
          </div>
        </div>

        {/* Stat 3: Wishlist Count */}
        <div className="glass-card flex items-center gap-4 rounded-3xl p-6 shadow-lg border border-slate-200/10 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <FaHeart size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">{wishlist.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Destinations</p>
          </div>
        </div>
      </div>

      {/* Main dashboard splits: Side tabs menu + Content display */}
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] items-start">
        
        {/* Left Side: Tabs Nav menu */}
        <aside className="rounded-3xl border border-slate-200/10 dark:border-slate-800 bg-slate-950/40 p-4 space-y-2">
          {[
            { key: 'bookings', label: 'My Bookings', icon: FaSuitcase },
            { key: 'saved', label: 'Wishlist stays', icon: FaHeart },
            { key: 'recent', label: 'Recently Viewed', icon: FaClock },
            { key: 'settings', label: 'Profile Settings', icon: RiUserSettingsFill }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`w-full flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Right Side: Tab Displays */}
        <div className="space-y-6">
          
          {/* TAB 1: MY BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Reservations History</h2>
              
              {isBookingsLoading ? (
                <Loader />
              ) : bookingsError ? (
                <ErrorMessage>Unable to load reservation histories.</ErrorMessage>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="glass-card overflow-hidden rounded-3xl border border-slate-200/10 dark:border-slate-800/80 shadow-lg flex flex-col md:flex-row"
                    >
                      {/* Booking Item Image */}
                      {booking.bookingItems[0]?.image && (
                        <div className="w-full md:w-56 shrink-0 aspect-video md:aspect-auto relative bg-slate-900">
                          <img
                            src={booking.bookingItems[0].image}
                            alt={booking.bookingItems[0].name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {/* Booking Metadata Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/10 uppercase tracking-wide">
                              Confirmed stay
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-2">
                              {booking.bookingItems[0]?.name}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Reserved on {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-lg font-extrabold text-brand-600 dark:text-brand-300 font-display">
                              ₹{booking.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Breakdown Receipt
                            </p>
                          </div>
                        </div>

                        {/* Dates & Quantities breakdown */}
                        <div className="grid gap-3 sm:grid-cols-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                            <FaCalendar className="text-brand-400" />
                            <span>Stay length: <span className="font-bold text-slate-900 dark:text-slate-200">{booking.bookingItems[0]?.qty} nights</span></span>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                            <FaUsers className="text-brand-400" />
                            <span>Rate breakdown: <span className="font-bold text-slate-900 dark:text-slate-200">₹{booking.bookingItems[0]?.price.toLocaleString()} + 8% tax</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center space-y-4">
                  <p className="text-sm text-slate-400">No active bookings yet. Start looking at catalog stays!</p>
                  <Link
                    to="/hotels"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-brand-400"
                  >
                    <span>Browse Luxury Hotels</span>
                    <FaArrowRight />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST SAVED STAYS GRID */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white font-display">Saved Stay Collections</h2>
              {wishlist.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {wishlist.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center space-y-4">
                  <p className="text-sm text-slate-400">Your wishlist is currently empty.</p>
                  <Link
                    to="/hotels"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-brand-400"
                  >
                    <span>Add properties to saved</span>
                    <FaArrowRight />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENTLY VIEWED LISTINGS */}
          {activeTab === 'recent' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Recently Viewed Stays</h2>
              {recentlyViewed.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {recentlyViewed.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center">
                  <p className="text-sm text-slate-400">No recently viewed history available.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS FORMS */}
          {activeTab === 'settings' && (
            <div className="glass-card rounded-[2rem] border border-slate-200/10 dark:border-slate-800 p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Update Account Settings</h2>
              
              {profileError && <ErrorMessage>Unable to reload settings information.</ErrorMessage>}
              {successMessage && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-200">
                  {successMessage}
                </div>
              )}
              
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  profileMutation.mutate()
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Update Password</label>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    placeholder="Provide a new password (leave blank to keep current)"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3.5 text-xs text-slate-800 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileMutation.status === 'pending'}
                  className="w-full rounded-2xl bg-brand-500 py-4 text-xs font-bold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98 shadow-lg shadow-brand-500/15"
                >
                  {profileMutation.status === 'pending' ? 'Saving modifications...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Profile
