import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6'
import { RiPlaneFill } from 'react-icons/ri'

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-slate-200/10 bg-slate-950/80 pt-16 pb-8 dark:border-slate-800/80 dark:bg-slate-950/85 backdrop-blur-xl text-slate-400 dark:text-slate-400 light:bg-slate-50 light:text-slate-600 light:border-slate-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
              <RiPlaneFill className="text-brand-500 float-element" />
              <span>Traveller</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Curating luxury hotel stays and bespoke travel experiences for the modern global explorer. Let us make your next journey unforgettable.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full bg-slate-800 p-2 text-white transition hover:bg-brand-500 hover:scale-110">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="rounded-full bg-slate-800 p-2 text-white transition hover:bg-brand-500 hover:scale-110">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="rounded-full bg-slate-800 p-2 text-white transition hover:bg-brand-500 hover:scale-110">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="rounded-full bg-slate-800 p-2 text-white transition hover:bg-brand-500 hover:scale-110">
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white font-display">Destinations</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/hotels" className="hover:text-brand-400 transition">New York City</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-400 transition">Amsterdam</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-400 transition">Buenos Aires</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-400 transition">Paris Stays</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-400 transition">Tokyo Escapes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white font-display">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/hotels" className="hover:text-brand-400 transition">Find Stays</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400 transition">My Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition">Login / Sign In</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition">Create Account</Link></li>
              <li><a href="#" className="hover:text-brand-400 transition">Support Center</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-white font-display">Weekly Inspiration</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Get handpicked destinations and travel recommendations delivered straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-400"
              />
              <button className="rounded-2xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-400 hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Traveller Ltd. All rights reserved.</p>
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
