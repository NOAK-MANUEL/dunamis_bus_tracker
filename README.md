# Dunamis Bus Tracker

A live bus-tracking app for Dunamis International Gospel Centre shuttle
routes: riders see how far a bus is and in what direction; drivers share
their live location from their phone while driving.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. On a phone, use your computer's local network
IP instead of `localhost` (e.g. `http://192.168.x.x:3000`) so the
browser's location permission prompt works correctly — most mobile
browsers only allow geolocation over `https://` or `localhost`, so for a
real deployment put this behind HTTPS (Vercel does this automatically).

## How it works

- **Home page (`/`)** — lists every route and whether the driver is
  currently sharing a location ("live" vs "offline"), refreshing every
  few seconds.
- **Driver page (`/driver`)** — a driver picks their route, enters their
  PIN, and taps "Start sharing location." The page uses the browser's
  GPS (`navigator.geolocation.watchPosition`) and sends an update roughly
  every 8 seconds while it stays open.
- **Bus detail page (`/bus/[id]`)** — asks the rider for their own
  location, then shows the distance and compass direction to the bus,
  refreshing every few seconds.

## Driver PINs (demo data)

Each seeded route has a 4-digit PIN in `lib/store.ts`. Change these
before sharing the app with real drivers:

| Route              | PIN  |
|---------------------|------|
| Kubwa Express        | 1234 |
| Gwarinpa Shuttle      | 2345 |
| Nyanya - Karu Line    | 3456 |
| Lugbe Connector       | 4567 |

## Moving beyond the demo backend

Bus locations are currently kept in server memory (`lib/store.ts`) —
simple to run, but it resets on every restart and won't work across
multiple server instances. When you're ready to go live for the whole
church:

1. Swap `lib/store.ts` for a real database — Firebase Realtime Database
   or Supabase (Postgres + realtime subscriptions) are both good fits,
   since they push updates to riders instantly instead of waiting for
   the next poll.
2. Replace the plain-text PINs with hashed values, and consider giving
   each driver their own login rather than one shared PIN per route.
3. Add an admin page for your route coordinators to add/edit routes
   instead of editing `lib/store.ts` by hand.

## Tech stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase. No external map or
backend service required for this version.
