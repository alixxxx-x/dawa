import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search, ChevronLeft, Loader2, Pill, CheckCircle2, XCircle,
  MapPin, Phone, Clock, ShieldCheck, AlertCircle, Plus, ChevronDown, ChevronUp,
  Droplets, Syringe, Sparkles, Eye, FlaskConical, Wind, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchMedicines, getMedicinePharmacies, createReport } from '@/lib/api'
import { ACCESS_TOKEN } from '@/constants'

// ── Form helpers ─────────────────────────────────────────────────────────────
const FORM_CONFIG = {
  'comprimé':   { icon: Pill,        color: 'bg-primary/10 text-primary' },
  'tablet':     { icon: Pill,        color: 'bg-primary/10 text-primary' },
  'gélule':     { icon: Pill,        color: 'bg-violet-100 text-violet-600' },
  'capsule':    { icon: Pill,        color: 'bg-violet-100 text-violet-600' },
  'sirop':      { icon: Droplets,    color: 'bg-blue-100 text-blue-600' },
  'syrup':      { icon: Droplets,    color: 'bg-blue-100 text-blue-600' },
  'injectable': { icon: Syringe,     color: 'bg-red-100 text-red-500' },
  'injection':  { icon: Syringe,     color: 'bg-red-100 text-red-500' },
  'solution':   { icon: FlaskConical,color: 'bg-cyan-100 text-cyan-600' },
  'crème':      { icon: Sparkles,    color: 'bg-pink-100 text-pink-500' },
  'cream':      { icon: Sparkles,    color: 'bg-pink-100 text-pink-500' },
  'pommade':    { icon: Sparkles,    color: 'bg-pink-100 text-pink-500' },
  'collyre':    { icon: Eye,         color: 'bg-sky-100 text-sky-600' },
  'inhalateur': { icon: Wind,        color: 'bg-teal-100 text-teal-600' },
  'inhaler':    { icon: Wind,        color: 'bg-teal-100 text-teal-600' },
}

function getFormConfig(form) {
  if (!form) return { icon: Pill, color: 'bg-muted text-muted-foreground' }
  const key = Object.keys(FORM_CONFIG).find(k => form.toLowerCase().includes(k))
  return FORM_CONFIG[key] || { icon: Pill, color: 'bg-muted text-muted-foreground' }
}

const QUICK_SEARCHES = [
  'Metformine', 'Paracétamol', 'Amoxicilline', 'Ibuprofène',
  'Oméprazole', 'Atorvastatine', 'Amlodipine', 'Metronidazole',
]

const CONFIDENCE = {
  high:    { label: 'High',    className: 'bg-green-100 text-green-700' },
  medium:  { label: 'Medium',  className: 'bg-yellow-100 text-yellow-700' },
  low:     { label: 'Low',     className: 'bg-orange-100 text-orange-700' },
  unknown: { label: 'Unknown', className: 'bg-muted text-muted-foreground' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function isExpired(expiresAt) {
  return expiresAt && new Date(expiresAt) < new Date()
}

// ── Report Form ──────────────────────────────────────────────────────────────
function ReportForm({ pharmacyId, medicineId, onDone }) {
  const [status, setStatus] = useState('found')
  const [confidence, setConfidence] = useState('medium')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      await createReport(pharmacyId, medicineId, status, confidence)
      onDone()
    } catch {
      setError('Failed to submit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 p-4 bg-muted/40 rounded-xl border border-border space-y-3">
      <p className="text-xs font-bold text-foreground uppercase tracking-widest">Submit a report</p>
      <div className="flex gap-2">
        {['found', 'not_found'].map(s => (
          <button key={s} type="button" onClick={() => setStatus(s)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all ${
              status === s
                ? s === 'found' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            }`}>
            {s === 'found' ? <><CheckCircle2 className="w-3.5 h-3.5" /> Found</> : <><XCircle className="w-3.5 h-3.5" /> Not found</>}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {['high', 'medium', 'low'].map(c => (
          <button key={c} type="button" onClick={() => setConfidence(c)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all ${
              confidence === c ? 'bg-secondary text-white border-secondary' : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            }`}>
            {c}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" size="sm" disabled={submitting}
        className="w-full rounded-lg h-8 text-xs font-bold bg-secondary hover:bg-secondary/90 border-none">
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit Report'}
      </Button>
    </form>
  )
}

// ── Pharmacy Card ────────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, confidence, status, reported_at, expires_at, medicineId, isLoggedIn }) {
  const [showReport, setShowReport] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const conf = CONFIDENCE[confidence] || CONFIDENCE.unknown
  const expired = isExpired(expires_at)
  const found = status === 'found'

  return (
    <div className={`bg-background rounded-2xl border overflow-hidden transition-all ${
      expired ? 'border-border opacity-60' : found ? 'border-green-200 hover:border-green-300 hover:shadow-md' : 'border-red-100 hover:border-red-200 hover:shadow-md'
    }`}>
      {/* Status stripe */}
      <div className={`h-1 w-full ${found ? 'bg-green-400' : 'bg-red-400'}`} />

      <div className="p-5">
        {/* Name + verified */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/pharmacy/${pharmacy.id}`}
            className="font-black text-foreground hover:text-primary transition-colors leading-tight text-sm flex items-center gap-1.5">
            {pharmacy.name}
            {pharmacy.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
          </Link>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.className}`}>
            {conf.label}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{pharmacy.wilaya} · {pharmacy.address}</span>
        </div>

        {/* Phone & hours */}
        {(pharmacy.phone || pharmacy.hours) && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
            {pharmacy.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{pharmacy.phone}</span>}
            {pharmacy.hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pharmacy.hours}</span>}
          </div>
        )}

        {/* Status row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            {found
              ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            }
            <span className={`text-xs font-bold ${found ? 'text-green-600' : 'text-red-500'}`}>
              {found ? 'In stock' : 'Out of stock'}
            </span>
            <span className="text-xs text-muted-foreground">· {timeAgo(reported_at)}</span>
            {expired && <span className="text-[10px] text-orange-500 font-bold">(expired)</span>}
          </div>
          {pharmacy.lat && pharmacy.lng && (
            <a href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-primary font-bold hover:underline flex items-center gap-0.5">
              <MapPin className="w-3 h-3" />Map
            </a>
          )}
        </div>

        {/* Report */}
        {isLoggedIn && !submitted && (
          <div className="mt-3">
            <button onClick={() => setShowReport(v => !v)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary font-medium transition-colors">
              {showReport ? <ChevronUp className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showReport ? 'Cancel' : 'Report availability'}
            </button>
            {showReport && (
              <ReportForm pharmacyId={pharmacy.id} medicineId={medicineId}
                onDone={() => { setSubmitted(true); setShowReport(false) }} />
            )}
          </div>
        )}
        {submitted && (
          <p className="mt-3 text-xs text-green-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Report submitted — thank you!
          </p>
        )}
      </div>
    </div>
  )
}

// ── Medicine Card ────────────────────────────────────────────────────────────
function MedicineCard({ med, onSelect }) {
  const [showBrands, setShowBrands] = useState(false)
  const { icon: FormIcon, color } = getFormConfig(med.form)

  return (
    <div className="bg-background rounded-2xl border border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group">
      <button onClick={() => onSelect(med)} className="w-full text-left p-5">
        <div className="flex items-start gap-3 mb-3">
          {/* Form icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <FormIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-foreground group-hover:text-primary transition-colors leading-tight text-sm">
              {med.commercial_name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{med.inn}</p>
          </div>
        </div>

        {/* Form + dosage chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {med.form && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color} bg-opacity-60`}>
              {med.form}
            </span>
          )}
          {med.dosage && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {med.dosage}
            </span>
          )}
          {med.brands?.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {med.brands.length} brand{med.brands.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          See pharmacies <ArrowRight className="w-3 h-3" />
        </div>
      </button>

      {/* Brands row */}
      {med.brands?.length > 0 && (
        <div className="border-t border-border">
          <button onClick={() => setShowBrands(v => !v)}
            className="w-full flex items-center gap-1.5 px-5 py-2.5 text-xs text-muted-foreground hover:text-primary font-medium transition-colors">
            {showBrands ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showBrands ? 'Hide' : 'Show'} brand variants
          </button>
          {showBrands && (
            <div className="px-5 pb-4 flex flex-wrap gap-2">
              {med.brands.map(b => (
                <button key={b.id} onClick={() => onSelect(b)}
                  className="px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border">
                  {b.commercial_name}{b.dosage ? ` ${b.dosage}` : ''}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MedicineSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [medicines, setMedicines] = useState([])
  const [selected, setSelected] = useState(null)
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPharm, setLoadingPharm] = useState(false)
  const detailRef = useRef(null)
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN)

  const doSearch = useCallback(async (q) => {
    setLoading(true); setSelected(null); setPharmacies([])
    const data = await searchMedicines(q)
    setMedicines(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q) }
  }, [searchParams, doSearch])

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) { setSearchParams({ q: query.trim() }); doSearch(query.trim()) }
  }

  function quickSearch(term) {
    setQuery(term)
    setSearchParams({ q: term })
    doSearch(term)
  }

  async function selectMedicine(med) {
    setSelected(med); setLoadingPharm(true); setPharmacies([])
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    const data = await getMedicinePharmacies(med.id)
    setPharmacies(Array.isArray(data) ? data : [])
    setLoadingPharm(false)
  }

  const hasSearched = !!searchParams.get('q')
  const inStockCount = pharmacies.filter(p => p.status === 'found').length

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero / Search ── */}
      <section className="relative py-12 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(93,224,230,0.08),transparent)]" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <Pill className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Medicine search</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Find your medicine. <span className="text-primary italic">Now.</span>
          </h1>
          <p className="text-white/60 text-sm mb-6">
            Search 1 000+ molecules and brand names — see real-time stock across pharmacies.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Metformin, Glucophage, Amoxicillin…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <Button type="submit"
              className="rounded-full px-8 h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-lg shadow-primary/30">
              Search
            </Button>
          </form>

          {/* Quick search chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-white/40 self-center font-medium">Try:</span>
            {QUICK_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => quickSearch(term)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/70 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/30 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full">

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-16 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Searching medicines…
          </div>
        )}

        {/* ── No results ── */}
        {!loading && medicines.length === 0 && hasSearched && !selected && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
              <Pill className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-foreground font-semibold mb-1">No medicines found for "{searchParams.get('q')}"</p>
            <p className="text-sm text-muted-foreground mb-4">Try the molecule name (e.g. Metformine) or a brand (e.g. Glucophage)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_SEARCHES.slice(0, 4).map(term => (
                <button key={term} onClick={() => quickSearch(term)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-all">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Initial state ── */}
        {!loading && !hasSearched && (
          <div className="py-8">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Common searches</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_SEARCHES.map(term => (
                <button key={term} onClick={() => quickSearch(term)}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{term}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Medicine list ── */}
        {!loading && !selected && medicines.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground font-medium">
                <span className="text-foreground font-bold">{medicines.length}</span> result{medicines.length > 1 ? 's' : ''} for "{searchParams.get('q')}"
              </p>
              <p className="text-xs text-muted-foreground">Select a medicine to see pharmacies</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {medicines.map(med => (
                <MedicineCard key={med.id} med={med} onSelect={selectMedicine} />
              ))}
            </div>
          </div>
        )}

        {/* ── Pharmacy detail view ── */}
        {selected && (
          <div ref={detailRef}>
            <button
              onClick={() => { setSelected(null); setPharmacies([]) }}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to results
            </button>

            {/* Selected medicine banner */}
            <div className="relative bg-secondary rounded-2xl p-6 mb-6 overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-48 opacity-5">
                <Pill className="w-full h-full" />
              </div>
              <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getFormConfig(selected.form).color}`}>
                    {(() => { const Icon = getFormConfig(selected.form).icon; return <Icon className="w-6 h-6" /> })()}
                  </div>
                  <div>
                    <p className="font-black text-white text-xl leading-tight">{selected.commercial_name}</p>
                    <p className="text-white/60 text-sm mt-1">
                      {selected.inn}
                      {selected.form ? ` · ${selected.form}` : ''}
                      {selected.dosage ? ` · ${selected.dosage}` : ''}
                    </p>
                  </div>
                </div>
                {!isLoggedIn && (
                  <Link to="/login"
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-primary bg-white/10 border border-white/20 rounded-full px-3 py-1.5 transition-colors">
                    <AlertCircle className="w-3.5 h-3.5" /> Log in to report
                  </Link>
                )}
              </div>

              {/* Inline stats if data loaded */}
              {!loadingPharm && pharmacies.length > 0 && (
                <div className="relative z-10 flex gap-4 mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-bold text-white/60">
                    {pharmacies.length} report{pharmacies.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {inStockCount} in stock
                  </span>
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {pharmacies.length - inStockCount} out of stock
                  </span>
                </div>
              )}
            </div>

            {loadingPharm && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-16 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Finding pharmacies…
              </div>
            )}

            {!loadingPharm && pharmacies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-foreground font-semibold mb-1">No availability reports yet</p>
                <p className="text-sm text-muted-foreground mb-4">Be the first to report after visiting a pharmacy.</p>
                {!isLoggedIn && (
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="rounded-full text-xs font-bold">
                      Log in to submit a report
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {pharmacies.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pharmacies.map(({ pharmacy, confidence, status, reported_at, expires_at }) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    confidence={confidence}
                    status={status}
                    reported_at={reported_at}
                    expires_at={expires_at}
                    medicineId={selected.id}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
