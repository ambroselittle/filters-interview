---
paths: [".claude/rules/**"]
---

## Rule Authoring

When creating or editing rules in `.claude/rules/`, follow these conventions:

### Scoping

Ask: does this rule only matter for specific file types or directories?

**Add `paths` frontmatter** when the rule applies to:
- Specific file types (`**/*.ts`, `**/*.tsx`)
- Specific directories (`packages/client/**`, `packages/server/**`)
- Specific tools or patterns only relevant in certain files

**Leave unscoped** when the rule:
- Governs general behavior across all work
- Is a process or quality standard, not a code pattern rule
- Can't reliably predict which file types trigger it

### Content

- Lead with the actionable directive, not the rationale.
- Keep rules concise — a rule that's too long won't be read.
- Use concrete examples when the rule might be ambiguous.
- One rule file per topic. Don't combine unrelated concerns.

### Naming

- Use lowercase kebab-case filenames: `code-quality.md`, `ui-polish.md`.
- Name should clearly indicate the topic without reading the file.
