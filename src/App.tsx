import { useCallback, useEffect, useState } from 'react'
import MovieDetailsModal from './components/MovieDetailsPage'
import MovieResults from './components/MovieResults'
import SearchPanel from './components/SearchPanel'
import styles from './App.module.css'
import useDebouncedValue from './hooks/useDebouncedValue'
import {
  getMovieDetails,
  searchMovies,
  searchMovieSuggestions,
} from './services/tmdb'
import type {
  Movie,
  MovieDetails,
  SearchFilters,
  SearchStatus,
} from './types/movie'

const RECENT_SEARCHES_STORAGE_KEY = 'tmdb-recent-searches'
const MAX_RECENT_SEARCHES = 8

const DEFAULT_FILTERS: SearchFilters = {
  language: 'en-US',
  primaryReleaseYear: '',
  year: '',
  region: '',
  includeAdult: false,
}

function isCompleteYearOrEmpty(value: string): boolean {
  return value.length === 0 || /^\d{4}$/.test(value)
}

function hasIncompleteYearFilters(filters: SearchFilters): boolean {
  return (
    !isCompleteYearOrEmpty(filters.primaryReleaseYear) ||
    !isCompleteYearOrEmpty(filters.year)
  )
}

function getStoredRecentSearches(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getStoredRecentSearches,
  )
  const [movies, setMovies] = useState<Movie[]>([])
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuggestionsRequestInFlight, setIsSuggestionsRequestInFlight] =
    useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [isMovieDetailsLoading, setIsMovieDetailsLoading] = useState(false)
  const [movieDetailsError, setMovieDetailsError] = useState('')
  const searchQuery = query.trim()
  const debouncedSuggestionsQuery = useDebouncedValue(searchQuery, 250)
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)
  const isSuggestionsLoading =
    searchQuery.length > 0 &&
    (debouncedSuggestionsQuery !== searchQuery || isSuggestionsRequestInFlight)

  const addRecentSearch = useCallback((value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue.length < 2) {
      return
    }

    setRecentSearches((currentSearches) => {
      const nextSearches = [
        trimmedValue,
        ...currentSearches.filter((search) => search !== trimmedValue),
      ].slice(0, MAX_RECENT_SEARCHES)

      window.localStorage.setItem(
        RECENT_SEARCHES_STORAGE_KEY,
        JSON.stringify(nextSearches),
      )

      return nextSearches
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    window.localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY)
  }, [])

  const handleQueryChange = (value: string) => {
    const trimmedValue = value.trim()

    setQuery(value)
    setCurrentPage(1)

    if (!trimmedValue) {
      setMovies([])
      setSuggestions([])
      setTotalResults(0)
      setTotalPages(0)
      setStatus('idle')
      setErrorMessage('')
      setIsSuggestionsRequestInFlight(false)
      return
    }

    if (hasIncompleteYearFilters(filters)) {
      setSuggestions([])
      setIsSuggestionsRequestInFlight(false)
      return
    }

    setMovies([])
    setSuggestions([])
    setTotalResults(0)
    setTotalPages(0)
    setStatus('loading')
    setErrorMessage('')
    setIsSuggestionsRequestInFlight(true)
  }

  const handleFiltersChange = (nextFilters: SearchFilters) => {
    setFilters(nextFilters)
    setCurrentPage(1)

    if (!searchQuery) {
      return
    }

    if (hasIncompleteYearFilters(nextFilters)) {
      setSuggestions([])
      setIsSuggestionsRequestInFlight(false)
      return
    }

    setMovies([])
    setSuggestions([])
    setTotalResults(0)
    setTotalPages(0)
    setStatus('loading')
    setErrorMessage('')
    setIsSuggestionsRequestInFlight(true)
  }

  const handlePageChange = (page: number) => {
    if (
      page === currentPage ||
      page < 1 ||
      (totalPages > 0 && page > totalPages) ||
      !searchQuery ||
      hasIncompleteYearFilters(filters)
    ) {
      return
    }

    setCurrentPage(page)
    setStatus('loading')
    setErrorMessage('')
  }

  const handleMovieOpen = (movieId: number) => {
    setSelectedMovie(null)
    setIsMovieDetailsLoading(true)
    setMovieDetailsError('')
    setSelectedMovieId(movieId)
  }

  const handleMovieClose = () => {
    setSelectedMovieId(null)
    setSelectedMovie(null)
    setMovieDetailsError('')
    setIsMovieDetailsLoading(false)
  }

  useEffect(() => {
    if (!selectedMovieId) {
      return
    }

    const abortController = new AbortController()

    const loadMovieDetails = async () => {
      try {
        const movieDetails = await getMovieDetails(
          selectedMovieId,
          abortController.signal,
        )

        setSelectedMovie(movieDetails)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setSelectedMovie(null)
        setMovieDetailsError('Something went wrong while loading movie details.')
      } finally {
        if (!abortController.signal.aborted) {
          setIsMovieDetailsLoading(false)
        }
      }
    }

    loadMovieDetails()

    return () => {
      abortController.abort()
    }
  }, [selectedMovieId])

  useEffect(() => {
    if (!selectedMovieId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleMovieClose()
      }
    }

    const { overflow, paddingRight } = document.body.style
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedMovieId])

  useEffect(() => {
    const abortController = new AbortController()

    if (!debouncedSuggestionsQuery || hasIncompleteYearFilters(filters)) {
      return
    }

    const loadSuggestions = async () => {
      try {
        const nextSuggestions = await searchMovieSuggestions(
          debouncedSuggestionsQuery,
          filters,
          abortController.signal,
        )

        setSuggestions(nextSuggestions)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setSuggestions([])
      } finally {
        if (!abortController.signal.aborted) {
          setIsSuggestionsRequestInFlight(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      abortController.abort()
    }
  }, [debouncedSuggestionsQuery, filters])

  useEffect(() => {
    const abortController = new AbortController()

    if (
      !debouncedSearchQuery ||
      debouncedSearchQuery !== searchQuery ||
      hasIncompleteYearFilters(filters)
    ) {
      return
    }

    const loadMovies = async () => {
      try {
        const result = await searchMovies(
          debouncedSearchQuery,
          filters,
          currentPage,
          abortController.signal,
        )

        setMovies(result.movies)
        setTotalResults(result.totalResults)
        setTotalPages(result.totalPages)
        setStatus('success')

        if (currentPage === 1) {
          addRecentSearch(debouncedSearchQuery)
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setMovies([])
        setTotalResults(0)
        setTotalPages(0)
        setStatus('error')
        setErrorMessage('Something went wrong while loading movies from TMDB.')
      }
    }

    loadMovies()

    return () => {
      abortController.abort()
    }
  }, [addRecentSearch, currentPage, debouncedSearchQuery, filters, searchQuery])

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
        onSuggestionSelect={(movie) => {
          addRecentSearch(movie.title)
          handleQueryChange(movie.title)
          handleMovieOpen(movie.id)
        }}
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
        <MovieDetailsModal
          key={selectedMovieId}
          movie={selectedMovie}
          isLoading={isMovieDetailsLoading}
          errorMessage={movieDetailsError}
          onClose={handleMovieClose}
        />
      ) : null}
    </main>
  )
}

export default App
