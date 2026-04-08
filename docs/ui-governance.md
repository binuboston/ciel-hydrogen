# UI Governance Guide

This project uses `shadcn/ui` with Radix primitives and tokenized styling.

## Core Rules

- Use components from `app/components/ui` first (`Button`, `Input`, `Card`, `Sheet`, `Dialog`, etc.).
- Prefer reusable wrappers in `app/components/ui/commerce` for storefront surfaces.
- Keep visual decisions token-driven via `app/styles/tailwind.css` CSS variables.
- Do not introduce hardcoded hex/rgb/hsl colors in route or component files.
- Do not introduce ad-hoc radius, shadow, or spacing values if a token/utility already exists.

## Theming Contract

- Brand-editable source of truth: `app/styles/tailwind.css`.
- Update tokens there for:
  - color system (`--background`, `--foreground`, `--primary`, etc.)
  - radii (`--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`)
  - spacing (`--brand-space-*`)
  - elevation (`--brand-shadow-*`)
  - focus (`--brand-focus-*`)

## Component Composition Standards

- **Primitives**: keep generic and broadly reusable.
- **Domain wrappers**: place commerce-specific abstractions under `app/components/ui/commerce`.
- **Routes**: compose wrappers and primitives; avoid route-scoped styling logic unless strictly needed.
- **States**: include designed empty/loading/error states for all user-facing surfaces.

## Accessibility Standards

- Use Radix-backed components for overlays and menus (`Sheet`, `Dialog`, `DropdownMenu`).
- Ensure all interactive controls have visible labels or `sr-only` labels.
- Preserve keyboard navigation and focus visibility.
- Do not disable focus rings without providing an accessible replacement.

## Migration / Cleanup Policy

- If a route is migrated to tokenized components, remove obsolete route-scoped CSS and fold shared styling into `app/styles/tailwind.css` tokens/utilities.
- Keep global CSS minimal; prefer tokenized utilities and component-level composition.
- Prefer incremental migration with behavior parity before visual redesign.
