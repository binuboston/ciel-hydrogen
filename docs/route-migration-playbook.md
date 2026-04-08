# Route Migration Playbook

This is the rollout order for migrating route UIs to the new shadcn/Radix system.

## Sequence

1. `app/routes/_index.tsx`
   - Extract hero/feature blocks into reusable sections.
   - Replace ad-hoc buttons and cards with `Button` and `Card`.
2. `app/routes/collections._index.tsx`
   - Standardize collection tiles into a shared `CollectionCard` wrapper.
3. `app/routes/collections.$handle.tsx`
   - Migrate product listing filters and cards.
4. `app/routes/products.$handle.tsx`
   - Normalize product media, option selectors, and purchase actions.
5. `app/routes/cart.tsx`
   - Reuse the updated cart components from shell migration.

## Wrapper Components To Create

- `app/components/ui/commerce/product-card.tsx`
- `app/components/ui/commerce/price-badge.tsx`
- `app/components/ui/commerce/section-header.tsx`
- `app/components/ui/commerce/empty-state.tsx`

## Definition Of Done Per Route

- No new hardcoded visual values in route component.
- Route uses shared wrappers or primitive components from `app/components/ui`.
- Interaction parity kept (links, forms, cart behavior).
- Mobile layout remains functional without route-specific CSS hacks.
