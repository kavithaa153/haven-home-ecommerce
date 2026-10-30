import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { user, setUser, showToast } = useShop()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

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

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.'
    }

    if (!form.password) {
      newErrors.password = 'Password is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) return

    const savedUsers = JSON.parse(localStorage.getItem('haven_registered_users') || '[]')

    const registeredUser = savedUsers.find(
      item =>
        item.email.toLowerCase() === form.email.trim().toLowerCase() &&
        item.password === form.password,
    )

    if (!registeredUser) {
      setErrors({
        form: 'Invalid email or password. Please check your details or create an account.',
      })
      return
    }

    const loggedInUser = {
      name: registeredUser.name,
      email: registeredUser.email,
    }

    setUser(loggedInUser)
    localStorage.setItem('haven_user', JSON.stringify(loggedInUser))

    showToast('Welcome back!')
    navigate('/')
  }

  if (user) {
    return (
      <main className="container-width flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-3xl font-medium text-[#292c25]">
          Welcome back, {user.name || 'there'}!
        </h1>

        <p className="mt-3 text-sm text-[#77796f]">
          You are already logged in.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="primary-button mt-6"
        >
          Continue Shopping
        </button>
      </main>
    )
  }

  return (
    <main className="container-width grid min-h-[75vh] items-center gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16">
      <motion.section
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden min-h-[480px] flex-col justify-end bg-[#e8e9df] p-10 md:flex lg:p-14"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(36,45,32,0.72), rgba(36,45,32,0.03)), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <p className="eyebrow text-white">Haven & Home</p>

        <h2 className="mt-4 max-w-sm text-4xl font-medium leading-tight text-white lg:text-5xl">
          Make room for the things you love.
        </h2>

        <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
          Thoughtful pieces for a home that feels uniquely yours.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-md"
      >
        <p className="eyebrow">Welcome back</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
          Sign in to your account
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#77796f]">
          Enter your details to continue your shopping journey.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

          {errors.form && (
            <p role="alert" className="bg-red-50 p-3 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <button type="submit" className="primary-button w-full">
            Sign In
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#77796f]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#374432] underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </motion.section>
    </main>
  )
}