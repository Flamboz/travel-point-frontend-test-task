export type Movie = {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  genres: string[]
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'
