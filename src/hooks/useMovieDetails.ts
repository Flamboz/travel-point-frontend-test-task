import { useCallback, useEffect, useState } from 'react'
import { getMovieDetails } from '../services/tmdb'
import type { MovieDetails } from '../types/movie'

function useMovieDetails() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [isMovieDetailsLoading, setIsMovieDetailsLoading] = useState(false)
  const [movieDetailsError, setMovieDetailsError] = useState('')

  const handleMovieOpen = useCallback((movieId: number) => {
    setSelectedMovie(null)
    setIsMovieDetailsLoading(true)
    setMovieDetailsError('')
    setSelectedMovieId(movieId)
  }, [])

  const handleMovieClose = useCallback(() => {
    setSelectedMovieId(null)
    setSelectedMovie(null)
    setMovieDetailsError('')
    setIsMovieDetailsLoading(false)
  }, [])

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
  }, [handleMovieClose, selectedMovieId])

  return {
    selectedMovieId,
    selectedMovie,
    isMovieDetailsLoading,
    movieDetailsError,
    handleMovieOpen,
    handleMovieClose,
  }
}

export default useMovieDetails
