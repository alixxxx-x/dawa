import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/routes/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import PharmacistLogin from './pages/PharmacistLogin'
import Home from './pages/Home'
import MedicineSearch from './pages/MedicineSearch'
import ProductSearch from './pages/ProductSearch'
import ProductDetail from './pages/ProductDetail'
import PharmacyDetail from './pages/PharmacyDetail'
import ReservationDetail from './pages/ReservationDetail'
import Profile from './pages/Profile'
import About from './pages/About'
import PharmacistDashboard from './pages/PharmacistDashboard'
import PharmacistCatalogue from './pages/PharmacistCatalogue'
import PharmacistExchange from './pages/PharmacistExchange'

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dawa-theme">
      <div className="flex flex-col min-h-screen bg-background text-foreground tracking-tight">
        <Navbar />
        <div className="h-16" />

        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pharmacist/login" element={<PharmacistLogin />} />

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/search/medicine" element={<MedicineSearch />} />
            <Route path="/search/products" element={<ProductSearch />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/pharmacy/:id" element={<PharmacyDetail />} />

            <Route path="/reservation/:id" element={<ProtectedRoute><ReservationDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/pharmacist/dashboard" element={<ProtectedRoute><PharmacistDashboard /></ProtectedRoute>} />
            <Route path="/pharmacist/catalogue" element={<ProtectedRoute><PharmacistCatalogue /></ProtectedRoute>} />
            <Route path="/pharmacist/exchange" element={<ProtectedRoute><PharmacistExchange /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
