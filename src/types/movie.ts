export type Movie = {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  genres: string[]
}

export type SearchFilters = {
  language: string
  primaryReleaseYear: string
  year: string
  region: string
  includeAdult: boolean
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'
