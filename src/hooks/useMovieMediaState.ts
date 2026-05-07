import { useEffect, useState } from 'react'

type UseMovieMediaStateParams = {
  posterSrc: string | null
  backdropSrc: string | null
}

function useMovieMediaState({
  posterSrc,
  backdropSrc,
}: UseMovieMediaStateParams) {
  const [loadedPosterSrc, setLoadedPosterSrc] = useState<string | null>(null)
  const [loadedBackdropSrc, setLoadedBackdropSrc] = useState<string | null>(null)

  const isPosterLoaded = !posterSrc || loadedPosterSrc === posterSrc
  const isBackdropLoaded = !backdropSrc || loadedBackdropSrc === backdropSrc

  useEffect(() => {
    if (!backdropSrc) {
      return
    }

    let isCancelled = false
    const image = new Image()

    image.onload = () => {
      if (!isCancelled) {
        setLoadedBackdropSrc(backdropSrc)
      }
    }

    image.onerror = () => {
      if (!isCancelled) {
        setLoadedBackdropSrc(backdropSrc)
      }
    }

    image.src = backdropSrc

    return () => {
      isCancelled = true
    }
  }, [backdropSrc])

  return {
    isPosterLoaded,
    isBackdropLoaded,
    isMediaReady: isPosterLoaded && isBackdropLoaded,
    handlePosterLoad: () => {
      setLoadedPosterSrc(posterSrc)
    },
  }
}

export default useMovieMediaState
