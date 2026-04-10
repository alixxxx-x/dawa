import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, MapPin, Phone, LogOut, ShoppingBag, Loader2,
  Shield, CheckCircle2, Calendar, Settings, Stethoscope,
  Clock, LayoutDashboard, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getMe, getReservations, logout } from '@/lib/api'

const STATUS_STYLE = {
  pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMe(), getReservations()]).then(([u, r]) => {
      setUser(u)
      setReservations(Array.isArray(r) ? r : [])
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      navigate('/login')
    })
  }, [navigate])

  function handleLogout() { logout(); navigate('/login') }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading your profile…</p>
      </div>
    </div>
  )

  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-lg text-muted-foreground mb-6 font-medium">Unable to load profile data.</p>
      <Button onClick={() => navigate('/')} className="rounded-full px-8 font-bold bg-secondary border-none">
        Return Home
      </Button>
    </div>
  )

  const initials = (user.name || user.phone || 'U').charAt(0).toUpperCase()
  const isPharmacist = user.role === 'pharmacist'
  const pendingCount = reservations.filter(r => r.status === 'pending').length

  return (
    <div className="flex flex-col w-full">

      {/* ── Header Banner ── */}
      <section className="relative py-10 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(93,224,230,0.08),transparent)]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                {user.name || user.phone}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                  isPharmacist ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/80'
                }`}>
                  {isPharmacist ? 'Pharmacist' : 'Patient'}
                </span>
                {user.created_at && (
                  <span className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isPharmacist && (
                <Link to="/pharmacist/dashboard">
                  <Button className="rounded-full h-10 px-5 font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none text-xs gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full h-10 px-5 font-bold border-white/20 text-white bg-transparent hover:bg-white/10 text-xs gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Contact card */}
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3 pt-5 px-5">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-5 pb-5 space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Phone Number</span>
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    {user.phone || <span className="text-muted-foreground italic font-normal">Not provided</span>}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">Wilaya</span>
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {user.wilaya || <span className="text-muted-foreground italic font-normal">Not specified</span>}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Status card */}
            <div className="bg-secondary rounded-2xl p-6 text-white shadow-xl shadow-secondary/20 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                {isPharmacist
                  ? <Stethoscope className="w-32 h-32" />
                  : <Shield className="w-32 h-32" />
                }
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-white">
                    {isPharmacist ? 'Pharmacist Account' : 'Verified Account'}
                  </h4>
                </div>
                <Separator className="bg-white/20 mb-3" />
                <p className="text-white/70 text-sm leading-relaxed">
                  {isPharmacist
                    ? 'You have access to the pharmacist portal to manage your catalogue and reservations.'
                    : 'Your account is active and you can reserve products from verified pharmacies across Algeria.'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Main Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Account overview */}
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border pb-5 pt-6 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-foreground">Account Overview</CardTitle>
                    <CardDescription className="text-sm mt-0.5">Your Dawa profile details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </span>
                  <p className="text-foreground font-semibold text-sm ml-5">
                    {user.name || <span className="text-muted-foreground italic font-normal">Not set</span>}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </span>
                  <p className="text-foreground font-semibold text-sm ml-5">{user.phone}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Wilaya
                  </span>
                  <p className="text-foreground font-semibold text-sm ml-5">
                    {user.wilaya || <span className="text-muted-foreground italic font-normal">Not specified</span>}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Role
                  </span>
                  <p className="text-foreground font-semibold text-sm ml-5 capitalize">{user.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reservations */}
            <section className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-foreground">My Reservations</p>
                    <p className="text-xs text-muted-foreground">
                      {reservations.length} total{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
                    </p>
                  </div>
                </div>
                <Link to="/search/products">
                  <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-border shadow-none gap-1.5">
                    Browse <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>

              {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                  <div className="w-14 h-14 rounded-3xl bg-muted flex items-center justify-center mb-3">
                    <ShoppingBag className="w-7 h-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-foreground font-semibold mb-1">No reservations yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Browse parapharmacy products and reserve from nearby pharmacies.</p>
                  <Link to="/search/products">
                    <Button size="sm" className="rounded-full text-xs font-bold bg-secondary border-none">
                      Browse products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {reservations.map(r => {
                    const s = STATUS_STYLE[r.status] || STATUS_STYLE.pending
                    return (
                      <Link
                        key={r.id}
                        to={`/reservation/${r.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors gap-4 group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {r.product_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{r.pharmacy_name}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(r.reserved_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${s.className}`}>
                          {s.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
