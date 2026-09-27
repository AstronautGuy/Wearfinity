# Requirements MVP

## Core Features
- **Local User Profiles**: Ability to create and switch between local user profiles (no online auth).
- **Wardrobe Digitization**: Use the device camera to take photos of clothing items and store them locally.
- **Custom Categories**: Users can create custom categories (e.g., Summer Tops, Formal Pants) and assign clothes to them.
- **Visual Mix & Match**: An interactive, image-based interface to manually combine different items into outfits.
- **AI Outfit Recommendations**: On-device AI/logic engine to suggest outfit combinations from the user's digitized wardrobe.
- **Local Database**: Use a local database (e.g., SQLite) to store profiles, categories, clothing metadata, and image paths.

## Non-Functional Requirements
- **Offline Only**: Must function 100% offline with zero network requests.
- **Cross-Platform**: Mobile-first design for both iOS and Android via Expo.
- **Performance**: Smooth image loading and responsive interactions.
