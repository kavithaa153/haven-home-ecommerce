import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetails() {
  const { id } = useParams()
  const { products, addToCart, wishlist, toggleWishlist } = useShop()
  const [quantity, setQuantity] = useState(1)

  const product = products.find(item => String(item.id) === id)
  const isWishlisted = product
    ? wishlist.some(item => item.id === product.id)
    : false

  if (!product) {
    return (
      <main className="container-width py-24 text-center">
        <p className="eyebrow">Product not found</p>
        <h1 className="mt-4 text-3xl font-medium">We couldn't find this product.</h1>
        <Link to="/products" className="primary-button mt-8">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
      </main>
    )
  }

  const relatedProducts = products
    .filter(item => item.category === product.category && item.id !== product.id)
    .slice(0, 4)

  function handleAddToCart() {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product)
    }
  }

  return (
    <main className="bg-[#faf9f6]">
      <div className="container-width py-7">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#85877c]">
          <Link to="/" className="hover:text-[#374432]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#374432]">Shop</Link>
          <span>/</span>
          <span className="text-[#374432]">{product.name}</span>
        </nav>

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden bg-[#eeece5]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/4.5] w-full object-cover"
            />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="py-2 md:py-6"
          >
            <p className="eyebrow">{product.category}</p>

            <h1 className="mt-4 text-3xl font-medium leading-tight tracking-tight text-[#292c25] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#77796f]">
              <span className="flex items-center gap-1">
                <Star size={15} fill="#a0a782" color="#a0a782" />
                {product.rating}
              </span>
              <span>({product.reviews} reviews)</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-[#292c25]">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {Number(product.oldPrice) > Number(product.price) && (
                <span className="text-base text-[#999a90] line-through">
                  ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                </span>
              )}
              {product.badge && (
                <span className="bg-[#e5eadf] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#374432]">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-7 text-[#77796f]">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider">
                Quantity
              </p>
              <div className="inline-flex h-12 items-center border border-[#deded5]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(current => Math.max(1, current - 1))}
                  className="flex h-full w-12 items-center justify-center hover:bg-[#eeeee7]"
                >
                  <Minus size={15} />
                </button>

                <span className="w-10 text-center text-sm">{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(current => Math.min(10, current + 1))}
                  className="flex h-full w-12 items-center justify-center hover:bg-[#eeeee7]"
                >
                  <Plus size={15} />
                </button>
              </div>
              <p className="mt-2 text-xs text-[#85877c]">Maximum 10 per order.</p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="primary-button flex-1"
              >
                <ShoppingBag size={17} />
                Add {quantity} to Bag
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="secondary-button"
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#374432' : 'none'}
                  color="#374432"
                />
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            <div className="mt-8 border-t border-[#e5e4dc] pt-5">
              <p className="text-sm font-medium text-[#374432]">Thoughtful delivery</p>
              <p className="mt-2 text-xs leading-6 text-[#77796f]">
                Free shipping on orders over ₹2,999. Product availability and delivery
                details can be confirmed during checkout.
              </p>
            </div>
          </motion.section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="section-padding">
            <p className="eyebrow">You may also like</p>
            <h2 className="section-title">More to make yourself at home.</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
              {relatedProducts.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}