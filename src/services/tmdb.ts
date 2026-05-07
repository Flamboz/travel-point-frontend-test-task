import type { Movie, SearchFilters } from '../types/movie'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

type TmdbMovieResponse = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

type TmdbGenreResponse = {
  id: number
  name: string
}

type GenresResponse = {
  genres: TmdbGenreResponse[]
}

type SearchMoviesResponse = {
  results: TmdbMovieResponse[]
  total_results: number
}

let genreLookupPromise: Promise<Map<number, string>> | null = null

function isValidYear(value: string): boolean {
  return /^\d{4}$/.test(value)
}

async function getGenreLookup(): Promise<Map<number, string>> {
  if (!genreLookupPromise) {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
    })

    genreLookupPromise = fetch(
      `${TMDB_BASE_URL}/genre/movie/list?${searchParams.toString()}`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load movie genres.')
        }

        const data = (await response.json()) as GenresResponse

        return new Map(data.genres.map((genre) => [genre.id, genre.name]))
      })
      .catch((error) => {
        genreLookupPromise = null
        throw error
      })
  }

  return genreLookupPromise
}

const mapMovie = (
  movie: TmdbMovieResponse,
  genreLookup: Map<number, string>,
): Movie => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterPath: movie.poster_path,
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average,
  genres: movie.genre_ids
    .map((genreId) => genreLookup.get(genreId))
    .filter((genreName): genreName is string => Boolean(genreName)),
})

async function fetchMappedMovies(
  query: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<{
  movies: Movie[]
  totalResults: number
}> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query,
    language: filters.language,
    page: '1',
    include_adult: String(filters.includeAdult),
  })

  if (isValidYear(filters.primaryReleaseYear)) {
    searchParams.set('primary_release_year', filters.primaryReleaseYear)
  }

  if (isValidYear(filters.year)) {
    searchParams.set('year', filters.year)
  }

  if (filters.region) {
    searchParams.set('region', filters.region)
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?${searchParams.toString()}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('Failed to search movies.')
  }

  const data = (await response.json()) as SearchMoviesResponse
  const genreLookup = await getGenreLookup().catch(() => new Map<number, string>())

  return {
    movies: data.results.map((movie) => mapMovie(movie, genreLookup)),
    totalResults: data.total_results,
  }
}

export async function searchMovies(
  query: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<{
  movies: Movie[]
  totalResults: number
}> {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return { movies: [], totalResults: 0 }
  }

  if (!TMDB_API_KEY) {
    throw new Error('Missing VITE_TMDB_API_KEY environment variable.')
  }

  return fetchMappedMovies(trimmedQuery, filters, signal)
}

export async function searchMovieSuggestions(
  query: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return []
  }

  if (!TMDB_API_KEY) {
    throw new Error('Missing VITE_TMDB_API_KEY environment variable.')
  }

  const { movies } = await fetchMappedMovies(trimmedQuery, filters, signal)

  return movies.slice(0, 5)
}
