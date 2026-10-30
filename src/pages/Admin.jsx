import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Edit3,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useShop } from '../context/ShopContext.jsx'
import { categories } from '../data/products.js'

const emptyForm = {
  name: '',
  category: 'Furniture',
  price: '',
  oldPrice: '',
  image: '',
  description: '',
  stock: '10',
  badge: '',
}

export default function Admin() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    showToast,
  } = useShop()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const totalValue = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0,
  )

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      category: product.category || 'Furniture',
      price: String(product.price ?? ''),
      oldPrice: String(product.oldPrice ?? ''),
      image: product.image || '',
      description: product.description || '',
      stock: String(product.stock ?? 10),
      badge: product.badge || '',
    })
    setErrors({})
    setModalOpen(true)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))

    setErrors(previous => ({
      ...previous,
      [name]: '',
    }))
  }

  function validateForm() {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Product name is required.'
    }

    if (!form.category) {
      nextErrors.category = 'Choose a category.'
    }

    if (form.price === '' || !Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      nextErrors.price = 'Enter a valid price greater than zero.'
    }

    if (
      form.oldPrice !== '' &&
      (!Number.isFinite(Number(form.oldPrice)) ||
        Number(form.oldPrice) < Number(form.price))
    ) {
      nextErrors.oldPrice = 'Original price must be at least the selling price.'
    }

    if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      nextErrors.stock = 'Stock must be a whole number of zero or more.'
    }

    if (!form.image.trim()) {
      nextErrors.image = 'Product image URL is required.'
    } else {
      try {
        const imageUrl = new URL(form.image.trim())

        if (!['http:', 'https:'].includes(imageUrl.protocol)) {
          nextErrors.image = 'Enter a valid HTTP or HTTPS image URL.'
        }
      } catch {
        nextErrors.image = 'Enter a valid image URL.'
      }
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Product description is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) return

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? Number(form.price) : Number(form.oldPrice),
      image: form.image.trim(),
      description: form.description.trim(),
      stock: Number(form.stock),
      badge: form.badge.trim(),
      rating: editingId
        ? products.find(product => product.id === editingId)?.rating || 4.5
        : 4.5,
      reviews: editingId
        ? products.find(product => product.id === editingId)?.reviews || 0
        : 0,
      featured: editingId
        ? products.find(product => product.id === editingId)?.featured || false
        : false,
    }

    if (editingId !== null) {
      updateProduct(editingId, productData)
      showToast('Product updated successfully.')
    } else {
      addProduct({
        ...productData,
        id: Date.now(),
      })
      showToast('Product added successfully.')
    }

    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
  }

  function handleDelete() {
    if (!deletingProduct) return

    deleteProduct(deletingProduct.id)
    showToast('Product deleted successfully.')
    setDeletingProduct(null)
  }

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
    },
    {
      label: 'Categories',
      value: new Set(products.map(product => product.category)).size,
      icon: ShoppingBag,
    },
    {
      label: 'Inventory Units',
      value: products.reduce(
        (total, product) => total + Number(product.stock || 0),
        0,
      ),
      icon: AlertTriangle,
    },
  ]

  return (
    <main className="container-width min-h-[70vh] py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Store management</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#292c25] sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-sm text-[#77796f]">
            Manage your products and keep your store organised.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="primary-button gap-2"
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="border border-[#e7e6de] bg-white p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#77796f]">{stat.label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9ede3] text-[#374432]">
                  <Icon size={19} strokeWidth={1.5} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-medium text-[#292c25]">
                {stat.value.toLocaleString('en-IN')}
              </p>
            </motion.article>
          )
        })}
      </div>

      <section className="mt-5 border border-[#e7e6de] bg-white p-5 sm:p-6">
        <p className="text-sm text-[#77796f]">Estimated inventory value</p>
        <p className="mt-2 text-2xl font-semibold text-[#374432]">
          ₹{totalValue.toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-xs text-[#85877c]">
          Calculated from selling price × stock quantity.
        </p>
      </section>

      <section className="mt-8 border border-[#e7e6de] bg-white">
        <div className="border-b border-[#e7e6de] p-5 sm:p-6">
          <h2 className="text-lg font-medium text-[#292c25]">
            Product Inventory
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_200px]">
            <div className="flex items-center gap-3 border border-[#deded5] px-4">
              <Search size={17} className="shrink-0 text-[#85877c]" />

              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search products..."
                className="min-h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
              aria-label="Filter products by category"
              className="min-h-11 border border-[#deded5] bg-white px-3 text-sm outline-none"
            >
              {['All', ...categories.filter(item => item !== 'All')].map(item => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Categories' : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={32} className="mx-auto text-[#85877c]" />
            <h3 className="mt-4 text-lg font-medium text-[#292c25]">
              No products found
            </h3>
            <p className="mt-2 text-sm text-[#77796f]">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e7e6de] bg-[#f8f8f4] text-[10px] uppercase tracking-wider text-[#77796f]">
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr
                    key={product.id}
                    className="border-b border-[#efeee8] last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 shrink-0 bg-[#eeece5] object-cover"
                        />

                        <div>
                          <p className="max-w-[230px] text-sm font-medium text-[#292c25]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-[#85877c]">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#77796f]">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#292c25]">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(product.stock || 0) === 0
                            ? 'bg-red-100 text-red-700'
                            : Number(product.stock || 0) < 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock ?? 'Not set'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          aria-label={`Edit ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center border border-[#deded5] text-[#374432] transition hover:bg-[#e9ede3]"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingProduct(product)}
                          aria-label={`Delete ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center border border-[#ead8d5] text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-[#e7e6de] px-5 py-4 text-xs text-[#77796f]">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#20251e]/55 p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setModalOpen(false)
          }}
        >
          <motion.section
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-[#faf9f6] p-5 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Inventory management</p>
                <h2
                  id="product-form-title"
                  className="mt-2 text-2xl font-medium text-[#292c25]"
                >
                  {editingId !== null ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
                className="flex h-9 w-9 items-center justify-center border border-[#deded5]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="productName" className="mb-2 block text-xs font-semibold">
                    Product name
                  </label>
                  <input
                    id="productName"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none focus:border-[#78816b]"
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="productCategory" className="mb-2 block text-xs font-semibold">
                    Category
                  </label>
                  <select
                    id="productCategory"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                  >
                    {categories.filter(item => item !== 'All').map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="productPrice" className="mb-2 block text-xs font-semibold">
                    Selling price (₹)
                  </label>
                  <input
                    id="productPrice"
                    name="price"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                    placeholder="1299"
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                </div>

                <div>
                  <label htmlFor="productOldPrice" className="mb-2 block text-xs font-semibold">
                    Original price (₹)
                  </label>
                  <input
                    id="productOldPrice"
                    name="oldPrice"
                    type="number"
                    min="1"
                    value={form.oldPrice}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                    placeholder="1599"
                  />
                  {errors.oldPrice && <p className="mt-1 text-xs text-red-600">{errors.oldPrice}</p>}
                </div>

                <div>
                  <label htmlFor="productStock" className="mb-2 block text-xs font-semibold">
                    Stock quantity
                  </label>
                  <input
                    id="productStock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                  />
                  {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
                </div>

                <div>
                  <label htmlFor="productBadge" className="mb-2 block text-xs font-semibold">
                    Badge (optional)
                  </label>
                  <input
                    id="productBadge"
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                    placeholder="Bestseller, New..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="productImage" className="mb-2 block text-xs font-semibold">
                  Image URL
                </label>
                <input
                  id="productImage"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  className="min-h-11 w-full border border-[#deded5] bg-white px-3 text-sm outline-none"
                  placeholder="https://example.com/product.jpg"
                />
                {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
              </div>

              <div>
                <label htmlFor="productDescription" className="mb-2 block text-xs font-semibold">
                  Description
                </label>
                <textarea
                  id="productDescription"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full resize-y border border-[#deded5] bg-white px-3 py-3 text-sm outline-none"
                  placeholder="Describe this product..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#e7e6de] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#20251e]/55 p-4">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md bg-white p-6 sm:p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 id="delete-product-title" className="mt-5 text-xl font-medium text-[#292c25]">
              Delete this product?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#77796f]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#292c25]">
                {deletingProduct.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="secondary-button"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </main>
  )
}