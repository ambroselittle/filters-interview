# Enhancement Ideas — Loancrate Filters App

These are post-feature-complete enhancement ideas, ordered roughly by signal/value for LoanCrate specifically.
Pick one and run with it, or combine related ones.

---

## 1. Loan Status Field (highest LoanCrate signal)

Add a `loanStatus` field to the Borrower model with an enum progression:
`submitted → in_review → pre_approved → approved → denied`

**Why it's good:** Shows domain understanding of what LoanCrate actually does. Slots naturally into
the existing filter system as a new field type (select/enum). Enables bulk actions that make sense.

**What to build:**
- Add `loanStatus` to the Prisma schema (`String`, default `"submitted"`)
- Add to the `borrowers.json` seed with realistic distribution (most `in_review`, some `pre_approved`, a few `approved`/`denied`)
- Add `loanStatus` to `BorrowerFilterFields` in shared with type `"string"` and operator `"is"` only
- Add a styled status badge to the table row (color-coded: yellow=in_review, green=approved, red=denied, etc.)
- Add a select/dropdown input variant to `FilterRow` for enum fields

---

## 2. Row Expand / Detail Panel

Click a table row to expand and see all 14 fields in a structured layout. Currently the table only
shows a subset; the rest (employer, title, phones, addresses, etc.) are invisible to the user.

**Why it's good:** Realistic pattern for loan officer workflow — scan the list, click in for details.
No backend changes needed.

**What to build:**
- Inline accordion expand below the row, OR a slide-out right panel
- Display all 14 fields in a clean two-column grid with labels from `BorrowerFilterFields`
- Date fields should be formatted nicely (already have `Intl` formatting in the table)
- Highlight any fields that have an active filter applied

---

## 3. Edit Borrower Modal

Click an edit icon on a row to open a modal for editing. Use the same RHF + Zod stack already in
place for filters, but for writes.

**Fields that make sense to edit** (mortgage processing context — data changes as a loan progresses):
- `creditScore` — re-pulled, score updates
- `w2Income` — income verified/corrected as docs arrive
- `employer`, `title`, `startDate` — employment verification
- `emailAddress`, `homePhone`, `cellPhone` — contact corrections
- `currentAddress`, `subjectPropertyAddress` — address changes
- `maritalStatus` — affects loan eligibility
- `loanStatus` (if built) — loan officer advances the status

**NOT editable** (identity fields, frozen once verified): `firstName`, `lastName`, `dateOfBirth`

**What to build:**
- `PUT /borrowers/:id` endpoint (Prisma `update`)
- Edit modal component with RHF form, Zod validation schema for the editable fields
- Inline edit icon button on each table row
- Optimistic update or refetch after save

---

## 4. Bulk Actions

Checkbox column on the table, action toolbar appears when rows are selected.

**Meaningful actions** (especially with loanStatus):
- "Move to In Review" / "Approve" / "Deny" — mass status update
- "Export to CSV" — always useful, pure client-side, no backend needed

**What to build:**
- Checkbox in each row + select-all in header
- Floating action bar that appears at bottom when selection is non-empty
- `PATCH /borrowers/bulk` endpoint for status updates (array of ids + new status)
- CSV export: client-side `Blob` download from current filtered result set

---

## Suggested combos

- **Quickest win:** Row expand (#2) — pure frontend, no backend, impressive UX
- **Best LoanCrate story:** Loan status (#1) + status badge in table + status filter
- **Most complete demo:** Loan status (#1) + edit modal (#3) — shows full CRUD lifecycle
- **Showstopper combo:** All four — ~3-4 hours of focused work

---

## Tech notes

- Prisma is already wired up on the `ambrose/db-and-deploy` branch (RDS Postgres, seeded borrowers)
- RHF + Zod already in place for the filter form — reuse for edit modal validation
- Table component is in `packages/client/App.tsx` and `packages/client/components/`
- Shared types are in `packages/shared/index.ts` — add new fields/schemas there
- Branch off `main` (feature-complete is merged); stack on or alongside `ambrose/db-and-deploy`
