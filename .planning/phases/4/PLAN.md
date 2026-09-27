# Phase 4 Plan: Local AI Recommendations

## Goal
Implement a local heuristic-based recommendation engine to suggest outfit combinations automatically without any network requests.

## Steps

- [ ] **Step 1: Recommendation Engine**
  - Create `src/lib/recommendations.ts`.
  - Write a function `generateRecommendations(clothes, categories, limit = 3)` that selects random valid combinations of Tops, Bottoms, and Shoes.

- [ ] **Step 2: Update NavBar**
  - Add a third tab to `src/components/NavBar.tsx` called "Ideas" or "For You" mapping to `/recommendations`.

- [ ] **Step 3: Recommendations UI**
  - Create `src/app/recommendations.tsx`.
  - Fetch user's clothes and categories.
  - Display a feed of auto-generated outfits using the Recommendation Engine.
  - Add a "Save Outfit" button directly on each recommendation card to instantly commit it to the `outfits` database.

## Verification
- Navigate to the "Ideas" tab.
- Ensure the app instantly generates outfit combinations combining available items.
- Tap "Save" on a recommendation and verify it appears in the regular Saved Outfits list.
