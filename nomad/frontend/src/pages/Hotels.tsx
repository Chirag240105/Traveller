import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import HotelCard from '../components/HotelCard'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'
import type { Hotel } from '../types'
import { FaSliders, FaStar, FaArrowRotateLeft, FaHeart, FaMagnifyingGlass } from 'react-icons/fa6'

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Basic search filters states
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [maxPrice, setMaxPrice] = useState<number>(40000)
  const [minRating, setMinRating] = useState<number>(0)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('featured')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fetch all hotel data
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await api.get('/hotels')
      return response.data
    }
  })

  // Watch URL parameters for search queries from landing page
  useEffect(() => {
    const searchParam = searchParams.get('search')
    const categoryParam = searchParams.get('category')
    
    if (searchParam) {
      setSearch(searchParam)
    }
    if (categoryParam) {
      // If it's a category redirect, match tags or location
      if (categoryParam.includes('Luxury')) {
        setMinRating(4.5)
      } else if (categoryParam.includes('City')) {
        setSelectedLocations(['New York City', 'Amsterdam'])
      } else if (categoryParam.includes('Beach')) {
        setSelectedAmenities(prev => [...new Set([...prev, 'pool'])])
      }
    }
  }, [searchParams])

  // Get unique locations in data for filtering options
  const locationsList = useMemo(() => {
    if (!hotels) return []
    return [...new Set(hotels.map((h) => h.location))]
  }, [hotels])

  // Core filter logic
  const filteredHotels = useMemo(() => {
    if (!hotels) return []

    return hotels
      .filter((hotel) => {
        // Text search matching (name or city)
        const matchText =
          search.trim() === '' ||
          hotel.name.toLowerCase().includes(search.toLowerCase()) ||
          hotel.location.toLowerCase().includes(search.toLowerCase()) ||
          hotel.address.toLowerCase().includes(search.toLowerCase())

        // Price range matching
        const matchPrice = hotel.price <= maxPrice

        // Rating threshold matching
        const matchRating = hotel.rating >= minRating

        // Locations matching
        const matchLocation =
          selectedLocations.length === 0 || selectedLocations.includes(hotel.location)

        // Amenities matching
        const matchAmenities =
          selectedAmenities.length === 0 ||
          selectedAmenities.every((amenity) =>
            hotel.amenities.toLowerCase().includes(amenity.toLowerCase())
          )

        return matchText && matchPrice && matchRating && matchLocation && matchAmenities
      })
      .sort((a, b) => {
        // Sorting logic
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'rating-desc') return b.rating - a.rating
        return 0 // default "featured" seeder order
      })
  }, [hotels, search, maxPrice, minRating, selectedLocations, selectedAmenities, sortBy])

  // Toggle locations filter
  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )
  }

  // Toggle amenities filter
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearch('')
    setMaxPrice(40000)
    setMinRating(0)
    setSelectedLocations([])
    setSelectedAmenities([])
    setSortBy('featured')
    setSearchParams({})
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 py-4">
      {/* Search Header Banner */}
      <div className="rounded-[2.5rem] border border-slate-200/10 dark:border-slate-800 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.06),_transparent_35%)] animate-pulse" />
        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Explore Handpicked Premium Stays
          </h1>
          <p className="max-w-xl text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Search our curated selection of top-tier hotels featuring exceptional amenities, stunning views, and top guest satisfaction.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, neighborhood, or specific stay..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-11 pr-5 py-4 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-brand-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/5 px-6 py-4 text-sm font-semibold hover:border-brand-400 hover:text-white transition cursor-pointer md:hidden"
            >
              <FaSliders />
              <span>Filters</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results Grid */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        
        {/* Left Column: Filters Sidebar (Desktop and Mobile drawer) */}
        <aside
          className={`lg:block ${
            isSidebarOpen 
              ? 'fixed inset-0 z-40 bg-slate-950/95 p-6 overflow-y-auto block' 
              : 'hidden'
          } lg:relative lg:bg-transparent lg:inset-auto lg:p-0 lg:z-0 lg:overflow-y-visible`}
        >
          {isSidebarOpen && (
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 lg:hidden">
              <h2 className="text-xl font-bold font-display text-white">Filters</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-xs uppercase tracking-wider text-slate-400 border border-slate-800 px-3 py-1.5 rounded-full"
              >
                Close
              </button>
            </div>
          )}

          <div className="space-y-6 pt-4 lg:pt-0">
            {/* Filter Header controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-display">Filter By</span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-brand-300 hover:text-white transition"
              >
                <FaArrowRotateLeft size={10} />
                <span>Reset All</span>
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="rounded-3xl border border-slate-200/10 dark:border-slate-800 bg-slate-950/40 p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nightly Budget</h3>
              <input
                type="range"
                min={5000}
                max={40000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>₹5,000</span>
                <span className="text-brand-300">Up to ₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Location Checkboxes */}
            <div className="rounded-3xl border border-slate-200/10 dark:border-slate-800 bg-slate-950/40 p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Locations</h3>
              <div className="space-y-2">
                {locationsList.map((loc) => (
                  <label key={loc} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                      className="rounded border-slate-800 bg-slate-900 text-brand-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Star Rating Checkbox */}
            <div className="rounded-3xl border border-slate-200/10 dark:border-slate-800 bg-slate-950/40 p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Guest Rating</h3>
              <div className="space-y-2">
                {[
                  { val: 4.5, label: '4.5 ★ & Above' },
                  { val: 4.0, label: '4.0 ★ & Above' },
                  { val: 3.5, label: '3.5 ★ & Above' }
                ].map((ratingOption) => (
                  <label key={ratingOption.val} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="rating-select"
                      checked={minRating === ratingOption.val}
                      onChange={() => setMinRating(ratingOption.val)}
                      className="border-slate-800 bg-slate-900 text-brand-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{ratingOption.label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="rating-select"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="border-slate-800 bg-slate-900 text-brand-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Show All Stays</span>
                </label>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="rounded-3xl border border-slate-200/10 dark:border-slate-800 bg-slate-950/40 p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Desired Amenities</h3>
              <div className="space-y-2">
                {[
                  { key: 'pool', label: 'Swimming Pool' },
                  { key: 'spa', label: 'Vitality Spa' },
                  { key: 'gym', label: 'Fitness Gym' },
                  { key: 'breakfast', label: 'Breakfast Included' },
                  { key: 'wifi', label: 'Free High-speed Wifi' }
                ].map((a) => (
                  <label key={a.key} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a.key)}
                      onChange={() => toggleAmenity(a.key)}
                      className="rounded border-slate-800 bg-slate-900 text-brand-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Hotel Listing Results */}
        <div className="space-y-6">
          {/* List stats & sorting toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-slate-200/10 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="text-slate-900 dark:text-white font-bold">{filteredHotels.length}</span> luxury properties
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Guest Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Hotels Grid */}
          {isLoading ? (
            <SkeletonLoader count={6} />
          ) : error ? (
            <ErrorMessage>Unable to load stay catalog. Please try again later.</ErrorMessage>
          ) : (
            <>
              {filteredHotels.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center space-y-4">
                  <p className="text-lg font-medium text-slate-300">No properties match your filter selection.</p>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Try broadening your price budget, reducing guest rating limits, or looking for general terms.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-brand-400"
                  >
                    <FaArrowRotateLeft />
                    <span>Clear Search Parameters</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hotels
