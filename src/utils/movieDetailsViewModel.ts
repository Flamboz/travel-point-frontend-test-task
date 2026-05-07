import {
  TMDB_BACKDROP_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from '../services/tmdb'
import type { MovieDetails } from '../types/movie'
import { formatMoney, formatRuntime } from './movieFormatters'

export function getMovieDetailsViewModel(movie: MovieDetails | null) {
  const posterSrc = movie?.posterPath
    ? `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`
    : null
  const backdropSrc = movie?.backdropPath
    ? `${TMDB_BACKDROP_BASE_URL}${movie.backdropPath}`
    : null

  return {
    posterSrc,
    backdropSrc,
    releaseYear: movie?.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA',
    runtime: movie ? formatRuntime(movie.runtime) : null,
    budget: movie ? formatMoney(movie.budget) : null,
    revenue: movie ? formatMoney(movie.revenue) : null,
    tmdbUrl: movie ? `https://www.themoviedb.org/movie/${movie.id}` : null,
  }
}
