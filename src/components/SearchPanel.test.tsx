import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchPanel from './SearchPanel'
import type { SearchFilters } from '../types/movie'
import { createMovie, defaultFilters } from '../test/fixtures'

function ControlledFiltersSearchPanel({
  onFiltersChange,
}: {
  onFiltersChange: (filters: SearchFilters) => void
}) {
  const [filters, setFilters] = useState(defaultFilters)

  return (
    <SearchPanel
      query=""
      isLoading={false}
      suggestions={[]}
      isSuggestionsLoading={false}
      filters={filters}
      recentSearches={[]}
      onQueryChange={vi.fn()}
      onRecentSearchSelect={vi.fn()}
      onRecentSearchesClear={vi.fn()}
      onSuggestionSelect={vi.fn()}
      onFiltersChange={(nextFilters) => {
        setFilters(nextFilters)
        onFiltersChange(nextFilters)
      }}
    />
  )
}

describe('SearchPanel', () => {
  it('shows suggestions on focus and selects a suggestion', async () => {
    const user = userEvent.setup()
    const suggestion = createMovie()
    const props = {
      query: 'arrival',
      isLoading: false,
      suggestions: [suggestion],
      isSuggestionsLoading: false,
      filters: defaultFilters,
      recentSearches: [],
      onQueryChange: vi.fn(),
      onRecentSearchSelect: vi.fn(),
      onRecentSearchesClear: vi.fn(),
      onSuggestionSelect: vi.fn(),
      onFiltersChange: vi.fn(),
    }

    render(
      <SearchPanel
        query={props.query}
        isLoading={props.isLoading}
        suggestions={props.suggestions}
        isSuggestionsLoading={props.isSuggestionsLoading}
        filters={props.filters}
        recentSearches={props.recentSearches}
        onQueryChange={props.onQueryChange}
        onRecentSearchSelect={props.onRecentSearchSelect}
        onRecentSearchesClear={props.onRecentSearchesClear}
        onSuggestionSelect={props.onSuggestionSelect}
        onFiltersChange={props.onFiltersChange}
      />,
    )

    await user.click(screen.getByLabelText('Search for movies'))

    expect(screen.getByRole('listbox', { name: 'Movie suggestions' })).toBeInTheDocument()
    expect(screen.getByText('2009 • Action, Adventure')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /avatar/i }))

    expect(props.onSuggestionSelect).toHaveBeenCalledWith(suggestion)
  })

  it('sanitizes year input and propagates filter updates', async () => {
    const user = userEvent.setup()
    const handleFiltersChange = vi.fn()

    render(
      <ControlledFiltersSearchPanel onFiltersChange={handleFiltersChange} />,
    )

    await user.click(
      screen.getByRole('button', { name: /advanced search options/i }),
    )
    await user.type(screen.getByLabelText('Release Year'), '20ab24')

    expect(screen.getByLabelText('Release Year')).toHaveValue('2024')
    expect(handleFiltersChange).toHaveBeenLastCalledWith({
      ...defaultFilters,
      primaryReleaseYear: '2024',
    })
  })

  it('shows recent searches for an empty focused query', async () => {
    const user = userEvent.setup()

    render(
      <SearchPanel
        query=""
        isLoading={false}
        suggestions={[]}
        isSuggestionsLoading={false}
        filters={defaultFilters}
        recentSearches={['Avatar']}
        onQueryChange={vi.fn()}
        onRecentSearchSelect={vi.fn()}
        onRecentSearchesClear={vi.fn()}
        onSuggestionSelect={vi.fn()}
        onFiltersChange={vi.fn()}
      />,
    )

    await user.click(screen.getByLabelText('Search for movies'))

    expect(screen.getByText('Recent searches')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avatar' })).toBeInTheDocument()
  })
})
