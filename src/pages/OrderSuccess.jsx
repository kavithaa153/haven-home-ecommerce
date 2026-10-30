
import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { motion } from 'motion/react'

export default function OrderSuccess() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return <Navigate to="/orders" replace />
  }

  return (
    <main className="container-width flex min-h-[70vh] items-center justify-center py-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl border border-[#e7e5dc] bg-white px-6 py-12 text-center sm:px-12"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
          <CheckCircle2 size={42} strokeWidth={1.5} />
        </div>

        <p className="eyebrow mt-7">Thank you for your purchase</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Order confirmed!
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#77796f]">
          Your order has been placed successfully. Thank you for choosing
          Haven & Home.
        </p>

        <div className="mt-8 border border-[#e7e5dc] bg-[#faf9f6] p-5">
          <div className="flex items-center justify-center gap-2 text-sm text-[#77796f]">
            <Package size={18} />
            Order number
          </div>

          <p className="mt-2 break-all text-lg font-semibold text-[#374432]">
            {order.id || order.orderNumber || 'Order confirmed'}
          </p>

          <p className="mt-3 text-sm text-[#77796f]">
            Order total:{' '}
            <span className="font-semibold text-[#292c25]">
              ₹{Number(order.total ?? order.totalAmount ?? 0).toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/orders" className="primary-button">
            View My Orders
            <ArrowRight size={16} />
          </Link>

          <Link to="/products" className="secondary-button">
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>
      </motion.section>
    </main>
  )
}
