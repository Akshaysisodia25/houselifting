# TDBD Engineering Works — House & Building Lifting Platform

> **Production Full-Stack Application**  
> India's premier non-destructive house lifting, building elevation, and structural shifting engineering platform.  
> Serving residential, commercial, and multi-storey structures Pan-India since 1999.

---

## 🏗️ Architecture Overview

The application is structured into a modern, decoupled client-server architecture:

```
houselifting/
├── src/                          # React + Vite Frontend
│   ├── assets/                   # Static branding & images
│   ├── components/               # Editorial Dark Theme UI Components
│   │   ├── admin/                # Admin Operations Portal UI
│   │   │   └── AdminPortal.jsx
│   │   ├── About.jsx
│   │   ├── ConsultationModal.jsx
│   │   ├── Contact.jsx
│   │   ├── CostEstimator.jsx
│   │   ├── Gallery.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── Services.jsx
│   │   ├── Testimonials.jsx
│   │   └── ...
│   ├── data/                     # Offline fallback datasets
│   │   └── companyData.js
│   ├── services/                 # Centralized API service layer
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/                       # Public web assets, logos, and slider media
│   └── images/
├── server/                       # Node.js + Express + Prisma REST API
│   ├── api/                      # Vercel serverless function entry
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma         # PostgreSQL schema definition
│   │   └── seed.js               # Comprehensive authentic database seeder
│   ├── src/
│   │   ├── controllers/          # Business logic handlers
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── serviceController.js
│   │   │   ├── galleryController.js
│   │   │   ├── testimonialController.js
│   │   │   ├── faqController.js
│   │   │   └── enquiryController.js
│   │   ├── middleware/           # JWT auth, error handling
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── routes/               # Modular Express API routers
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── galleryRoutes.js
│   │   │   ├── testimonialRoutes.js
│   │   │   ├── faqRoutes.js
│   │   │   └── enquiryRoutes.js
│   │   ├── utils/
│   │   │   ├── prisma.js         # Singleton Prisma client instance
│   │   │   └── fallbackStore.js  # Resilient zero-downtime memory store
│   │   ├── app.js                # Express app setup, CORS, Helmet, Rate limiter
│   │   └── server.js             # HTTP server entry point
│   ├── .env.example              # Template for backend secrets
│   └── package.json
├── package.json                  # Root runner and build orchestration
├── vite.config.js
└── README.md
```

---

## ⚡ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom Dark Editorial / Industrial Theme)
- **Icons**: Lucide React
- **Client Features**:
  - Resilient API Client with automatic zero-downtime offline fallback
  - Interactive Hydraulic Cost & Height Estimator
  - On-Site Field Gallery with category filtering & Lightbox
  - Synchronized Project Case Archives
  - Direct Lead Dispatch (Contact Forms, Consultation Modal, WhatsApp Link)
  - Staff Operations Admin Portal (`#admin` or Footer link)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Server Framework**: Express.js
- **Database & ORM**: PostgreSQL via Prisma ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security**: Helmet, CORS origin validation, express-rate-limit
- **Deployment Compatibility**: Node server (Render / Railway / VPS / Docker) or Serverless (Vercel)

---

## 📋 Prerequisites

- **Node.js**: `v18.x` or `v20.x+`
- **npm**: `v9.x+`
- **PostgreSQL**: `v14+` (Local Postgres, Neon, Supabase, Railway, or AWS RDS)

---

## 🚀 Getting Started

### 1. Repository Setup

Clone or open the project folder:
```bash
cd houselifting
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

---

### 2. Environment Variables Configuration

Copy the example environment file inside `server/`:
```bash
cp server/.env.example server/.env
```

Open `server/.env` and configure your local environment parameters as guided in `.env.example`:

- `DATABASE_URL`: Connection string pointing to your PostgreSQL instance (e.g. user, password, host, port, database name, and schema).
- `JWT_SECRET`: A secure random secret key for signing session tokens.
- `JWT_EXPIRES_IN`: Token validity period (e.g. `7d`).
- `ADMIN_NAME`: Name of the default administrative officer.
- `ADMIN_EMAIL`: Administrative login email.
- `ADMIN_PASSWORD`: Secure initial password for admin portal access.
- `PORT`: Backend port (default: `5001`).
- `CLIENT_URL`: Allowed frontend origin for CORS.

*(Optional)* Configure frontend environment variable if deploying to custom domain:
Create `.env` in root:
```env
VITE_API_URL=http://localhost:5001/api
```

---

### 3. Database Migration & Seeding

1. Generate Prisma Client:
```bash
npm run prisma:generate
# or: cd server && npx prisma generate
```

2. Push schema to PostgreSQL database:
```bash
npm run prisma:migrate
# or: cd server && npx prisma db push
```

3. Seed database with authentic TDBD company projects, services, gallery, FAQs, and default admin:
```bash
npm run seed
# or: cd server && node prisma/seed.js
```

---

### 4. Running the Application

You can run both services concurrently:

#### Start Backend API (Port 5001):
```bash
npm run server:dev
# or: cd server && npm run dev
```

#### Start Frontend Dev Server (Port 5173):
```bash
npm run dev
```

Visit the application in your browser:
- **Frontend Web App**: `http://localhost:5173`
- **API Health Check**: `http://localhost:5001/api/health`
- **Staff Operations Admin Portal**: Open `http://localhost:5173/#admin` or click **"Staff Portal / Admin"** in the footer!

---

## 🔐 Administrator Account Access

Initial administrative credentials configured in `server/.env` (and seeded via `npm run seed`):

| Field | Description |
|---|---|
| **Portal URL** | `http://localhost:5173/#admin` |
| **Email** | Configured via `ADMIN_EMAIL` in `server/.env` |
| **Password** | Configured via `ADMIN_PASSWORD` in `server/.env` |
| **Role** | `SUPERADMIN` |

---

## 📡 API Endpoints Reference

### Base URL: `/api`

### 1. Health & Status
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Server operational status & timestamp | Public |

**Sample Response (`GET /api/health`):**
```json
{
  "success": true,
  "message": "TDBD Engineering Works API is operational",
  "timestamp": "2026-10-28T20:32:19.281Z",
  "version": "1.0.0"
}
```

---

### 2. Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/login` | Login with email & password, returns JWT | Public |
| `GET` | `/auth/me` | Fetch authenticated admin profile | Protected (JWT) |
| `POST` | `/auth/logout` | Client token revocation | Public |

**Sample Request (`POST /api/auth/login`):**
```json
{
  "email": "<admin-email>",
  "password": "<admin-password>"
}
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "admin": {
      "id": 1,
      "name": "Chief Engineer Sushil Sisodia",
      "email": "admin@houselifting.in",
      "role": "SUPERADMIN"
    }
  }
}
```

---

### 3. Enquiries (Leads & Feasibility Submissions)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/enquiries` | Submit contact / estimator lead | Public |
| `GET` | `/enquiries` | List all client enquiries (filter by `status`) | Protected (JWT) |
| `GET` | `/enquiries/:id` | Get single enquiry record | Protected (JWT) |
| `PUT` | `/enquiries/:id` | Update status (`NEW`, `CONTACTED`, etc.) | Protected (JWT) |
| `DELETE` | `/enquiries/:id` | Remove enquiry record | Protected (JWT) |

**Sample Request (`POST /api/enquiries`):**
```json
{
  "name": "Rameshwar Dayal",
  "phone": "+91 98123 45678",
  "email": "rameshwar.d@gmail.com",
  "city": "Yamunanagar, Haryana",
  "service": "House Lifting",
  "message": "Need survey for lifting 2-storey house by 4 ft due to road heightening."
}
```

---

### 4. Projects (Portfolio)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/projects` | List projects (query: `category`, `featured`) | Public |
| `GET` | `/projects/:idOrSlug`| Get project details by ID or slug | Public |
| `POST` | `/projects` | Create new project | Protected (JWT) |
| `PUT` | `/projects/:id` | Update existing project | Protected (JWT) |
| `DELETE` | `/projects/:id` | Delete project | Protected (JWT) |

---

### 5. Services
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/services` | List core engineering services | Public |
| `GET` | `/services/:idOrSlug`| Get service details by ID or slug | Public |
| `POST` | `/services` | Create new service | Protected (JWT) |
| `PUT` | `/services/:id` | Update existing service | Protected (JWT) |
| `DELETE` | `/services/:id` | Delete service | Protected (JWT) |

---

### 6. Gallery
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/gallery` | List gallery images (query: `category`) | Public |
| `GET` | `/gallery/:id` | Get single gallery image | Public |
| `POST` | `/gallery` | Add image | Protected (JWT) |
| `PUT` | `/gallery/:id` | Update image metadata | Protected (JWT) |
| `DELETE` | `/gallery/:id` | Remove gallery image | Protected (JWT) |

---

### 7. Testimonials & FAQs
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/testimonials` | List verified client reviews | Public |
| `GET` | `/testimonials/all`| List all reviews (including unapproved) | Protected (JWT) |
| `POST` | `/testimonials` | Add client testimonial | Public / Admin |
| `PUT` | `/testimonials/:id`| Update testimonial / approve | Protected (JWT) |
| `DELETE` | `/testimonials/:id`| Delete testimonial | Protected (JWT) |
| `GET` | `/faqs` | List published engineering FAQs | Public |
| `GET` | `/faqs/all` | List all FAQs | Protected (JWT) |
| `POST` | `/faqs` | Create FAQ | Protected (JWT) |
| `PUT` | `/faqs/:id` | Update FAQ | Protected (JWT) |
| `DELETE` | `/faqs/:id` | Delete FAQ | Protected (JWT) |

---

## 🚢 Production Deployment Guide

### Option A: Database on Cloud PostgreSQL (Recommended: Neon or Supabase)
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy the Connection String URI with `?sslmode=require`.
3. Set `DATABASE_URL` in your backend environment variables.
4. Run `npx prisma db push` and `node prisma/seed.js`.

### Option B: Deploy Backend to Render or Railway
1. **Render**:
   - Create a **Web Service** pointing to the repository.
   - Root Directory: `server`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `node src/server.js`
   - Add Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT=5001`, `CLIENT_URL=https://your-frontend.vercel.app`
2. **Railway**:
   - Deploy repo with root directory set to `server`.
   - Add PostgreSQL plugin with one click; Railway sets `DATABASE_URL` automatically.

### Option C: Deploy Frontend to Vercel
1. Link your repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Root Directory: `./` (or leave default)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: URL of your backend API (e.g. `https://api.yourdomain.com/api` or `https://tdbd-server.onrender.com/api`)

### Option D: Monorepo Vercel Deployment (Frontend + Serverless API)
The project includes `server/api/index.js` which exports the Express app instance ready for Vercel Serverless Function routing.
A root `vercel.json` can be configured:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/server/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🛡️ Reliability & Fault Tolerance

1. **Zero Downtime Fallback**:
   - If PostgreSQL connection credentials are being migrated or the database is momentarily down, the backend controllers seamlessly serve the structured fallback repository without throwing 500 errors.
   - If the backend itself is offline during client rendering, `src/services/api.js` serves instant static defaults from `companyData.js` so that the public website never breaks or flickers.

2. **Security Controls**:
   - Passwords hashed using standard `bcryptjs` salt rounds.
   - `passwordHash` is excluded from all user-facing JSON responses.
   - API rate limiting prevents denial-of-service on public endpoints.
   - Strict CORS restricts unauthorized third-party origins.

---

## 📞 Support & Contacts

**TDBD Engineering Works Private Limited**  
Village Farkpur, Jagadhri Workshop Road, Yamunanagar, Haryana – 135002, India  
- **Director / Chief Engineer**: Mr. Sushil Kumar Sisodia (+91 94417 70000)
- **Logistics & Field Desk**: Mr. Pardeep Kumar Sisodia (+91 94667 41300)
- **Official Email**: houselifting44@gmail.com
- **Web**: [https://www.houselifting.in](https://www.houselifting.in)

