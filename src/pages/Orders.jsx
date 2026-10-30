import { Link } from 'react-router-dom'
import { ArrowRight, Package, ShoppingBag, Truck } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Orders() {
  const { orders, user } = useShop()

  const userOrders = user
    ? orders.filter(
        order => order.customer?.email?.toLowerCase() === user.email?.toLowerCase(),
      )
    : []

  function formatDate(date) {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function getStatusStyle(status) {
    const value = String(status || 'Processing').toLowerCase()

    if (value.includes('deliver')) {
      return 'bg-green-100 text-green-800'
    }

    if (value.includes('cancel')) {
      return 'bg-red-100 text-red-700'
    }

    if (value.includes('ship')) {
      return 'bg-blue-100 text-blue-700'
    }

    return 'bg-amber-100 text-amber-800'
  }

  if (!user) {
    return (
      <main className="container-width flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
          <Package size={32} strokeWidth={1.4} />
        </div>

        <h1 className="mt-6 text-3xl font-medium text-[#292c25]">
          Sign in to view your orders
        </h1>

        <p className="mt-3 text-sm text-[#77796f]">
          Your purchase history will appear here.
        </p>

        <Link to="/login" className="primary-button mt-7">
          Sign In
        </Link>
      </main>
    )
  }

  return (
    <main className="container-width min-h-[65vh] py-10 sm:py-14">
      <div className="mb-10">
        <p className="eyebrow">Your purchases</p>

        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
          My Orders
        </h1>

        <p className="mt-3 text-sm text-[#77796f]">
          View your orders and keep track of your purchases.
        </p>
      </div>

      {userOrders.length === 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center border border-[#e7e6de] bg-white px-6 py-16 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
            <ShoppingBag size={30} strokeWidth={1.4} />
          </div>

          <h2 className="mt-6 text-2xl font-medium text-[#292c25]">
            No orders yet
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#77796f]">
            Your shopping journey starts here. Discover something beautiful for
            your home.
          </p>

          <Link to="/products" className="primary-button mt-7">
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </motion.section>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order, index) => {
            const items = Array.isArray(order.items) ? order.items : []
            const orderId = order.id || order.orderNumber || `ORDER-${index + 1}`

            return (
              <motion.article
                key={orderId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-[#e7e6de] bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e6de] bg-[#f8f8f4] p-5 sm:px-7">
                  <div>
                    <p className="text-xs text-[#77796f]">Order number</p>

                    <h2 className="mt-1 text-sm font-semibold text-[#292c25]">
                      {orderId}
                    </h2>
                  </div>

                  <div>
                    <p className="text-xs text-[#77796f]">Order date</p>

                    <p className="mt-1 text-sm font-medium text-[#292c25]">
                      {formatDate(order.date || order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#77796f]">Order status</p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}
                    >
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-7">
                  {items.map((item, itemIndex) => (
                    <div
                      key={`${item.id || item.name}-${itemIndex}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name || 'Ordered product'}
                        className="h-20 w-20 shrink-0 bg-[#eeece5] object-cover sm:h-24 sm:w-24"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-[#292c25]">
                          {item.name || 'Product'}
                        </h3>

                        <p className="mt-2 text-xs text-[#77796f]">
                          Quantity: {Number(item.quantity) || 1}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#374432]">
                          ₹
                          {(
                            (Number(item.price) || 0) *
                            (Number(item.quantity) || 1)
                          ).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7e6de] pt-5">
                    <div className="flex items-center gap-2 text-sm text-[#77796f]">
                      <Truck size={17} />
                      <span>Delivery information</span>
                    </div>

                    <p className="text-lg font-semibold text-[#292c25]">
                      Total: ₹
                      {Number(order.total ?? order.totalAmount ?? 0).toLocaleString(
                        'en-IN',
                      )}
                    </p>
                  </div>

                  {order.customer?.address && (
                    <div className="border-t border-[#e7e6de] pt-4">
                      <p className="text-xs font-semibold text-[#292c25]">
                        Delivery address
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#77796f]">
                        {order.customer.address}
                        {order.customer.city ? `, ${order.customer.city}` : ''}
                        {order.customer.state ? `, ${order.customer.state}` : ''}
                        {order.customer.pincode ? ` - ${order.customer.pincode}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </main>
  )
}