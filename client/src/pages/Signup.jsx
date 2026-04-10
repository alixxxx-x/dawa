import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Lock, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { register, login } from '../lib/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal',
  'Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet','El M\'Ghair','El Meniaa',
]

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '', name: '', wilaya: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const data = await register(form.phone, form.password, form.name, 'patient', form.wilaya)
    if (data?.id) {
      await login(form.phone, form.password)
      navigate('/')
    } else {
      const msg = data?.phone?.[0] || data?.password?.[0] || 'Registration failed'
      setError(msg)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-primary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl font-black text-primary tracking-tight">دَوَاء</h1>
          </Link>
          <p className="text-slate-500 mt-2 text-sm font-medium">Create a patient account</p>
        </div>

        <Card className="rounded-3xl border-slate-100 shadow-xl shadow-slate-200/50">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Full name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ahmed Benali"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="pl-11 rounded-xl h-12 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-700 font-bold ml-1">Phone number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+213 555 000 001"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    className="pl-11 rounded-xl h-12 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="wilaya" className="text-slate-700 font-bold ml-1">Wilaya</Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    id="wilaya"
                    value={form.wilaya}
                    onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))}
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none font-medium"
                  >
                    <option value="">Select your wilaya</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                    className="pl-11 rounded-xl h-12 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm font-medium border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 mt-4 border-none">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account…</> : 'Create account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6 pt-6 border-t border-slate-50">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
