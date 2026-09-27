# Phase 3 Research: Visual Mix & Match

## Objective
Provide an interactive user interface where users can select multiple clothing items from their wardrobe and visually combine them into outfits. 

## Findings
1. **Navigation**: Since we removed the restricted `AppTabs`, we need a simple global navigation mechanism to switch between the Wardrobe (Gallery) and the Mix & Match (Outfits) screen. A custom bottom tab bar in `_layout.tsx` using standard React Native components and `router.push` is ideal and avoids the strict constraints of Expo's `NativeTabs`.
2. **Database Schema**: 
   - An `outfits` table to save user-created combinations.
   - `outfits (id INTEGER PRIMARY KEY, name TEXT, userId INTEGER, topId INTEGER, bottomId INTEGER, shoesId INTEGER)`. 
   *(Alternatively, a relational `outfit_items` table, but a flat structure with specific columns is easier for a basic Mix & Match MVP).*
3. **UI Layout**:
   - The Mix & Match screen needs slots for Top, Bottom, and Shoes. 
   - Tapping a slot opens a modal or horizontal list to pick an item from the wardrobe belonging to that category.
   - A "Save Outfit" button persists it to the database.

## Decisions
- Create a custom Navigation Bar to route between `/` (Wardrobe) and `/outfits` (Mix & Match).
- Update the `useWardrobe` hook and SQLite schema to support `outfits`.
- Build the interactive Visual Mixer interface in `src/app/outfits.tsx`.
