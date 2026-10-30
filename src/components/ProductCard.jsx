import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext'

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useShop()

  const isWishlisted = wishlist.some(
    item => item.id === product.id,
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      className="group min-w-0"
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

        {product.badge && (
          <span className="absolute left-3 top-3 bg-[#faf9f6] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={`Toggle wishlist for ${product.name}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition hover:scale-105"
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            fill={isWishlisted ? '#374432' : 'none'}
            color={isWishlisted ? '#374432' : '#45483f'}
          />
        </button>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-white py-3 text-xs font-semibold transition hover:bg-[#374432] hover:text-white sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <ShoppingBag size={15} />
          Add to bag
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 pt-4">
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#85877c]">
          {product.category}
        </span>

        <span className="flex items-center gap-1 text-[10px] text-[#6d705f]">
          <Star size={12} fill="#a0a782" color="#a0a782" />
          {product.rating}
        </span>
      </div>

      <Link to={`/products/${product.id}`}>
        <h3 className="mt-2 text-sm font-medium leading-5 transition hover:text-[#718064] sm:text-[15px]">
          {product.name}
        </h3>
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </span>

        {Number(product.oldPrice) > Number(product.price) && (
          <span className="text-xs text-[#999a90] line-through">
            ₹{Number(product.oldPrice).toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </motion.article>
  )
}