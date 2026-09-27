# Conventions

- **Mobile First**: Prioritize mobile-first patterns, performance, and cross-platform compatibility.
- **Routing**: Use Expo Router for all navigation (`src/app/`). `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- **Package Management**: Use `npx expo install <package>` instead of npm/yarn/bun add.
- **Native Directories**: Do not create or edit `ios/` or `android/` directories manually (Continuous Native Generation).
- **TypeScript**: Use strict TypeScript typing.
- **Code Organization**: Keep non-route code outside `src/app/`.
