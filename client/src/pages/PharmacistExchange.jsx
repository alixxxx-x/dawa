import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Search, ArrowLeftRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getProducts, createReservation } from '../lib/api'

export default function PharmacistExchange() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [reserving, setReserving] = useState(null)
  const [success, setSuccess] = useState(null)

  const load = async (q = '') => {
    setLoading(true)
    const data = await getProducts({ b2b: 'true', ...(q ? { q } : {}) })
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleSearch(e) { e.preventDefault(); load(query) }

  async function reserve(productId) {
    setReserving(productId)
    const data = await createReservation(productId, 'b2b')
    setReserving(null)
    if (data?.id) {
      setSuccess(`Reservation #${data.id} sent. The pharmacy will confirm.`)
      setProducts(ps => ps.filter(p => p.id !== productId))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link to="/pharmacist/dashboard" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <span className="text-slate-200">|</span>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-800 text-sm">Inter-pharmacy exchange</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-4">
          Browse surplus stock from nearby pharmacies. Send a reservation request — the seller confirms in-app.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search surplus (Mustela, Avène, supplements…)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <Button type="submit" className="shrink-0 rounded-xl bg-secondary hover:bg-secondary/90 border-none px-6">Search</Button>
        </form>

        {success && (
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 text-sm text-primary mb-4 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {!loading && products.length === 0 && (
          <Card className="rounded-2xl border-dashed border-slate-200">
            <CardContent className="py-10 text-center">
              <ArrowLeftRight className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No surplus stock listed yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate text-base">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate font-medium">{p.brand}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    From:{' '}
                    <Link to={`/pharmacy/${p.pharmacy}`} className="text-primary hover:underline">
                      {p.pharmacy_name}
                    </Link>
                    {p.pharmacy_wilaya && ` · ${p.pharmacy_wilaya}`}
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {p.wholesale_price_dzd && (
                      <span className="text-base font-black text-primary">
                        {p.wholesale_price_dzd.toLocaleString()} <span className="text-xs">DZD</span>
                        <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-tighter">wholesale</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium italic">Retail: {p.price_dzd.toLocaleString()} DZD</span>
                    <Badge variant="blue" className="bg-blue-50 text-blue-600 border-none font-bold">B2B</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => reserve(p.id)}
                  disabled={reserving === p.id}
                  className="shrink-0 rounded-xl h-10 px-5 bg-secondary hover:bg-secondary/90 border-none font-bold text-xs"
                >
                  {reserving === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Order Stock'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
