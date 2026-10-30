import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop()

  function handleAddToCart(product) {
    addToCart(product)
    toggleWishlist(product)
  }

  if (wishlist.length === 0) {
    return (
      <main className="container-width flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
          <Heart size={32} strokeWidth={1.4} />
        </div>

        <p className="eyebrow mt-7">Your favourites</p>

        <h1 className="mt-3 text-3xl font-medium text-[#292c25] sm:text-4xl">
          Your wishlist is waiting.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-[#77796f]">
          Save the pieces you love and come back to them whenever you like.
        </p>

        <Link to="/products" className="primary-button mt-8">
          Explore Products
          <ArrowRight size={16} />
        </Link>
      </main>
    )
  }

  return (
    <main className="container-width min-h-[65vh] py-10 sm:py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your favourites</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-3 text-sm text-[#77796f]">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#374432] hover:underline"
        >
          Continue Shopping
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
        {wishlist.map(product => (
          <motion.article
            key={product.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0"
          >
            <div className="product-image-container relative overflow-hidden bg-[#eeece5]">
              <Link to={`/products/${product.id}`} className="block">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="product-image aspect-[4/4.7] w-full object-cover"
                />
              </Link>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={`Remove ${product.name} from wishlist`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition hover:scale-105"
              >
                <Trash2 size={16} strokeWidth={1.6} />
              </button>
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[#85877c]">
              {product.category}
            </p>

            <Link to={`/products/${product.id}`}>
              <h2 className="mt-2 text-sm font-medium leading-5 text-[#292c25] hover:text-[#78816b]">
                {product.name}
              </h2>
            </Link>

            <p className="mt-2 text-sm font-semibold">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </p>

            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              className="secondary-button mt-4 w-full gap-2"
            >
              <ShoppingBag size={15} />
              Add to Bag
            </button>
          </motion.article>
        ))}
      </div>
    </main>
  )
}