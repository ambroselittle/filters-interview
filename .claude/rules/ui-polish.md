---
paths: ["packages/client/**/*.tsx", "packages/client/**/*.ts"]
---

## UI Polish and User Feedback

Every user action that triggers an async operation must provide clear, immediate feedback.

### Loading States

- Show a loading indicator (spinner, skeleton, or disabled state) while async operations are
  in flight. The user should never click a button and see nothing happen.
- Disable interactive controls during loading to prevent duplicate submissions.
- Prefer subtle indicators (inline spinners, opacity changes) over heavy overlays for
  operations that typically complete quickly.

### Error States

- Never silently swallow errors. If an operation fails, the user must see a meaningful message.
- Error messages should be clear, non-technical, and actionable: what went wrong and what the
  user can do about it (retry, check connection, etc.).
- Display errors near the action that caused them when possible (inline), not in a distant
  toast or only in the console.
- Always log the technical error to the console for debugging, in addition to showing the
  user-facing message.
- Provide a way to recover — a retry button, a "try again" prompt, or clear instructions.

### Empty States

- When a list or table has no data, show a helpful empty state — not a blank screen.
- Distinguish between "no results because of filters" and "no data at all" when applicable.

### General

- Don't leave stale data on screen after an operation fails. Either show the error state or
  keep the last known good state with a clear indication that a refresh failed.
- Use Tailwind utility classes for all styling. No inline styles, no CSS modules, no styled-components.
