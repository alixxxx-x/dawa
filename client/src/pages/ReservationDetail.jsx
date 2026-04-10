import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Navigation, Loader2, Clock, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getReservations, cancelReservation } from '../lib/api'

const STATUS_VARIANT = {
  pending:   'warning',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
}

export default function ReservationDetail() {
  const { id } = useParams()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getReservations().then(data => {
      const found = Array.isArray(data) ? data.find(r => String(r.id) === id) : null
      setReservation(found || null)
      setLoading(false)
    })
  }, [id])

  async function handleCancel() {
    setCancelling(true)
    const updated = await cancelReservation(id)
    setReservation(updated)
    setCancelling(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm font-medium">Fetching reservation details…</p>
      </div>
    </div>
  )

  if (!reservation) return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 font-medium">Reservation not found.</p>
        <Link to="/profile">
          <Button variant="link" className="mt-2">Back to Profile</Button>
        </Link>
      </div>
    </div>
  )

  const deadline = new Date(reservation.pickup_deadline)
  const isExpired = new Date() > deadline

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          My reservations
        </Link>

        <Card className="rounded-3xl border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Reservation #{reservation.id}</h1>
            <Badge variant={STATUS_VARIANT[reservation.status]} className="capitalize px-3 py-1 font-bold">
              {reservation.status}
            </Badge>
          </div>
          
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <Row label="Product" value={reservation.product_name} />
              <Row
                label="Pharmacy"
                value={
                  <Link to={`/pharmacy/${reservation.pharmacy}`} className="text-primary hover:underline font-bold">
                    {reservation.pharmacy_name}
                  </Link>
                }
              />
              {reservation.pharmacy_address && (
                <Row
                  label="Address"
                  value={
                    <span className="flex items-center gap-1.5 text-right font-medium">
                      <MapPin className="w-4 h-4 shrink-0 text-slate-300" />
                      {reservation.pharmacy_address}
                    </span>
                  }
                />
              )}
              <Row
                label="Pickup deadline"
                value={
                  <span className={`flex items-center gap-1.5 font-bold ${isExpired ? 'text-red-500' : 'text-slate-900'}`}>
                    <Clock className="w-4 h-4 shrink-0" />
                    {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    {isExpired && <span className="text-[10px] uppercase ml-1 px-1.5 py-0.5 bg-red-50 rounded">expired</span>}
                  </span>
                }
              />
            </div>

            <div className="p-6 bg-slate-50/30 flex gap-3">
              {reservation.pharmacy_lat && reservation.pharmacy_lng && (
                <a
                  href={`https://maps.google.com/?q=${reservation.pharmacy_lat},${reservation.pharmacy_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full h-12 rounded-xl gap-2 bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20 border-none">
                    <Navigation className="w-4 h-4" /> Navigate to Pharmacy
                  </Button>
                </a>
              )}
              {reservation.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 h-12 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 font-bold"
                >
                  {cancelling ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Cancelling…</> : 'Cancel Order'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm px-6 py-5">
      <span className="text-slate-400 font-medium shrink-0 uppercase tracking-widest text-[10px] mt-0.5">{label}</span>
      <span className="text-slate-800 text-right leading-tight">{value}</span>
    </div>
  )
}
