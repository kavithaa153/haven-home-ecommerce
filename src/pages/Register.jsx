import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { user, setUser, showToast } = useShop()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))

    setErrors(previous => ({
      ...previous,
      [name]: '',
      form: '',
    }))
  }

  function validateForm() {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must contain at least 2 characters.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.'
    }

    if (!form.password) {
      newErrors.password = 'Password is required.'
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) return

    const email = form.email.trim().toLowerCase()

    let savedUsers = []

    try {
      savedUsers = JSON.parse(
        localStorage.getItem('haven_registered_users') || '[]',
      )

      if (!Array.isArray(savedUsers)) {
        savedUsers = []
      }
    } catch {
      savedUsers = []
    }

    const emailExists = savedUsers.some(
      registeredUser => registeredUser.email.toLowerCase() === email,
    )

    if (emailExists) {
      setErrors({
        email: 'This email is already registered. Please sign in.',
      })
      return
    }

    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email,
      password: form.password,
    }

    savedUsers.push(newUser)

    localStorage.setItem(
      'haven_registered_users',
      JSON.stringify(savedUsers),
    )

    const loggedInUser = {
      name: newUser.name,
      email: newUser.email,
    }

    setUser(loggedInUser)
    localStorage.setItem('haven_user', JSON.stringify(loggedInUser))

    showToast('Your account has been created successfully!')
    navigate('/')
  }

  if (user) {
    return (
      <main className="container-width flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-medium text-[#292c25]">
          You are already signed in.
        </h1>

        <Link to="/" className="primary-button mt-6">
          Continue Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="container-width grid min-h-[75vh] items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
      <motion.section
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden min-h-[520px] flex-col justify-end bg-[#e8e9df] p-10 md:flex lg:p-14"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(36,45,32,0.75), rgba(36,45,32,0.03)), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <p className="eyebrow text-white">Haven & Home</p>

        <h2 className="mt-4 max-w-sm text-4xl font-medium leading-tight text-white lg:text-5xl">
          A home that feels like you.
        </h2>

        <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
          Discover thoughtful pieces to make every corner feel special.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-md"
      >
        <p className="eyebrow">Join our community</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
          Create your account
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#77796f]">
          Sign up to save favourites and manage your orders.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-semibold">
              Full name
            </label>

            <div className="flex items-center gap-3 border border-[#deded5] bg-white px-4">
              <UserRound size={17} className="shrink-0 text-[#85877c]" />

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="min-h-12 w-full bg-transparent text-sm outline-none"
              />
            </div>

            {errors.name && (
              <p className="mt-2 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold">
              Email address
            </label>

            <div className="flex items-center gap-3 border border-[#deded5] bg-white px-4">
              <Mail size={17} className="shrink-0 text-[#85877c]" />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="min-h-12 w-full bg-transparent text-sm outline-none"
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold">
              Password
            </label>

            <div className="flex items-center gap-3 border border-[#deded5] bg-white px-4">
              <LockKeyhole size={17} className="shrink-0 text-[#85877c]" />

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="min-h-12 w-full bg-transparent text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(previous => !previous)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-[#77796f]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-xs font-semibold"
            >
              Confirm password
            </label>

            <div className="flex items-center gap-3 border border-[#deded5] bg-white px-4">
              <LockKeyhole size={17} className="shrink-0 text-[#85877c]" />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="min-h-12 w-full bg-transparent text-sm outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(previous => !previous)
                }
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                className="text-[#77796f]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" className="primary-button w-full">
            Create Account
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#77796f]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#374432] underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </motion.section>
    </main>
  )
}