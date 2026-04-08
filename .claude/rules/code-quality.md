## Code Quality and Cleanliness

- Write clean, readable code. If a staff+ engineer wouldn't approve it, iterate before reporting done.
- Follow DRY — extract reusable logic, but don't create abstractions for one-time operations.
  Three similar lines is better than a premature abstraction.
- Use meaningful names. Avoid abbreviations unless they're universally understood in context.
- Keep functions focused on a single responsibility.
- No dead code — if something becomes unused as part of a change, remove it in the same change.
- No commented-out code. Git history is the archive.
- Only add comments where the logic isn't self-evident. Don't add docstrings or type annotations
  to code you didn't change.
- Prefer explicit over clever. A clear `if/else` beats a dense ternary chain.
  Never nest ternary operators — use `if/else` or `switch` for multiple conditions.
- Don't add error handling, fallbacks, or validation for scenarios that can't happen.
  Trust internal code and framework guarantees. Validate at system boundaries (user input,
  external APIs).
