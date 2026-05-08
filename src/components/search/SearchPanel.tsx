import { memo, useState } from 'react'
import RecentSearches from './RecentSearches'
import SearchFilters from './SearchFilters'
import SearchSuggestions from './SearchSuggestions'
import type { Movie, SearchFilters as SearchFiltersType } from '../../types/movie'
import styles from './SearchPanel.module.css'

type SearchPanelProps = {
  query: string
  isLoading: boolean
  suggestions: Movie[]
  isSuggestionsLoading: boolean
  filters: SearchFiltersType
  recentSearches: string[]
  onQueryChange: (value: string) => void
  onRecentSearchSelect: (value: string) => void
  onRecentSearchesClear: () => void
  onSuggestionSelect: (movie: Movie) => void
  onFiltersChange: (filters: SearchFiltersType) => void
}

function SearchPanel({
  query,
  isLoading,
  suggestions,
  isSuggestionsLoading,
  filters,
  recentSearches,
  onQueryChange,
  onRecentSearchSelect,
  onRecentSearchesClear,
  onSuggestionSelect,
  onFiltersChange,
}: SearchPanelProps) {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const shouldShowDropdown =
    isInputFocused &&
    query.trim().length > 0 &&
    (isSuggestionsLoading || suggestions.length > 0)
  const shouldShowRecentSearches =
    isInputFocused && query.trim().length === 0 && recentSearches.length > 0

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
          <SearchSuggestions
            suggestions={suggestions}
            isSuggestionsLoading={isSuggestionsLoading}
            onSuggestionSelect={(movie) => {
              onSuggestionSelect(movie)
              setIsInputFocused(false)
            }}
          />
        ) : null}

        {shouldShowRecentSearches ? (
          <RecentSearches
            recentSearches={recentSearches}
            onRecentSearchSelect={(value) => {
              onRecentSearchSelect(value)
              setIsInputFocused(false)
            }}
            onRecentSearchesClear={onRecentSearchesClear}
          />
        ) : null}
      </div>

      <SearchFilters
        filters={filters}
        isOpen={isFiltersOpen}
        onToggle={() => setIsFiltersOpen((currentValue) => !currentValue)}
        onFiltersChange={onFiltersChange}
      />
    </section>
  )
}

export default memo(SearchPanel)
