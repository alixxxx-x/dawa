import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Search, ArrowRight, Pill, ShoppingBag, MapPin,
  Sparkles, Baby, Zap, Bandage, Smile, Scissors, Activity, Bone, Stethoscope, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CATEGORIES = [
  { key: 'dermo_cosmetics',  label: 'Dermo-cosmetics', icon: Sparkles, color: 'text-pink-500 bg-pink-50' },
  { key: 'baby_care',        label: 'Baby care',        icon: Baby,     color: 'text-blue-500 bg-blue-50' },
  { key: 'supplements',      label: 'Supplements',      icon: Zap,      color: 'text-yellow-500 bg-yellow-50' },
  { key: 'orthopedics',      label: 'Orthopedics',      icon: Bone,     color: 'text-orange-500 bg-orange-50' },
  { key: 'wound_care',       label: 'Wound care',       icon: Bandage,  color: 'text-red-500 bg-red-50' },
  { key: 'oral_hygiene',     label: 'Oral hygiene',     icon: Smile,    color: 'text-cyan-500 bg-cyan-50' },
  { key: 'hair_care',        label: 'Hair care',        icon: Scissors, color: 'text-purple-500 bg-purple-50' },
  { key: 'wellness_devices', label: 'Wellness',         icon: Activity, color: 'text-primary bg-primary/5' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function searchMedicine(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search/medicine?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ── */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">

          <Badge variant="outline" className="mb-4 py-1 px-4 text-primary border-primary/20 bg-primary/5 rounded-full animate-in fade-in slide-in-from-bottom-3 duration-500">
            Fast Medicine search across Algeria
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Your Medicine is <br />
            <span className="text-primary italic">One Click Away.</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            Search by molecule or brand name and know which nearby pharmacy has it in stock.
          </p>

          {/* Search bar */}
          <form
            onSubmit={searchMedicine}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Molecule or brand… (Metformin, Glucophage)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-full px-8 h-12 font-bold shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 border-none">
              Search <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground animate-in fade-in duration-1000">
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" />Constantine</span>
            <span className="opacity-30">·</span><span>Algiers</span>
            <span className="opacity-30">·</span><span>Oran</span>
            <span className="opacity-30">·</span><span>Annaba</span>
            <span className="opacity-30">·</span><span>+54 wilayas</span>
          </div>
        </div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Why use Dawa?</h2>
            <p className="text-muted-foreground">Built for Algerian patients and pharmacists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl shadow-foreground/5 bg-background hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                  <Search className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Real-time Availability</CardTitle>
                <CardDescription>Community-verified stock updated hourly.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Patients report what they found. The platform ranks the most reliable nearby pharmacies for any medicine.
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-foreground/5 bg-background hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
                  <Pill className="text-secondary h-6 w-6" />
                </div>
                <CardTitle className="text-xl">1 000+ Medicines</CardTitle>
                <CardDescription>Molecules, branded generics, and equivalents.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Search by DCI or commercial name. We link equivalents so you always find an alternative when your medicine is out of stock.
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-foreground/5 bg-background hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-2">
                  <ShieldCheck className="text-green-600 h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Trusted Pharmacies</CardTitle>
                <CardDescription>Verified pharmacist profiles and B2B exchange.</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Navigate across trusted and verified Pharmacies all across Algeria.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Parapharmacy products available for reservation and pickup.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.key}
                  to={`/search/products?category=${cat.key}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-tight">{cat.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-secondary rounded-4xl p-8 md:p-16 text-center text-white shadow-2xl shadow-secondary/30 overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                Are you a pharmacist?
              </h2>
              <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg font-medium">
                Join Dawa to manage your catalogue, reach more patients, and participate in the B2B exchange network across Algeria.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/pharmacist/login">
                  <Button size="lg" className="rounded-full px-10 h-14 font-black shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                    Access Pharmacist Portal
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-black border-white/20 text-white bg-transparent hover:bg-white/10">
                    Create Patient Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-100 h-100 bg-primary/15 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-75 h-75 bg-white/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
      </section>

    </div>
  )
}
