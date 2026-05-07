import { useEffect, useState } from 'react'
import MovieResults from './components/MovieResults'
import SearchPanel from './components/SearchPanel'
import styles from './App.module.css'
import useDebouncedValue from './hooks/useDebouncedValue'
import { searchMovies, searchMovieSuggestions } from './services/tmdb'
import type { Movie, SearchStatus } from './types/movie'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [totalResults, setTotalResults] = useState(0)
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

    if (!trimmedValue) {
      setMovies([])
      setSuggestions([])
      setTotalResults(0)
      setStatus('idle')
      setErrorMessage('')
      setIsSuggestionsRequestInFlight(false)
      return
    }

    setMovies([])
    setSuggestions([])
    setTotalResults(0)
    setStatus('loading')
    setErrorMessage('')
    setIsSuggestionsRequestInFlight(true)
  }

  useEffect(() => {
    const abortController = new AbortController()

    if (!debouncedSuggestionsQuery) {
      return
    }

    const loadSuggestions = async () => {
      try {
        const nextSuggestions = await searchMovieSuggestions(
          debouncedSuggestionsQuery,
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
  }, [debouncedSuggestionsQuery])

  useEffect(() => {
    const abortController = new AbortController()

    if (!debouncedSearchQuery) {
      return
    }

    const loadMovies = async () => {
      try {
        const result = await searchMovies(
          debouncedSearchQuery,
          abortController.signal,
        )

        setMovies(result.movies)
        setTotalResults(result.totalResults)
        setStatus('success')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setMovies([])
        setTotalResults(0)
        setStatus('error')
        setErrorMessage('Something went wrong while loading movies from TMDB.')
      }
    }

    loadMovies()

    return () => {
      abortController.abort()
    }
  }, [debouncedSearchQuery])

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
        onQueryChange={handleQueryChange}
        onSuggestionSelect={handleQueryChange}
      />

      <MovieResults
        movies={movies}
        query={query}
        status={status}
        totalResults={totalResults}
        errorMessage={errorMessage}
      />
    </main>
  )
}

export default App
