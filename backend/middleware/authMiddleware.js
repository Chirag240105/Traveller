import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { getMockUserById } from '../mockData.js'

const useMock = process.env.USE_MOCK === 'true' || !process.env.MONGO_URI

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (useMock) {
                const user = getMockUserById(decoded.id)
                if (!user) {
                    res.status(401)
                    throw new Error('Not authorized, user not found')
                }
                req.user = user
            } else {
                req.user = await User.findById(decoded.id).select('-password')
                if (!req.user) {
                    res.status(401)
                    throw new Error('Not authorized, user not found')
                }
            }

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

export { protect }