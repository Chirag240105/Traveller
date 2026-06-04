import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import users from './data/users.js'
import hotels from './data/hotels.js'

const makeId = () => new mongoose.Types.ObjectId().toHexString()

const mockHotels = hotels.map((hotel) => ({
  ...hotel,
  _id: makeId(),
  user: makeId(),
  reviews: hotel.reviews ?? [],
  numReviews: hotel.reviews?.length ?? 0,
}))

const mockUsers = users.map((user) => ({
  ...user,
  _id: makeId(),
  email: user.email.toLowerCase(),
  isAdmin: user.isAdmin ?? false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const mockBookings = []

const getMockHotels = () => mockHotels
const getMockHotelById = (id) => mockHotels.find((hotel) => hotel._id === id)

const addMockHotelReview = (hotelId, review) => {
  const hotel = getMockHotelById(hotelId)
  if (!hotel) return null
  hotel.reviews.push({ _id: makeId(), ...review, createdAt: new Date().toISOString() })
  hotel.numReviews = hotel.reviews.length
  hotel.rating = hotel.reviews.reduce((acc, item) => item.rating + acc, 0) / hotel.reviews.length
  return hotel
}

const getMockUserByEmail = (email) => mockUsers.find((user) => user.email === email?.toLowerCase())
const getMockUserById = (id) => mockUsers.find((user) => user._id === id)

const createMockUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = {
    _id: makeId(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return newUser
}

const updateMockUser = async (id, { name, email, password }) => {
  const user = getMockUserById(id)
  if (!user) return null

  user.name = name ?? user.name
  user.email = email?.toLowerCase() ?? user.email
  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }
  user.updatedAt = new Date().toISOString()
  return user
}

const getMockBookingsByUser = (userId) => mockBookings.filter((booking) => booking.user === userId)
const getMockBookingById = (id) => mockBookings.find((booking) => booking._id === id)

const createMockBooking = ({ bookingItems, user, itemsPrice, taxPrice, totalPrice }) => {
  const booking = {
    _id: makeId(),
    bookingItems,
    user,
    itemsPrice,
    taxPrice,
    totalPrice,
    createdAt: new Date().toISOString(),
  }

  mockBookings.push(booking)
  return booking
}

export {
  getMockHotels,
  getMockHotelById,
  addMockHotelReview,
  getMockUserByEmail,
  getMockUserById,
  createMockUser,
  updateMockUser,
  getMockBookingsByUser,
  getMockBookingById,
  createMockBooking,
}
