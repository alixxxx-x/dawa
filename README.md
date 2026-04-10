# 💊 Dawa

**Dawa** is a comprehensive Algerian pharmacy ecosystem designed to solve medicine availability issues and formalize inter-pharmacy trade. Built in just **3 hours** at the WebExpo Semi-Hackathon, Dawa bridges the gap between pharmacies and patients while creating a structured B2B marketplace to securely trade surplus inventory.

## 🚀 Key Features

* **Real-Time Medicine Finder**: Allows patients to search and locate available medicines across nearby pharmacies in real time.
* **Click & Collect Marketplace**: A seamless way for users to reserve and collect medicines directly from their chosen pharmacy.
* **B2B Pharmacist Platform**: A structured network for pharmacists to connect, exchange, and trade surplus inventory, actively minimizing medical waste and addressing local shortages.

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS v4, Shadcn UI
* **Animations**: Framer Motion
* **Routing & API**: React Router DOM, Axios
* **Icons**: Lucide React

### Backend (Server)
* **Framework**: Python, Django
* **API**: Django REST Framework (DRF)
* **Authentication**: JWT (djangorestframework-simplejwt)
* **Database**: SQLite3
* **Image Processing**: Pillow

## 🏁 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)

### 1. Starting the Backend
From the root directory, open a terminal and run:

```bash
cd server

# Create and activate virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# Mac/Linux
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

The backend API will run on `http://127.0.0.1:8000/`.

### 2. Starting the Frontend
Open a **new** terminal, from the root directory:

```bash
cd client

# Install packages
npm install

# Start the dev server
npm run dev
```

The React app will typically run on `http://localhost:5173/`.

---
*Developed with ❤️ to improve the healthcare ecosystem in Algeria.*
