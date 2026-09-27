# Phase 1 Research: Local Storage & Profiles

## Objective
Determine the best approach to implement local storage for multiple user profiles in an Expo 57 / React Native 0.86 application, focusing on offline-only capabilities.

## Findings
1. **Local Storage Technology**: 
   - `expo-sqlite` is the recommended way to handle structured data locally in Expo. It is fully offline and supports robust querying.
   - Another option is `AsyncStorage`, but given that we will later need complex queries for clothing items, categories, and AI recommendations, SQLite is the much better choice.
2. **State Management**:
   - For the currently active user, a simple React Context (`UserContext`) combined with a custom hook (`useUser`) is sufficient.
3. **Database Initialization**:
   - The database needs to be initialized when the app starts. We can use the root `_layout.tsx` (Expo Router) to trigger table creation (e.g., `CREATE TABLE IF NOT EXISTS users`).
4. **Dependencies to Install**:
   - `npx expo install expo-sqlite`

## Decisions
- We will use `expo-sqlite` for all database needs.
- We will store the active user in a global React Context to make it easily accessible across the app.
