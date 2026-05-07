import { memo } from 'react'
import type { Movie, SearchFilters, SearchStatus } from '../types/movie'
import MovieCard from './MovieCard'
import styles from './MovieResults.module.css'

const SKELETON_CARDS_COUNT = 6

type MovieResultsProps = {
  movies: Movie[]
  query: string
  filters: SearchFilters
  status: SearchStatus
  totalResults: number
  currentPage: number
  totalPages: number
  errorMessage: string
  onMovieOpen: (movieId: number) => void
  onPageChange: (page: number) => void
}

function MovieResults({
  movies,
  query,
  filters,
  status,
  totalResults,
  currentPage,
  totalPages,
  errorMessage,
  onMovieOpen,
  onPageChange,
}: MovieResultsProps) {
  const hasActiveFilters = Boolean(
    filters.primaryReleaseYear ||
      filters.year ||
      filters.region ||
      filters.includeAdult ||
      filters.language !== 'en-US',
  )
  const canPaginate = status === 'success' && totalPages > 1
  const isInitialLoading = status === 'loading' && movies.length === 0
  const shouldShowResults =
    (status === 'success' || status === 'loading') && movies.length > 0

  return (
    <section className={styles.resultsSection} aria-busy={status === 'loading'}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>Search Results</h2>
        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>{totalResults} movies found</span>
          {canPaginate ? (
            <span className={styles.pageSummary}>
              Page {currentPage} of {totalPages}
            </span>
          ) : null}
        </div>
      </div>

      {isInitialLoading ? (
        <div className={styles.skeletonGrid} aria-hidden="true">
          {Array.from({ length: SKELETON_CARDS_COUNT }).map((_, index) => (
            <article key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonPoster}></div>
              <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`}></div>
                <div className={`${styles.skeletonLine} ${styles.skeletonYear}`}></div>
                <div className={`${styles.skeletonLine} ${styles.skeletonOverview}`}></div>
                <div className={`${styles.skeletonLine} ${styles.skeletonOverview}`}></div>
                <div className={`${styles.skeletonLine} ${styles.skeletonOverviewShort}`}></div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className={styles.emptyState}>
          <h3>Search failed</h3>
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {status === 'idle' && !query.trim() ? (
        <div className={styles.emptyState}>
          <h3>Search for a movie</h3>
          <p>Type a title above to load matching movies from TMDB.</p>
        </div>
      ) : null}

      {status === 'success' && movies.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No movies found</h3>
          <p>
            No results matched <strong>{query}</strong>
            {hasActiveFilters ? ' with the current filters.' : '.'}{' '}
            Try another movie title
            {hasActiveFilters ? ' or adjust the filters.' : '.'}
          </p>
        </div>
      ) : null}

      {shouldShowResults ? (
        <>
          <div className={styles.moviesGrid}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onOpen={onMovieOpen} />
            ))}
          </div>

          {canPaginate ? (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

export default memo(MovieResults)
