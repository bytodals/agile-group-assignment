# Design tokens and usage

This repository centralizes visual design variables as CSS custom properties so every team member and app can share the same tokens.

Location of the runtime tokens

- Primary tokens in: "AnnaBook/src/styles/tokens.css"
- Frontend base/layout stylesheet: "AnnaBook/src/globals.css" (imports the token file and adds app-level styles)

What this file documents

- Canonical token names and purpose (colors, spacing, radii, typography)
- How to consume the tokens from CSS, JS/React, and component libraries
- Guidelines for adding or changing tokens

Token reference (from "tokens.css")

Colors

- --color-brand: #1B3B36            — primary color
- --color-brand-strong: #112723     — stronger brand variant
- --color-brand-soft: #cfece6       — soft brand background
- --color-secondary: #BC936A        — secondary/accent color
- --color-accent-strong: #7f5e3f
- --color-accent-soft: #efd0ad
- --color-surface: #FAF7F2          — default page background
- --color-surface-raised: #FFFFFF   — elevated surface backgrounds
- --color-surface-muted: #f0ece8
- --color-border: #E6E1DD
- --color-text: #0F172A
- --color-text-muted: #6B7280
- --color-text-inverse: #FFFFFF
- --color-success: #10B981
- --color-danger: #EF4444
- --color-warning: #F59E0B

Spacing

- --space-xs: 4px
- --space-sm: 8px
- --space-md: 16px
- --space-lg: 24px
- --space-xl: 32px
- --space-md-plus: 12px
- --space-lg-plus: 18px
- --space-xl-plus: 20px
- --space-2xl: 28px
- --space-3xl: 40px
- --space-4xl: 56px

Radii

- --radius-sm: 4px
- --radius-md: 8px
- --radius-lg: 12px

Typography

- --font-body: "Hanken Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- --font-heading: "Literata", Georgia, "Times New Roman", serif
- --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace
- --font-size-base: 16px
- --font-size-sm: 0.875rem
- --font-size-md: 1rem
- --font-size-lg: 1.125rem

Application background token

- --app-bg: var(--color-surface)
- --app-bg: var(--color-surface)
- --shadow: rgba(0,0,0,0.06) 0 8px 20px -8px

How to use the tokens

- In CSS (preferred):

  .card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    padding: var(--space-md);
    border-radius: var(--radius-md);
    color: var(--color-text);
  }

- In inline styles from React/JS:

  const styles = { background: "var(--color-surface-raised)" };

  // or read computed value
  const root = getComputedStyle(document.documentElement);
  const brand = root.getPropertyValue("--color-brand");

- In CSS-in-JS libraries:
  - Many libraries (styled-components, emotion) accept CSS custom properties directly.
  - You can also resolve values at runtime using "getComputedStyle(document.documentElement)" if needed.

Guidelines for changing tokens

- Prefer additive changes — add new tokens rather than renaming or removing existing ones.
- Keep token names semantic (color-purpose or spacing-size), not literal (avoid "--blue-1").
- When changing a token's value, coordinate with the team and update this "DESIGN.md" with the rationale.
- All code comments in the project should be written in English to keep team communication consistent.

Adding a new token

1. Add the new "--" variable to "AnnaBook/src/styles/tokens.css".
2. Use it in components and update "DESIGN.md" with the name and purpose.
3. Run the frontend locally and verify visual impact.
