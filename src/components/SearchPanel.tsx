import { useState } from 'react'
import { TMDB_IMAGE_BASE_URL } from '../services/tmdb'
import type { Movie } from '../types/movie'
import styles from './SearchPanel.module.css'

type SearchPanelProps = {
  query: string
  isLoading: boolean
  suggestions: Movie[]
  isSuggestionsLoading: boolean
  onQueryChange: (value: string) => void
  onSuggestionSelect: (value: string) => void
}

function SearchPanel({
  query,
  isLoading,
  suggestions,
  isSuggestionsLoading,
  onQueryChange,
  onSuggestionSelect,
}: SearchPanelProps) {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const shouldShowDropdown =
    isInputFocused &&
    query.trim().length > 0 &&
    (isSuggestionsLoading || suggestions.length > 0)

  return (
    <section className={styles.searchSection}>
      <div
        className={styles.searchContainer}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsInputFocused(false)
          }
        }}
      >
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search for movies..."
          aria-label="Search for movies"
          aria-autocomplete="list"
          aria-expanded={shouldShowDropdown}
          aria-controls="movie-autocomplete-list"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsInputFocused(false)
            }
          }}
        />

        {isLoading ? (
          <div className={styles.loadingIndicator} aria-label="Searching movies">
            <span className={styles.loadingSpinner}></span>
          </div>
        ) : null}

        {shouldShowDropdown ? (
          <div
            id="movie-autocomplete-list"
            className={styles.autocompleteDropdown}
            role="listbox"
            aria-label="Movie suggestions"
          >
            {isSuggestionsLoading ? (
              <div className={styles.autocompleteStatus}>Loading suggestions...</div>
            ) : null}

            {!isSuggestionsLoading
              ? suggestions.map((suggestion) => {
                  const releaseYear = suggestion.releaseDate
                    ? suggestion.releaseDate.slice(0, 4)
                    : 'TBA'
                  const posterSrc = suggestion.posterPath
                    ? `${TMDB_IMAGE_BASE_URL}${suggestion.posterPath}`
                    : null
                  const meta = [releaseYear, suggestion.genres.slice(0, 2).join(', ')]
                    .filter(Boolean)
                    .join(' • ')

                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      className={styles.autocompleteItem}
                      onClick={() => {
                        onSuggestionSelect(suggestion.title)
                        setIsInputFocused(false)
                      }}
                    >
                      <div className={styles.autocompletePoster}>
                        {posterSrc ? (
                          <img
                            className={styles.autocompletePosterImage}
                            src={posterSrc}
                            alt=""
                          />
                        ) : null}
                      </div>
                      <div className={styles.autocompleteInfo}>
                        <h4>{suggestion.title}</h4>
                        <p>{meta || 'Movie'}</p>
                      </div>
                    </button>
                  )
                })
              : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SearchPanel
