import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, Package, AlertCircle, X, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProducts, createProduct, updateProduct, deleteProduct, getMe } from '@/lib/api'

const CATEGORIES = [
  { key: 'dermo_cosmetics',  label: 'Dermo-cosmetics' },
  { key: 'baby_care',        label: 'Baby care' },
  { key: 'supplements',      label: 'Supplements' },
  { key: 'orthopedics',      label: 'Orthopedics' },
  { key: 'wound_care',       label: 'Wound care' },
  { key: 'oral_hygiene',     label: 'Oral hygiene' },
  { key: 'hair_care',        label: 'Hair care' },
  { key: 'wellness_devices', label: 'Wellness' },
]

const STOCK_OPTIONS = [
  { key: 'high',   label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low',    label: 'Low' },
  { key: 'out',    label: 'Out of stock' },
]

const STOCK_VARIANT = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }
const STOCK_LABEL   = { high: 'In stock', medium: 'Medium', low: 'Low stock', out: 'Out of stock' }

const EMPTY_FORM = {
  name: '', brand: '', category: 'dermo_cosmetics',
  price_dzd: '', wholesale_price_dzd: '',
  stock_level: 'medium', is_b2b_listed: false, photo_url: '',
}

export default function PharmacistCatalogue() {
  const [products, setProducts]     = useState([])
  const [pharmacyId, setPharmacyId] = useState(null)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [editId, setEditId]         = useState(null)
  const [saving, setSaving]         = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    getMe().then(u => {
      if (u?.pharmacy) {
        setPharmacyId(u.pharmacy)
        getProducts({ pharmacy: u.pharmacy }).then(data => {
          setProducts(Array.isArray(data) ? data : [])
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  function field(key, value) { setForm(f => ({ ...f, [key]: value })) }

  function openNew()   { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }
  function openEdit(p) {
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price_dzd: p.price_dzd, wholesale_price_dzd: p.wholesale_price_dzd || '',
      stock_level: p.stock_level, is_b2b_listed: p.is_b2b_listed, photo_url: p.photo_url || '',
    })
    setEditId(p.id)
    setShowForm(true)
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price_dzd: parseInt(form.price_dzd),
      wholesale_price_dzd: form.wholesale_price_dzd ? parseInt(form.wholesale_price_dzd) : null,
    }
    const data = editId ? await updateProduct(editId, payload) : await createProduct(payload)
    if (data?.id) {
      setProducts(ps => editId ? ps.map(p => p.id === data.id ? data : p) : [data, ...ps])
      setShowForm(false)
    }
    setSaving(false)
  }

  async function remove(id) {
    await deleteProduct(id)
    setProducts(ps => ps.filter(p => p.id !== id))
  }

  async function toggleStock(p) {
    const newLevel = p.stock_level === 'out' ? 'medium' : 'out'
    const updated = await updateProduct(p.id, { stock_level: newLevel })
    if (updated?.id) setProducts(ps => ps.map(x => x.id === updated.id ? updated : x))
  }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading catalogue…</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col w-full">

      {/* ── Header ── */}
      <section className="relative py-10 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(93,224,230,0.08),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link to="/pharmacist/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 uppercase tracking-widest hover:text-white/80 transition-colors mb-2">
                <ChevronLeft className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Pharmacist Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">My Catalogue</h1>
              <p className="text-white/50 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            </div>
            <Button
              onClick={openNew}
              className="rounded-full h-10 px-5 font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none text-xs gap-2 self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Add product
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full">

        {/* Pharmacy not linked warning */}
        {!pharmacyId && (
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Your account is not linked to a pharmacy yet. Please contact support.
          </div>
        )}

        {/* ── Add / Edit modal ── */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto border border-border shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <h2 className="font-black text-foreground text-base">{editId ? 'Edit product' : 'Add product'}</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={save} className="p-6 space-y-4">
                <div>
                  <Label htmlFor="f-name">Product name *</Label>
                  <Input id="f-name" value={form.name} onChange={e => field('name', e.target.value)} required placeholder="e.g. Sensibio H2O" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="f-brand">Brand</Label>
                  <Input id="f-brand" value={form.brand} onChange={e => field('brand', e.target.value)} placeholder="e.g. Bioderma" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="f-cat">Category</Label>
                  <select
                    id="f-cat"
                    value={form.category}
                    onChange={e => field('category', e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="f-price">Retail price (DZD) *</Label>
                    <Input id="f-price" type="number" value={form.price_dzd} onChange={e => field('price_dzd', e.target.value)} required min={0} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="f-ws">Wholesale (DZD)</Label>
                    <Input id="f-ws" type="number" value={form.wholesale_price_dzd} onChange={e => field('wholesale_price_dzd', e.target.value)} min={0} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="f-stock">Stock level</Label>
                  <select
                    id="f-stock"
                    value={form.stock_level}
                    onChange={e => field('stock_level', e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {STOCK_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="f-photo">Photo URL</Label>
                  <Input id="f-photo" value={form.photo_url} onChange={e => field('photo_url', e.target.value)} placeholder="https://…" className="mt-1" />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={form.is_b2b_listed}
                    onChange={e => field('is_b2b_listed', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm text-foreground">List on inter-pharmacy exchange</span>
                </label>
                <Button type="submit" disabled={saving} className="w-full rounded-full font-bold bg-primary hover:bg-primary/90 border-none text-primary-foreground">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : editId ? 'Save changes' : 'Add product'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── Product list ── */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-background rounded-2xl border border-border">
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-foreground font-semibold mb-1">Your catalogue is empty</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first product to get started.</p>
            <Button onClick={openNew} size="sm" className="rounded-full text-xs font-bold bg-secondary border-none">
              Add your first product
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="bg-background rounded-2xl border border-border p-5 flex items-start justify-between gap-4 hover:border-primary/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-black text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{p.brand}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-sm font-black text-foreground">
                      {p.price_dzd?.toLocaleString()}
                      <span className="text-[10px] font-normal text-muted-foreground ml-0.5">DZD</span>
                    </span>
                    <Badge variant={STOCK_VARIANT[p.stock_level]}>{STOCK_LABEL[p.stock_level]}</Badge>
                    {p.is_b2b_listed && <Badge variant="blue">B2B</Badge>}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {p.category?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStock(p)}
                    className="text-xs px-3 rounded-full h-8 font-bold border-border"
                  >
                    {p.stock_level === 'out' ? 'In stock' : 'Mark out'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                    className="rounded-full h-8 w-8 p-0 border-border hover:border-primary/40 hover:text-primary"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(p.id)}
                    className="rounded-full h-8 w-8 p-0 border-border hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
