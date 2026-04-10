import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  Store, 
  Loader2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  MapPin,
  CheckCircle2,
  Package,
  ArrowRight
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { getProduct, createReservation, getToken } from '../lib/api'

const STOCK_META = {
  high: { color: 'bg-green-500', text: 'High Stock', variant: 'default', bg: 'bg-green-50' },
  medium: { color: 'bg-amber-500', text: 'In Stock', variant: 'warning', bg: 'bg-amber-50' },
  low: { color: 'bg-orange-600', text: 'Limited Stock', variant: 'orange', bg: 'bg-orange-50' },
  out: { color: 'bg-red-500', text: 'Out of Stock', variant: 'destructive', bg: 'bg-red-50' }
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    getProduct(id)
      .then(data => { setProduct(data); setLoading(false) })
      .catch(() => { setLoading(false); setError('Failed to load product.') })
  }, [id])

  async function reserve() {
    if (!getToken()) { navigate('/login'); return }
    setReserving(true); setError('')
    try {
      const data = await createReservation(product.id, 'b2c')
      if (data?.id) navigate(`/reservation/${data.id}`)
      else setError('Could not create reservation. Please try again.')
    } catch {
      setError('An error occurred during reservation.')
    } finally {
      setReserving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-slate-500 font-medium animate-pulse">Fetching details...</p>
      </div>
    </div>
  )

  if (!product?.id) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">The product you're looking for might have been removed or moved.</p>
        <Button onClick={() => navigate('/search/products')}>Back to Search</Button>
      </div>
    </div>
  )

  const meta = STOCK_META[product.stock_level] || STOCK_META.out

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/search/products" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to search
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
          >
            <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
              {product.photo_url ? (
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  src={product.photo_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <Package className="w-16 h-16 text-slate-200" />
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <Badge className={`${meta.bg} ${meta.color.replace('bg-', 'text-')} border-none px-3 py-1 shadow-sm`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${meta.color} mr-2`} />
                  {meta.text}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-primary font-bold tracking-wider text-xs uppercase">{product.category ? product.category.replace('_', ' ') : 'General'}</p>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>
                {product.brand && (
                  <p className="text-lg text-slate-500 font-medium">{product.brand}</p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                  {product.price_dzd?.toLocaleString()}
                  <span className="text-lg font-bold text-slate-400">DZD</span>
                </p>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Description or Specs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Product Info</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description || `High-quality ${product.name} available at ${product.pharmacy_name}. This product is stored under regulated conditions to ensure maximum efficacy.`}
              </p>
            </div>

            {/* Seller Card */}
            <Link to={`/pharmacy/${product.pharmacy}`} className="block group">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Sold by</p>
                    <p className="text-base font-bold text-slate-900">{product.pharmacy_name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {product.pharmacy_wilaya}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Action Section */}
            <div className="space-y-4 pt-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <Button
                  onClick={reserve}
                  disabled={product.stock_level === 'out' || reserving}
                  className={`w-full h-14 text-lg font-bold rounded-2xl transition-all ${
                    product.stock_level !== 'out' 
                      ? 'bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 hover:shadow-secondary/30' 
                      : ''
                  }`}
                >
                  {reserving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Reserving...
                    </div>
                  ) : product.stock_level === 'out' ? (
                    'Out of stock'
                  ) : (
                    'Reserve for pickup'
                  )}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-3 py-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    2-Hour Hold
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-3 py-2 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Pay in Store
                  </div>
                </div>
              </div>
            </div>

            {/* Features/Trust */}
            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p>Authentic products only</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p>Pharmacist verified</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Scroll to top decorative element */}
      <div className="h-20" />
    </div>
  )
}
