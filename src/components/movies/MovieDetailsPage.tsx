import useMovieMediaState from '../../hooks/useMovieMediaState'
import type { MovieDetails } from '../../types/movie'
import { formatList } from '../../utils/movieFormatters'
import { getMovieDetailsViewModel } from '../../utils/movieDetailsViewModel'
import styles from './MovieDetailsPage.module.css'

type MovieDetailsModalProps = {
  movie: MovieDetails | null
  isLoading: boolean
  errorMessage: string
  onClose: () => void
}

type MovieDetailsContentProps = {
  movie: MovieDetails
  posterSrc: string | null
  backdropSrc: string | null
  releaseYear: string
  runtime: string | null
  budget: string | null
  revenue: string | null
  tmdbUrl: string | null
  isMediaReady: boolean
  onPosterLoad: () => void
}

type FactItem = {
  label: string
  value: string
}

const SKELETON_FACT_COUNT = 6

function getFactItems(
  movie: MovieDetails,
  runtime: string | null,
  budget: string | null,
  revenue: string | null,
): FactItem[] {
  return [
    { label: 'Release date', value: movie.releaseDate || 'TBA' },
    { label: 'Runtime', value: runtime || 'Unknown' },
    { label: 'TMDB rating', value: `${movie.voteAverage.toFixed(1)} / 10` },
    { label: 'Vote count', value: movie.voteCount.toLocaleString() },
    { label: 'Budget', value: budget || 'Unknown' },
    { label: 'Revenue', value: revenue || 'Unknown' },
  ]
}

function MovieDetailsSkeleton() {
  return (
    <article className={styles.detailsCard} aria-hidden="true">
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.posterWrap}>
            <div className={`${styles.posterFallback} ${styles.skeletonBlock}`}></div>
          </div>

          <div className={styles.summary}>
            <div className={styles.metaRow}>
              <span className={`${styles.skeletonLine} ${styles.metaSkeleton}`}></span>
              <span className={`${styles.skeletonLine} ${styles.metaSkeleton}`}></span>
              <span className={`${styles.skeletonLine} ${styles.metaSkeleton}`}></span>
            </div>

            <div className={`${styles.skeletonLine} ${styles.titleSkeleton}`}></div>
            <div className={`${styles.skeletonLine} ${styles.subtitleSkeleton}`}></div>

            <div className={styles.genres}>
              <span className={`${styles.genreTag} ${styles.skeletonChip}`}></span>
              <span className={`${styles.genreTag} ${styles.skeletonChip}`}></span>
              <span className={`${styles.genreTag} ${styles.skeletonChip}`}></span>
            </div>

            <div className={styles.skeletonParagraph}>
              <div className={`${styles.skeletonLine} ${styles.paragraphLine}`}></div>
              <div className={`${styles.skeletonLine} ${styles.paragraphLine}`}></div>
              <div className={`${styles.skeletonLine} ${styles.paragraphLineShort}`}></div>
            </div>

            <div className={styles.actions}>
              <span className={`${styles.primaryLink} ${styles.skeletonButton}`}></span>
              <span className={`${styles.secondaryLink} ${styles.skeletonButton}`}></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.factGrid}>
          {Array.from({ length: SKELETON_FACT_COUNT }).map((_, index) => (
            <div key={index} className={styles.factCard}>
              <span className={`${styles.skeletonLine} ${styles.factLabelSkeleton}`}></span>
              <span className={`${styles.skeletonLine} ${styles.factValueSkeleton}`}></span>
            </div>
          ))}
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <span className={`${styles.skeletonLine} ${styles.infoLabelSkeleton}`}></span>
            <div className={styles.skeletonParagraph}>
              <div className={`${styles.skeletonLine} ${styles.paragraphLine}`}></div>
              <div className={`${styles.skeletonLine} ${styles.paragraphLineShort}`}></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function MovieDetailsErrorState({ errorMessage }: { errorMessage: string }) {
  return (
    <div className={styles.stateCard}>
      <h2>Movie details unavailable</h2>
      <p>{errorMessage}</p>
    </div>
  )
}

function MovieDetailsContent({
  movie,
  posterSrc,
  backdropSrc,
  releaseYear,
  runtime,
  budget,
  revenue,
  tmdbUrl,
  isMediaReady,
  onPosterLoad,
}: MovieDetailsContentProps) {
  const factItems = getFactItems(movie, runtime, budget, revenue)

  return (
    <article className={styles.detailsCard}>
      <div className={styles.hero}>
        {backdropSrc ? (
          <div
            className={`${styles.heroBackdrop} ${
              isMediaReady ? styles.heroBackdropLoaded : ''
            }`}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(16, 18, 30, 0.2), rgba(16, 18, 30, 0.88)), url(${backdropSrc})`,
            }}
            aria-hidden="true"
          ></div>
        ) : null}

        <div className={styles.heroContent}>
          <div className={styles.posterWrap}>
            {posterSrc && !isMediaReady ? (
              <div
                className={`${styles.posterFallback} ${styles.posterLoadingPlaceholder}`}
                aria-hidden="true"
              ></div>
            ) : null}

            {posterSrc ? (
              <img
                className={`${styles.poster} ${isMediaReady ? styles.posterLoaded : ''}`}
                src={posterSrc}
                alt={movie.title}
                onLoad={onPosterLoad}
                onError={onPosterLoad}
              />
            ) : (
              <div className={styles.posterFallback}>No poster</div>
            )}
          </div>

          <div className={styles.summary}>
            <div className={styles.metaRow}>
              <span>{releaseYear}</span>
              <span>{movie.voteAverage.toFixed(1)} / 10</span>
              {runtime ? <span>{runtime}</span> : null}
              <span>{movie.status}</span>
            </div>

            <h1 className={styles.title}>{movie.title}</h1>

            {movie.originalTitle !== movie.title ? (
              <p className={styles.originalTitle}>Original title: {movie.originalTitle}</p>
            ) : null}

            {movie.tagline ? <p className={styles.tagline}>{movie.tagline}</p> : null}

            {movie.genres.length > 0 ? (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre} className={styles.genreTag}>
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}

            <p className={styles.overview}>
              {movie.overview || 'No overview is available for this movie yet.'}
            </p>

            <div className={styles.actions}>
              {tmdbUrl ? (
                <a
                  className={styles.primaryLink}
                  href={tmdbUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on TMDB
                </a>
              ) : null}

              {movie.homepage ? (
                <a
                  className={styles.secondaryLink}
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official site
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.factGrid}>
          {factItems.map((fact) => (
            <div key={fact.label} className={styles.factCard}>
              <span className={styles.factLabel}>{fact.label}</span>
              <span className={styles.factValue}>{fact.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>Production countries</span>
            <p className={styles.infoValue}>{formatList(movie.productionCountries)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function MovieDetailsModal({
  movie,
  isLoading,
  errorMessage,
  onClose,
}: MovieDetailsModalProps) {
  const { posterSrc, backdropSrc, releaseYear, runtime, budget, revenue, tmdbUrl } =
    getMovieDetailsViewModel(movie)
  const { isMediaReady, handlePosterLoad } = useMovieMediaState({
    posterSrc,
    backdropSrc,
  })

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={movie ? movie.title : 'Movie details'}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {isLoading ? <MovieDetailsSkeleton /> : null}
        {!isLoading && errorMessage ? <MovieDetailsErrorState errorMessage={errorMessage} /> : null}
        {!isLoading && !errorMessage && movie ? (
          <MovieDetailsContent
            movie={movie}
            posterSrc={posterSrc}
            backdropSrc={backdropSrc}
            releaseYear={releaseYear}
            runtime={runtime}
            budget={budget}
            revenue={revenue}
            tmdbUrl={tmdbUrl}
            isMediaReady={isMediaReady}
            onPosterLoad={handlePosterLoad}
          />
        ) : null}
      </section>
    </div>
  )
}

export default MovieDetailsModal
