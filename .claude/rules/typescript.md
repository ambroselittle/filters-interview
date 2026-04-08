---
paths: ["**/*.ts", "**/*.tsx"]
---

## TypeScript Conventions

### Naming

- Use **PascalCase** for enums, objects, classes, and exported constant collections (maps,
  arrays, config objects): `BorrowerFields`, `OperatorsByType`, `MaritalStatuses`.
- Use **SCREAMING_SNAKE_CASE** only for local, single-valued scalar constants:
  `const MAX_RETRIES = 3`, `const DEFAULT_PORT = 3000`.
- Never use SCREAMING_SNAKE_CASE for exported objects, arrays, maps, or enum-like constants.
  These are PascalCase because they behave like types/classes, not like C preprocessor macros.

### Modules

- Use ES module imports (`import`/`export`), never CommonJS (`require`).
- Prefer named exports over default exports.
- No `any` — use `unknown` and narrow, or define a proper type.
- Prefer interfaces for object shapes, types for unions and intersections.
- Use Zod schemas as the source of truth for validated types, then infer the TypeScript type
  with `z.infer<typeof Schema>`. Don't manually duplicate a type that a schema already defines.
- Use `Record<X, Y>` for metadata maps where compile-time completeness matters (ensures every
  enum value has an entry).
- Use `satisfies` to validate constant shapes without widening the type.
- Avoid type assertions (`as`) when possible. If a cast is necessary, add a comment explaining
  why the type system can't infer it.
- Keep strict mode enabled in all tsconfig files — no exceptions.
