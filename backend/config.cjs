//config for oauth2 with credentials

require('dotenv').config()
const baseURL = process.env.BASE_URL || 'http://localhost:5000'

module.exports = {
  JWTsecret: process.env.JWT_SECRET || 'mysecret',
  baseURL,
  port: Number(process.env.PORT || 5000),
  oauth2Credentials: {
    client_id: process.env.CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    project_id: 'Traveller',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: process.env.CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    redirect_uris: [`${baseURL}/auth_callback`],
    scopes: [
      'openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'profile'
    ]
  }
}