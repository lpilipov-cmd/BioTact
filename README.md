# BIOTACT

**Live:** [bio-tact.vercel.app](https://bio-tact.vercel.app)

A wellness product catalog I designed and built end to end. It presents a curated LR Health & Beauty portfolio in a clean, trustworthy way and routes every order through personal contact instead of an automated checkout.

## What it does

- **8 collections** (Aloe Vera, Immunity, Energy & Focus, Heart & Circulation, and more) with filterable product pages
- **Curated bundles** that group products into simple daily routines
- **Guided entry points** for users who don't know where to start
- **Cart + inquiry flow** so orders are confirmed personally, not by card checkout
- Product data (pack size, catalog price) shown only once verified

## Why it's built this way

The brand sells through personal relationships, so the product problem wasn't "add a checkout", it was "make the catalog clear enough that people know what to ask for". Every page is designed to shorten that decision.

## Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Data | Supabase (PostgreSQL), generated TypeScript types |
| Forms & validation | React Hook Form, Zod |
| Testing | Vitest (unit), Playwright (end-to-end), Supabase DB tests |
| Hosting | Vercel |

## Run locally

```bash
npm install
npm run db:reset     # local Supabase database
npm run dev          # http://localhost:3000
```

Other scripts: `npm run test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`.

---

*BIOTACT presents products from the LR Health & Beauty portfolio and is not the manufacturer of those products.*

Built by [Luka Pilipovic](https://github.com/lpilipov-cmd).
