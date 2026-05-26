import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Hotel } from '../types'

type WishlistContextType = {
  wishlist: Hotel[]
  addToWishlist: (hotel: Hotel) => void
  removeFromWishlist: (hotelId: string) => void
  toggleWishlist: (hotel: Hotel) => void
  isInWishlist: (hotelId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Hotel[]>(() => {
    try {
      const saved = localStorage.getItem('travellerWishlist')
      return saved ? (JSON.parse(saved) as Hotel[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('travellerWishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (hotel: Hotel) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === hotel._id)) return prev
      return [...prev, hotel]
    })
  }

  const removeFromWishlist = (hotelId: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== hotelId))
  }

  const toggleWishlist = (hotel: Hotel) => {
    if (isInWishlist(hotel._id)) {
      removeFromWishlist(hotel._id)
    } else {
      addToWishlist(hotel)
    }
  }

  const isInWishlist = (hotelId: string) => {
    return wishlist.some((item) => item._id === hotelId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
