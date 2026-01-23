# 🎓 HTI Academic Student Portal Design and Development of a Comprehensive Digital Transformation Solution for HTI.

Comprehensive monorepo for the HTI-portal application. This repository contains two main packages:

- `backend/` — Node.js + Express API server (MySQL - Redis)
- `frontend/` — React app built with Vite

This README gives clear, actionable steps to run, build, and deploy both parts locally and with Docker.

## Table of contents

- [Overview](#overview)
- [Project layout](#project-layout)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Backend — install & run](#backend-—-install--run)
- [Frontend — install & run](#frontend-—-install--run)
- [Run both for development](#run-both-for-development)
- [Build / Production notes](#build--production-notes)
- [Docker (optional)](#docker-optional)
- [Seed data & logs](#seed-data--logs)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

The backend exposes REST endpoints and uses MySQL for persistence. The frontend is a single-page React app that consumes the backend API. Redis is optionally used for caching and socket adapter (see `backend/utils/redisClient.js` and `backend/utils/socket.js`).

## Project layout

- `backend/` — API server
  - `config/`, `controllers/`, `models/`, `routes/`, `middlewares/`, `seeders/`, `logs/`, `Dockerfile`
- `frontend/` — React + Vite app
  - `src/`, `public/`, `vite.config.js`, `Dockerfile`

## Prerequisites

- Node.js 16+ (or the version used by the project)
- npm (or yarn)
- MySQL server (local or remote)
- Optional: Docker & Docker Compose

On Windows PowerShell, verify Node and npm with:

```powershell
node --version; npm --version
```

## Environment variables

Create `.env` files in `backend/`:

```text
### Server Config ###
NODE_ENV=
port=
CLIENT_URL=

### Tokent Secret Used to Assign JTW Tokens ###
TOKEN_SECRET=

### DataBases ###

# MYSQL
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Redis
REDIS_URL=

### Send-Email ###
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_USERNAME=
```
Create `.env` files in `frontend/`

```text
VITE_BASE_API_URL=
VITE_BASE_API_SOCKET_URL=
```

## Backend — install & run

1. Install dependencies and start the server (PowerShell):

```powershell
cd backend
npm install
# development (if a `dev` script exists, e.g., nodemon):
npm run dev
# production:
npm start
```

2. Common locations:

- Logs: `backend/logs/`
- Seeders: `backend/seeders/`

## Frontend — install & run

1. Install and run dev server:

```powershell
cd frontend
npm install
npm run dev
```

2. Build for production and preview:

```powershell
cd frontend
npm install
npm run build
```

By default Vite serves on port 5173. If the app needs to call the backend running on a different host/port, update the API base URL in `frontend/src/Api` or use environment variables (e.g., `VITE_API_BASE_URL`).

## Run both for development

Open two terminals.

Terminal A — backend:

```powershell
cd backend
npm install
npm run start
```

Terminal B — frontend:

```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` (or the URL Vite prints). Ensure the frontend's API base URL points to the backend (e.g., `http://localhost:3000`).

## Build / Production notes

- Build the frontend (`npm run build`) and serve the static output with a CDN or a static server (Nginx) or have the backend serve it.
- Ensure environment variables (DB, JWT, SMTP) are set on the production host.

## Docker (optional)

Both packages include Dockerfiles. There is no top-level `docker-compose.yml` included by default.

Quick example to build images:

```powershell
# Build
docker build -f backend/Dockerfile -t hti-backend:latest backend
docker build -f frontend/Dockerfile -t hti-frontend:latest frontend

# Run (example; adapt ports and envs)
docker run -d -p 3000:3000 --name hti-backend -e DB_HOST=... hti-backend:latest
docker run -d -p 5173:5173 --name hti-frontend hti-frontend:latest
```

If you'd like, I can add a `docker-compose.yml` that runs MySQL + Redis + backend + frontend for local development.

## Seed data & logs

- Seeders: `backend/seeders/` — run any seeder scripts directly (e.g., `node seeders/Seed.js`) or via an npm script if provided.
- Logs are written to `backend/logs/` (e.g., `combined.log`, `error.log`). Check them for server errors.

## Troubleshooting

- Database connection errors: verify `DB_*` env variables and that MySQL accepts connections from your host.
- CORS errors: ensure backend enables CORS for the frontend origin or use a proxy in dev.
- Port conflicts: change ports in scripts, `vite.config.js`, or Docker commands.

If you see a git push rejection, fetch and rebase/merge first:

```powershell
git fetch origin
git rebase origin/main  # or origin/<default-branch>
```

## Contributing

- Create a branch for each feature/fix: `git checkout -b feat/your-feature`.
- Keep commits small and focused.
- Push, open a Pull Request, and request reviews.

If you want, I can create a PR for the README+LICENSE changes.

## License

This repository is licensed under the Apache License, Version 2.0.

See the full license text in `LICENSE` or `LICENSE_APACHE_2.0.txt` in the repository root.

---