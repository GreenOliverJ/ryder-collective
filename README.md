# Ryder

Monorepo for **Ryder** — an interactive musicians tech rider. Bands build a stage layout (positions, instruments, technical and sound requirements, audio stems). Visitors open a shareable URL to explore the stage and play mixes.

## Structure

```
packages/
  ryder-backend/   Node.js + Express + MongoDB (repository → service → routes)
  ryder-front/     Quasar (Vue 3) SPA — editor + public stage view
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Docker)

## Setup

```bash
# Start MongoDB (Docker)
docker compose up -d

# From repo root
npm install

# Backend env (already has defaults in packages/ryder-backend/.env)
cp packages/ryder-backend/.env.example packages/ryder-backend/.env

# Frontend env
cp packages/ryder-front/.env.example packages/ryder-front/.env 2>/dev/null || true
```

## Run

```bash
# API + Quasar dev server together
npm run dev

# Or separately
npm run dev:back   # http://localhost:4000
npm run dev:front  # http://localhost:9000
```

## Demo data

```bash
node packages/ryder-backend/scripts/seed-demo.js
```

- Login: `demo@ryder.app` / `demo12345`
- Public stage: http://localhost:9000/stage/demo/demo-gig

## Data model (MongoDB)

Document-oriented fit for nested rider content:

| Collection | Purpose |
|------------|---------|
| `users` | Auth, `handle` for public URLs (`/stage/:handle/:slug`) |
| `riders` | One document per gig/rider: `musicians[]`, `audioTracks[]`, `stage`, `isPublished`, `publicId` |

Users own many riders (`ownerId`). Slug is unique per user. No SQL joins needed for the embedded stage graph.

## API (HTTP)

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/auth/me` | Bearer |
| GET/POST | `/api/riders` | Bearer |
| GET/PATCH/DELETE | `/api/riders/:id` | Bearer |
| GET | `/api/public/stage/:handle/:slug` | — |
| GET | `/api/public/s/:publicId` | — |
| POST | `/api/uploads/:riderId/tracks/:trackId` | Bearer (multipart) |

## Public vs editor

- **Editor** (`/editor/:id`) — authenticated; drag musicians, edit tech rider, upload audio, publish.
- **Public stage** (`/stage/:handle/:slug` or `/s/:publicId`) — read-only interactive view for FOH, venues, band members.

## Mobile later

Quasar is configured as SPA today. The same codebase can target Capacitor/Cordova via Quasar’s build modes when you are ready for native shells.
