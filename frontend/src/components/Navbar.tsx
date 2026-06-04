import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getUser, clearUser } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { useWishlist } from '../context/WishlistContext'
import { FaSun, FaMoon, FaHeart, FaUser } from 'react-icons/fa6'
import { RiCompass3Fill } from 'react-icons/ri'
import MagneticButton from './MagneticButton'

const Navbar = () => {
  const user = getUser()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { wishlist } = useWishlist()
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 dark:border-white/5 glass-nav backdrop-blur-xl transition-all duration-300">
      {/* Scroll Progress Indicator */}
      <div 
        className="h-[3px] bg-gradient-to-r from-sunset-500 to-sunset-600 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-ocean-800 dark:text-white font-display group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-ocean-700 to-ocean-900 dark:from-ocean-800 dark:to-ocean-950 border border-white/10 group-hover:rotate-12 transition-transform duration-300">
            <RiCompass3Fill className="text-sunset-500 text-xl animate-spin-slow" />
          </div>
          <span className="bg-gradient-to-r from-ocean-800 to-ocean-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            NomadLuxury
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4 text-[10px] font-bold uppercase tracking-widest">
          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              isActive
                ? 'rounded-full bg-sunset-500 px-5 py-2.5 text-white shadow-lg shadow-sunset-500/25 border border-sunset-500/10 transition-colors'
                : 'rounded-full px-5 py-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
            }
          >
            Explore Stays
          </NavLink>

          {/* Wishlist Link */}
          <Link
            to="/profile?tab=saved"
            className="relative rounded-full p-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
            title="Wishlist"
          >
            <FaHeart className={wishlist.length > 0 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-300'} size={15} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-md shadow-rose-500/10">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FaSun size={15} className="text-sunset-500" /> : <FaMoon size={15} className="text-ocean-800" />}
          </button>

          {/* Auth Controls */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {user ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-2 rounded-full bg-sunset-500/10 border border-sunset-500/20 px-5 py-2.5 text-sunset-500 dark:text-sunset-400'
                    : 'flex items-center gap-2 rounded-full px-5 py-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }
              >
                <FaUser size={10} />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 dark:border-slate-800 px-5 py-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:border-sunset-500 dark:hover:border-sunset-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-sunset-500 px-5 py-2.5 text-white'
                    : 'rounded-full px-5 py-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }
              >
                Sign In
              </NavLink>
              
              <MagneticButton
                onClick={() => navigate('/register')}
                className="hidden sm:block"
              >
                <span className="block rounded-full bg-ocean-800 dark:bg-white text-white dark:text-ocean-800 px-5 py-2.5 font-bold hover:opacity-90 transition shadow-lg shadow-ocean-800/10">
                  Join
                </span>
              </MagneticButton>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
