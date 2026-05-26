import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { setUser } from './hooks/useAuth'
import { useTheme } from './context/ThemeContext'

function App() {
  const location = useLocation()
  const { theme } = useTheme()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const encoded = params.get('setUserInfo')
    if (encoded) {
      try {
        const user = JSON.parse(atob(encoded))
        setUser(user)
        window.history.replaceState({}, '', location.pathname)
      } catch {
        // ignore invalid data
      }
    }
  }, [location.pathname, location.search])

  return (
    <div className={`${theme} flex min-h-screen flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="flex-grow px-4 pb-16 pt-6 md:px-8"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div className="py-20 text-center text-2xl font-display">Page not found.</div>} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App
