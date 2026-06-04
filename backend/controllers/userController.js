//route controllers for users

import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import { getMockUserByEmail, createMockUser, getMockUserById, updateMockUser } from '../mockData.js'

const useMock = process.env.USE_MOCK === 'true' || !process.env.MONGO_URI

//Auth user & get token
//POST/api/users/login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (useMock) {
        const user = getMockUserByEmail(email)
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        }
        res.status(401)
        throw new Error('Invalid email or password')
    }

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//Register a new user
//POST/api/users
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (useMock) {
        if (getMockUserByEmail(email)) {
            res.status(400)
            throw new Error('User already exists!')
        }

        const user = await createMockUser({ name, email, password })
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists!')
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data!')
    }
})

//Get user profile
//GET/api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
    if (useMock) {
        const user = getMockUserById(req.user._id)
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            })
        }
        res.status(404)
        throw new Error('User not found!')
    }

    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})

//Update user profile
//Put/api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
    if (useMock) {
        const user = await updateMockUser(req.user._id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        }
        res.status(404)
        throw new Error('User not found!')
    }

    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found!')
    }
})

export { authUser, getUserProfile, registerUser, updateUserProfile }