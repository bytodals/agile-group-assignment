# Design System – bookMoth

This document serves as the **single source of truth** for the visual design system of the project.

## Overview

We use **CSS Custom Properties (Design Tokens)** to ensure consistency, maintainability, and easier theming across the team.

**Token Files:**
- **Canonical source**: `AnnaBook/src/styles/tokens.css`
- **Global stylesheet**: `AnnaBook/src/styles/globals.css` (imports tokens + base styles)

---

## Token Reference

### Colors

| Token                      | Value       | Purpose                              |
|---------------------------|-------------|--------------------------------------|
| `--color-brand`           | `#1B3B36`   | Primary brand color                  |
| `--color-brand-strong`    | `#112723`   | Stronger brand variant               |
| `--color-brand-soft`      | `#cfece6`   | Soft brand background                |
| `--color-secondary`       | `#BC936A`   | Secondary / accent color             |
| `--color-accent-strong`   | `#7f5e3f`   | Strong accent                        |
| `--color-accent-soft`     | `#efd0ad`   | Soft accent background               |
| `--color-surface`         | `#FAF7F2`   | Default page background              |
| `--color-surface-raised`  | `#FFFFFF`   | Cards, modals, elevated surfaces     |
| `--color-surface-muted`   | `#f0ece8`   | Subtle backgrounds                   |
| `--color-border`          | `#E6E1DD`   | Borders and dividers                 |
| `--color-text`            | `#0F172A`   | Primary text                         |
| `--color-text-muted`      | `#6B7280`   | Secondary / caption text             |
| `--color-text-inverse`    | `#FFFFFF`   | Text on dark or brand backgrounds    |
| `--color-success`         | `#10B981`   | Success states                       |
| `--color-danger`          | `#EF4444`   | Errors and destructive actions       |
| `--color-warning`         | `#F59E0B`   | Warnings                             |

### Spacing

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 28px
- `--space-3xl`: 40px
- `--space-4xl`: 56px
- `--space-md-plus`: 12px
- `--space-lg-plus`: 18px
- `--space-xl-plus`: 20px

### Radii

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px

### Typography

- `--font-body`: "Hanken Grotesk", system-ui, ...
- `--font-heading`: "Literata", Georgia, ...
- `--font-mono`: ui-monospace, ...
- `--font-size-base`: 16px
- `--font-size-sm`: 0.875rem
- `--font-size-md`: 1rem
- `--font-size-lg`: 1.125rem

### Other

- `--app-bg`: `var(--color-surface)`
- `--shadow`: `rgba(0,0,0,0.06) 0 8px 20px -8px`

---

## Usage Examples

**CSS (Recommended)**
```css
.book-card {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}
React / Inline Styles
tsxconst style = {
  backgroundColor: "var(--color-surface-raised)",
  padding: "var(--space-lg)"
};
```

Accessibility Guidelines

Maintain minimum contrast ratio of 4.5:1 for normal text
All interactive elements must have visible focus states
Use semantic HTML (<button>, <main>, <nav>, etc.)
Provide meaningful alt text for images
Ensure sufficient touch target size (min 44px)


Icons

Using Lucide React icon library
Icon size default: 24px
Prefer strokeWidth={2} for consistency
Color: inherit from parent or use --color-text


Animation & Motion

Use subtle transitions (duration 200–300ms)
Prefer ease-out or cubic-bezier(0.4, 0, 0.2, 1)
Respect prefers-reduced-motion media query

Example:
CSStransition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

Guidelines for the Team

Additive changes preferred — add new tokens instead of modifying/removing old ones
Token names should be semantic (purpose-based)
Always update this DESIGN.md when adding or significantly changing tokens
All code comments in the project must be written in English
Keep the design clean, warm, and bookish (earthy tones, good readability)


Adding a New Token

Add the variable to AnnaBook/src/styles/tokens.css

Document it here (name + purpose)

Test in the app

Notify the team
