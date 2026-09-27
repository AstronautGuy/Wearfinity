# Phase 3 Plan: Visual Mix & Match

## Goal
Build an interactive UI to manually mix and match clothing items into saved outfits, and establish global navigation between the Wardrobe and Outfits screens.

## Steps

- [ ] **Step 1: Database Migration for Outfits**
  - Update `src/lib/db.ts` to create the `outfits` table.
  - Columns: `id, name, userId, topId, bottomId, shoesId, createdAt`.
  - Add foreign key constraints mapping back to `clothes(id)` and `users(id)`.

- [ ] **Step 2: Extend Wardrobe Hooks**
  - Update `src/hooks/useWardrobe.tsx` to include `outfits` state.
  - Add functions: `loadOutfits(userId)`, `saveOutfit(userId, name, topId, bottomId, shoesId)`.

- [ ] **Step 3: Global Navigation Bar**
  - Create `src/components/NavBar.tsx` containing a simple row of buttons (Wardrobe, Outfits).
  - Inject this component into `src/app/_layout.tsx` just below the `<Slot />` so it is permanently visible on primary screens.

- [ ] **Step 4: Outfit Selection UI**
  - Create `src/app/outfits.tsx`.
  - Implement a visual layout stacking three slots: Top, Bottom, Shoes.
  - Add a horizontally scrolling carousel picker for each slot that filters the user's `clothes` by category matching "Top", "Bottom", etc.
  - Add a "Save Outfit" button.

- [ ] **Step 5: Saved Outfits Gallery**
  - Below the mixer in `outfits.tsx`, display a list/grid of previously saved outfits using the `outfits` database records.

## Verification
- Navigate to the Outfits tab using the new NavBar.
- Select a Top, Bottom, and Shoes from the visual mixer.
- Save the outfit.
- Verify the outfit appears in the Saved Outfits list at the bottom of the screen.
