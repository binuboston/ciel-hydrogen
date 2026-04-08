## Summary

- [ ] I used `app/components/ui` primitives where possible
- [ ] I reused/extended `app/components/ui/commerce` wrappers where relevant
- [ ] I avoided hardcoded visual values (hex/rgb/hsl, custom radius/shadow) in TSX files
- [ ] I used theme tokens from `app/styles/tailwind.css` for brand styling

## UI Verification

- [ ] Keyboard navigation works for new/updated interactive controls
- [ ] Focus states are visible and accessible
- [ ] Overlay interactions (`Sheet`/`Dialog`/menus) work correctly
- [ ] Empty/loading/error states are handled for updated surfaces

## Styling Hygiene

- [ ] I removed obsolete legacy CSS for migrated areas
- [ ] I did not add new route-specific hardcoded CSS unnecessarily

## Validation

- [ ] `npm run typecheck` passes locally
- [ ] I sanity-checked impacted routes in the browser
