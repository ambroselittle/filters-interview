# Borrower Filters — Interview Sample App

A TypeScript monorepo implementing server-side compound (AND-only) filtering for borrower data.

## Structure

```
packages/
  shared/    — Types, Zod schemas, field metadata, URL serialization (consumed by both client and server)
  server/    — Express 5 API with POST /borrowers/search, filter engine
  client/    — React 19 + Vite SPA with filter UI
```

The **shared package** is the single source of truth for domain types, filter schemas, field
metadata (`BorrowerFields`, `OperatorsByType`), value validation (`validateFilterValues`), and
serialization. Both client and server import from it — never duplicate these definitions.

## Tech Stack

- **Runtime:** Node.js 22, npm 10 workspaces
- **Language:** TypeScript 5.9 (strict)
- **Client:** React 19, Vite, Zustand (filter store), React Hook Form + Zod (filter form), Tailwind v4
- **Server:** Express 5, tsx (TypeScript execution)
- **Testing:** Vitest

## Build and Run

```sh
npm install                # install all workspace dependencies
npm start                  # start both client and server (concurrently)
npm run dev:client         # client only (Vite dev server, port 1234)
npm run dev:server         # server only (tsx watch, port 3000)
```

## Testing

```sh
npm test --workspace=packages/server   # server filter logic
npm test --workspace=packages/shared   # serialization utilities
```

No client-side tests yet. Server and shared tests use Vitest.

## Data Flow

1. User builds filter conditions in `FilterBar` (React Hook Form + Zod validation, pending state)
2. On Apply / row remove / Clear All / dropdown change -> `FilterBar` writes to the Zustand `filterStore`
3. `filterStore` initializes from URL `?filters=` on creation; `useUrlFilters` writes store changes back to URL (one-way sync)
4. `BorrowerTableProvider` re-fetches from `POST /borrowers/search` via `useBorrowers` whenever `appliedFilters` changes

## Key Files

| Purpose | File |
|---------|------|
| Domain types, schemas, field metadata | `packages/shared/index.ts` |
| Filter engine (pure function) | `packages/server/filters.ts` |
| Express API routes | `packages/server/index.ts` |
| Zustand filter store (initializes from URL) | `packages/client/store/filterStore.ts` |
| Filter UI components | `packages/client/components/FilterBar.tsx`, `FilterRow.tsx` |
| Borrower table + expandable rows | `packages/client/components/BorrowerTable.tsx`, `BorrowerRow.tsx`, `BorrowerDetail.tsx` |
| Grid column config, cell formatting | `packages/client/borrowerGrid.ts` |
| Table + row context providers | `packages/client/context/BorrowerTableContext.tsx`, `BorrowerRowContext.tsx` |
| Data fetching hook | `packages/client/hooks/useBorrowers.ts` |
| URL sync hook (write-only) | `packages/client/hooks/useUrlFilters.ts` |
| API client | `packages/client/api.ts` |
| UI string constants | `packages/client/labels.ts` |

## Extensibility

Adding a new filter operator (e.g., `gte`) requires changes in exactly two places:
1. `shared/index.ts` — add to `FilterOperator` enum and `OperatorsByType`
2. `server/filters.ts` — add a case to the relevant type handler

Adding a new filterable field requires updating `FilterableField`, `BorrowerFields`, and
optionally `BorrowerFieldName` in `shared/index.ts`. For fields with constrained values,
add `allowedValues` to the `FieldMeta` entry — the filter UI will render a dropdown
automatically, and `validateFilterValues` will enforce them server-side.
