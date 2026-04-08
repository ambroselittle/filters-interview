## Dependency Management

- Never use unpinned versions (`"latest"`, `"*"`, or unbounded ranges) in `package.json`.
  All dependencies must specify a bounded version: exact (`1.2.3`), caret (`^1.2.3`),
  or tilde (`~1.2.3`).
- Prefer the narrowest version range that allows reasonable updates.
- Before adding a new dependency, check if the need can be met with what's already installed
  or with a small utility. Don't add a library for a single function call.
- When removing code that was the sole consumer of a dependency, remove the dependency too.
