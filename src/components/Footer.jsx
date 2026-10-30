import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
} from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return
    }

    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-12 bg-[#30382d] text-[#f8f6f0]">
      <div className="container-width grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Link to="/" className="text-2xl font-semibold tracking-[-0.06em]">
            haven<span className="font-light text-[#bac3ad]">&</span>home
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-[#d0d2c8]">
            Thoughtfully selected pieces for slower mornings, warmer evenings,
            and a home that feels like you.
          </p>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Instagram"
            className="mt-5 inline-flex items-center gap-2 text-sm transition hover:text-white"
          >
            <span className="text-lg font-semibold">◎</span>
            Follow our journey
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">
            Explore
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-[#d0d2c8]">
            <Link to="/products" className="transition hover:text-white">
              Shop all
            </Link>
            <Link to="/wishlist" className="transition hover:text-white">
              Wishlist
            </Link>
            <Link to="/cart" className="transition hover:text-white">
              Shopping bag
            </Link>
            <Link to="/orders" className="transition hover:text-white">
              My orders
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">
            Customer care
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-[#d0d2c8]">
            <Link to="/profile" className="transition hover:text-white">
              My account
            </Link>
            <Link to="/login" className="transition hover:text-white">
              Sign in
            </Link>
            <a
              href="mailto:hello@havenhome.example"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Mail size={15} />
              Contact us
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">
            A little inspiration
          </h3>

          <p className="mt-4 text-sm leading-6 text-[#d0d2c8]">
            Join our newsletter for new arrivals, thoughtful ideas, and
            exclusive offers.
          </p>

          <form onSubmit={handleSubscribe} className="mt-5">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>

            <div className="flex border-b border-white/40">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={event => {
                  setEmail(event.target.value)
                  setSubscribed(false)
                }}
                placeholder="Your email address"
                required
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#c5c8bc]"
              />

              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-2 transition hover:text-[#bac3ad]"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {subscribed && (
              <p role="status" className="mt-3 text-xs text-[#d4dfc8]">
                Thank you for subscribing!
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-width flex flex-col justify-between gap-3 py-5 text-xs text-[#c5c8bc] sm:flex-row">
          <span>© 2026 Haven & Home. All rights reserved.</span>
          <span>Made for thoughtful living.</span>
        </div>
      </div>
    </footer>
  )
}