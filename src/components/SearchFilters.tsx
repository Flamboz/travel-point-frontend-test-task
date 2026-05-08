import type { ChangeEvent } from 'react'
import type { SearchFilters as SearchFiltersType } from '../types/movie'
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

type SearchFiltersProps = {
  filters: SearchFiltersType
  isOpen: boolean
  onToggle: () => void
  onFiltersChange: (filters: SearchFiltersType) => void
}

type YearField = 'primaryReleaseYear' | 'year'

function SearchFilters({
  filters,
  isOpen,
  onToggle,
  onFiltersChange,
}: SearchFiltersProps) {
  const updateFilters = (nextFilters: Partial<SearchFiltersType>) => {
    onFiltersChange({
      ...filters,
      ...nextFilters,
    })
  }

  const handleYearInputChange =
    (field: YearField) => (event: ChangeEvent<HTMLInputElement>) => {
      updateFilters({
        [field]: event.target.value.replace(/\D/g, '').slice(0, 4),
      } as Pick<SearchFiltersType, YearField>)
    }

  return (
    <div className={styles.advancedFilters}>
      <button
        type="button"
        className={styles.filtersToggle}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="advanced-search-filters"
      >
        {isOpen ? '🔼' : '🔽'} Advanced Search Options
      </button>

      {isOpen ? (
        <div id="advanced-search-filters" className={styles.filtersContent}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel} htmlFor="language-filter">
              Language
            </label>
            <select
              id="language-filter"
              className={styles.filterSelect}
              value={filters.language}
              onChange={(event) => updateFilters({ language: event.target.value })}
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
              onChange={(event) => updateFilters({ region: event.target.value })}
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
              <label htmlFor="include-adult-filter">Include Adult Content</label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default SearchFilters
