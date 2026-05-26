//db model for booking data

import mongoose from 'mongoose'
const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bookingItems: [
        {
            hotel: { type: String, required: true },
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true }
        }
    ],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
}, {
    timestamps: true
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking