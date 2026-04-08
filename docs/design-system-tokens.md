# Design System Token Contract

This project now uses `shadcn/ui` components with Radix primitives and tokenized styling.

## Edit-First Tokens

Update these tokens in `app/styles/tailwind.css` under `@layer base -> :root` and `.dark`:

- Color system: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`
- Typography: `--font-sans`, `--font-heading`
- Radius scale: `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- Elevation: `--brand-shadow-sm`, `--brand-shadow-md`, `--brand-shadow-lg`
- Spacing scale: `--brand-space-xs`, `--brand-space-sm`, `--brand-space-md`, `--brand-space-lg`, `--brand-space-xl`
- Focus treatment: `--brand-focus-ring`, `--brand-focus-offset`

## Usage Rules

- Use `Button`, `Input`, `Card`, `Sheet`, `Dialog`, and other primitives in `app/components/ui`.
- Avoid hardcoded hex, pixel radius, and ad-hoc shadows in components.
- For brand-specific patterns, create wrappers in `app/components/ui` instead of duplicating utility strings.
