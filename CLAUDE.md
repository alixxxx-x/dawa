# Workshop MVP Starter

## What We're Building
Read PROJECT.md for the full project plan. Always check it before starting a new feature.

## Stack
- **Framework**: React.js with JavaScript
- **Styling**: Tailwind CSS v4, Shadcn, 21st Dev
- **Database + Auth**: Django + SQLite
- **Deploy**: Render (free tier)

## Commands
### Frontend (React + Vite)
- `npm run dev` — start dev server on localhost:5173
- `npm run build` — production build
- Deploy via Render dashboard (connect GitHub repo, set as Static Site)

### Backend (Django)
- `python manage.py runserver` — start Django dev server on localhost:8000
- `python manage.py makemigrations` — generate migrations from model changes
- `python manage.py migrate` — apply migrations to the database
- `python manage.py createsuperuser` — create an admin user

## Project Structure
```
frontend/
  src/
    pages/        — page-level components (one per route)
    components/   — reusable UI components
    lib/          — API client and utilities

backend/
  manage.py
  config/         — Django settings, urls, wsgi
  api/            — Django app: models, views, serializers, urls
```

## Rules
- All API calls go through `frontend/src/lib/api.js` — never use fetch directly in components
- Use React Router for client-side routing. Put page components in `src/pages/`
- Use Tailwind CSS utility classes for all styling. No CSS modules or inline styles
- Keep components small and focused. One component per file
- Put reusable components in `src/components/`
- Environment variables: use `VITE_API_URL` in frontend (prefix with `VITE_`), standard Django settings in backend — set these in the Render dashboard per service, never hardcode them
- When creating new data models, write the Django model in `api/models.py`, then run `makemigrations` + `migrate`
- Use Django REST Framework for API endpoints. Write serializers in `api/serializers.py` and views in `api/views.py`
- Use Django's built-in auth (`django.contrib.auth`) with JWT tokens (djangorestframework-simplejwt) for authentication
- Store the JWT token in `localStorage` and include it as `Authorization: Bearer <token>` on all authenticated requests
- When creating new tables, tell the user to run `python manage.py makemigrations && python manage.py migrate`
- After completing a feature, suggest the user commit with git

## Django API Quick Reference
```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class MyModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

# serializers.py
from rest_framework import serializers
from .models import MyModel

class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = '__all__'

# views.py
from rest_framework import viewsets, permissions
from .models import MyModel
from .serializers import MyModelSerializer

class MyModelViewSet(viewsets.ModelViewSet):
    serializer_class = MyModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MyModel.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

## Frontend API Client Quick Reference
```javascript
// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Auth - sign up
export async function signUp(email, password) {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

// Auth - sign in (stores token)
export async function signIn(email, password) {
  const res = await fetch(`${API_URL}/api/token/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.access) localStorage.setItem('token', data.access)
  return data
}

// Auth - sign out
export function signOut() {
  localStorage.removeItem('token')
}

// Read
export async function getItems() {
  const res = await fetch(`${API_URL}/api/items/`, { headers: getHeaders() })
  return res.json()
}

// Create
export async function createItem(payload) {
  const res = await fetch(`${API_URL}/api/items/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })
  return res.json()
}

// Update
export async function updateItem(id, payload) {
  const res = await fetch(`${API_URL}/api/items/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })
  return res.json()
}

// Delete
export async function deleteItem(id) {
  await fetch(`${API_URL}/api/items/${id}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
}
```
