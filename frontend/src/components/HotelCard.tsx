import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHeart, FaStar } from 'react-icons/fa6'
import { useWishlist } from '../context/WishlistContext'
import type { Hotel } from '../types'

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const isSaved = isInWishlist(hotel._id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(hotel)
  }

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200/10 dark:border-slate-800/80 bg-white dark:bg-slate-950/70 shadow-xl hover:shadow-2xl hover:border-brand-500/30 transition duration-300"
    >
      <Link to={`/hotels/${hotel._id}`} className="block">
        {/* Exterior Image & Tags */}
        <div className="relative h-64 overflow-hidden bg-slate-900 dark:bg-slate-900">
          <img
            src={hotel.image_exterior}
            alt={hotel.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-4 top-4 flex justify-between items-center z-10">
            <span className="rounded-full bg-brand-500/90 dark:bg-brand-500/85 px-4.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white shadow-md">
              {hotel.tag || 'Exclusive stay'}
            </span>
            
            {/* Wishlist Heart Toggle */}
            <button
              onClick={handleWishlistToggle}
              className="rounded-full bg-slate-950/60 p-2.5 text-white backdrop-blur-md transition hover:bg-slate-950/80 hover:scale-110 active:scale-90"
              title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <FaHeart className={isSaved ? 'text-rose-500 scale-110' : 'text-slate-200'} size={15} />
            </button>
          </div>
        </div>

        {/* Card Metadata Details */}
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display leading-snug line-clamp-1">
                {hotel.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {hotel.location}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-extrabold text-brand-600 dark:text-brand-300 font-display">
                ₹{hotel.price.toLocaleString()}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                / night
              </p>
            </div>
          </div>

          <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[32px]">
            {hotel.description}
          </p>

          {/* Footer ratings and stock details */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <FaStar className="text-amber-400" size={13} />
              <span className="font-bold text-slate-800 dark:text-slate-200">{hotel.rating.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">({hotel.numReviews || 0} reviews)</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
              {hotel.qty} rooms left
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default HotelCard
