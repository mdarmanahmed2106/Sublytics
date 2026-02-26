# Sublytics — Subscription Intelligence Tracker

![Sublytics Dashboard App Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)

> **Sublytics** — A production-grade full-stack SaaS application for subscription intelligence, built with **React 19**, **Express 5**, and **MongoDB**. Implements **enterprise-level security** with JWT access/refresh token rotation, HTTP-only cookie authentication, Helmet.js hardening, and rate-limited API endpoints. Features a **service-oriented backend architecture** with centralized error handling, Winston structured logging, and input validation. The **analytics engine** leverages MongoDB aggregation pipelines to deliver real-time spending insights, category-level cost analysis, unused subscription detection, month-over-month trend tracking, and automated savings recommendations. Designed for **100K+ user scalability** with compound indexes, pagination, and Docker-ready deployment. Architected as a monolithic but production-scalable codebase with CI/CD via GitHub Actions.

---

## 🚀 Features

- **JWT Authentication** (Access & Refresh tokens via HTTP-only Cookies)
- **Advanced Dashboard** with KPIs (MRR, Total Subs, Waste Risk)
- **Centralized Subscriptions** (Add, edit, pause, or cancel subscriptions)
- **Smart Analytics Engine**
  - Spending Spike Detection
  - Duplicate Category/Service Alerts
  - Behavioral "Unused" Subscription Flagging
- **Role-Based Financial Simulation** (See impact of canceling unused items)
- **Automated MongoDB Cron Jobs** (For resetting refresh tokens arrays)

---

## 🛠 Tech Stack

### Frontend (Client)
- **React 19** + **Vite**
- **Tailwind CSS 4.0** (or vanilla CSS with custom tokens)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)
- **Axios** (With custom interceptors for transparent token refresh)
- **React Router DOM 7**

### Backend (Server)
- **Node.js** + **Express 5.0**
- **MongoDB** + **Mongoose** (ODM)
- **JWT** (JSON Web Tokens)
- **Bcrypt.js** (Password Hashing)
- **Winston** (Structured Logging)

---

## 📁 Project Structure

```
SubsTracker/
├── client/                           # React 19 + Vite frontend
│   └── src/
│       ├── api/api.js                # Axios: in-memory token, auto-refresh interceptor
│       ├── components/
│       │   ├── ErrorBoundary.jsx     # Global error boundary with retry UI
│       │   ├── Navbar.jsx            # Desktop sidebar navigation
│       │   └── ProtectedRoute.jsx    # Auth guard with loading state
│       ├── context/
│       │   ├── AuthProvider.jsx      # Auth state, session restore from cookie
│       │   ├── authContext.js        # React context
│       │   └── useAuth.js            # Custom auth hook
│       └── pages/                    # Dashboard, Subscriptions, Analytics, Activity, etc.
│
├── server/                           # Express 5 backend
│   ├── config/db.js                  # MongoDB connection
│   ├── controllers/                  # Thin controllers (validation → service → response)
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   ├── errorHandler.js           # Centralized error handler
│   │   ├── rateLimiter.js            # Auth + API rate limiters
│   │   └── requestLogger.js          # Winston request logging
│   ├── models/                       # Mongoose schemas (User, Subscription, ActivityLog)
│   ├── routes/                       # Express routers
│   ├── services/                     # Business logic layer
│   │   ├── subscriptionService.js    # Subscription CRUD + activity logging
│   │   └── analyticsService.js       # Aggregation, insights, unused detection
│   ├── utils/
│   │   ├── AppError.js               # Custom error class
│   │   ├── asyncHandler.js           # Async wrapper (eliminates try/catch)
│   │   ├── logger.js                 # Winston logger
│   │   └── response.js               # Standardized response formatter
│   ├── scripts/
│   │   └── migrate-billing.js        # DB migration: billingCycle → billingInterval
│   ├── Dockerfile                    # Production Docker image
│   └── .env.example                  # Environment template
│
└── .github/workflows/ci.yml          # GitHub Actions CI
```

---

## 🔌 API Endpoints

All protected routes require `Authorization: Bearer <accessToken>`.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (name, email, password) |
| POST | `/api/auth/login` | Login → access token + refresh cookie |
| POST | `/api/auth/refresh` | Rotate tokens via refresh cookie |
| POST | `/api/auth/logout` | Clear refresh cookie |

### Subscriptions (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | List with search, filter, sort |
| POST | `/api/subscriptions` | Create new |
| GET | `/api/subscriptions/:id` | Get one |
| PUT | `/api/subscriptions/:id` | Update |
| DELETE | `/api/subscriptions/:id` | Delete |

### Analytics (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Monthly/annual costs, counts |
| GET | `/api/analytics/by-category` | Spending by category |
| GET | `/api/analytics/trend` | Monthly spending trend |
| GET | `/api/analytics/insights` | Smart insights (unused, savings, tips) |

### Activity (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Paginated audit log |

---

## 📊 Data Models

### Subscription Schema
```js
{
  userId:             ObjectId (ref: User),
  name:               String (max 100),
  description:        String (max 500),
  category:           Enum (16 categories),
  cost:               Number (min 0),
  currency:           Enum ('INR', 'USD', 'EUR', 'GBP'),
  billingInterval:    { value: Number, unit: Enum('day','week','month','year') },
  status:             Enum ('active', 'paused', 'cancelled'),
  startDate:          Date,
  nextBillingDate:    Date (auto-calculated),
  autoRenew:          Boolean (default true),
  reminderDaysBefore: Number (default 3),
}
// Indexes: { userId, status }, { userId, nextBillingDate }, { userId, category }
```

---

## 🧠 Analytics Engine

| Feature | Description |
|---------|-------------|
| **Cost Summary** | Total monthly/annual spend, avg per sub, most expensive |
| **Category Breakdown** | Spending grouped by category with counts |
| **Spending Trend** | Month-over-month cost tracking |
| **Unused Detection** | Flags active subs not modified in 90+ days |
| **Savings Suggestions** | Estimates savings from switching monthly → yearly |
| **Smart Tips** | Contextual insights based on user behavior |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ / MongoDB Atlas

### Setup
```bash
# Server
cd server && cp .env.example .env  # Fill in your values
npm install && npm run dev

# Client
cd client && npm install && npm run dev
```

### Migration (if upgrading from old schema)
```bash
cd server && node scripts/migrate-billing.js
```

### Docker
```bash
cd server && docker build -t substracker-api . && docker run -p 5000:5000 --env-file .env substracker-api
```

---

## 📐 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Monolithic** | Realistic for BTech project scale, avoids microservice overhead |
| **Service layer** | Controllers are thin; business logic is testable and reusable |
| **In-memory access token** | Prevents XSS from reading JWT (vs localStorage) |
| **Refresh token rotation** | Old refresh token is invalidated on each use |
| **billingInterval object** | Flexible (`every 2 months`) vs rigid enum (`monthly/quarterly`) |
| **Compound indexes** | Query patterns scoped per user for multi-tenant performance |
| **Winston logging** | Structured JSON logs ready for log aggregation services |

---

## 🎨 Design System

Premium dark theme with glassmorphism: deep navy backgrounds (`#060910`), purple accent gradients, Poppins + Inter typography, glass cards, skeleton loaders, micro-animations (fade-up, scale-in, pulse glow).

---

## 📝 Currency

All monetary values default to **Indian Rupees (₹)**. Multi-currency support available (USD, EUR, GBP).
