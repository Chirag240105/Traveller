export type Hotel = {
  _id: string
  name: string
  location: string
  price: number
  image_exterior: string
  image_room: string
  image_bar?: string
  description: string
  rating: number
  amenities: string
  qty: number
  tag?: string
  address: string
  lat: number
  long: number
  phone: string
  reviews?: Array<{ _id: string; name: string; rating: number; comment: string; createdAt: string }>
  numReviews?: number
}

export type UserProfile = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  token: string
}

export type BookingItem = {
  hotel: string
  name: string
  qty: number
  price: number
  image?: string
}

export type Booking = {
  _id: string
  bookingItems: BookingItem[]
  user: string | UserProfile
  itemsPrice: number
  taxPrice: number
  totalPrice: number
  createdAt: string
}
