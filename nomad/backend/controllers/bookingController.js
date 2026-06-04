//route controllers from bookings

import asyncHandler from 'express-async-handler'
import Booking from '../models/bookingModel.js'
import { createMockBooking, getMockBookingsByUser, getMockBookingById } from '../mockData.js'

const useMock = process.env.USE_MOCK === 'true' || !process.env.MONGO_URI

//Create new booking
//POST /api/bookings
const addBookingItems = asyncHandler(async (req, res) => {
    const { bookingItems, itemsPrice, taxPrice, totalPrice } = req.body

    if (!bookingItems || bookingItems.length === 0) {
        res.status(400)
        throw new Error('No booking items')
    } else if (useMock) {
        const booking = createMockBooking({
            bookingItems,
            user: req.user._id,
            itemsPrice,
            taxPrice,
            totalPrice,
        })
        res.status(201).json(booking)
    } else {
        const booking = new Booking({
            bookingItems,
            user: req.user._id,
            itemsPrice,
            taxPrice,
            totalPrice,
        })

        const createdBooking = await booking.save()
        res.status(201).json(createdBooking)
    }
})

//Get booking by id
//GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
    if (useMock) {
        const booking = getMockBookingById(req.params.id)
        if (booking) {
            return res.json(booking)
        }
        res.status(404)
        throw new Error('Booking not found!')
    }

    const booking = await Booking.findById(req.params.id).populate('user', 'name email')
    if (booking) {
        res.json(booking)
    } else {
        res.status(404)
        throw new Error('Booking Not Found!')
    }
})

//Get logged in user bookings
//GET /api/bookings/mybookings
const getMyBookings = asyncHandler(async (req, res) => {
    if (useMock) {
        const bookings = getMockBookingsByUser(req.user._id)
        return res.json(bookings)
    }

    const bookings = await Booking.find({ user: req.user._id })
    res.json(bookings)
})

export { addBookingItems, getBookingById, getMyBookings }