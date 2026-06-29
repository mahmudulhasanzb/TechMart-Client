# TechMart Client

Frontend for TechMart — e-commerce platform. Built with Next.js 16, React 19, HeroUI, Tailwind CSS 4.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 |
| UI | React 19 + HeroUI v3 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Auth | Better Auth + MongoDB adapter |
| Icons | Lucide React, Gravity UI Icons |
| DB | MongoDB |

## Setup

```bash
# install deps
npm install

# copy env and fill values
cp .env.example .env

# run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev    # dev server
npm run build  # production build
npm run start  # run production build
npm run lint   # lint
```

## Project Structure

```
src/
├── app/         # Next.js App Router pages & layouts
├── components/  # Reusable UI components
└── lib/         # Utilities, auth config, DB helpers
```

## Environment Variables

Create `.env` from `.env.example`. Required vars:

- `BETTER_AUTH_SECRET` — auth secret key
- `MONGODB_URI` — MongoDB connection string
- `NEXT_PUBLIC_APP_URL` — public app URL
