
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { initialProducts } from '../data/products.js'

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return false
  }

  return true
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() =>
    readStorage('haven_products', initialProducts),
  )

  const [cart, setCart] = useState(() =>
    readStorage('haven_cart', []),
  )

  const [wishlist, setWishlist] = useState(() =>
    readStorage('haven_wishlist', []),
  )

  const [user, setUser] = useState(() =>
    readStorage('haven_user', null),
  )

  const [orders, setOrders] = useState(() =>
    readStorage('haven_orders', []),
  )

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    writeStorage('haven_products', products)
  }, [products])

  useEffect(() => {
    writeStorage('haven_cart', cart)
  }, [cart])

  useEffect(() => {
    writeStorage('haven_wishlist', wishlist)
  }, [wishlist])

  useEffect(() => {
    writeStorage('haven_user', user)
  }, [user])

  useEffect(() => {
    writeStorage('haven_orders', orders)
  }, [orders])

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current)
      }
    }
  }, [])

  function showToast(message, type = 'success') {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current)
    }

    setToast({ message, type })

    toastTimer.current = window.setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 2800)
  }

  function addToCart(product, quantity = 1) {
    const amount = Number(quantity)

    if (!product || !Number.isInteger(amount) || amount < 1) {
      showToast('Please select a valid quantity.', 'error')
      return
    }

    setCart(current => {
      const existing = current.find(item => item.id === product.id)

      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
      }

      return [...current, { ...product, quantity: amount }]
    })

    showToast(`${product.name} added to cart`)
  }

  function updateQuantity(productId, quantity) {
    const amount = Number(quantity)

    if (!Number.isInteger(amount) || amount < 1) {
      removeFromCart(productId)
      return
    }

    setCart(current =>
      current.map(item =>
        item.id === productId
          ? { ...item, quantity: amount }
          : item,
      ),
    )
  }

  function removeFromCart(productId) {
    setCart(current => current.filter(item => item.id !== productId))
    showToast('Item removed from cart')
  }

  function toggleWishlist(product) {
    if (!product) return

    setWishlist(current => {
      const exists = current.some(item => item.id === product.id)

      if (exists) {
        showToast('Removed from wishlist')
        return current.filter(item => item.id !== product.id)
      }

      showToast('Added to wishlist')
      return [...current, product]
    })
  }

  function addProduct(product) {
    const price = Number(product.price)
    const oldPrice = Number(product.oldPrice || product.price)

    if (!product.name?.trim() || !Number.isFinite(price) || price <= 0) {
      showToast('Enter a valid product name and price.', 'error')
      return
    }

    const newProduct = {
      ...product,
      id: Date.now(),
      name: product.name.trim(),
      price,
      oldPrice: Number.isFinite(oldPrice) ? oldPrice : price,
      rating: Number(product.rating || 5),
      reviews: Number(product.reviews || 0),
      featured: true,
    }

    setProducts(current => [newProduct, ...current])
    showToast('Product added successfully')
  }

  function updateProduct(productId, updatedProduct) {
    const price = Number(updatedProduct.price)

    if (
      !updatedProduct.name?.trim() ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      showToast('Enter a valid product name and price.', 'error')
      return
    }

    setProducts(current =>
      current.map(product =>
        product.id === productId
          ? {
              ...product,
              ...updatedProduct,
              name: updatedProduct.name.trim(),
              price,
              oldPrice: Number(updatedProduct.oldPrice || price),
            }
          : product,
      ),
    )

    showToast('Product updated successfully')
  }

  function deleteProduct(productId) {
    setProducts(current =>
      current.filter(product => product.id !== productId),
    )

    showToast('Product deleted successfully')
  }

  const cartCount = cart.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  )

  const subtotal = cart.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )

  const value = {
    products,
    setProducts,
    cart,
    setCart,
    wishlist,
    setWishlist,
    user,
    setUser,
    orders,
    setOrders,
    toast,
    showToast,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    addProduct,
    updateProduct,
    deleteProduct,
    cartCount,
    subtotal,
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)

  if (!context) {
    throw new Error('useShop must be used inside ShopProvider')
  }

  return context
}
