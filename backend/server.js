import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import hotelRoutes from './routes/hotelRoutes.js'
import userRoutes from './routes/userRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { createRequire } from 'module'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import User from './models/userModel.js'
import generateToken from './utils/generateToken.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const CONFIG = require('./config.cjs')
const google = require('googleapis').google
const OAuth2 = google.auth.OAuth2

dotenv.config()
const useMock = process.env.USE_MOCK === 'true' || !process.env.MONGO_URI
if (!useMock) {
    connectDB()
}
const app = express()

const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
]

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Render health checks, mobile apps)
        if (!origin) return callback(null, true)
        if (allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.netlify.app')) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}))
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.json())

app.use('/api/hotels', hotelRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mockMode: useMock })
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    )
}

app.get('/auth_callback', async function (req, res) {
    const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
    if (req.query.error) {
        return res.redirect('/');
    } else {
        try {
            const { tokens } = await oauth2Client.getToken(req.query.code)
            res.cookie('jwt', jwt.sign(tokens, CONFIG.JWTsecret));
            const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                },
            ).then(res => res.data).catch(error => {
                throw new Error(error.message);
            });
            let name = googleUser.name
            let email = googleUser.email
            const user = (await User.findOne({ email })) || (await User.create({
                name,
                email,
                password: null,
            }))
            const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173'
            return res.redirect(`${redirectUrl}?setUserInfo=${Buffer.from(JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })).toString('base64')}`)
        } catch (error) {
            console.error(`Error: ${error.message}`.red.underline.bold)
        }
    }
}
)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))