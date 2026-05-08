import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilters from './SearchFilters'
import type { SearchFilters as SearchFiltersType } from '../../types/movie'
import { defaultFilters } from '../../test/fixtures'

function ControlledSearchFilters({
  onFiltersChange,
}: {
  onFiltersChange: (filters: SearchFiltersType) => void
}) {
  const [filters, setFilters] = useState(defaultFilters)

  return (
    <SearchFilters
      filters={filters}
      isOpen={true}
      onToggle={vi.fn()}
      onFiltersChange={(nextFilters) => {
        setFilters(nextFilters)
        onFiltersChange(nextFilters)
      }}
    />
  )
}

describe('SearchFilters', () => {
  it('toggles the advanced filters section', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    render(
      <SearchFilters
        filters={defaultFilters}
        isOpen={false}
        onToggle={handleToggle}
        onFiltersChange={vi.fn()}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: /advanced search options/i }),
    )

    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('sanitizes year input and propagates filter changes', async () => {
    const user = userEvent.setup()
    const handleFiltersChange = vi.fn()

    render(<ControlledSearchFilters onFiltersChange={handleFiltersChange} />)

    await user.type(screen.getByLabelText('Release Year'), '20ab24')
    await user.selectOptions(screen.getByLabelText('Language'), 'fr-FR')

    expect(screen.getByLabelText('Release Year')).toHaveValue('2024')
    expect(handleFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      primaryReleaseYear: '2024',
    })
    expect(handleFiltersChange).toHaveBeenLastCalledWith({
      ...defaultFilters,
      language: 'fr-FR',
    })
  })
})
