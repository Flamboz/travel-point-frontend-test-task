import { useState } from 'react'
import { TMDB_IMAGE_BASE_URL } from '../services/tmdb'
import type { Movie } from '../types/movie'
import styles from './MovieCard.module.css'

type MovieCardProps = {
  movie: Movie
  onOpen?: (movieId: number) => void
}

function MovieCard({ movie, onOpen }: MovieCardProps) {
  const releaseYear = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA'
  const posterSrc = movie.posterPath
    ? `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`
    : null
  const [loadedPosterSrc, setLoadedPosterSrc] = useState<string | null>(null)
  const isPosterLoaded = !posterSrc || loadedPosterSrc === posterSrc

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardLink}
        onClick={() => onOpen?.(movie.id)}
        aria-label={`Open details for ${movie.title}`}
      >
        <div className={styles.poster}>
          {!isPosterLoaded ? <div className={styles.posterSkeleton}></div> : null}
          {posterSrc ? (
            <img
              className={`${styles.posterImage} ${
                isPosterLoaded ? styles.posterImageLoaded : ''
              }`}
              src={posterSrc}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedPosterSrc(posterSrc)}
              onError={() => setLoadedPosterSrc(posterSrc)}
            />
          ) : null}
          <div className={styles.rating}>{movie.voteAverage.toFixed(1)}</div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          <div className={styles.year}>{releaseYear}</div>
          <p className={styles.overview}>
            {movie.overview || 'No overview is available for this movie yet.'}
          </p>
          {movie.genres.length > 0 ? (
            <div className={styles.genres} aria-label="Movie genres">
              {movie.genres.map((genre) => (
                <span key={`${movie.id}-${genre}`} className={styles.genreTag}>
                  {genre}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </button>
    </article>
  )
}

export default MovieCard
