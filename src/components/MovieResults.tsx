import type { Movie, SearchStatus } from '../types/movie'
import MovieCard from './MovieCard'
import styles from './MovieResults.module.css'

const SKELETON_CARDS_COUNT = 6

type MovieResultsProps = {
  movies: Movie[]
  query: string
  status: SearchStatus
  totalResults: number
  errorMessage: string
}

function MovieResults({
  movies,
  query,
  status,
  totalResults,
  errorMessage,
}: MovieResultsProps) {
  return (
    <section className={styles.resultsSection}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>Search Results</h2>
        <span className={styles.resultsCount}>{totalResults} movies found</span>
      </div>

      {status === 'loading' ? (
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

      {status === 'idle' ? (
        <div className={styles.emptyState}>
          <h3>Search for a movie</h3>
          <p>Type a title above to load matching movies from TMDB.</p>
        </div>
      ) : null}

      {status === 'success' && movies.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No movies found</h3>
          <p>
            No results matched <strong>{query}</strong>. Try another movie title.
          </p>
        </div>
      ) : null}

      {status === 'success' && movies.length > 0 ? (
        <div className={styles.moviesGrid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default MovieResults
