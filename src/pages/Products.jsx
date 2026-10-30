import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from "../components/ProductCard.jsx";
import { useShop } from '../context/ShopContext'
import { categories } from '../data/products'

export default function Products() {
  const { products } = useShop()
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All',
  )
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      const matchesCategory =
        category === 'All' || product.category === category

      const matchesMin =
        minPrice === '' || product.price >= Number(minPrice)

      const matchesMax =
        maxPrice === '' || product.price <= Number(maxPrice)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMin &&
        matchesMax
      )
    })

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }

    if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [products, search, category, minPrice, maxPrice, sort])

  function resetFilters() {
    setSearch('')
    setCategory('All')
    setMinPrice('')
    setMaxPrice('')
    setSort('featured')
  }

  return (
    <main className="container-width min-h-screen py-10 sm:py-14">
      <div className="border-b border-[#e5e3da] pb-8">
        <p className="eyebrow">The Haven collection</p>

        <h1 className="section-title">Objects for everyday living.</h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#77796f]">
          Explore thoughtful furniture, home decor, lighting, and textiles
          designed to make your space feel like home.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="flex min-h-12 flex-1 items-center gap-3 border border-[#deddd4] bg-white px-4">
            <Search size={18} className="shrink-0 text-[#7b7e72]" />

            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search furniture, decor, and more..."
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search products"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="secondary-button gap-2"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Hide filters' : 'Filters'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 py-8 lg:flex-row">
        <aside
          className={`shrink-0 lg:w-56 ${
            showFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="border-b border-[#e5e3da] pb-6">
            <h2 className="text-sm font-semibold">Categories</h2>

            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {categories.map(item => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-3 py-2 text-xs transition lg:w-full lg:text-left ${
                    category === item
                      ? 'bg-[#374432] text-white'
                      : 'bg-[#efeee8] text-[#55594f] hover:bg-[#e3e5da]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-[#e5e3da] py-6">
            <h2 className="text-sm font-semibold">Price range</h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs text-[#77796f]">
                Min price
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={event => setMinPrice(event.target.value)}
                  placeholder="₹0"
                  className="mt-2 w-full border border-[#deddd4] bg-white px-3 py-3 text-sm text-[#292c25] outline-none focus:border-[#718064]"
                />
              </label>

              <label className="text-xs text-[#77796f]">
                Max price
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={event => setMaxPrice(event.target.value)}
                  placeholder="₹50000"
                  className="mt-2 w-full border border-[#deddd4] bg-white px-3 py-3 text-sm text-[#292c25] outline-none focus:border-[#718064]"
                />
              </label>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="mt-5 text-xs font-semibold text-[#626c57] underline underline-offset-4"
          >
            Clear all filters
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-[#77796f]">
              Showing{' '}
              <span className="font-semibold text-[#292c25]">
                {filteredProducts.length}
              </span>{' '}
              products
            </p>

            <label className="flex items-center gap-3 text-xs text-[#77796f]">
              Sort by

              <select
                value={sort}
                onChange={event => setSort(event.target.value)}
                className="min-h-10 border border-[#deddd4] bg-white px-3 text-xs text-[#292c25] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="rating">Highest rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center bg-[#f0efe9] px-5 text-center">
              <Search size={30} strokeWidth={1.3} className="text-[#818577]" />

              <h2 className="mt-5 text-xl font-medium">
                No products found
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#77796f]">
                Try another search or adjust your category and price filters.
              </p>

              <button
                onClick={resetFilters}
                className="primary-button mt-5"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="border-t border-[#e5e3da] pt-6">
        <Link
          to="/"
          className="text-xs font-semibold text-[#626c57] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}