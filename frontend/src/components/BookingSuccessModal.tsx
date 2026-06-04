import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarDays, FaCheck, FaUsers, FaXmark } from 'react-icons/fa6'

type BookingSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    hotelName: string
    nights: number
    price: number
    tax: number
    total: number
    checkIn: string
    checkOut: string
    guests: number
    bookingId: string
  } | null
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ isOpen, onClose, bookingDetails }) => {
  if (!bookingDetails) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200/10 bg-slate-950 p-6 dark:border-slate-800/80 dark:bg-slate-950 text-white shadow-2xl light:bg-white light:text-slate-800 light:border-slate-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-slate-900/60 p-2 text-slate-400 hover:bg-slate-800 hover:text-white dark:bg-slate-900 dark:hover:bg-slate-800 light:bg-slate-100 light:hover:bg-slate-200 light:text-slate-600"
            >
              <FaXmark size={18} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Success Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              >
                <FaCheck size={28} />
              </motion.div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
                Booking Confirmed!
              </h2>
              <p className="mt-1 text-sm text-emerald-400 font-semibold uppercase tracking-wider">
                Ref: {bookingDetails.bookingId}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your luxury stay has been reserved successfully. A confirmation receipt has been sent to your email.
              </p>

              {/* Booking Summary Box */}
              <div className="mt-6 w-full rounded-3xl bg-slate-900/80 p-5 text-left border border-slate-800 dark:bg-slate-900/80 dark:border-slate-800 light:bg-slate-50 light:border-slate-200 light:text-slate-700">
                <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Reserved Property</h3>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white font-display">
                  {bookingDetails.hotelName}
                </p>

                {/* Dates & Guests */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-b border-slate-800 dark:border-slate-800 light:border-slate-200 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarDays className="text-brand-400" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Dates</p>
                      <p className="font-medium text-slate-900 dark:text-slate-200">
                        {bookingDetails.checkIn} - {bookingDetails.checkOut}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-brand-400" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Guests</p>
                      <p className="font-medium text-slate-900 dark:text-slate-200">
                        {bookingDetails.guests} {bookingDetails.guests === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Nightly Rate</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      ₹{bookingDetails.price.toLocaleString()} x {bookingDetails.nights} nights
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Estimated Taxes (8%)</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      ₹{bookingDetails.tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-800 dark:border-slate-800 light:border-slate-200 pt-2 text-sm font-semibold">
                    <span className="text-slate-900 dark:text-white">Total Amount</span>
                    <span className="text-brand-300 dark:text-brand-300">
                      ₹{bookingDetails.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98"
                >
                  View My Bookings
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/40 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white dark:border-slate-800 dark:bg-slate-900/40 light:border-slate-300 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
                >
                  Close Window
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookingSuccessModal
