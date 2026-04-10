const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  })
  if (res.status === 204) return null
  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(phone, password, name, role = 'patient', wilaya = '') {
  return request('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ phone, password, name, role, wilaya }),
  })
}

export async function login(phone, password) {
  const data = await request('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
  if (data?.access) {
    localStorage.setItem('token', data.access)
    localStorage.setItem('refresh', data.refresh)
  }
  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
}

export function getToken() {
  return localStorage.getItem('token')
}

export async function getMe() {
  return request('/api/auth/me/')
}

// ── Pharmacies ────────────────────────────────────────────────────────────────

export async function getPharmacies(search = '') {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  return request(`/api/pharmacies/${q}`)
}

export async function getPharmacy(id) {
  return request(`/api/pharmacies/${id}/`)
}

export async function getPharmacyProducts(id, category = '') {
  const q = category ? `?category=${category}` : ''
  return request(`/api/pharmacies/${id}/products/${q}`)
}

export async function getPharmacyAvailability(id) {
  return request(`/api/pharmacies/${id}/availability/`)
}

// ── Medicines ─────────────────────────────────────────────────────────────────

export async function searchMedicines(q) {
  return request(`/api/medicines/?q=${encodeURIComponent(q)}`)
}

export async function getMedicine(id) {
  return request(`/api/medicines/${id}/`)
}

export async function getMedicinePharmacies(id) {
  return request(`/api/medicines/${id}/pharmacies/`)
}

// ── Availability Reports ──────────────────────────────────────────────────────

export async function createReport(pharmacyId, medicineId, status, confidence = 'unknown') {
  return request('/api/reports/', {
    method: 'POST',
    body: JSON.stringify({ pharmacy: pharmacyId, medicine: medicineId, status, confidence }),
  })
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return request(`/api/products/${qs ? '?' + qs : ''}`)
}

export async function getProduct(id) {
  return request(`/api/products/${id}/`)
}

export async function createProduct(payload) {
  return request('/api/products/', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateProduct(id, payload) {
  return request(`/api/products/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}/`, { method: 'DELETE' })
}

// ── Reservations ──────────────────────────────────────────────────────────────

export async function getReservations() {
  return request('/api/reservations/')
}

export async function createReservation(productId, type = 'b2c') {
  return request('/api/reservations/', {
    method: 'POST',
    body: JSON.stringify({ product: productId, type }),
  })
}

export async function confirmReservation(id) {
  return request(`/api/reservations/${id}/confirm/`, { method: 'PATCH' })
}

export async function cancelReservation(id) {
  return request(`/api/reservations/${id}/cancel/`, { method: 'PATCH' })
}

export async function completeReservation(id) {
  return request(`/api/reservations/${id}/complete/`, { method: 'PATCH' })
}
