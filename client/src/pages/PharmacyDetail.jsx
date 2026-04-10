import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, ShieldCheck, Pill, ShoppingBag, ChevronLeft, Loader2, CheckCircle2, XCircle, Navigation } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getPharmacy, getPharmacyProducts, getPharmacyAvailability } from '../lib/api'

const CONFIDENCE_VARIANT = { high: 'default', medium: 'warning', low: 'orange', unknown: 'secondary' }
const STOCK_VARIANT       = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }
const STOCK_LABEL         = { high: 'In stock', medium: 'Available', low: 'Low stock', out: 'Out of stock' }

export default function PharmacyDetail() {
  const { id } = useParams()
  const [pharmacy, setPharmacy] = useState(null)
  const [tab, setTab] = useState('medicines')
  const [products, setProducts] = useState([])
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ph, prods, avail] = await Promise.all([
        getPharmacy(id), getPharmacyProducts(id), getPharmacyAvailability(id),
      ])
      setPharmacy(ph)
      setProducts(Array.isArray(prods) ? prods : [])
      setAvailability(Array.isArray(avail) ? avail : [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading pharmacy info…</p>
      </div>
    </div>
  )

  if (!pharmacy) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 font-medium">Pharmacy not found.</p>
        <Link to="/search/medicine">
          <Button variant="link" className="mt-2">Back to Search</Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <Link to="/search/medicine" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Search
        </Link>

        {/* Header card */}
        <Card className="mb-8 rounded-3xl border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{pharmacy.name}</h1>
                    {pharmacy.is_verified && (
                      <Badge variant="default" className="gap-1.5 px-3 py-1 font-bold bg-primary/10 text-primary border-none">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-slate-500 mt-3 font-medium">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                    <span className="text-sm leading-relaxed">{pharmacy.address}, {pharmacy.wilaya}</span>
                  </div>
                  {pharmacy.hours && (
                    <div className="flex items-center gap-2 mt-2 font-bold text-primary text-[10px] uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded w-fit">
                      {pharmacy.hours}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
              {pharmacy.phone && (
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="flex-1 flex items-center justify-center gap-2.5 py-5 text-sm text-primary hover:bg-white transition-all font-bold group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  {pharmacy.phone}
                </a>
              )}
              {pharmacy.lat && pharmacy.lng && (
                <a
                  href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-5 text-sm text-primary hover:bg-white transition-all font-bold group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Navigation className="w-4 h-4" />
                  </div>
                  Navigate
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tab switcher */}
        <div className="flex gap-2 bg-slate-100/50 rounded-2xl p-1.5 mb-6">
          <button
            onClick={() => setTab('medicines')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
              tab === 'medicines' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Pill className="w-4.5 h-4.5" /> Medicines
          </button>
          <button
            onClick={() => setTab('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
              tab === 'shop' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" /> Shop
          </button>
        </div>

        {/* Content area */}
        <div className="space-y-3">
          {tab === 'medicines' ? (
            availability.length === 0 ? (
              <Card className="rounded-2xl border-dashed border-slate-200"><CardContent className="py-16 text-center">
                <p className="text-slate-400 text-sm font-medium">No availability reports yet.</p>
              </CardContent></Card>
            ) : (
              availability.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{r.medicine_name}</p>
                    <div className="flex items-center gap-2 mt-1.5 font-medium">
                      {r.status === 'found'
                        ? <CheckCircle2 className="w-4 h-4 text-primary" />
                        : <XCircle className="w-4 h-4 text-red-500" />
                      }
                      <span className="text-xs text-slate-400">
                        {r.status === 'found' ? 'Found' : 'Not found'} · {new Date(r.reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={CONFIDENCE_VARIANT[r.confidence] || 'secondary'} className="shrink-0 font-bold px-2.5 py-1">
                    {r.confidence}
                  </Badge>
                </div>
              ))
            )
          ) : (
            products.length === 0 ? (
              <Card className="rounded-2xl border-dashed border-slate-200"><CardContent className="py-16 text-center">
                <p className="text-slate-400 text-sm font-medium">No products listed yet.</p>
              </CardContent></Card>
            ) : (
              products.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all border border-slate-100 gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate font-medium">{p.brand}</p>
                    <div className="mt-2">
                      <Badge variant={STOCK_VARIANT[p.stock_level]} className="font-bold border-none px-2.5 py-0.5">{STOCK_LABEL[p.stock_level]}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-slate-900 text-base">
                      {p.price_dzd.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">DZD</p>
                  </div>
                </Link>
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
}
