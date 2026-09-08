# Firefin Frontend

Next.js (App Router) + TypeScript + React. Firefin's first store, first demand
sensor, and first operating system — built lean and instrumented.

## What's here now

The first surface is the **Recipe & Batch Lab** (`/lab`) — the internal R&D tool
for perfecting products. Right now that means Blue Flame. It reads from the
Firefin API and lets you:

- Browse products in development (type, status, heat).
- Open a product to see its current gram-weight formula and version history.
- Read the batch log and **log a new batch** with a rating, verdict, and a
  categorized observation (what worked / what didn't).

The customer storefront (Shop, Product Detail, Build Your Freezer, Sauces,
Fire Drops, cart/checkout) comes next and reuses the same product data.

## Structure

```
src/
  app/          routes (App Router) — /lab and /lab/[slug]
  components/   atomic UI pieces (< 500 lines each)
  lib/          API client
  types/        TypeScript mirrors of the API DTOs
```

## Getting started

```bash
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at the API
npm install
npm run dev                        # http://localhost:3000  ->  redirects to /lab
```

The backend must be running (see the firefin-backend repo). The default API base
URL is `http://localhost:5080`.
