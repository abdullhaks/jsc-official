# Production Deployment Checklist

## Environment Variables (`.env`) Review
Ensure your production environment uses the following secure configurations:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=api
CLIENT_URL=https://your-production-domain.com

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/islamic_org_db

# JWT Secrets (Use strong random strings!)
JWT_ACCESS_SECRET=your_super_strong_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_strong_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cookies
COOKIE_DOMAIN=.your-production-domain.com
COOKIE_SECURE=true
COOKIE_SAMESITE=none

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Seed admin (Change these immediately upon deployment)
SEED_ADMIN_USERNAME=admin_prod
SEED_ADMIN_PASSWORD=secure_password_123

DEFAULT_PAGE_LIMIT=9
```

## Pre-Deployment Checklist

1. **Security Headers & Rate Limiting**
   - [x] Helmet is configured to set security-related HTTP headers.
   - [x] Throttler is configured to rate-limit endpoints (specifically auth).
   - [x] Input sanitization is enforced via `ValidationPipe(whitelist: true, forbidNonWhitelisted: true)`.
   - [x] Global Exception Filter (`AllExceptionsFilter`) is catching internal errors cleanly.

2. **Cross-Origin Resource Sharing (CORS)**
   - [x] CORS is enabled.
   - [x] Origin must exactly match `CLIENT_URL` (no trailing slash).
   - [x] `credentials: true` is configured for cookie transport.

3. **Database**
   - [ ] Use a managed MongoDB service (e.g., MongoDB Atlas) for high availability and automated backups.
   - [ ] Whitelist the production server's IP address in MongoDB Atlas.

4. **Process Management**
   - [ ] Install `pm2` globally: `npm install -g pm2`
   - [ ] Build the app: `npm run build`
   - [ ] Start the app with PM2: `pm2 start dist/main.js --name "jsc-api"`
   - [ ] Enable PM2 startup script: `pm2 startup` & `pm2 save`

5. **Reverse Proxy & HTTPS (Nginx)**
   - [ ] Set up Nginx to proxy requests to `http://localhost:3000`.
   - [ ] Provision SSL certificates using Let's Encrypt (Certbot).
   - [ ] Ensure `proxy_set_header` directives correctly pass IP and protocol schemes so that NestJS rate limiting works accurately.

6. **Media Storage (Cloudinary)**
   - [ ] Verify production Cloudinary keys.
   - [ ] Set up folder structure matching development or segmented by environment (e.g., `prod/articles`, `prod/events`).

## Deployment Command Summary

```bash
# Backend
cd backend
npm ci
npm run build
pm2 start dist/main.js --name "jsc-backend"
pm2 save

# Frontend
cd frontend
npm ci
npm run build
# Serve dist/ using Nginx/Apache or deploy to Vercel/Netlify
```
