import styles from './SearchPanel.module.css'

type RecentSearchesProps = {
  recentSearches: string[]
  onRecentSearchSelect: (value: string) => void
  onRecentSearchesClear: () => void
}

function RecentSearches({
  recentSearches,
  onRecentSearchSelect,
  onRecentSearchesClear,
}: RecentSearchesProps) {
  return (
    <div className={styles.recentSearchesDropdown}>
      <div className={styles.recentSearchesHeader}>
        <span className={styles.recentSearchesTitle}>Recent searches</span>
        <button
          type="button"
          className={styles.clearRecentSearchesButton}
          onClick={onRecentSearchesClear}
        >
          Clear
        </button>
      </div>

      <div className={styles.recentSearchesList}>
        {recentSearches.map((search) => (
          <button
            key={search}
            type="button"
            className={styles.recentSearchButton}
            onClick={() => onRecentSearchSelect(search)}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecentSearches
