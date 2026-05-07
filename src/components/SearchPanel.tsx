import { useState, type ChangeEvent } from 'react'
import { TMDB_IMAGE_BASE_URL } from '../services/tmdb'
import type { Movie, SearchFilters } from '../types/movie'
import styles from './SearchPanel.module.css'

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese' },
]

const REGION_OPTIONS = [
  { value: '', label: 'All Regions' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
]

type SearchPanelProps = {
  query: string
  isLoading: boolean
  suggestions: Movie[]
  isSuggestionsLoading: boolean
  filters: SearchFilters
  onQueryChange: (value: string) => void
  onSuggestionSelect: (movie: Movie) => void
  onFiltersChange: (filters: SearchFilters) => void
}

function SearchPanel({
  query,
  isLoading,
  suggestions,
  isSuggestionsLoading,
  filters,
  onQueryChange,
  onSuggestionSelect,
  onFiltersChange,
}: SearchPanelProps) {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const shouldShowDropdown =
    isInputFocused &&
    query.trim().length > 0 &&
    (isSuggestionsLoading || suggestions.length > 0)

  const handleYearInputChange =
    (field: 'primaryReleaseYear' | 'year') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateFilters({
        [field]: event.target.value.replace(/\D/g, '').slice(0, 4),
      } as Partial<SearchFilters>)
    }

  const updateFilters = (nextFilters: Partial<SearchFilters>) => {
    onFiltersChange({
      ...filters,
      ...nextFilters,
    })
  }

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
                        onSuggestionSelect(suggestion)
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

      <div className={styles.advancedFilters}>
        <button
          type="button"
          className={styles.filtersToggle}
          onClick={() => setIsFiltersOpen((currentValue) => !currentValue)}
          aria-expanded={isFiltersOpen}
          aria-controls="advanced-search-filters"
        >
          {isFiltersOpen ? '🔼' : '🔽'} Advanced Search Options
        </button>

        {isFiltersOpen ? (
          <div id="advanced-search-filters" className={styles.filtersContent}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel} htmlFor="language-filter">
                Language
              </label>
              <select
                id="language-filter"
                className={styles.filterSelect}
                value={filters.language}
                onChange={(event) =>
                  updateFilters({ language: event.target.value })
                }
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterField}>
              <label
                className={styles.filterLabel}
                htmlFor="primary-release-year-filter"
              >
                Release Year
              </label>
              <input
                id="primary-release-year-filter"
                className={styles.filterInput}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="e.g. 2024"
                value={filters.primaryReleaseYear}
                onChange={handleYearInputChange('primaryReleaseYear')}
              />
            </div>

            <div className={styles.filterField}>
              <label className={styles.filterLabel} htmlFor="year-filter">
                Year
              </label>
              <input
                id="year-filter"
                className={styles.filterInput}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="e.g. 2024"
                value={filters.year}
                onChange={handleYearInputChange('year')}
              />
            </div>

            <div className={styles.filterField}>
              <label className={styles.filterLabel} htmlFor="region-filter">
                Region
              </label>
              <select
                id="region-filter"
                className={styles.filterSelect}
                value={filters.region}
                onChange={(event) =>
                  updateFilters({ region: event.target.value })
                }
              >
                {REGION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterField}>
              <span className={styles.filterLabel}>Content Filter</span>
              <div className={styles.checkboxField}>
                <input
                  id="include-adult-filter"
                  type="checkbox"
                  checked={filters.includeAdult}
                  onChange={(event) =>
                    updateFilters({ includeAdult: event.target.checked })
                  }
                />
                <label htmlFor="include-adult-filter">
                  Include Adult Content
                </label>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SearchPanel
