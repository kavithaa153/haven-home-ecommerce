
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRound, Mail, LogOut, Package, Save } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser, showToast } = useShop()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  if (!user) {
    return (
      <main className="container-width flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
        <UserRound size={38} strokeWidth={1.3} className="text-[#78816b]" />
        <h1 className="mt-5 text-3xl font-medium">Your account</h1>
        <p className="mt-3 text-sm text-[#77796f]">
          Please sign in to view your profile.
        </p>
        <Link to="/login" className="primary-button mt-6">
          Sign In
        </Link>
      </main>
    )
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !email) {
      showToast('Please enter your name and email.', 'error')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    const registeredUsers = JSON.parse(
      localStorage.getItem('haven_registered_users') || '[]',
    )

    const emailExists = registeredUsers.some(
      account =>
        account.email.toLowerCase() === email &&
        account.email.toLowerCase() !== user.email.toLowerCase(),
    )

    if (emailExists) {
      showToast('This email is already registered.', 'error')
      return
    }

    const updatedUser = { ...user, name, email }

    const updatedAccounts = registeredUsers.map(account =>
      account.email.toLowerCase() === user.email.toLowerCase()
        ? { ...account, name, email }
        : account,
    )

    localStorage.setItem(
      'haven_registered_users',
      JSON.stringify(updatedAccounts),
    )
    localStorage.setItem('haven_user', JSON.stringify(updatedUser))

    setUser(updatedUser)
    showToast('Profile updated successfully!')
  }

  function handleLogout() {
    localStorage.removeItem('haven_user')
    setUser(null)
    showToast('You have been signed out.')
    navigate('/')
  }

  return (
    <main className="container-width py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 text-sm text-[#77796f]">
          Manage your personal information and orders.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Link
            to="/orders"
            className="flex items-center gap-4 border border-[#e7e5dc] bg-white p-5 transition hover:border-[#a5ad99]"
          >
            <span className="flex h-11 w-11 items-center justify-center bg-[#edf0e8] text-[#374432]">
              <Package size={21} />
            </span>
            <span>
              <span className="block font-medium">My Orders</span>
              <span className="mt-1 block text-xs text-[#77796f]">
                View your purchases
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-4 border border-[#e7e5dc] bg-white p-5 text-left transition hover:border-red-300"
          >
            <span className="flex h-11 w-11 items-center justify-center bg-red-50 text-red-700">
              <LogOut size={20} />
            </span>
            <span>
              <span className="block font-medium">Sign Out</span>
              <span className="mt-1 block text-xs text-[#77796f]">
                Sign out of your account
              </span>
            </span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 border border-[#e7e5dc] bg-white p-6 sm:p-8"
        >
          <h2 className="text-xl font-medium">Personal information</h2>

          <label className="mt-6 block text-sm font-medium">
            Full name
            <span className="relative mt-2 block">
              <UserRound
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85877c]"
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full border border-[#deded4] py-3 pl-10 pr-4 outline-none focus:border-[#718064]"
                required
              />
            </span>
          </label>

          <label className="mt-5 block text-sm font-medium">
            Email address
            <span className="relative mt-2 block">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85877c]"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full border border-[#deded4] py-3 pl-10 pr-4 outline-none focus:border-[#718064]"
                required
              />
            </span>
          </label>

          <button type="submit" className="primary-button mt-7">
            <Save size={16} />
            Save Changes
          </button>
        </form>
      </motion.div>
    </main>
  )
}
