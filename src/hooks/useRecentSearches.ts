import { useCallback, useState } from 'react'

const RECENT_SEARCHES_STORAGE_KEY = 'tmdb-recent-searches'
const MAX_RECENT_SEARCHES = 8

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

function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getStoredRecentSearches,
  )

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

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  }
}

export default useRecentSearches
