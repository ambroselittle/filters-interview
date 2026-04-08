## Architecture and Organization

### Shared Package Is the Source of Truth

All domain types, Zod schemas, field metadata, and serialization utilities live in
`packages/shared/`. Both client and server import from shared — never duplicate these definitions.
If a type or constant is needed by both sides, it belongs in shared.

### Separation of Concerns

- **Server** owns data access and filter execution. Filter logic is pure functions, no side effects.
- **Client** owns UI state (React Hook Form for draft state, Zustand for applied state) and
  presentation. Business logic should not leak into components — extract to hooks or utilities.
- **Shared** owns the contract between client and server. No runtime dependencies on either side.

### Discover and Follow Existing Patterns

Before adding new code, look at how similar things are already done in the codebase. Match the
existing style for:
- How types are defined (Zod schema + inferred type)
- How metadata maps use `Record<X, Y>` for compile-time completeness
- How the filter engine dispatches by field type

### File Organization

- Co-locate related code. Components and their hooks live near each other.
- Don't create new files for trivial amounts of code. Prefer adding to an existing relevant file
  over creating a new one.
- If a new file is needed, verify the right location with the team before creating it.
