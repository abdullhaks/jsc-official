# Islamic Organization Website — Refactor & Rebuild Plan
### From Static Site → Dynamic Full-Stack Application
**Prepared for build execution in Antigravity**

---

## 1. Executive Summary

We are converting an existing static Islamic organization website into a full dynamic
web application with:

- A **NestJS + MongoDB** backend exposing versioned REST APIs (`http://localhost:3000/api`)
- **Cloudinary**-backed media storage, uploaded **only from the backend**, only after
  full validation of the parent payload (no orphan/unused Cloudinary assets)
- **JWT access + refresh token** auth, stored in **httpOnly cookies**, with environment-aware
  cookie settings (dev vs prod, and cross-platform browser behavior on iOS/Android/Windows)
- A secured **Admin Dashboard** (CRUD for every content module) built on private/public
  routing driven by a **Zustand** auth store
- A refactored **public frontend**: nav bar redesign, lightweight SVG background
  animations, a verse-by-verse Quran reader, styled event notices, share-to-WhatsApp
  functionality, and a new **Articles** section

This document breaks the work into sequential, independently shippable **phases**.
Each phase has a clear goal, task checklist, and "definition of done" so progress can be
tracked and verified phase-by-phase inside Antigravity.

---

## 2. Final Tech Stack

| Layer | Choice |
|---|---|
| Backend framework | NestJS (TypeScript) |
| Database | MongoDB (Mongoose ODM) |
| Media storage | Cloudinary (server-side upload only) |
| Auth | JWT (access + refresh), httpOnly cookies |
| Admin state | Zustand |
| HTTP client | Axios (with interceptors for refresh-and-retry) |
| Frontend | React (existing stack, refactored components) |
| Process/env config | `@nestjs/config` + `.env` |
| Validation | `class-validator` / `class-transformer` DTOs |
| File handling | `multer` (memory storage) → Cloudinary SDK upload stream |
| Scheduling | `@nestjs/schedule` (event status transitions, expired cleanup) |

---

## 3. Environment Variables (`backend/.env`)

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/islamic_org_db

# JWT
JWT_ACCESS_SECRET=change_me_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cookies
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false          # true in production (HTTPS required)
COOKIE_SAMESITE=lax          # 'none' in production if cross-site + secure

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Seed admin
SEED_ADMIN_USERNAME=adminjsc
SEED_ADMIN_PASSWORD=admin123

# Pagination defaults
DEFAULT_PAGE_LIMIT=9
```

> In production, set `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none` (required for cross-site
> cookies on iOS Safari/Android WebView), serve over HTTPS, and set `CLIENT_URL` to the real
> domain so CORS `credentials: true` works correctly.

---

## 4. High-Level Data Model (MongoDB Collections)

- **admins** — `{ username, passwordHash, role, createdAt }`
- **refresh_tokens** *(optional, if server-side revocation is desired)* — `{ adminId, tokenHash, expiresAt, userAgent }`
- **events** — `{ title, type: 'weekly' | 'monthly' | 'special', description, venue, defaultSchedule, overrides:[{date, time, venue, reason}], date, time, imageUrl, imagePublicId, status: 'upcoming'|'ongoing'|'ended', createdAt }`
- **latest_contents** — `{ title, description, imageUrl, imagePublicId, createdAt }`
- **memories** — `{ title, description, imageUrl, imagePublicId, createdAt }`
- **publications** — `{ title, description, coverImageUrl, coverImagePublicId, link/fileUrl?, createdAt }`
- **downloads** — `{ title, description, fileUrl, filePublicId, fileType, createdAt }`
- **articles** — `{ title, content, coverImageUrl, coverImagePublicId, inlineImages:[{url, publicId, position}], author:{name, bio?, avatarUrl?}, createdAt }`

All list collections share: pagination (`limit`, `page`/`cursor`), `createdAt` sort, and
soft counters for "load more".

---

## 5. Authentication & Security Design

1. **Login** (`POST /api/auth/login`) — validate credentials → issue:
   - Access token (short-lived, 15m) → httpOnly cookie `access_token`
   - Refresh token (long-lived, 7d) → httpOnly cookie `refresh_token`, path-scoped to `/api/auth`
2. **Route protection** — Global `JwtAuthGuard` on all `/admin/*` controllers; public
   `GET` endpoints explicitly marked `@Public()` (custom decorator) and skipped by the
   guard, so we never pay the cost of token verification on public reads.
3. **Refresh flow** — `POST /api/auth/refresh` reads the `refresh_token` cookie, verifies
   it, rotates both tokens, sets new cookies. No body payload needed (cookie-based).
4. **Logout** — `POST /api/auth/logout` clears both cookies (matching domain/path/sameSite
   attributes used at set-time) and optionally invalidates the stored refresh token.
5. **Frontend Axios instance**:
   - `withCredentials: true`
   - Response interceptor catches `401`, calls `/auth/refresh` once, retries the original
     request; if refresh also fails → clears Zustand store → redirects to `/admin/login`.
   - A request de-duplication/mutex guard prevents multiple parallel refresh calls when
     several requests fail at once.
6. **Cross-platform cookie notes**:
   - Dev (`http://localhost`): `secure: false`, `sameSite: 'lax'`
   - Prod (HTTPS, possibly cross-subdomain admin vs API): `secure: true`, `sameSite: 'none'`
   - iOS Safari / in-app WebViews are strict about third-party cookies — same-site
     deployment (admin panel served from same domain as API, or a reverse proxy) is
     strongly recommended over cross-domain cookies.
7. **Password hashing** — `bcrypt` (salt rounds 10+) for the seeded admin and any future
   admin creation.
8. **Zustand auth store** — holds `{ admin: { id, username, role }, isAuthenticated }`
   only (never the password); hydrated on app load via a `GET /api/auth/me` call.

---

## 6. Media Upload Policy (Cloudinary)

- All uploads are **multipart/form-data → NestJS `FileInterceptor`/`FilesInterceptor` → memory buffer**.
- The DTO for the *entire* record (text fields + files) is validated **first**.
- Only after validation passes does the service stream the buffer to Cloudinary.
- Store both `url` and `publicId` so that on **update/delete**, the old Cloudinary asset
  is destroyed (`cloudinary.uploader.destroy(publicId)`) before/along with replacing it —
  preventing orphaned media.
- Centralize this in a reusable `CloudinaryService` (`uploadBuffer`, `destroyAsset`) used
  by every module (Events, Latest Content, Memories, Publications, Downloads, Articles).

---

## 7. Event Status & Scheduling Logic

- Weekly Swalath Majlis: recurring **every Friday, after Maghrib**, at Jeelani Masjid,
  Valanchery, Malappuram, Kerala.
- Monthly Swalath Majlis: recurring **2nd Sunday of every month, after Maghrib**, at
  Sheikh Jeelani Islamic Academy, Mankery, Irimbiliyam, Malappuram, Kerala.
- These recurring templates are stored once as `type: 'weekly' | 'monthly'` with a
  `defaultSchedule`. Admin can create a dated **occurrence** with an **override**
  (different time/venue/date + reason) for a specific week/month without altering the
  template.
- A scheduled job (`@nestjs/schedule` cron, runs hourly) recomputes `status` for every
  event occurrence:
  - `upcoming` → now < start time
  - `ongoing` → start time ≤ now ≤ estimated end time
  - `ended` → now > estimated end time
- Admin endpoint `DELETE /api/admin/events/cleanup/expired` removes all `ended` events
  older than a retention window in one action.
- Public event cards render a status **badge** (color-coded: upcoming/ongoing/ended).

---

## 8. API Surface (Reference)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET  /api/auth/me`

### Events
- `GET  /api/events` — public, paginated (`?page=&limit=`), filter by status
- `GET  /api/admin/events` — admin list (all statuses)
- `POST /api/admin/events` — create (multipart: image + fields)
- `PATCH /api/admin/events/:id`
- `DELETE /api/admin/events/:id`
- `DELETE /api/admin/events/cleanup/expired`
- `GET  /api/events/:id/share` — returns share-ready payload (image + prefilled text) for WhatsApp/status/stories

### Latest Content
- `GET /api/latest-content` (public, paginated)
- `POST /api/admin/latest-content` / `PATCH .../:id` / `DELETE .../:id`

### Cherished Memories
- `GET /api/memories` (public, paginated)
- `POST /api/admin/memories` / `PATCH .../:id` / `DELETE .../:id`
- `GET /api/memories/:id/share`

### Publications
- `GET /api/publications` (public, paginated)
- `POST /api/admin/publications` / `PATCH .../:id` / `DELETE .../:id`

### Downloads
- `GET /api/downloads` (public, paginated)
- `GET /api/downloads/:id/file` — triggers download
- `POST /api/admin/downloads` / `PATCH .../:id` / `DELETE .../:id`

### Articles
- `GET /api/articles` (public, paginated)
- `GET /api/articles/:id`
- `POST /api/admin/articles` (cover + up to 2 inline images + author details)
- `PATCH /api/admin/articles/:id`
- `DELETE /api/admin/articles/:id`
- `GET /api/articles/:id/share`

### Quran (read-only, likely proxied/cached from a public Quran API or local dataset)
- `GET /api/quran/chapters`
- `GET /api/quran/chapters/:id/verses` — verse-by-verse, translation optional via `?translation=true`

All public `GET` list endpoints accept `?page=1&limit=9` and respond with
`{ items, total, hasMore }` to drive the "Load More" button.

---

## 9. Build Phases

### Phase 0 — Project Foundation
- Initialize NestJS project structure (`backend/`), module-per-feature layout
- Configure `@nestjs/config` to load and validate `.env`
- Connect Mongoose to MongoDB; set global `ValidationPipe`, CORS (`credentials: true`,
  origin = `CLIENT_URL`), and global API prefix `api`
- Build shared `CloudinaryService` and `PaginationDto`/`PaginationHelper`
- Build `@Public()` decorator + base `JwtAuthGuard` wiring (guard applied globally)
- **Done when:** app boots, connects to Mongo, health check route responds

### Phase 1 — Auth Module & Admin Seeding
- `Admin` schema + `AuthModule` (login, refresh, logout, me)
- Access/refresh JWT strategies, cookie-setting service (env-aware options)
- Seed script: creates `adminjsc` / hashed `admin123` if not present
- Postman/REST test collection for auth flow
- **Done when:** login sets cookies, `/me` returns admin without password, refresh
  rotates tokens, logout clears cookies

### Phase 2 — Core Content Modules (Backend CRUD)
Build in this order, each following the same pattern (schema → DTOs → service →
controller → Cloudinary hook → pagination):
1. Events (with recurrence/override + status cron + expired cleanup + share endpoint)
2. Latest Content
3. Cherished Memories (+ share endpoint)
4. Publications (articles removed from this module)
5. Downloads (+ file-serving/download endpoint)
- **Done when:** every module has working admin CRUD (auth-protected) and public
  paginated GET, verified via REST client, images correctly stored/removed in Cloudinary

### Phase 3 — Articles Module (New Feature)
- `Article` schema: cover image, up to 2 optional inline images with `position`,
  author object, rich text content
- Admin CRUD with 3-image upload handling and validation-before-upload
- Public list + detail endpoints, share endpoint
- **Done when:** an article can be created with cover + 2 inline images placed between
  content blocks, and fetched/rendered correctly on the public side

### Phase 4 — Admin Dashboard (Frontend)
- Zustand `authStore` (admin data only, no password), hydration on load
- Axios instance with interceptors (attach cookies automatically, refresh-and-retry on 401,
  logout-and-redirect on refresh failure)
- Route guarding: `PrivateRoute` / `PublicRoute` (login page only) wrappers
- Dashboard shell: sidebar navigation, top bar, summary widgets (counts per module,
  upcoming events, recent articles)
- CRUD screens per module: table/list view, create/edit forms (with image previews,
  drag-drop upload), delete confirmations, expired-events cleanup action
- **Done when:** an admin can log in, manage all six content modules end-to-end, and
  session persists across refresh with silent token renewal

### Phase 5 — Public Frontend Refactor
- **Nav bar:** redesign layout/alignment, responsive behavior, active-link states
- **SVG background animations:** lightweight, GPU-cheap (CSS transforms/opacity only,
  no heavy JS particle systems), applied consistently across sections
- **Quran reader:** chapter view renders verse-by-verse; translation hidden by default
  with a per-verse or global toggle to reveal meaning
- **Events & Programs section:** styled message cards for the weekly/monthly Swalath
  Majlis notices (icon + venue + time + recurrence, status badge), "Load More" pagination
- **Latest Content / Memories / Publications / Downloads:** wire to new public APIs,
  "Load More" pattern, share buttons (WhatsApp/status/story deep links with image) on
  Events, Memories, and Articles
- **New Articles section:** list + detail page, inline images placed within content,
  author byline, share button
- **Done when:** public site is fully data-driven from the new backend, animations are
  smooth (no jank on low-end devices), and share links open correctly on mobile

### Phase 6 — Hardening, Testing & Deployment
- Rate limiting on auth endpoints, helmet-style security headers, input sanitization
- Centralized error handling/logging (Nest exception filters)
- E2E tests for auth flow and one CRUD module (pattern reusable for others)
- Production `.env` review (cookie flags, CORS origin, Cloudinary folder structure)
- Deployment checklist (process manager, HTTPS/reverse proxy, MongoDB Atlas or managed DB)
- **Done when:** app runs cleanly under production settings with secure cookies over HTTPS

---

## 10. Suggested Folder Structure (Backend)

```
backend/
├── src/
│   ├── auth/
│   ├── admin/                # shared admin schema/seed
│   ├── events/
│   ├── latest-content/
│   ├── memories/
│   ├── publications/
│   ├── downloads/
│   ├── articles/
│   ├── quran/
│   ├── common/
│   │   ├── decorators/       # @Public()
│   │   ├── guards/           # JwtAuthGuard
│   │   ├── interceptors/
│   │   ├── pagination/
│   │   └── cloudinary/
│   ├── config/
│   ├── app.module.ts
│   └── main.ts
├── .env
└── package.json
```

---

## 11. Execution Notes for Antigravity

- Work strictly phase-by-phase; do not start Phase *n+1* until Phase *n*'s "Done when"
  criteria are verifiable (via REST client calls or UI walkthrough).
- Within each phase, generate schema → DTO → service → controller → module wiring, then
  a short smoke test, before moving to the next module.
- Reuse the shared `CloudinaryService` and pagination helper rather than duplicating
  upload/pagination logic per module.
- Keep the public GET endpoints outside the JWT guard (`@Public()`) so no unnecessary
  token verification overhead occurs on read-heavy public pages.
