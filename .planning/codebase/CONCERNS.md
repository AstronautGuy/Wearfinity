# Concerns

- **Testing**: No test suite is currently configured.
- **EAS Builds**: Since Expo Go only includes bundled native modules, adding custom native code will require a development build (`eas build --profile development` or `npx expo run:ios|android`).
- **Dependency Management**: Expo ships breaking changes every SDK release. Strict adherence to `npx expo install` and checking versioned docs for Expo (v57) is required.
