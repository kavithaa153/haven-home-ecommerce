import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  UserRound,
  Search,
} from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount, wishlist, user } = useShop()

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Our Story', path: '/#story' },
  ]

  return (
    <>
      <div className="bg-[#374432] px-4 py-2 text-center text-[10px] tracking-[0.16em] text-white sm:text-xs">
        THOUGHTFUL DESIGN. TIMELESS LIVING. FREE SHIPPING OVER ₹2,999.
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e9e7df] bg-[#faf9f6]/95 backdrop-blur-md">
        <div className="container-width flex h-[76px] items-center justify-between gap-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <Link to="/" className="shrink-0">
            <div className="text-[22px] font-semibold tracking-[-0.07em] sm:text-[27px]">
              haven<span className="font-light text-[#8b927c]">&</span>home
            </div>
            <div className="mt-0.5 text-[8px] tracking-[0.28em] text-[#7e8177]">
              THOUGHTFUL LIVING
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[12px] transition hover:text-[#718064] ${
                    isActive
                      ? 'font-semibold text-[#374432]'
                      : 'text-[#66685f]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/products"
              aria-label="Search products"
              className="hidden sm:block"
            >
              <Search size={19} strokeWidth={1.5} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative"
            >
              <Heart size={20} strokeWidth={1.5} />

              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#374432] px-1 text-[9px] text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to={user ? '/profile' : '/login'}
              aria-label="My account"
              className="hidden sm:block"
            >
              <UserRound size={20} strokeWidth={1.5} />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#374432] px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#e9e7df] bg-[#faf9f6] px-6 py-4 lg:hidden">
            {links.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-[#e9e7df] py-4 text-sm"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block py-4 text-sm"
            >
              My Account
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}