# Phase 2 Plan: Wardrobe Digitization

## Goal
Integrate the device camera to capture photos of clothing, save the images to the local filesystem, and build the main Wardrobe gallery and category management interface.

## Steps

- [ ] **Step 1: Install Dependencies**
  - Run `npx expo install expo-camera expo-file-system`.

- [ ] **Step 2: Update Database Schema**
  - Update `src/lib/db.ts` to create two new tables if they don't exist:
    - `categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, userId INTEGER)`
    - `clothes (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, categoryId INTEGER, userId INTEGER, createdAt INTEGER)`

- [ ] **Step 3: Wardrobe Data Hook**
  - Create `src/hooks/useWardrobe.tsx` that exposes functions to:
    - `getCategories(userId)`
    - `createCategory(userId, name)`
    - `getClothesByCategory(userId, categoryId)`
    - `addClothing(userId, categoryId, imageUri)`

- [ ] **Step 4: Camera Screen**
  - Create `src/app/camera.tsx` utilizing `CameraView` from `expo-camera`.
  - Implement a shutter button to take a photo.
  - Implement logic to move the photo from cache to `FileSystem.documentDirectory`.
  - Pass the permanent `imageUri` back to the Wardrobe screen (via router parameters or context).

- [ ] **Step 5: Wardrobe Gallery Screen**
  - Create `src/app/wardrobe/index.tsx` (or update the home screen).
  - Implement a horizontally scrollable list of Categories at the top.
  - Implement a Grid view of clothing items for the selected category.
  - Add an "Add Item" button that navigates to the Camera Screen.

## Verification
- Navigate to the Wardrobe.
- Create a new category "Shirts".
- Open the Camera, grant permissions, and take a photo.
- Verify the photo appears in the Grid view under "Shirts" and persists after restarting the app.
