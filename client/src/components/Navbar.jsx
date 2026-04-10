import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import { logout, getToken } from '../lib/api'
import { Button } from './ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>دَوَاء</span>
        <span className="text-xs text-slate-400 hidden sm:block">Dawa</span>
      </Link>

      <div className="flex items-center gap-1">
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500">
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
