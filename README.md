# Setup

## Node.js

We recommend using [nvm](https://github.com/nvm-sh/nvm) to install the exact
version Node.js expected by this project. Quick installation commands:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Then run `nvm install` to install and use the project version in `.nvmrc`.

## Package Dependencies

In the project root, run `npm install` to install all workspace dependencies.

# Running

- In the project root, run `npm start` to start both client and server concurrently
- Or start them individually:
  - `npm run dev:client` to start only the client dev server
  - `npm run dev:server` to start only the server dev server

Open `http://localhost:1234`. There should be a table of borrower data.

# Testing

Run tests from the project root:

```sh
npm test --workspace=packages/server   # server filter logic (Vitest)
npm test --workspace=packages/shared   # serialization utilities (Vitest)
```

# Filter Architecture

Filters are compound (AND-only) and applied server-side via `POST /borrowers/search`.

**Data flow:**
1. User builds conditions in `FilterBar` (React Hook Form + Zod, pending state)
2. On Apply / row remove / Clear All → `FilterBar` writes to the Zustand `filterStore`
3. `useUrlFilters` hook syncs `appliedFilters` ↔ URL `?filters=` param (shareable links)
4. `App` re-fetches from `POST /borrowers/search` whenever `appliedFilters` changes

**Key files:**
- `packages/shared/index.ts` — types, schemas, `BorrowerFilterFields` map, `OperatorsByType`, URL serialization
- `packages/server/filters.ts` — pure `applyFilters` function, type-dispatched comparison handlers
- `packages/client/store/filterStore.ts` — thin Zustand store (committed filter state only)
- `packages/client/components/FilterBar.tsx` / `FilterRow.tsx` — filter UI

**Extensibility:** Adding a new operator (e.g. `gte`) requires changes in exactly two places:
1. `shared/index.ts` — add to `FilterOperator` enum and `OperatorsByType`
2. `server/filters.ts` — add a case to the relevant type handler

# Tech Stack

- **Javascript Runtime**: Node.js 22
- **Package Manager**: npm 10
- **Language**: TypeScript 5.9
- **Client**: React 19 + Vite + Zustand + React Hook Form + Zod + Tailwind v4
- **Server**: Express 5 + tsx (TypeScript execution)
