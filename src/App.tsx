import { lazy, useCallback } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import MovieResults from './components/MovieResults'
import SearchPanel from './components/SearchPanel'
import styles from './App.module.css'
import useMovieDetails from './hooks/useMovieDetails'
import useMovieSearch from './hooks/useMovieSearch'
import useRecentSearches from './hooks/useRecentSearches'
import type { Movie } from './types/movie'

const MovieDetailsModal = lazy(() => import('./components/MovieDetailsPage'))

function App() {
  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useRecentSearches()
  const {
    query,
    filters,
    movies,
    suggestions,
    totalResults,
    totalPages,
    currentPage,
    status,
    errorMessage,
    isSuggestionsLoading,
    handleQueryChange,
    handleFiltersChange,
    handlePageChange,
  } = useMovieSearch({ addRecentSearch })
  const {
    selectedMovieId,
    selectedMovie,
    isMovieDetailsLoading,
    movieDetailsError,
    handleMovieOpen,
    handleMovieClose,
  } = useMovieDetails()

  const handleSuggestionSelect = useCallback(
    (movie: Movie) => {
      addRecentSearch(movie.title)
      handleQueryChange(movie.title)
      handleMovieOpen(movie.id)
    },
    [addRecentSearch, handleMovieOpen, handleQueryChange],
  )

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>TMDB Movie Search</h1>
        <p className={styles.subtitle}>
          Find your favorite movies with powerful search and autocomplete
        </p>
      </header>

      <SearchPanel
        query={query}
        isLoading={status === 'loading'}
        suggestions={suggestions}
        isSuggestionsLoading={isSuggestionsLoading}
        filters={filters}
        recentSearches={recentSearches}
        onQueryChange={handleQueryChange}
        onRecentSearchSelect={handleQueryChange}
        onRecentSearchesClear={clearRecentSearches}
        onSuggestionSelect={handleSuggestionSelect}
        onFiltersChange={handleFiltersChange}
      />

      <MovieResults
        movies={movies}
        query={query}
        filters={filters}
        status={status}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        errorMessage={errorMessage}
        onMovieOpen={handleMovieOpen}
        onPageChange={handlePageChange}
      />

      {selectedMovieId ? (
        <ErrorBoundary
          title="Movie details crashed."
          message="Close the dialog and open the movie again."
          actionLabel="Close dialog"
          onAction={handleMovieClose}
        >
            <MovieDetailsModal
              key={selectedMovieId}
              movie={selectedMovie}
              isLoading={isMovieDetailsLoading}
              errorMessage={movieDetailsError}
              onClose={handleMovieClose}
            />
        </ErrorBoundary>
      ) : null}
    </main>
  )
}

export default App
