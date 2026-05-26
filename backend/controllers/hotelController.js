//route controllers for hotels

import asyncHandler from 'express-async-handler'
import Hotel from '../models/hotelModel.js'
import { getMockHotels, getMockHotelById, addMockHotelReview } from '../mockData.js'

const useMock = process.env.USE_MOCK === 'true' || !process.env.MONGO_URI

//Fetch all hotels
//GET /api/hotels
const getHotels = asyncHandler(async (req, res) => {
    if (useMock) {
        return res.json(getMockHotels())
    }

    const hotels = await Hotel.find()
    res.json(hotels)
})

//Fetch single hotel
//GET /api/hotels/:id
const getHotelById = asyncHandler(async (req, res) => {
    if (useMock) {
        const hotel = getMockHotelById(req.params.id)
        if (hotel) {
            return res.json(hotel)
        }
        res.status(404)
        throw new Error('Hotel not found!')
    }

    const hotel = await Hotel.findById(req.params.id)
    if (hotel) {
        res.json(hotel)
    } else {
        res.status(404)
        throw new Error('Hotel not found!')
    }
})

//Create new review
//POST /api/hotels/:id/reviews
const createHotelReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    if (useMock) {
        const hotel = getMockHotelById(req.params.id)
        if (!hotel) {
            res.status(404)
            throw new Error('Hotel not found!')
        }

        const alreadyReviewed = hotel.reviews.find((r) => r.user === req.user._id)
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Hotel already reviewed')
        }

        addMockHotelReview(req.params.id, {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        })
        return res.status(201).json({ message: 'Review added' })
    }

    const hotel = await Hotel.findById(req.params.id)
    if (hotel) {
        const alreadyReviewed = hotel.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Hotel already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        hotel.reviews.push(review)
        hotel.numReviews = hotel.reviews.length
        hotel.rating = hotel.reviews.reduce((acc, item) => item.rating + acc, 0) / hotel.reviews.length
        await hotel.save()
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Hotel not found!')
    }
})

export { getHotels, getHotelById, createHotelReview }