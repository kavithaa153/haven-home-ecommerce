import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useShop()

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <main className="container-width flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
          <ShoppingBag size={32} strokeWidth={1.4} />
        </div>

        <p className="eyebrow mt-7">Your shopping bag</p>

        <h1 className="mt-3 text-3xl font-medium text-[#292c25] sm:text-4xl">
          Your bag is waiting for something lovely.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-[#77796f]">
          Discover thoughtful furniture and beautiful home essentials for your space.
        </p>

        <Link to="/products" className="primary-button mt-8">
          Explore Products
        </Link>
      </main>
    )
  }

  return (
    <main className="container-width min-h-[65vh] py-10 sm:py-14">
      <div className="mb-10">
        <p className="eyebrow">Your selection</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
          Shopping Bag
        </h1>
        <p className="mt-3 text-sm text-[#77796f]">
          You have {cart.length} {cart.length === 1 ? 'product' : 'products'} in your bag.
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_350px]">
        <section>
          <div className="hidden grid-cols-[1fr_120px_110px] gap-4 border-b border-[#e5e4dc] pb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#85877c] sm:grid">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y divide-[#e5e4dc]">
            {cart.map(item => (
              <motion.article
                key={item.id}
                layout
                className="grid grid-cols-[88px_1fr] gap-4 py-6 sm:grid-cols-[100px_1fr]"
              >
                <Link
                  to={`/products/${item.id}`}
                  className="overflow-hidden bg-[#eeece5]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#85877c]">
                        {item.category}
                      </p>
                      <Link
                        to={`/products/${item.id}`}
                        className="mt-2 block text-sm font-medium text-[#292c25] hover:text-[#78816b] sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-sm font-semibold">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="shrink-0 p-2 text-[#85877c] transition hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex h-9 items-center border border-[#deded5]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-full w-9 items-center justify-center hover:bg-[#eeeee7]"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="w-8 text-center text-xs">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-full w-9 items-center justify-center hover:bg-[#eeeee7]"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="text-sm font-semibold sm:hidden">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <span className="hidden text-sm font-semibold sm:block">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <Link
            to="/products"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#374432] hover:underline"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>
        </section>

        <aside className="border border-[#e5e4dc] bg-white p-6 sm:p-7">
          <h2 className="text-lg font-medium text-[#292c25]">Order Summary</h2>

          <div className="mt-6 space-y-4 border-b border-[#e5e4dc] pb-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Subtotal</span>
              <span className="font-medium">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#77796f]">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? 'Free' : `₹${shipping}`}
              </span>
            </div>

            {subtotal > 0 && subtotal < 2999 && (
              <p className="text-xs leading-5 text-[#78816b]">
                Add ₹{(2999 - subtotal).toLocaleString('en-IN')} more to qualify for free shipping.
              </p>
            )}
          </div>

          <div className="flex justify-between gap-4 py-5">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-semibold">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to="/checkout"
            className="primary-button w-full"
          >
            Proceed to Checkout
          </Link>

          <p className="mt-4 text-center text-[11px] leading-5 text-[#85877c]">
            Shipping charges are estimated and may be confirmed at checkout.
          </p>
        </aside>
      </div>
    </main>
  )
}