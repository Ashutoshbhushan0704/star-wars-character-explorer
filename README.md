<<<<<<< HEAD
# star-wars-character-explorer
=======
## Star Wars Character Explorer

### 🚀 Getting Started
- `npm install`  
- `npm run dev` → open the printed Vite URL (defaults to `http://localhost:5173`)
- `npm run test -- --run` to execute the React Testing Library integration test

### ✅ Implemented Features
- Paginated Star Wars character gallery powered by SWAPI (species/homeworld/film enrichment & caching)
- Search bar plus combined filters for species, homeworld, and films
- Responsive character cards with species-based accent colors and random imagery
- Detail modal with formatted stats (height, mass, birth year, added date), homeworld details, and film list
- Loading and error states with graceful fallbacks
- React Testing Library integration test covering the modal flow

### 🧠 Design Notes & Trade-offs
- Pre-fetches every paginated /people result, then enriches characters; delivers fastest interactions at the cost of initial load when there are many results.
- Picsum seeded images guarantee a deterministic “random” card visual without bundling assets.
- Species color accents map common species to curated Tailwind palettes, falling back to hash-derived themes for unknown species.
- SWAPI responses are memoized in-memory to avoid redundant fetches during search/filter interactions.
- Filters reset the page index and modal state to keep UI consistent whenever result sets change.

>>>>>>> e9dbc2c (Star Wars Character explorer)
