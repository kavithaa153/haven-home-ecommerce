import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Leaf, Truck, ShieldCheck, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import ProductCard from '../components/ProductCard.jsx'
import { useShop } from '../context/ShopContext.jsx'

const collections = [
  {
    title: 'Furniture',
    subtitle: 'Made for living',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85',
    link: '/products?category=Furniture',
  },
  {
    title: 'Home Decor',
    subtitle: 'Details that matter',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    link: '/products?category=Decor',
  },
  {
    title: 'Soft Furnishings',
    subtitle: 'Comfort in every layer',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=85',
    link: '/products?category=Textiles',
  },
]

const benefits = [
  {
    icon: Leaf,
    title: 'Thoughtfully sourced',
    description: 'Considered materials and designs made for everyday living.',
  },
  {
    icon: Truck,
    title: 'Careful delivery',
    description: 'Your favourite finds, delivered with care to your doorstep.',
  },
  {
    icon: ShieldCheck,
    title: 'Shopping made simple',
    description: 'A straightforward shopping experience from start to finish.',
  },
  {
    icon: Heart,
    title: 'Made to feel like home',
    description: 'Beautiful essentials chosen to make your space feel personal.',
  },
]

export default function Home() {
  const { products } = useShop()

  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4)

  return (
    <main>
      <section className="relative overflow-hidden bg-[#eeece4]">
        <div className="grid min-h-[540px] lg:min-h-[650px] lg:grid-cols-2">
          <div className="order-2 flex items-center px-6 py-14 sm:px-12 lg:order-1 lg:px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto w-full max-w-xl"
            >
              <p className="eyebrow">
                A slower, softer way of living
              </p>

              <h1 className="mt-5 max-w-lg text-[43px] font-medium leading-[1.06] tracking-[-0.065em] text-[#30382d] sm:text-6xl xl:text-[70px]">
                Make room for
                <span className="block font-light italic text-[#858d76]">
                  what matters.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#6e7166] sm:text-base">
                Discover thoughtfully designed furniture and home essentials
                that turn everyday moments into something special.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products" className="primary-button">
                  Explore the collection
                  <ArrowRight size={16} />
                </Link>

                <a href="#story" className="secondary-button">
                  Our philosophy
                </a>
              </div>

              <div className="mt-12 flex items-center gap-4 border-t border-[#d7d7cc] pt-6">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-[#eeece4] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-[#eeece4] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80"
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-[#eeece4] object-cover"
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#374432]">
                    Made for your everyday
                  </div>
                  <p className="mt-1 text-xs text-[#77796f]">
                    Little details. Lasting comfort.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative order-1 min-h-[320px] overflow-hidden lg:order-2 lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90"
              alt="Warm and welcoming contemporary living room"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

            <div className="absolute bottom-6 right-6 bg-[#faf9f6]/95 px-5 py-4 sm:bottom-10 sm:right-10">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#858d76]">
                The art of home
              </p>
              <p className="mt-1 text-sm font-medium text-[#30382d]">
                Spaces that feel like you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e9e7df] bg-[#faf9f6]">
        <div className="container-width grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          {benefits.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon
                size={20}
                strokeWidth={1.4}
                className="shrink-0 text-[#7c876e]"
              />
              <span className="text-[11px] font-medium text-[#55594e] sm:text-xs">
                {title}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding container-width">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Find your favourites</p>
            <h2 className="section-title">Shop by collection</h2>
            <p className="mt-3 text-sm text-[#77796f]">
              Thoughtful pieces for every corner of your home.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#374432] hover:text-[#78816b]"
          >
            Explore all collections
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-[#eeece5]"
            >
              <Link to={collection.link} className="block">
                <div className="product-image-container relative overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    loading="lazy"
                    className="product-image aspect-[4/4.6] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white sm:p-7">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/80">
                        {collection.subtitle}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
                        {collection.title}
                      </h3>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 transition group-hover:bg-white group-hover:text-[#30382d]">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#f0f0e8] py-16 sm:py-20">
        <div className="container-width">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">A few things we love</p>
              <h2 className="section-title">Pieces to live with</h2>
              <p className="mt-3 text-sm text-[#77796f]">
                Everyday essentials, chosen with care.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#374432] hover:text-[#78816b]"
            >
              View all products
              <ArrowRight size={15} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-[#77796f]">
              New favourites are on their way.
            </p>
          )}
        </div>
      </section>

      <section id="story" className="section-padding container-width">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="product-image-container overflow-hidden bg-[#eeece5]">
            <img
              src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=85"
              alt="Natural textures and carefully chosen home furnishings"
              loading="lazy"
              className="product-image aspect-[5/4] w-full object-cover"
            />
          </div>

          <div className="max-w-lg">
            <p className="eyebrow">Our philosophy</p>

            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.055em] text-[#30382d] sm:text-5xl">
              A home isn't
              <span className="block font-light italic text-[#858d76]">
                just a place.
              </span>
              It's a feeling.
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#77796f]">
              We believe the best spaces are built slowly, with pieces you
              love and details that mean something. Haven & Home brings
              together considered designs, natural textures, and everyday
              essentials to help make your home feel more like you.
            </p>

            <Link to="/products" className="primary-button mt-7">
              Discover our collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-width pb-16">
        <div className="grid gap-6 bg-[#dfe5d8] px-6 py-10 sm:grid-cols-2 sm:items-center sm:px-10 lg:px-14">
          <div>
            <p className="eyebrow">A note from us</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#30382d] sm:text-4xl">
              Good things feel like home.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#62695b]">
              Find your next favourite piece and make more room for the
              everyday moments that matter.
            </p>
          </div>

          <div className="sm:justify-self-end">
            <Link to="/products" className="primary-button">
              Shop the collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}