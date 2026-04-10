import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, ArrowLeftRight, Clock, CheckCircle2, Loader2,
  ShoppingBag, TrendingUp, AlertCircle, Users, ArrowRight,
  LayoutDashboard, CalendarClock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getMe, getReservations, confirmReservation, completeReservation } from '@/lib/api'

const STATUS_STYLE = {
  pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
}

export default function PharmacistDashboard() {
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMe(), getReservations()]).then(([u, r]) => {
      setUser(u)
      setReservations(Array.isArray(r) ? r : [])
      setLoading(false)
    })
  }, [])

  async function confirm(id) {
    const updated = await confirmReservation(id)
    setReservations(rs => rs.map(r => r.id === updated.id ? updated : r))
  }

  async function complete(id) {
    const updated = await completeReservation(id)
    setReservations(rs => rs.map(r => r.id === updated.id ? updated : r))
  }

  const pending   = reservations.filter(r => r.status === 'pending')
  const confirmed = reservations.filter(r => r.status === 'confirmed')
  const completed = reservations.filter(r => r.status === 'completed')

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading dashboard…</p>
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
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Pharmacist Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {user?.name ? `Welcome back, ${user.name}` : 'Dashboard'}
              </h1>
              {user?.wilaya && (
                <p className="text-white/50 text-sm mt-1">{user.wilaya}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Link to="/pharmacist/catalogue">
                <Button className="rounded-full h-10 px-5 font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-none text-xs gap-2">
                  <Package className="w-3.5 h-3.5" /> Catalogue
                </Button>
              </Link>
              <Link to="/pharmacist/exchange">
                <Button variant="outline" className="rounded-full h-10 px-5 font-bold border-white/20 text-white bg-transparent hover:bg-white/10 text-xs gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Exchange
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders',    value: reservations.length, icon: ShoppingBag,   color: 'bg-primary/10 text-primary' },
            { label: 'Pending',         value: pending.length,      icon: AlertCircle,   color: 'bg-yellow-100 text-yellow-600', alert: pending.length > 0 },
            { label: 'Awaiting Pickup', value: confirmed.length,    icon: CalendarClock, color: 'bg-blue-100 text-blue-600' },
            { label: 'Completed',       value: completed.length,    icon: TrendingUp,    color: 'bg-green-100 text-green-600' },
          ].map(stat => (
            <div key={stat.label}
              className={`bg-background rounded-2xl border p-5 flex items-center gap-4 ${stat.alert ? 'border-yellow-200 shadow-md shadow-yellow-100' : 'border-border'}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Action queues ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Pending — needs action */}
            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  <h2 className="text-sm font-black text-foreground uppercase tracking-widest">
                    Needs Action
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 normal-case tracking-normal">
                      {pending.length} pending
                    </span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {pending.map(r => (
                    <div key={r.id}
                      className="bg-background rounded-2xl border border-yellow-200 p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                          <ShoppingBag className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-foreground truncate">{r.product_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r.type === 'b2b' ? 'Inter-pharmacy' : 'Patient pickup'} · {new Date(r.reserved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => confirm(r.id)} size="sm"
                        className="shrink-0 rounded-full h-9 px-4 font-bold bg-secondary hover:bg-secondary/90 border-none text-xs gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Confirmed — awaiting pickup */}
            {confirmed.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="text-sm font-black text-foreground uppercase tracking-widest">
                    Awaiting Pickup
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary normal-case tracking-normal">
                      {confirmed.length}
                    </span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {confirmed.map(r => (
                    <div key={r.id}
                      className="bg-background rounded-2xl border border-primary/20 p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-foreground truncate">{r.product_name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Deadline {new Date(r.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => complete(r.id)} size="sm" variant="outline"
                        className="shrink-0 rounded-full h-9 px-4 font-bold border-border text-xs gap-1.5 shadow-none">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Mark done
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {reservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-background rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-foreground font-semibold mb-1">No reservations yet</p>
                <p className="text-sm text-muted-foreground mb-4">Add products to your catalogue to start receiving orders.</p>
                <Link to="/pharmacist/catalogue">
                  <Button size="sm" className="rounded-full text-xs font-bold bg-secondary border-none">
                    Go to Catalogue
                  </Button>
                </Link>
              </div>
            )}

            {/* Recent history */}
            {reservations.length > 0 && (
              <section>
                <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-3">All Orders</h2>
                <div className="bg-background rounded-2xl border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {reservations.map(r => {
                      const s = STATUS_STYLE[r.status] || STATUS_STYLE.pending
                      return (
                        <div key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-foreground text-sm truncate">{r.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.type === 'b2b' ? 'B2B' : 'B2C'} · {new Date(r.reserved_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${s.className}`}>
                            {s.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Quick links ── */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest">Quick Access</h2>

            <Link to="/pharmacist/catalogue"
              className="group flex items-center gap-4 p-5 bg-background rounded-2xl border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-foreground text-sm group-hover:text-primary transition-colors">Catalogue</p>
                <p className="text-xs text-muted-foreground">Manage your products & stock</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
            </Link>

            <Link to="/pharmacist/exchange"
              className="group flex items-center gap-4 p-5 bg-background rounded-2xl border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-foreground text-sm group-hover:text-primary transition-colors">B2B Exchange</p>
                <p className="text-xs text-muted-foreground">Inter-pharmacy transfers</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
            </Link>

            <Link to="/profile"
              className="group flex items-center gap-4 p-5 bg-background rounded-2xl border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-foreground text-sm group-hover:text-primary transition-colors">My Profile</p>
                <p className="text-xs text-muted-foreground">Account settings</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
            </Link>

            {/* Summary card */}
            {reservations.length > 0 && (
              <div className="bg-secondary rounded-2xl p-5 text-white mt-2">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Today's Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Pending</span>
                    <span className="font-black text-yellow-300">{pending.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Awaiting pickup</span>
                    <span className="font-black text-primary">{confirmed.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Completed</span>
                    <span className="font-black text-green-400">{completed.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
