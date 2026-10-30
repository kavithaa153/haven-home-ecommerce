
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  paymentMethod: 'cod',
}

export default function Checkout() {
  const navigate = useNavigate()
  const {
    cart,
    subtotal,
    orders,
    setOrders,
    setCart,
    user,
    showToast,
  } = useShop()

  const [form, setForm] = useState({
    ...initialForm,
    fullName: user?.name || '',
    email: user?.email || '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99
  const total = subtotal + shipping

  function handleChange(event) {
    const { name, value } = event.target

    setForm(current => ({
      ...current,
      [name]:
        name === 'phone' || name === 'pincode'
          ? value.replace(/\D/g, '')
          : value,
    }))

    setErrors(current => ({
      ...current,
      [name]: '',
    }))
  }

  function validateForm() {
    const nextErrors = {}

    if (form.fullName.trim().length < 3) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.'
    }

    if (form.address.trim().length < 10) {
      nextErrors.address =
        'Enter a complete address of at least 10 characters.'
    }

    if (form.city.trim().length < 2) {
      nextErrors.city = 'Please enter your city.'
    }

    if (!form.state.trim()) {
      nextErrors.state = 'Please enter your state.'
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      nextErrors.pincode = 'Enter a valid 6-digit PIN code.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) return

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error')
      navigate('/products')
      return
    }

    if (!validateForm()) {
      showToast('Please correct the highlighted fields.', 'error')
      return
    }

    setIsSubmitting(true)

    const orderDate = new Date().toISOString()
    const customerEmail = form.email.trim().toLowerCase()

    const order = {
      id: `HH${Date.now().toString().slice(-8)}`,
      orderNumber: `HH${Date.now().toString().slice(-8)}`,
      items: cart.map(item => ({ ...item })),
      customer: {
        name: form.fullName.trim(),
        email: customerEmail,
        phone: form.phone,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode,
      },
      address: {
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode,
      },
      paymentMethod: form.paymentMethod,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      date: orderDate,
      createdAt: orderDate,
    }

    try {
      const existingOrders = Array.isArray(orders) ? orders : []
      const updatedOrders = [order, ...existingOrders]

      setOrders(updatedOrders)
      setCart([])
      setPlacedOrder(order)

      showToast('Your order has been placed successfully.')
    } catch {
      showToast('Unable to place your order. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full border border-[#deded5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#78816b]'

  const labelClass = 'block text-xs font-semibold text-[#45483f]'
  const errorClass = 'mt-1 text-xs text-red-600'

  if (placedOrder) {
    return (
      <main className="container-width flex min-h-[70vh] items-center justify-center py-16">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl border border-[#e5e4dc] bg-white p-7 text-center sm:p-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e5eadf] text-[#374432]">
            <CheckCircle2 size={32} />
          </div>

          <p className="eyebrow mt-6">Thank you for your order</p>

          <h1 className="mt-3 text-3xl font-medium text-[#292c25]">
            Your order is confirmed!
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#77796f]">
            Thank you, {placedOrder.customer.name}. Your order has been saved
            in this demo store.
          </p>

          <div className="mt-7 space-y-3 bg-[#faf9f6] p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Order number</span>
              <span className="break-all font-semibold">
                {placedOrder.id}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Payment method</span>
              <span className="font-semibold">
                {placedOrder.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : 'UPI / Online'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Order total</span>
              <span className="font-semibold">
                ₹{placedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Order status</span>
              <span className="font-semibold">{placedOrder.status}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/products" className="primary-button">
              Continue Shopping
            </Link>

            <Link to="/orders" className="secondary-button">
              View Orders
            </Link>
          </div>
        </motion.section>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="container-width flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <ShoppingBag
          size={42}
          strokeWidth={1.3}
          className="text-[#78816b]"
        />

        <h1 className="mt-5 text-3xl font-medium text-[#292c25]">
          Your cart is empty
        </h1>

        <p className="mt-3 text-sm text-[#77796f]">
          Add some products before proceeding to checkout.
        </p>

        <Link to="/products" className="primary-button mt-7">
          Explore Products
        </Link>
      </main>
    )
  }

  return (
    <main className="container-width min-h-[70vh] py-10 sm:py-14">
      <Link
        to="/cart"
        className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#374432] hover:underline"
      >
        <ArrowLeft size={15} />
        Back to Shopping Bag
      </Link>

      <div className="mb-10">
        <p className="eyebrow">Almost yours</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-3 text-sm text-[#77796f]">
          Enter your delivery details to complete your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="border border-[#e5e4dc] bg-white p-5 sm:p-7">
              <h2 className="flex items-center gap-3 text-lg font-medium text-[#292c25]">
                <span className="flex h-8 w-8 items-center justify-center bg-[#e5eadf] text-sm">
                  1
                </span>
                Contact Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="fullName">
                    Full name *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    className={inputClass}
                    placeholder="Enter your full name"
                  />

                  {errors.fullName && (
                    <p className={errorClass}>{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={inputClass}
                    placeholder="you@example.com"
                  />

                  {errors.email && (
                    <p className={errorClass}>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    Mobile number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="10-digit mobile number"
                  />

                  {errors.phone && (
                    <p className={errorClass}>{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="border border-[#e5e4dc] bg-white p-5 sm:p-7">
              <h2 className="flex items-center gap-3 text-lg font-medium text-[#292c25]">
                <span className="flex h-8 w-8 items-center justify-center bg-[#e5eadf] text-sm">
                  2
                </span>
                Delivery Address
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className={labelClass} htmlFor="address">
                    House / Street address *
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    rows={3}
                    className={inputClass}
                    placeholder="House number, street, area and landmark"
                  />

                  {errors.address && (
                    <p className={errorClass}>{errors.address}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="city">
                      City *
                    </label>

                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      className={inputClass}
                      placeholder="Enter your city"
                    />

                    {errors.city && (
                      <p className={errorClass}>{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="state">
                      State *
                    </label>

                    <input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      className={inputClass}
                      placeholder="Enter your state"
                    />

                    {errors.state && (
                      <p className={errorClass}>{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="pincode">
                      PIN code *
                    </label>

                    <input
                      id="pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="postal-code"
                      className={inputClass}
                      placeholder="6-digit PIN code"
                    />

                    {errors.pincode && (
                      <p className={errorClass}>{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="border border-[#e5e4dc] bg-white p-5 sm:p-7">
              <h2 className="flex items-center gap-3 text-lg font-medium text-[#292c25]">
                <span className="flex h-8 w-8 items-center justify-center bg-[#e5eadf] text-sm">
                  3
                </span>
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 border border-[#deded5] p-4 transition hover:border-[#78816b]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mt-1 accent-[#374432]"
                  />

                  <span>
                    <span className="block text-sm font-medium">
                      Cash on Delivery
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#77796f]">
                      Pay when your order arrives.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 border border-[#deded5] p-4 transition hover:border-[#78816b]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={form.paymentMethod === 'online'}
                    onChange={handleChange}
                    className="mt-1 accent-[#374432]"
                  />

                  <span>
                    <span className="block text-sm font-medium">
                      UPI / Online Payment (Demo)
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#77796f]">
                      Demo selection only. No payment will be processed.
                    </span>
                  </span>
                </label>
              </div>
            </section>
          </div>

          <aside className="border border-[#e5e4dc] bg-white p-5 sm:p-7 lg:sticky lg:top-6">
            <h2 className="text-lg font-medium text-[#292c25]">
              Order Summary
            </h2>

            <div className="mt-6 max-h-72 space-y-4 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-20 w-16 shrink-0 bg-[#eeece5]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#374432] px-1 text-[10px] text-white">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-[#77796f]">
                      {item.category}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium">
                    ₹
                    {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[#e5e4dc] pt-5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#77796f]">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#77796f]">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between gap-3 border-t border-[#e5e4dc] pt-4 text-base font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-button mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-[#77796f]">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-[#78816b]"
              />
              <p>
                Your order is stored locally in this demo. No real payment is
                collected.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#77796f]">
              <Truck size={15} />
              Free shipping on orders over ₹2,999
            </div>
          </aside>
        </div>
      </form>
    </main>
  )
}
