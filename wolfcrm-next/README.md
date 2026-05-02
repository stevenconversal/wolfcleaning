# Wolf CRM — Next.js

Field Service CRM voor zelfstandige buitendienstwerkers. Next.js 14 + Prisma + SQLite + Tailwind CSS.

## Setup in Cursor

```bash
# 1. Open deze map in Cursor
# 2. Open de terminal (Ctrl+`) en run:

npm install
npx prisma db push
npm run seed
npm run dev
```

Open http://localhost:3000 — je hebt een werkende app met 14 klanten en 6 maanden data.

## Wat zit erin

- **Dashboard** — KPI's + recente bezoeken
- **Klanten** — Lijst, detail, aanmaken, bewerken met zoek en filters
- **Klantfiche** — Contactgegevens, notities, bezoekhistoriek, stats
- **Bezoeken** — Registreren vanuit klantfiche
- **Zones** — Aanmaken, bewerken, verwijderen met kleurkeuze

## Tech

- **Next.js 14** App Router (Server Components + Client Components)
- **Prisma** ORM met SQLite (geen database server nodig)
- **Tailwind CSS** met Wolf CRM design tokens
- **TypeScript** doorheen het hele project

## Structuur

```
app/
  dashboard/     → Dashboard pagina (server component)
  clients/       → Klantenlijst, detail, create, edit
  zones/         → Zone beheer
  api/           → REST API routes
components/      → Herbruikbare React componenten
lib/             → Prisma client + utils
prisma/          → Schema + seed
```

## Handige commando's

```bash
npm run dev          # Start dev server
npm run seed         # Seed demo data
npx prisma studio    # Open database GUI
npx prisma db push   # Sync schema naar database
```

## Deploy naar Vercel

1. Push naar GitHub
2. Ga naar vercel.com → New Project → Import repo
3. Vercel detecteert Next.js automatisch
4. Na deploy: ga naar `/api/seed` (POST request) om data te seeden

Voor productie: vervang SQLite door PostgreSQL (Vercel Postgres of Neon).
