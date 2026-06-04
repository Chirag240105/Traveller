import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6'
import { RiCompass3Fill } from 'react-icons/ri'

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-ocean-800 pt-16 pb-8 dark:border-white/5 dark:bg-ocean-950 backdrop-blur-xl text-slate-400">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white font-display group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunset-500 border border-white/10 group-hover:rotate-12 transition-transform duration-300">
                <RiCompass3Fill className="text-white text-lg animate-spin-slow" />
              </div>
              <span>NomadLuxury</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Curating luxury hotel stays and bespoke travel experiences for the modern global explorer. Let us make your next journey unforgettable.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-full bg-white/5 p-2.5 text-white border border-white/5 hover:border-sunset-500 transition hover:bg-sunset-500 hover:scale-110">
                <FaTwitter size={14} />
              </a>
              <a href="#" className="rounded-full bg-white/5 p-2.5 text-white border border-white/5 hover:border-sunset-500 transition hover:bg-sunset-500 hover:scale-110">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="rounded-full bg-white/5 p-2.5 text-white border border-white/5 hover:border-sunset-500 transition hover:bg-sunset-500 hover:scale-110">
                <FaFacebook size={14} />
              </a>
              <a href="#" className="rounded-full bg-white/5 p-2.5 text-white border border-white/5 hover:border-sunset-500 transition hover:bg-sunset-500 hover:scale-110">
                <FaLinkedin size={14} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">Destinations</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">New York City</Link></li>
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">Amsterdam</Link></li>
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">Buenos Aires</Link></li>
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">Paris Stays</Link></li>
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">Tokyo Escapes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li><Link to="/hotels" className="hover:text-sunset-500 transition">Find Stays</Link></li>
              <li><Link to="/profile" className="hover:text-sunset-500 transition">My Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-sunset-500 transition">Login / Sign In</Link></li>
              <li><Link to="/register" className="hover:text-sunset-500 transition">Create Account</Link></li>
              <li><a href="#" className="hover:text-sunset-500 transition">Support Center</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">Weekly Inspiration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get handpicked destinations and luxury travel recommendations delivered straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sunset-500"
              />
              <button className="rounded-xl bg-sunset-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-sunset-600 hover:scale-102 active:scale-98">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 sm:flex-row text-[10px] uppercase tracking-wider text-slate-500">
          <p>© {new Date().getFullYear()} NomadLuxury Ltd. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
