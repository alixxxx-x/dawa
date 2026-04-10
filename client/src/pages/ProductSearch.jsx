import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search, ShoppingBag, Loader2,
  Sparkles, Baby, Zap, Bone, Bandage, Smile, Scissors, Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/lib/api'

const CATEGORIES = [
  { key: '',                 label: 'All',             icon: ShoppingBag },
  { key: 'dermo_cosmetics',  label: 'Dermo-cosmetics', icon: Sparkles },
  { key: 'baby_care',        label: 'Baby care',       icon: Baby },
  { key: 'supplements',      label: 'Supplements',     icon: Zap },
  { key: 'orthopedics',      label: 'Orthopedics',     icon: Bone },
  { key: 'wound_care',       label: 'Wound care',      icon: Bandage },
  { key: 'oral_hygiene',     label: 'Oral hygiene',    icon: Smile },
  { key: 'hair_care',        label: 'Hair care',       icon: Scissors },
  { key: 'wellness_devices', label: 'Wellness',        icon: Activity },
]

const STOCK_BADGE = {
  high:   { label: 'In stock',    className: 'bg-green-100 text-green-700' },
  medium: { label: 'Available',   className: 'bg-yellow-100 text-yellow-700' },
  low:    { label: 'Low stock',   className: 'bg-orange-100 text-orange-700' },
  out:    { label: 'Out of stock',className: 'bg-red-100 text-red-600' },
}

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (q = query, cat = category) => {
    setLoading(true)
    const params = {}
    if (q) params.q = q
    if (cat) params.category = cat
    const data = await getProducts(params)
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [category, query])

  useEffect(() => { load() }, [load])

  function handleSubmit(e) {
    e.preventDefault()
    const params = {}
    if (query) params.q = query
    if (category) params.category = category
    setSearchParams(params)
    load(query, category)
  }

  const activeCategory = CATEGORIES.find(c => c.key === category) || CATEGORIES[0]

  return (
    <div className="flex flex-col w-full">

      {/* ── Header ── */}
      <section className="py-10 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Parapharmacy</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-13">Browse and reserve products from verified pharmacies near you.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full">

        {/* ── Search ── */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products (Avène, Mustela…)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <Button type="submit" className="rounded-full px-8 h-11 font-bold bg-secondary hover:bg-secondary/90 border-none shadow-lg shadow-secondary/20">
            Search
          </Button>
        </form>

        {/* ── Category pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-6 px-6 sm:mx-0 sm:px-0">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const active = category === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  active
                    ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* ── Results header ── */}
        {!loading && products.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            {products.length} product{products.length > 1 ? 's' : ''} in <span className="text-foreground font-bold">{activeCategory.label}</span>
          </p>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-16 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading products…
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-foreground font-semibold mb-1">No products found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        )}

        {/* ── Product grid ── */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => {
              const stock = STOCK_BADGE[p.stock_level] || STOCK_BADGE.out
              return (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group flex flex-col bg-background rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {/* Top row: category badge + stock */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {p.category?.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stock.className}`}>
                      {stock.label}
                    </span>
                  </div>

                  {/* Name & brand */}
                  <p className="font-black text-foreground text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">{p.brand}</p>

                  {/* Footer: pharmacy + price */}
                  <div className="mt-auto flex items-end justify-between gap-2">
                    <p className="text-xs text-muted-foreground leading-tight line-clamp-2 flex-1">
                      {p.pharmacy_name}
                    </p>
                    <p className="text-sm font-black text-foreground shrink-0">
                      {p.price_dzd?.toLocaleString()}
                      <span className="text-[10px] font-normal text-muted-foreground ml-0.5">DZD</span>
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
