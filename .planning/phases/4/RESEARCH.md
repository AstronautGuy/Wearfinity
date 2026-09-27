# Phase 4 Research: Local AI Recommendations

## Objective
Build a completely offline recommendation engine that suggests outfit combinations (Top + Bottom + Shoes) based on the user's wardrobe, adhering to the strict "no network" requirement.

## Findings
1. **Local AI Constraints**: 
   Since the app is 100% offline, we cannot rely on external APIs (like OpenAI or Claude) to analyze images. Furthermore, running local Vision Models (LLaVA/MobileNet) entirely on-device via React Native is heavy and often requires complex native bridges. 
2. **Heuristic Engine**: 
   A lightweight heuristic approach can effectively simulate "AI" for everyday casual users. We can build a matching algorithm that analyzes outfit history or randomly generates viable combinations, perhaps weighting combinations that use rarely-worn items or items from compatible categories.
3. **Database Setup**: 
   We already have the `clothes`, `categories`, and `outfits` tables. The recommendation engine just needs to query random tops, bottoms, and shoes that haven't been frequently saved, and surface them in a "Suggested" feed.

## Decisions
- Implement a Local Recommendation Engine (`src/lib/recommendations.ts`) that uses pseudo-random heuristics to generate "Smart Combos" from available categories.
- Create a new tab/screen or section in the Outfits screen for "AI Recommendations".
