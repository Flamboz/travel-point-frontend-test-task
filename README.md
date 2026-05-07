# TMDB Movie Search

A React + TypeScript single-page application for searching movies via TMDB.

The app supports:

- movie search with debounced requests
- autocomplete suggestions
- advanced filters by language, region, year, and adult content
- paginated search results
- movie details modal with extended metadata
- recent searches stored in `localStorage`
- loading, empty, and error states

## Required functionality

- Search movies by title
- Show autocomplete suggestions while typing
- Display results as movie cards
- Advanced filters: language, year, region, adult content
- Loading states: progress indicator, skeletons, spinner
- API error handling
- Component-based React architecture
- Open a movie card to view detailed information

## Bonus functionality

Implemented bonus items:

- TypeScript for component and API typing
- pagination
- search history with `localStorage`
- unit tests for components
- Error Boundaries for React runtime failures

Not implemented:

- Context API

Reason:

- the state is local to a single page flow, so Context would add indirection without solving a real problem in the current architecture

## Installation and run

### Requirements

- Node.js `20.19+` or `22.12+`
- npm or pnpm
- TMDB API key

### 1. Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Run tests

```bash
npm test
```

### 5. Build for production

```bash
npm run build
```

## Technologies and libraries

- React 19
- TypeScript
- Vite
- CSS Modules
- TMDB API
- `react-error-boundary`
- Vitest
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- ESLint

## Architecture decisions

### Component structure

The UI is split into feature-oriented components:

- `SearchPanel` for search input, suggestions, recent searches, and filters
- `MovieResults` for result states and pagination
- `MovieCard` for a single movie preview
- `MovieDetailsPage` for the details modal
- `ErrorBoundary` for isolated UI failure handling

### State management

The app uses local React state and custom hooks instead of Context or external state libraries.

Reasoning:

- the state is still scoped to a small tree
- most data is only needed in `App` and direct children
- this keeps the solution simpler and easier to review

### Custom hooks

Complex logic is extracted into dedicated hooks:

- `useMovieSearch` manages query state, filters, pagination, suggestions, and search requests
- `useMovieDetails` manages selected movie state and modal behavior
- `useMovieMediaState` manages poster/backdrop loading state
- `useRecentSearches` persists recent searches in `localStorage`
- `useDebouncedValue` reduces request frequency while typing

This keeps components focused on rendering and interaction.

### Data layer

TMDB communication is isolated in `src/services/tmdb.ts`.

Reasoning:

- UI components do not depend on raw API response formats
- mapping from TMDB fields to app-specific types happens in one place
- request cancellation via `AbortSignal` is supported for search and details fetches

### UI/UX decisions

- the movie details modal is lazy-loaded to reduce initial bundle cost
- search results stay visible during loading when possible to reduce UI flicker
- posters use native lazy loading
- error and loading states are explicit instead of failing silently

## Project structure

```text
src/
  components/
  hooks/
  services/
  test/
  types/
  utils/
```

## Notes

- The app requires a valid TMDB API key to work.
- If `npm run build` fails on an older Node version, upgrade Node to `20.19+` or `22.12+`.
