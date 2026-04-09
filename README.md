# Borrower Filters

A TypeScript monorepo implementing server-side compound (AND-only) filtering for borrower data.
Built as a take-home interview project demonstrating full-stack filter architecture with
React 19, Express 5, Prisma, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22, npm 10 workspaces |
| Language | TypeScript 5.9 (strict) |
| Client | React 19, Vite, Zustand, React Hook Form + Zod, Tailwind v4 |
| Server | Express 5, Prisma ORM, tsx |
| Database | PostgreSQL 16 (Docker Compose for local dev) |
| Testing | Vitest |

## Setup

### Node.js

We recommend [nvm](https://github.com/nvm-sh/nvm) to install the exact version
expected by this project:

```sh
nvm install   # reads .nvmrc
```

### Database

Start PostgreSQL via Docker Compose:

```sh
docker compose up -d
```

Copy `.env.example` to `.env` and set `DATABASE_URL` if needed (defaults work
with the Docker Compose config).

Run migrations and seed data:

```sh
npx prisma migrate deploy --schema=packages/server/prisma/schema.prisma
npm run db:seed
```

### Dependencies

```sh
npm install
```

## Running

```sh
npm start                  # start both client and server (concurrently)
npm run dev:client         # client only (Vite dev server, port 1234)
npm run dev:server         # server only (tsx watch, port 1337)
```

Open `http://localhost:1234`. You'll see a summary table of borrower data with
expandable detail rows and a filter bar.

## Testing

```sh
npm test --workspace=packages/server   # server filter logic
npm test --workspace=packages/shared   # serialization + validation utilities
```

## Project Structure

```
packages/
  shared/    — Types, Zod schemas, field metadata, validation, URL serialization
  server/    — Express API, Prisma client, filter engine
  client/    — React SPA with filter UI and borrower table
```

The **shared package** is the single source of truth for domain types, filter
schemas, field metadata (`BorrowerFields`, `OperatorsByType`), value validation,
and serialization. Both client and server import from it.

## Architecture

### Filter System

Filters are compound (AND-only) and applied server-side via `POST /borrowers/search`.
The API validates filter values against field types — invalid values (e.g., non-numeric
credit score) return a 400 with descriptive errors.

**Data flow:**

1. User builds conditions in `FilterBar` (React Hook Form + Zod, pending state)
2. On Apply / row remove / Clear All / dropdown change -> filters write to the Zustand `filterStore`
3. `filterStore` initializes from URL `?filters=` on creation; `useUrlFilters` writes changes back to URL (shareable links)
4. `BorrowerTableProvider` re-fetches via `useBorrowers` whenever `appliedFilters` changes

### Borrower Table

The grid shows 9 summary columns focused on loan-relevant data (name, DOB, credit
score, marital status, W2 income, employer, start date, subject property). Click any
row to expand an inline detail panel with the remaining fields. Multiple rows can be
expanded simultaneously.

React context providers (`BorrowerTableContext`, `BorrowerRowContext`) manage table
and row state, keeping components decoupled from prop drilling.

### UI Touches

- Fields with constrained values (e.g., marital status) render as dropdowns in the filter UI
- Changing a field, operator, or dropdown value auto-applies the filter
- Switching between plain string fields preserves the typed value

### Extensibility

Adding a new filter operator (e.g., `gte`) requires changes in exactly two places:
1. `shared/index.ts` — add to `FilterOperator` enum and `OperatorsByType`
2. `server/prismaFilters.ts` — add a case to the relevant type handler

Adding a new filterable field requires updating `FilterableField`, `BorrowerFields`,
and optionally `BorrowerFieldName` in `shared/index.ts`. For fields with constrained
values, add `allowedValues` to the `FieldMeta` entry — the filter UI renders a
dropdown automatically, and server-side validation enforces them.

## Docker

Container definitions are provided for both services:

- `Dockerfile.api` — Node 22, Express server (port 1337)
- `Dockerfile.web` — nginx SPA server (port 80)
- `docker-compose.yml` — PostgreSQL 16 for local development
