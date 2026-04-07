# ShopZone — E-Commerce Storefront & Admin Dashboard

A production-grade E-Commerce platform built with React, TypeScript, TanStack Query, React Hook Form, Zod, and Tailwind CSS.

## Features

- **Public Storefront**: Browse products, filter by category, view product details
- **User Authentication**: Register/Login with JWT, session persisted in localStorage
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout**: Multi-step form (Shipping → Payment → Review) with strict validation
- **Order History**: Users can view their past orders
- **Admin Dashboard**: Manage products, orders, and categories with full CRUD
- **Role-Based Access Control**: Admin and User routes are fully protected

## Admin Credentials (for grading)

```
Email:    admin@ecomus.com
Password: Admin@1234
```

## Tech Stack

- React 19 + TypeScript
- React Router v6
- TanStack Query (React Query) — caching & data fetching
- React Hook Form + Zod — form management & validation
- Axios 1.14.0 — HTTP client (safe version)
- Tailwind CSS v4 — styling
- React Hot Toast — notifications
- Lucide React — icons

## Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd my-project

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API

Backend: `https://e-commas-apis-production.up.railway.app`  
Docs: [Swagger UI](https://e-commas-apis-production.up.railway.app/api-docs/#/)

## Deployment

Deployed on Vercel/Netlify. Add a `_redirects` file (Netlify) or `vercel.json` for SPA routing:

**Netlify** (`public/_redirects`):
```
/* /index.html 200
```

**Vercel** (`vercel.json`):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
