import { useEffect, useState } from 'react'
import {
  searchMovies,
  searchMovieSuggestions,
} from '../services/tmdb'
import type {
  Movie,
  SearchFilters,
  SearchStatus,
} from '../types/movie'
import useDebouncedValue from './useDebouncedValue'

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

type UseMovieSearchParams = {
  addRecentSearch: (value: string) => void
}

function useMovieSearch({ addRecentSearch }: UseMovieSearchParams) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuggestionsRequestInFlight, setIsSuggestionsRequestInFlight] =
    useState(false)
  const searchQuery = query.trim()
  const debouncedSuggestionsQuery = useDebouncedValue(searchQuery, 250)
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

  const isSuggestionsLoading =
    searchQuery.length > 0 &&
    (debouncedSuggestionsQuery !== searchQuery || isSuggestionsRequestInFlight)

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

  return {
    query,
    filters,
    movies,
    suggestions,
    totalResults,
    totalPages,
    currentPage,
    status,
    errorMessage,
    isSuggestionsLoading,
    handleQueryChange,
    handleFiltersChange,
    handlePageChange,
  }
}

export default useMovieSearch
