import type { Movie, SearchFilters } from '../types/movie'

export const defaultFilters: SearchFilters = {
  language: 'en-US',
  primaryReleaseYear: '',
  year: '',
  region: '',
  includeAdult: false,
}

export function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Avatar',
    overview: 'A marine on an alien planet becomes torn between two worlds.',
    posterPath: '/avatar.jpg',
    releaseDate: '2009-12-18',
    voteAverage: 7.6,
    genres: ['Action', 'Adventure'],
    ...overrides,
  }
}
