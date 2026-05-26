import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getUser, clearUser } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { useWishlist } from '../context/WishlistContext'
import { FaSun, FaMoon, FaHeart, FaUser } from 'react-icons/fa6'
import { RiPlaneFill } from 'react-icons/ri'

const Navbar = () => {
  const user = getUser()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { wishlist } = useWishlist()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/10 dark:border-slate-800/80 glass-nav backdrop-blur-lg transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
          <RiPlaneFill className="text-brand-500 float-element" />
          <span>Traveller</span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              isActive
                ? 'rounded-full bg-brand-500 px-4 py-2 text-white shadow-lg shadow-brand-500/15'
                : 'rounded-full px-4 py-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
            }
          >
            Hotels
          </NavLink>

          {/* Wishlist Link */}
          <Link
            to="/profile?tab=saved"
            className="relative rounded-full p-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
            title="Wishlist"
          >
            <FaHeart className={wishlist.length > 0 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-300'} size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md shadow-rose-500/10">
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
            {theme === 'dark' ? <FaSun size={18} className="text-amber-400 animate-pulse" /> : <FaMoon size={18} className="text-slate-700" />}
          </button>

          {/* Auth Controls */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {user ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-2 text-brand-300 shadow-md'
                    : 'flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }
              >
                <FaUser size={12} />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 dark:border-slate-800 px-4 py-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:border-brand-500 dark:hover:border-brand-500"
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
                    ? 'rounded-full bg-brand-500 px-4 py-2 text-white'
                    : 'rounded-full px-4 py-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="hidden sm:block rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-lg"
              >
                Join
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
