# Phase 2 Research: Wardrobe Digitization

## Objective
Determine the required tools and database changes to support taking photos of clothing, saving them locally, and managing categories per user.

## Findings
1. **Camera**: `expo-camera` is the standard and fully offline-capable solution for taking photos in Expo.
2. **Local Image Storage**: `expo-file-system` is needed to move images from the temporary cache (where the camera initially stores them) into persistent document storage so they don't get deleted by the OS.
3. **Database Schema**: 
   - A `categories` table is needed to store user-defined categories (e.g., Tops, Bottoms).
   - A `clothes` table is needed to store the saved local file URI, and references to the `categoryId` and `userId`.
4. **Hooks**: A `useWardrobe` hook will cleanly manage fetching and mutating the SQLite database for these new tables, keeping UI components clean.

## Decisions
- Install `expo-camera` and `expo-file-system`.
- Expand `src/lib/db.ts` with the new tables.
- Build a dedicated Camera route to snap photos.
