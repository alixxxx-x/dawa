# Dawa: Medicine & Pharmacy Ecosystem

**Dawa** is an Algerian pharmacy ecosystem built in just **3 hours** as part of the **WebExpo Semi-Hackathon**. It is designed to solve critical medicine availability issues and formalize the inter-pharmacy trade market.

- **Medicine Finder**: Real-time availability search by molecule or brand.
- **Parapharmacy Marketplace**: Click & Collect for cosmetics, baby care, and supplements.
- **Pharmacist B2B Exchange**: A structured platform for pharmacists to trade surplus stock.

---

# Project Plan

<!--
  This file is your team's shared brain.
  Fill it in together during brainstorming. Save it.

  - Claude Code reads this automatically. It will know what you're building.
  - Your marketing/pitch team uses this to build the pitch deck.
  - One file, everyone's on the same page.
-->

## Product

**Name:** Dawa

**One sentence:** Your medicine is one click away.

**Problem:** Algerian patients waste hours pharmacy-hopping to find life-saving medications because there is no citizen-facing availability layer — despite regulations (Article 162, Finance Act 2026) that mandate inventory reporting. At the same time, Algeria's 12,000+ pharmacies have no online sales channel for their high-margin parapharmaceutical products (dermo-cosmetics, supplements, baby care, orthopedic supports), and no structured system for inter-pharmacy stock exchange — which today happens informally over media platforms.

---

## Target Audience

**Who is this for?**

Three distinct users, one platform:

1. **Patients & caregivers** — Algerians (28–70 yrs) managing chronic conditions (diabetes, hypertension, cardiac) for themselves or a family member. They run pharmacy errands 1–4× per month and lose 45–90 minutes per trip chasing availability.

2. **Pharmacists (B2B)** — Licensed pharmacists who need to restock urgently or offload surplus parapharmaceutical inventory. Today this is done by phone calls and social media groups between colleagues — informal, slow, and untracked. Dawa formalises this into a structured inter-pharmacy exchange.

**Why would they use it?**

- **Patients:** The alternative is 3–4 pharmacy visits averaging 90 minutes in transport. Dawa replaces that with one search, The alternative is paying whatever the nearest pharmacy charges, with no price range visibility. Dawa is the first price-comparison layer for parapharmaceuticals in Algeria.
- **Pharmacists:** The alternative is social media messages to pharmacy group chats — no structure, no confirmation, no record. Dawa gives them a live inter-pharmacy stock exchange with reservation and invoicing.

---

## Pages & User Flow

### Patient-facing pages

1. `/login` and `/signup` — Phone number + OTP authentication (no email required — lower friction for Algerian users)

2. `/` — Home screen with two clear entry points:
   - **"Find my medicine"** — search bar (INN / molecule or commercial brand name)
   - **"Browse parapharmaceuticals"** — category grid (dermo-cosmetics, baby care, supplements, orthopedics, wound care, oral hygiene, hair care, wellness devices)
   - Below: "Near you" section showing pharmacies on the marketplace sorted by distance

3. `/search/medicine?q=` — Medicine search results page:
   - Autocomplete by molecule (Metformin, Amlodipine…) or brand (Glucophage, Amlor…)
   - Groups all equivalent brands under the same molecule
   - Shows nearby pharmacies with availability confidence (High / Medium / Low / Unknown) + last report timestamp
   - Color-coded map + list view toggle
   - Each pharmacy card links to `/pharmacy/:id`

4. `/search/products?q=` — Parapharmaceutical search results:
   - Filter by category, price range, distance
   - Shows product with price, pharmacy name, distance, stock status
   - Sort by: price, distance, rating

5. `/pharmacy/:id` — Unified pharmacy profile:
   - Name, address, phone, hours, distance, rating
   - Two tabs: **"Medicines"** (availability confidence for reported medicines) | **"Shop"** (parapharmaceutical catalogue with prices)
   - Reserve button on each listed product

6. `/product/:id` — Product detail page:
   - Photo, description, price, pharmacy stock status (it's a range estimation (categorical instead of numerical))
- 
1. `/reservation/:id` — Reservation confirmation(only for parapharmaceuticals):
   - Product, pharmacy, pickup window (2-hour hold)
   - "Navigate to pharmacy" button (opens Google Maps)
   - Cancellation option

2. `/profile` — User profile:
   - Saved medicines (quick re-search)
   - Order history
   - Availability report history ("you've helped 14 patients")

### Pharmacist-facing pages (separate onboarding flow)

9. `/pharmacist/login` — Separate pharmacist login (licence number verified)

10. `/pharmacist/dashboard` — Pharmacist home:
    - Pending reservations (Click & Collect queue)
    - My catalogue (add/edit parapharmaceutical listings)
    - **"Inter-pharmacy exchange"** tab — see what nearby pharmacies have listed / post surplus stock
    - Quick stats: reservations today, catalogue views, top searched medicines in their area

11. `/pharmacist/catalogue` — Manage parapharmaceutical inventory:
    - Add product (name, brand, price, quantity, photo)
    - Toggle "in stock / out of stock" per item
    
12. `/pharmacist/exchange` — **Inter-pharmacy marketplace (B2B):**
    - Search for a product another pharmacist has surplus of (by product name or category)
    - See nearby pharmacies with available stock, listed quantity, and proposed wholesale price
    - Send a reservation request → pharmacy confirms via in-app
    - Post your own surplus: list products you want to offload at wholesale price to other pharmacists
    - Designed for parapharmaceuticals first; medicine exchange (strict regulatory compliance) is a V1 feature

**User flow — Patient (Medicine Finder):**
1. Opens Dawa → taps "Find my medicine"
2. Types "Amlodipine" or "Amlor" → sees autocomplete with molecule + all equivalent brands
3. Grants location (or enters commune manually)
4. Sees color-coded map of nearby pharmacies with availability confidence
5. Visits pharmacy, buys medicine
6. 30 minutes later: receives push notification → "Did you find it at [Pharmacy Name]?" → taps "✅ Yes" or "❌ No"
7. Map updates. Screen shows: "شكراً — ساعدت مريضاً آخر اليوم"

**User flow — Patient (Parapharmaceutical Marketplace):**
1. Opens Dawa → browses "Dermo-cosmetics" category
2. Searches "Avène Cicalfate" → sees it listed at 3 nearby pharmacies with prices
3. Taps "Reserve for pickup"
4. Receives confirmation: "Held for 2 hours at [Pharmacy Name]"
5. Goes to pharmacy → pays in-store → rates the transaction (1–5 stars)

**User flow — Pharmacist (Inter-pharmacy Exchange):**
1. Logs into pharmacist dashboard → taps "Inter-pharmacy exchange"
2. Searches "Mustela Bébé" → sees 2 nearby pharmacies with surplus stock listed at wholesale
3. Sends reservation request → receiving pharmacist confirms in app.
4. Picks up (or arranges messenger) → transaction logged on platform
5. Platform records the exchange for tracking purposes
---

## Data Model

**Table: `users`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| phone | varchar (unique) | Phone number (primary identifier) |
| role | enum | `patient`, `pharmacist` |
| wilaya | varchar | User's wilaya for geo-filtering |
| created_at | timestamp | Auto-set |

**Table: `pharmacies`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | varchar | Pharmacy display name |
| address | text | Full address |
| wilaya | varchar | Wilaya |
| lat | float | Latitude |
| lng | float | Longitude |
| phone | varchar | Contact number |
| is_verified | boolean | Has claimed listing |
| pharmacist_user_id | uuid | FK → users (role: pharmacist) |
| created_at | timestamp | Auto-set |

**Table: `medicines`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| inn | varchar | International Non-proprietary Name (molecule) |
| commercial_name | varchar | Brand name |
| form | varchar | Tablet / syrup / injectable etc. |
| dosage | varchar | e.g. 850mg |
| molecule_id | uuid | FK → self (groups brands by molecule) |

**Table: `availability_reports`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| pharmacy_id | uuid | FK → pharmacies |
| medicine_id | uuid | FK → medicines |
| reporter_id | uuid | FK → users |
| status | enum | `found`, `not_found` |
| confidence | enum | `high`, `medium`, `low`, `unknown` |
| reported_at | timestamp | When the report was made |
| expires_at | timestamp | Computed: reported_at + decay window |

**Table: `products`** *(parapharmaceuticals)*
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| pharmacy_id | uuid | FK → pharmacies |
| name | varchar | Product display name |
| brand | varchar | e.g. Avène, Mustela |
| category | enum | `dermo_cosmetics`, `baby_care`, `supplements`, `orthopedics`, `wound_care`, `oral_hygiene`, `hair_care`, `wellness_devices` |
| price_dzd | integer | Retail price in DZD |
| wholesale_price_dzd | integer | Price for inter-pharmacy exchange (nullable) |
| stock_qty | integer | Current stock (null = unlisted) |
| is_b2b_listed | boolean | Whether this product appears in inter-pharmacy exchange |
| photo_url | varchar | Product image |
| created_at | timestamp | Auto-set |

**Table: `reservations`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | FK → products |
| buyer_id | uuid | FK → users (patient or pharmacist) |
| pharmacy_id | uuid | FK → pharmacies (seller) |
| type | enum | `b2c` (patient pickup) or `b2b` (inter-pharmacy) |
| status | enum | `pending`, `confirmed`, `completed`, `cancelled` |
| reserved_at | timestamp | Auto-set |
| pickup_deadline | timestamp | reserved_at + 2 hours |
| commission_pct | float | Applied commission rate (8–12%) |
| created_at | timestamp | Auto-set |

---

## Scope Check

- [x] We have a clear core loop for each user type (patient, pharmacist)
- [x] Data model is 6 tables — manageable, no unnecessary joins at MVP
- [x] Core feature can be explained in one sentence per user
- [x] Inter-pharmacy exchange (B2B) shares the same `products` and `reservations` tables — no extra infrastructure
- [x] Click & Collect = no delivery, no payment gateway, no cold chain at MVP
- [x] Medicine finder has no transaction layer — zero regulatory risk
- [ ] Pharmacist licence verification is manual at MVP (no API integration yet)
- [ ] In-app payment is deferred to V1 — all MVP transactions are pay-in-store

**What we've cut for MVP:**
- Home delivery
- In-app payment (CIB / Dahabia card integration)
- AI shelf image scanning
- Prescription medicine transactions
- Stock prediction / analytics dashboard
- CNAS integration

---

## Pitch Outline

**The problem:**
Algerian patients with chronic illnesses spend several hours per medication run, hopping between pharmacies with no information. Meanwhile, Algeria's pharmacies sit on high-margin parapharmaceutical inventory with no online channel — and restock informally by calling each other over social media.

**Our solution:**
Dawa is a three-sided pharmacy platform: a free medicine finder (search by molecule or brand, see real availability nearby), a parapharmaceutical marketplace where patients can browse and reserve products for pickup, and an inter-pharmacy B2B exchange where pharmacists buy surplus stock directly from each other.

**Key differentiator:**
- Inter-pharmacy exchange formalises an existing informal behaviour (stock trading between pharmacists), creating a commission-generating B2B layer that no competitor has attempted
- First app that offers nationwide a medicine finder (free, high-frequency) feeds the marketplace (paid, high-margin)

**Demo moment:**
Search "Metformin" → see all equivalent brands at nearby pharmacies with confidence scores and last-report times → tap a pharmacy → see their parapharmaceutical catalogue → find the same Avène sunscreen  → reserve it in one tap. All in under 60 seconds.

**Target market:**
- **Primary TAM:**  chronic disease patients in Algeria who buy medicines regularly
- **Parapharmaceutical market:** Pharmacy retail market.
- **First users:** Patients in Constantine.
- **Year 1 SOM:** 5,000 registered users, 50 pharmacy partners

**The ask:**
- Seed funding to cover 6 months of development and pharmacy onboarding in Constantine.
- Introductions to pharmacist associations (CAPHA, Ordre des Pharmaciens) for partnership conversations