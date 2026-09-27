# Phase 1 Plan: Local Storage & Profiles

## Goal
Set up a local SQLite database and implement user profile creation and switching.

## Steps

- [x] **Step 1: Install Dependencies**
  - Run `npx expo install expo-sqlite` to add SQLite support.

- [x] **Step 2: Database Initialization**
  - Create `src/lib/db.ts` to export a database instance using `openDatabaseSync`.
  - Create a function to initialize the schema: `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, avatar TEXT)`.
  - Call the initialization function in the root `src/app/_layout.tsx` before rendering the app.

- [x] **Step 3: User Context**
  - Create `src/hooks/useUser.tsx` with a React Context that holds `activeUserId`, `setActiveUserId`, and a list of `users`.
  - Wrap the main app with this Context Provider.

- [x] **Step 4: Profile Management Screen**
  - Create a new route `src/app/profiles/index.tsx`.
  - Implement UI to list existing users from the SQLite database.
  - Implement UI to create a new user (text input for name).
  - Implement a mechanism to select a user, which updates the `UserContext` and navigates to the main app (e.g., `/home`).

- [x] **Step 5: Main App Redirection**
  - In `src/app/index.tsx`, check if an `activeUserId` exists.
  - If not, redirect to `/profiles`.
  - If yes, redirect to the main wardrobe view (which will be built in Phase 2).

## Verification
- Start the app on the simulator.
- Verify that a user can be created and saved to the SQLite database.
- Verify that the user can be selected and persists as the active user.
- Restart the app and ensure the created users are still present.
