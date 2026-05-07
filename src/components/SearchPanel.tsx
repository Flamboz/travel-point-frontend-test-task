import styles from './SearchPanel.module.css'

type SearchPanelProps = {
  query: string
  isLoading: boolean
  onQueryChange: (value: string) => void
}

function SearchPanel({ query, isLoading, onQueryChange }: SearchPanelProps) {
  return (
    <section className={styles.searchSection}>
      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search for movies..."
          aria-label="Search for movies"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />

        {isLoading ? (
          <div className={styles.loadingIndicator} aria-label="Searching movies">
            <span className={styles.loadingSpinner}></span>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SearchPanel
