## Testing Standards

### General

- Use Vitest for all tests. Test files live alongside their source in the same package.
- Write tests that verify **behavior and contracts**, not implementation details.
  Tests should survive refactoring — if you swap a `switch` for a lookup table, tests should
  still pass.
- Mock external services (network, filesystem), not internal modules.
- Use red-green-refactor: write a failing test first, make it pass, then clean up.

### What to Test

- All pure logic functions (filter engine, serialization, parsing) — these are the easiest
  and highest-value tests.
- API route behavior — correct status codes and response shapes for valid and invalid input.
- Edge cases that are documented as intentional behavior (e.g., graceful degradation on invalid
  input) should have tests proving they work.
- Critical UI interactions that involve meaningful logic (e.g., filter apply/remove/clear behavior).

### What Not to Test

- Trivial getters/setters with no logic.
- Things that the type system or linter already enforces.
- Implementation details like internal function call counts or specific DOM structure.

### Test Quality

- Test names should read as behavioral specifications: "returns all borrowers when filter value
  is not a valid number" — not "test case 3".
- Prefer few, focused assertions per test over large tests that check many things.
- Don't duplicate test fixtures — share them when multiple tests need the same setup.
