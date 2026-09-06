# HIMTI KIT

A web application for HIMTI BINUS students to access lesson summaries and software resources.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The native workflow requires PostgreSQL matching `DATABASE_URL`. The development seed creates student NIM `2500000000` in `Binusian 25`, plus representative Computer Science summaries and software links.

## Docker

Docker Desktop users running this repository in WSL must enable integration for the repository's WSL distribution.

Start the local development server with hot reload:

```bash
docker compose up --build
docker compose exec app npm run db:seed
```

Open [http://localhost:3000](http://localhost:3000). Stop and remove the containers with:

```bash
docker compose down
```

Rebuild the image after changing `package.json` or `package-lock.json` so the container's `node_modules` volume is refreshed:

```bash
docker compose down --volumes
docker compose up --build
```

The Docker workflow runs Next.js and PostgreSQL for development. Compose defaults the admin login to `admin` / `change-me`; override `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in your environment before using shared or exposed environments. Administrators manage the student NIM allowlist, persisted cohorts, and cohort-scoped Course and Software resources through `/admin`. The production image remains deferred until deployment requirements are confirmed.

Student cohorts are inferred from the first two digits of each ten-digit NIM (`28xxxxxxxx` becomes `Binusian 28`). The admin allowlist accepts individual entries or a CSV file up to 1 MB with this format:

```csv
name,nim
Jane Student,2800000000
John Student,2900000000
```

CSV imports create missing inferred cohorts and update existing NIMs. Validation is transactional, so an invalid row leaves the allowlist unchanged.

## Checks

```bash
npm run lint
npm test
npm run build
```

See [docs/plan.md](docs/plan.md) for the development plan.
