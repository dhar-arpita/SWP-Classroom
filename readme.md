# SWP Classroom

> **Survive with Physics** — A full-stack e-learning platform built for Bangladeshi Secondary and Higher Secondary science students. Teacher create courses with videos and study materials; students browse, enroll, and learn at their own pace.

---



- **Frontend** → https://swp-classroom.vercel.app
- **Backend API** → https://swp-classroom.onrender.com



---

## ✨ Features

### Student
- Browse courses filtered by **class** (HSC, SSC, JSC, Admission) and **subject** (Physics, Chemistry, Math, etc.)
- Enroll in **free** courses instantly
- Request enrollment for **paid** courses (teacher approves manually after offline payment)
- Watch course videos (YouTube-embedded) and download materials (PDF / Google Drive)
- Personal dashboard showing enrolled & pending courses
- Visual badges on browse page showing enrollment status

### Teacher
- Create courses with thumbnail (Cloudinary upload), pricing, class & subject
- Structure content into **chapters → videos → materials**
- Review pending enrollment requests with **search by name / email / mobile**
- Approve or reject enrollments
- Manage all courses, chapters, videos, and materials (edit / delete)

### Authentication
- **Mobile-first** registration — mobile number required, email optional
- Login with **either email or mobile number** + password
- JWT-based auth with 7-day token expiry
- Auto-logout on token expiry (axios interceptor)
- Public landing page + protected role-based routes (student / teacher)

---

##  Tech Stack

### Frontend
- **React 18** with **Vite**
- **React Router** for routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** + **Express**
- **Prisma ORM**
- **JWT** + **bcrypt** for auth
- **Cloudinary** for image uploads
- **Multer** for multipart form handling

### Database
- **PostgreSQL** hosted on **Neon** (serverless)

### Hosting
- **Vercel** — frontend
- **Render** — backend (free tier)
- **Neon** — database (free tier)
- **Cloudinary** — image storage (free tier)

---

## Project Structure

```
SWP_Classroom/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── pages/                  # Home, Login, Register, Dashboards, CourseDetail, etc.
│   │   ├── components/             # Navbar, Modal
│   │   ├── context/                # AuthContext
│   │   ├── App.jsx                 # Routes + axios global setup
│   │   └── main.jsx
│   ├── .env                        # VITE_API_URL
│   ├── vercel.json                 # SPA rewrite config
│   └── package.json
│
└── server/                         # Express backend
    ├── src/
    │   ├── controllers/            # authController, courseController, enrollmentController
    │   ├── routes/                 # API route definitions
    │   ├── middleware/             # auth.js (verifyToken)
    │   ├── config/                 # cloudinary.js
    │   └── index.js                # Server entry, CORS, route mounting
    ├── prisma/
    │   ├── schema.prisma           # User, Course, Chapter, Video, Material, CourseEnrollment
    │   └── migrations/             # Migration history
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon free account)
- Cloudinary account (for image uploads)

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your_long_random_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Run migrations & start:

```bash
npx prisma migrate dev
npm run dev
```

Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=""
```

(Leave empty for local dev — Vite proxy handles `/api/*` calls.)

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🌍 Production Deployment

| Service | Role | Notes |
|---|---|---|
| **Vercel** | Frontend hosting | Auto-deploys on push to `main` |
| **Render** | Backend hosting | Set `Root Directory` to `server`; auto-deploys on push |
| **Neon** | Production database | Apply migrations with `npx prisma migrate deploy` |
| **Cloudinary** | Thumbnail storage | Set API keys in Render env vars |

### Environment Variables in Production

**Render (backend)**
- `DATABASE_URL` — Neon connection string
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET`

**Vercel (frontend)**
- `VITE_API_URL` — full backend URL (`https://swp-classroom.onrender.com`)



---

## 🧠 Key Decisions

- **Mobile as primary identifier** — Bangladesh context where mobile is more universal than email.
- **Course-level progress** (vs per-video) — stored as completed video IDs on enrollment record; simpler to query and display.
- **Manual paid enrollment approval** — payments happen offline (Facebook Page, bKash), teacher approves after confirmation. No payment gateway needed for MVP.
- **YouTube unlisted videos** — for MVP privacy. Migration to Bunny.net planned for production launch.

---

## 👤 Author

**Arpita Dhar**
- GitHub: [@dhar-arpita](https://github.com/dhar-arpita)

---

## 📝 License

Educational project — all rights reserved by the author.
