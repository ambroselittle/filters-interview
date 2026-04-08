---
skill: start-work
issue: none
branch: ambrose/feature-complete
status: in-progress
---

# Plan: Loancrate Filters — Feature Complete

> Extend the borrower table view with a compound filter builder supporting string, number, and date
> field types. Filtering is performed server-side via a new POST endpoint. The client maintains a
> Zustand store that keeps pending form state, applied state, and URL query string in sync so
> filter configurations are shareable and bookmarkable.

## Context

- **Issue:** No issue — take-home challenge spec
- **Goal:** All three filter types (string, number, date) working end-to-end with server-side
  filtering, URL sync, clean commit history, and code that passes a style/cleanliness review
- **Scope:** packages/shared (types + schemas), packages/server (POST endpoint + filter logic),
  packages/client (state store + filter UI); paging is out of scope

## Requirements Checklist

- [ ] R1: String filters (Is, Includes) for firstName, lastName, maritalStatus, emailAddress,
       homePhone, cellPhone, currentAddress, employer, title, subjectPropertyAddress
- [ ] R2: Number filters (Is less than, Is, Is greater than) for creditScore, w2Income
- [ ] R3: Date filters (Is less than, Is, Is greater than) for dateOfBirth, startDate
- [ ] R4: All filters AND-ed together
- [ ] R5: Server-side filtering via POST /borrowers/search
- [ ] R6: URL ?filters= param stays in sync; loading URL applies those filters
- [ ] Apply button disabled when no pending changes (isDirty = false)
- [ ] X button removes individual filter rows
- [ ] Empty state shown when no filters added
- [ ] All Vitest tests pass
- [ ] No TypeScript errors
- [ ] Code passes style/cleanliness review

## Relevant Files

| File | Role |
|------|------|
| `packages/shared/index.ts` | Shared types + constants; will add Zod schemas, BorrowerFilterFields, serialize utils |
| `packages/server/index.ts` | Express app; will add POST /borrowers/search route |
| `packages/server/filters.ts` | New — pure applyFilters function + per-type operator logic |
| `packages/client/App.tsx` | Root component; will wire FilterBar + table to filter store |
| `packages/client/store/filterStore.ts` | New — Zustand filter store |
| `packages/client/hooks/useUrlFilters.ts` | New — URL ↔ filter state sync |
| `packages/client/components/FilterBar.tsx` | New — compound filter UI matching wireframes |
| `packages/client/components/FilterRow.tsx` | New — single filter row (field/operator/value/remove) |

## Phases

### Phase 1: Foundation — Infra, Schemas, and Server Endpoint

**Goal:** Testing framework, styling, shared types, and the server filtering function are all in
place with tests passing. No UI changes yet — foundation only.

**Tasks:**
- [x] `chore: add Vitest with co-located test config` — install `vitest`, add `vitest.config.ts`
      to both `packages/server` and `packages/client`; add `"test": "vitest run"` to each
      package's scripts; add a smoke test (`1 + 1 === 2`) to confirm setup
- [x] `chore: add Tailwind v4 to client` — install `tailwindcss @tailwindcss/vite`; add Vite
      plugin to `packages/client/vite.config.ts`; add `@import "tailwindcss"` to `style.css`;
      verify dev server still starts
- [x] `chore: add Zustand, Zod, and React Hook Form to client` — install `zustand`, `zod`,
      `react-hook-form`, `@hookform/resolvers`; no usage yet, just install + TS compiles clean
- [x] `feat(shared): add FieldType, FilterOperator, FilterCondition schema and BorrowerFilterFields`
      — in `packages/shared/index.ts`: define `FieldType` union (`'string' | 'number' | 'date'`);
      define `FilterOperator` union (`'is' | 'includes' | 'lt' | 'gt'`); define `FilterCondition`
      Zod schema (`{ field, operator, value: string }`) and infer TS type from it; add
      `SearchRequest` Zod schema (`{ filters: FilterCondition[] }`); add `BorrowerFilterFields`
      map (PascalCase object: `{ [field: keyof Borrower]: { label: string; type: FieldType } }`)
      covering all 14 filterable fields; export everything
- [x] `feat(shared): add filter serialization utilities` — add `serializeFilters` (
      `FilterCondition[] → string`, JSON + base64 or plain JSON) and `deserializeFilters`
      (`string → FilterCondition[]`, validates with Zod, returns `[]` on parse error) to
      `packages/shared/index.ts`; add `shared/filterSerialization.test.ts` with round-trip tests
      and invalid-input safety tests
- [x] `feat(server): add applyFilters with string operator tests` — create
      `packages/server/filters.ts` with `applyFilters(borrowers, conditions)` pure function;
      write `filters.test.ts` first (red): tests for string `is` (exact, case-insensitive),
      string `includes` (substring, case-insensitive), multiple conditions AND-ed; implement to
      green; export function
- [x] `feat(server): add POST /borrowers/search endpoint` — in `packages/server/index.ts` add
      `POST /borrowers/search`; parse + validate body with `SearchRequest` Zod schema; call
      `applyFilters`; return filtered array; keep existing `GET /borrowers` intact

**Verify:**
- [ ] `npm test` in `packages/server` — all tests green
- [ ] `npm test` in `packages/shared` (if test added) — green
- [ ] `npx tsc --noEmit` from root — no errors
- [ ] Dev server starts (`npm run dev`) and `GET /borrowers` still returns 100 borrowers

---

### Phase 2: String Filters — End-to-End Working (R1, R4, R5, R6)

**Goal:** String filters are fully functional from UI to server and back. URL sync works.
This is the gut-check milestone before adding number/date types.

**Tasks:**
- [x] `feat(shared): add display labels for filter operators` — add `labels.ts` to
      `packages/client/src/` (or `packages/shared/`) with all UI strings: operator labels
      (`{ is: 'Is', includes: 'Includes', lt: 'Is less than', gt: 'Is greater than' }`),
      placeholder text, button labels — single place for all display strings (localization seam)
- [x] `feat(client): add Zustand filter store` — create
      `packages/client/src/store/filterStore.ts`; store shape:
      `appliedFilters`, `pendingFilters`, `isDirty` (computed), actions: `addCondition`,
      `removeCondition`, `updateCondition`, `applyFilters`, `resetPending`; `isDirty` is
      `JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters)`
- [x] `feat(client): add useUrlFilters hook` — create
      `packages/client/src/hooks/useUrlFilters.ts`; on mount: read `?filters=` from
      `window.location.search`, call `deserializeFilters`, set both `appliedFilters` and
      `pendingFilters` in store; on `appliedFilters` change: call `serializeFilters`, push to
      URL via `history.replaceState` (no page reload)
- [x] `feat(client): add FilterRow component` — create
      `packages/client/src/components/FilterRow.tsx`; renders: row label ("Where"/"AND"),
      field `<select>` (only string-type fields from `BorrowerFilterFields`), operator
      `<select>` (operators valid for selected field type), value `<input>`, X remove button;
      controlled via React Hook Form field array; Tailwind classes for layout
- [x] `feat(client): add FilterBar component` — create
      `packages/client/src/components/FilterBar.tsx`; renders: "Filters" heading + "Add Filter"
      button (top right); empty state when no conditions; list of `FilterRow` components;
      "Apply Filters" button (disabled when `!isDirty`); uses `useForm` from RHF with Zod
      resolver; on Apply: validate → call store `applyFilters` → triggers `useUrlFilters` URL
      update → triggers server fetch
- [x] `feat(client): wire FilterBar to App and fetch on apply` — update `App.tsx`: add
      `useUrlFilters()` call; move `getBorrowers` to use POST `/borrowers/search` with
      `appliedFilters` as body; subscribe to `appliedFilters` changes to re-fetch; render
      `<FilterBar />` above table; keep `<table>` rendering unchanged

**Verify:**
- [ ] `npm test` — all green
- [ ] Manual: add "firstName Is Matt" → Apply → table shows 2 rows (Matt Spencer, Matt Toy)
- [ ] Manual: add "firstName Is Matt" + "lastName Is Toy" → Apply → table shows 1 row
- [ ] Manual: reload page with `?filters=` in URL → same filters re-applied automatically
- [ ] Manual: copy URL, open in new tab → same filtered state
- [ ] `npx tsc --noEmit` — no errors

---

### Phase 3: Number + Date Filters — Feature Complete (R2, R3)

**Goal:** All three filter types working. All 14 fields available. Feature complete per spec.

**Tasks:**
- [x] `feat(server): extend applyFilters with number operator tests` — in `filters.test.ts`:
      add tests for `lt`, `is`, `gt` on number fields; add tests for edge cases (NaN value,
      boundary values); implement in `filters.ts` — parse `value` as `Number`, apply comparison
- [x] `feat(server): extend applyFilters with date operator tests` — in `filters.test.ts`:
      add tests for `lt`, `is`, `gt` on date fields (stored as MM/DD/YYYY strings); implement
      in `filters.ts` — parse stored date string to `Date`, parse filter value (`YYYY-MM-DD`
      from `<input type="date">`) to `Date`, compare `getTime()`; handle invalid dates gracefully
- [x] `feat(client): extend FilterRow for number and date field types` — update `FilterRow.tsx`:
      field `<select>` now shows ALL filterable fields (string + number + date); when field
      changes, operator options update based on `BorrowerFilterFields[field].type`; when type
      is `'number'`, value input is `<input type="number">`; when type is `'date'`, value input
      is `<input type="date">`; Zod validation schema updates accordingly
- [x] `feat(client): use Intl for table number and date formatting` — in table rendering in
      `App.tsx`: format number fields (creditScore, w2Income) with `Intl.NumberFormat('en-US')`;
      format date fields (dateOfBirth, startDate) with
      `Intl.DateTimeFormat('en-US', { dateStyle: 'short' })` — cosmetic improvement, localization seam

**Verify:**
- [x] `npm test` — all tests green, including new number + date cases
- [x] Manual: creditScore Is greater than 800 → verify only high-score borrowers shown
- [x] Manual: dateOfBirth Is less than 1970-01-01 (as date input) → verify older borrowers shown
- [x] Manual: dateOfBirth lt 1970-01-01 AND creditScore gt 800 → AND works across types (9 results)
- [x] `npx tsc --noEmit` — no errors
- [x] All R1–R6 acceptance criteria met

---

### Phase 4: Style + Cleanliness Review

**Goal:** Code is interview-ready. DRY, no dead code, clean naming, extensible design.

**Tasks:**
- [ ] `refactor: style and cleanliness pass` — review all changed files for: duplicate logic,
      inconsistent naming, unused imports/variables, magic strings that should be in labels.ts,
      operator/type dispatch that should be table-driven rather than if/else chains; fix anything
      found; confirm adding a new operator (e.g. `gte`) requires changes in only 1–2 places
- [ ] `docs: update README with setup, run, and test instructions` — ensure README covers:
      `npm install`, `npm run dev`, `npm test`; brief description of filter architecture

**Verify:**
- [ ] Full requirements checklist at top of this plan — all items checked
- [ ] `npm test` across all packages — green
- [ ] `npx tsc --noEmit` — clean
- [ ] Read through each new file as if reviewing a PR — would a senior engineer approve?

---

## Verification Commands

```bash
# From packages/server
npm test

# From packages/client (after Vitest added)
npm test

# TypeScript — from repo root
npx tsc --noEmit

# Full dev stack
npm run dev
```

## Open Questions

- None — all architecture decisions finalized in pre-planning session

## Out of Scope

- Pagination
- OR logic between filters
- Filter persistence beyond URL (localStorage, etc.)
- shadcn/ui date picker upgrade (polish phase, post-feature-complete)
- Deployed environment / CI

## Lessons

<!-- Populated during the work by /hack and /learn -->
