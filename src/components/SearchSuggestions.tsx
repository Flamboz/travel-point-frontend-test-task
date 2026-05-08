import { TMDB_IMAGE_BASE_URL } from '../services/tmdb'
import type { Movie } from '../types/movie'
import styles from './SearchPanel.module.css'

type SearchSuggestionsProps = {
  suggestions: Movie[]
  isSuggestionsLoading: boolean
  onSuggestionSelect: (movie: Movie) => void
}

function SearchSuggestions({
  suggestions,
  isSuggestionsLoading,
  onSuggestionSelect,
}: SearchSuggestionsProps) {
  return (
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
                onClick={() => onSuggestionSelect(suggestion)}
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
  )
}

export default SearchSuggestions
